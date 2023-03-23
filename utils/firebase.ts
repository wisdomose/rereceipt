import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  updatePassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  query,
  where,
  collection,
  addDoc,
  getCountFromServer,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { DOC, DOC_TYPES, POS, RECEIPT, SAVED } from "../types";
import { log } from "next-axiom";
import { notify, pick } from ".";
import { string } from "zod";

enum COLLECTION {
  TEMPLATES = "templates",
  SAVED = "saved",
  USERS = "users",
}

enum IMAGES {
  GENERAL = "/",
  RECEIPTS = "/receipts/",
  PROFILE = "/profile/",
}

const defaultProfile = {
  paid: false,
  timestamp: serverTimestamp(),
  trial_ends_in: Timestamp.fromDate(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  ),
};

async function createUser({
  email,
  first_name,
  last_name,
  uid,
}: {
  email: string;
  first_name: string;
  last_name: string;
  uid: string;
}) {
  const db = getFirestore(getApp());
  const auth = getAuth();

  const docRef = doc(db, COLLECTION.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return;
  }

  // create a collection with the user data

  log.info(`Creating Paystack account for ${email}`);
  fetch("/api/billing/customer/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name,
      last_name,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Account creation failed");
    })
    .then((json) => {
      log.info(`Creating account for ${email}`);
      setDoc(doc(db, COLLECTION.USERS, uid), {
        ...defaultProfile,
        billing: pick(json, ["customer_code", "id"]),
      });
      log.info(`Account creationg for ${email} sucessful`);
    })
    .catch((err) => {
      log.warn(`Error creating account for ${email}`);
      log.warn(`Deleting account for ${email}`);
      auth.currentUser && deleteUser(auth.currentUser);
      log.warn(`Account deleted for ${email}`);
    });
}

// auth
// TODO: if it is based on the user closing the modal then don't log
export const signUpWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      log.info(`Signup with Google initiated`);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) return;
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      createUser({
        email: user.email ?? "",
        first_name: user.displayName?.split(" ")[0] ?? "",
        last_name: user.displayName?.split(" ")[1] ?? "",
        uid: user.uid,
      });
    })
    .catch((err) => {
      log.error(`Sign in with Google failed`, err);
      console.log(err.message);
    });
};

export const signupWithEmail = async ({
  email,
  password,
  firstname,
  lastname,
}: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}) => {
  try {
    const auth = getAuth();
    const db = getFirestore(getApp());
    log.info(`Signup with Email initiated`);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        auth.currentUser &&
          updateProfile(auth.currentUser, {
            displayName: `${lastname} ${firstname}`,
          });
        // create a collection with the user data
        createUser({
          email: email,
          first_name: firstname,
          last_name: lastname,
          uid: user.user.uid,
        });
      })
      .catch((error) => {
        console.log(error.code);
        log.error(`Signup with Email failed`, error);
        notify(
          error?.code.split("/")[1].replaceAll("-", " ") ?? "Sign up failed"
        );
      });
  } catch (error: any) {
    log.error(`Signup with Email failed`, error);
    notify(error?.message ?? "Sign up failed");
  }
};

export const loginWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const auth = getAuth();
  log.info(`Login with Email initiated for ${email}`);
  signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      log.info(`Login with Email sucessfully for ${email}`);
      notify("Login sucessful");
    })
    .catch((error: any) => {
      log.error(`Login with Email failed for ${email}`, error);
      notify(error?.code ?? "Login failed");
    });
};

export const logoutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
  window.location.replace("/auth/login");
};

export const sendResetEmail = async (email: string) => {
  try {
    log.info(`Forgot password for ${email} initiated`);
    if (!string().email().safeParse(email).success)
      throw new Error("A valid email is required");
    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
      log.info(`Forgot password for ${email} sent`);
      notify("Password reset mail sent. Check your mailbox");
    });
  } catch (error: any) {
    log.error(
      `sendResetEmail errored with "${error.message}" for email ${email}` ??
        `sendResetEmail errored failed to send reset email to ${email}`,
      error
    );
    notify(error.message ?? "failed to send reset email");
  }
};

export const fetchCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};

export const updateLoggedInUserPassword = async (password: string) => {
  const auth = getAuth(getApp());

  const user = auth.currentUser;

  log.info(`Update password initiated`);
  if (!user) {
    log.warn(`Update password accessed by a user who isn't loggedin`);
    notify("you need to be logged in");
    return;
  }

  try {
    updatePassword(user, password)
      .then(() => {
        log.info(`Password changed for ${user.email}`);
        notify("password changed sucessfully");
      })
      .catch((error) => {
        log.info(`Password changed failed for ${user.email}`);
        notify(error?.message ?? "Failed to update password");
      });
  } catch (error: any) {
    log.error(`Error occured during Password changed`);
    notify(error?.message ?? "Failed to update password");
  }
};

export const updateUserProfile = async ({
  phoneNumber,
}: {
  phoneNumber?: string;
}) => {
  const auth = getAuth(getApp());
  const db = getFirestore(getApp());
  const user = auth.currentUser;

  log.info(`Profiile update initiated`);

  if (!user) {
    log.info(`Profiile update attempted by a user who isn't loggedin`);
    notify("you need to be logged in");
    return;
  }

  try {
    const update: Record<string, any> = {
      phoneNumber: phoneNumber ?? user.phoneNumber,
    };

    // remove null fields
    Object.keys(update).forEach((key) => {
      if (typeof update[key] !== "string" || (update[key] ?? "").length === 0) {
        delete update[key];
      }
    });

    if (update.phoneNumber) {
      await updateDoc(doc(db, COLLECTION.USERS, user.uid), {
        phoneNumber: update.phoneNumber,
      }).catch((err) => {});
    }

    // update
    updateProfile(user, update)
      .then((res) => {
        log.info(`Profiile update sucessful for ${user.email}`);
        notify("Profile updated sucessfully");
      })
      .catch((error) => {
        log.warn(`Profiile update failed for ${user.email}`);
        notify(error?.code ?? "Failed to update profile");
      });
  } catch (error: any) {
    log.error(
      `updateUserProfile - message:${error?.message} code:${error?.code}` ??
        "Failed to update profile",
      error
    );
    notify(error?.code ?? "Failed to update profile");
  }
};

export const updateUserProfileImage = async (image: File) => {
  const auth = getAuth(getApp());
  const user = auth.currentUser;

  log.info(`Profiile update image initiated`);

  if (!user) {
    log.info(`Profiile update attempted by a user who isn't loggedin`);
    notify("you need to be logged in");
    return;
  }

  try {
    let url = "";

    await uploadFile({
      file: image,
      name: user.displayName
        ? user.displayName?.replaceAll(" ", "-")
        : new Date().getTime().toString(),
      folder: IMAGES.PROFILE,
    }).then((res) => {
      url = res;
    });

    const update = {
      photoURL: url,
    };

    // update
    updateProfile(user, update)
      .then((res) => {
        log.info(`Profiile image update sucessful for ${user.email}`);
        notify("Profile image updated");
      })
      .catch((error) => {
        log.error(`Profiile image update failed for ${user.email}`, error);
        notify(error?.code ?? "Failed to update profile image");
      });
  } catch (error: any) {
    log.error(`Profiile image update failed for ${user.email}`, error);
    notify("Failed to update profile image");
  }
};

type Data = {
  paid: boolean;
  trial_ends_in: {
    seconds: number;
    nanoseconds: number;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  billing: {};
};

export const fetchUserDetails = async (uid: string) => {
  const db = getFirestore(getApp());
  const docRef = doc(db, COLLECTION.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Data;
  }

  log.error(`An error occured fetching user details`);
  notify("An error occured fetching your details");
};

// firestore
export const uploadFile = async ({
  file,
  name,
  folder,
}: {
  file: File;
  name: string;
  folder: IMAGES;
}) => {
  const storage = getStorage(getApp());
  const fileRef = ref(storage, folder + name);

  return await uploadBytes(fileRef, file).then((snapshot) => {
    return getDownloadURL(fileRef).then((url) => {
      return url;
    });
  });
};

/**
 * TODO
 * - check if a receipt has already been created
 */
export const createTemplate = async (
  data: Pick<DOC, "isActive" | "template_name" | "type"> & {
    data: RECEIPT | POS;
  },
  image: File
) => {
  try {
    log.info("creating a new template");
    if (!data.template_name) throw new Error("A nuique id is required");
    const db = getFirestore(getApp());

    const colRef = collection(db, COLLECTION.TEMPLATES);
    const _query = query(
      colRef,
      where("data.settings.id", "==", data.template_name)
    );

    const querySnapshot = await getDocs(_query);

    log.info("Check for duplicate template done");

    if (querySnapshot.size > 0) {
      log.warn("A template with this id already exists");
      throw new Error("A template with this id already exists");
    }

    const img = await uploadFile({
      file: image,
      name: data.template_name,
      folder: IMAGES.RECEIPTS,
    });

    await addDoc(collection(db, COLLECTION.TEMPLATES), {
      timestamp: serverTimestamp(),
      ...data,
      img,
    });

    log.info(`template "${data.template_name}" created sucessfully`);
  } catch (error: any) {
    log.error(error.message, error);
    notify(error.message);
    throw new Error("failed to create template");
  }
};

export const updateTemplate = async (
  id: string,
  {
    isActive,
    template_name,
    type,
    image,
    data,
  }: Pick<DOC, "isActive" | "template_name" | "type"> & {
    data: RECEIPT | POS;
    image?: File;
  }
) => {
  try {
    log.info(`Updating template "${id}"`);
    const db = getFirestore(getApp());
    const docRef = doc(db, COLLECTION.TEMPLATES, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let img = "";
      if (image) {
        img = await uploadFile({
          file: image,
          name: template_name,
          folder: IMAGES.RECEIPTS,
        });
      }
      const update = {
        timestamp: serverTimestamp(),
        data,
        isActive,
        type,
        template_name,
      };
      log.info("updating doc", update);
      await updateDoc(
        docRef,
        image
          ? {
              ...update,
              img,
            }
          : { ...update }
      );
      log.info(`Template "${id}" update sucessful`);
      notify("Template Updated");
      return true;
    }
  } catch (error: any) {
    log.error(`Template "${id}" update failed`, error);
    notify("Update failed");
    throw new Error("failed to create template");
  }
};

/**
 *
 * @param data
 * @param id {string} saved document id optional if this is a new save
 * @returns
 */
export const saveProgress = async ({
  data,
  id,
  spaces,
}: {
  data: Pick<SAVED, "data" | "template_name" | "type" | "img" | "templateId">;
  id?: string;
  spaces?: number;
}) => {
  try {
    const auth = getAuth();
    if (!auth.currentUser)
      throw new Error("you need to be logged in to use this feature");
    const uid = auth.currentUser.uid;

    const db = getFirestore(getApp());

    if (!id) {
      log.info(`Saving a new document for ${uid}`);
      const count = await countNoOfSavedTemplates(uid);

      if (count === spaces)
        throw new Error("you have used up your save spaces");

      const doc = await addDoc(collection(db, "saved"), {
        timestamp: serverTimestamp(),
        ...data,
        uid,
      });
      log.info(`Document created with id ${doc.id}`);
      return doc.id;
    } else {
      log.info(`Updating saved document ${id}`);
      const ref = doc(db, COLLECTION.SAVED, id);
      await updateDoc(ref, {
        uid,
        timestamp: serverTimestamp(),
        ...data,
      });
      log.info(`Updated saved document ${id}`);
      return id;
    }
  } catch (error: any) {
    log.error(`Error saving template`, error);
    notify(error.message ?? "failed to save receipt");
  }
};

export const countNoOfSavedTemplates = async (uid: string) => {
  try {
    if (!uid) throw new Error("you need to be logged in to use this feature");
    log.info(`counting no of saved templates for ${uid}`);
    const db = getFirestore(getApp());
    const coll = collection(db, COLLECTION.SAVED);
    const query_ = query(coll, where("uid", "==", uid));
    const snapshot = await getCountFromServer(query_);
    const count = snapshot.data().count;
    log.info(`${uid} has ${count} saved document(s)`);
    return count;
  } catch (error: any) {
    log.error(`Error counting no of saved templates for ${uid}`, error);
    notify("Error");
  }
};

export const getAllSavedTemplates = async (uid: string) => {
  try {
    log.info(`Getting all saved documents for ${uid}`);
    const saved: SAVED[] = [];
    if (!uid) return saved;

    const db = getFirestore(getApp());

    const q = query(collection(db, COLLECTION.SAVED), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      saved.push({
        id: doc.id,
        ...(data as Pick<
          SAVED,
          | "data"
          | "img"
          | "template_name"
          | "templateId"
          | "timestamp"
          | "type"
          | "uid"
        >),
      });
    });
    return saved;
  } catch (error: any) {
    console.log(error);
    log.error(`Getting all saved documents for ${uid} failed`, error);
    notify(error.message ?? "failed to fetch templates");
    return [];
  }
};

export const getOneSavedTemplate = async (id: string) => {
  try {
    log.info(`Getting saved document ${id}`);
    const db = getFirestore(getApp());
    const docRef = doc(db, COLLECTION.SAVED, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      log.info(`Saved document with id "${id}" exists`);
      const saved = docSnap.data() as SAVED;

      return saved;
    }
    log.info(`No saved document with id "${id}" exists`);
    throw new Error("No document found");
  } catch (error: any) {
    log.error(`No saved document found with id "${id}"`, error);
    notify(error?.message ?? "We couldn't find a template");
  }
};

export const deleteOneSavedTemplate = async (id: string) => {
  try {
    log.info(`Attempting to delete saved document ${id}`);
    if (!id) throw new Error("No document specified");
    const db = getFirestore(getApp());
    const docRef = doc(db, COLLECTION.SAVED, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef).then((res) => {
        log.info(`Deleted saved document ${id}`);
        notify("template deleted");
      });
    } else {
      log.warn(
        `Saved document ${id} dosent exist or may have already been deleted`
      );
      throw new Error("This file may have already been deleted");
    }
  } catch (error: any) {
    log.error(`Failed to delete saved document ${id}`, error);
    notify(
      error.message ?? "We encountered a problem while deleting this file"
    );
  }
};

export const getAllTemplates = async () => {
  try {
    log.info(`Getting all templates`);
    const db = getFirestore(getApp());
    const query_ = query(collection(db, COLLECTION.TEMPLATES));
    const querySnapshot = await getDocs(query_);
    let docs: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      docs.push({ id: doc.id, ...data });
    });

    return docs as Pick<
      DOC,
      "id" | "img" | "template_name" | "type" | "data"
    >[];
  } catch (error: any) {
    log.error(`Failed to get all templates`, error);
    return [];
  }
};

export const getAllActiveTemplates = async () => {
  try {
    log.info(`Getting all active templates`);
    const db = getFirestore(getApp());
    const query_ = query(
      collection(db, COLLECTION.TEMPLATES),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(query_);
    let receipts: any[] = [];
    let pos: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.type === DOC_TYPES.RECEIPT
        ? receipts.push({ id: doc.id, ...doc.data() })
        : data.type === DOC_TYPES.POS
        ? pos.push({ id: doc.id, ...doc.data() })
        : null;
    });

    return { receipts, pos } as unknown as {
      receipts: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
      pos: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
    };
  } catch (error: any) {
    log.error(`Failed to get active templates`, error);
    return { receipts: [], pos: [] };
  }
};

export const getOneTemplate = async (id: string) => {
  log.info(`Fetch template with id "${id}"`);
  const db = getFirestore(getApp());
  const docRef = doc(db, COLLECTION.TEMPLATES, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    log.info(`Template with id "${id}" found`);
    return docSnap.data() as DOC;
  } else {
    log.error(`No template with id "${id}" found`);
    return null;
  }
};

export const updatePaid = async (uid: string, paid: boolean) => {
  log.info(`Updating paid status of "${uid}" to ${paid}`);
  const db = getFirestore(getApp());
  const docRef = doc(db, COLLECTION.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      timestamp: serverTimestamp(),
      paid: paid,
    });
    log.info(`Update sucessful`);
    return true;
  }

  log.error("no user found in DB", { uid, action: "purchase", paid });
  return false;
};

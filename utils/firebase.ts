import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
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

  // create a collection with the user data
  const resp = await fetch("/api/billing/customer/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name,
      last_name,
    }),
  });
  const res = await resp.json();

  await setDoc(doc(db, COLLECTION.USERS, uid), {
    ...defaultProfile,
    billing: pick(res, ["customer_code", "id"]),
  });
}

// auth
export const signUpWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
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
      console.log(err);
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
        notify(
          error?.code.split("/")[1].replaceAll("-", " ") ?? "Sign up failed"
        );
      });
  } catch (error: any) {
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
  signInWithEmailAndPassword(auth, email, password)
    .then((user) => {})
    .catch((err) => {});
};

export const logoutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
  window.location.replace("/auth/login");
};

export const sendResetEmail = async (email: string) => {
  try {
    if (!string().email().safeParse(email).success)
      throw new Error("A valid email is required");
    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
      notify("Password reset mail sent");
    });
  } catch (error: any) {
    log.warn(
      `sendResetEmail errored with "${error.message}" for email ${email}` ??
        `sendResetEmail errored failed to send reset email to ${email}`
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

  if (!user) {
    notify("you need to be logged in");
    return;
  }

  try {
    updatePassword(user, password)
      .then(() => {
        notify("password changed sucessfully");
      })
      .catch((error) => {
        notify(error?.message ?? "Failed to update password");
      });
  } catch (error: any) {
    notify(error?.message ?? "Failed to update password");
  }
};

export const updateUserProfile = async ({
  image,
  phoneNumber,
}: {
  image?: File;
  phoneNumber?: string;
}) => {
  const auth = getAuth(getApp());
  const db = getFirestore(getApp());

  const user = auth.currentUser;

  if (!user) {
    notify("you need to be logged in");
    return;
  }

  try {
    let url = "";

    if (image) {
      await uploadFile({
        file: image,
        name: user.displayName
          ? user.displayName?.replaceAll(" ", "-")
          : new Date().getTime().toString(),
        folder: IMAGES.PROFILE,
      }).then((res) => {
        url = res;
      });
    }

    const update = {
      photoURL: url ?? user?.photoURL,
      phoneNumber: phoneNumber ?? user.phoneNumber,
    };

    // remove null fields
    Object.keys(update).forEach((key) => {
      if (
        typeof update[key as keyof typeof update] !== "string" ||
        (update[key as keyof typeof update] ?? "").length === 0
      ) {
        delete update[key as keyof typeof update];
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
        notify("Profile updated sucessfully");
      })
      .catch((error) => {
        notify(error?.code ?? "Failed to update profile");
      });
  } catch (error: any) {
    log.warn(
      `updateUserProfile - message:${error?.message} code:${error?.code}` ??
        "Failed to update profile"
    );
    notify(error?.code ?? "Failed to update profile");
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
  data: Pick<DOC, "isActive" | "name" | "type"> & { data: RECEIPT | POS },
  image: File
) => {
  const db = getFirestore(getApp());

  const img = await uploadFile({
    file: image,
    name: data.name,
    folder: IMAGES.RECEIPTS,
  });
  await addDoc(collection(db, COLLECTION.TEMPLATES), {
    timestamp: serverTimestamp(),
    ...data,
    img,
  });
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
  data: Pick<SAVED, "data" | "name" | "type" | "img" | "templateId">;
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
      const count = await countNoOfSavedTemplates(uid);

      if (count === spaces)
        throw new Error("you have used up your save spaces");
      const doc = await addDoc(collection(db, "saved"), {
        timestamp: serverTimestamp(),
        ...data,
        uid,
      });
      return doc.id;
    } else {
      const ref = doc(db, COLLECTION.SAVED, id);
      await updateDoc(ref, {
        uid,
        timestamp: serverTimestamp(),
        ...data,
      });
      return id;
    }
  } catch (error: any) {
    notify(error.message ?? "failed to save receipt");
  }
};

export const countNoOfSavedTemplates = async (uid: string) => {
  try {
    if (!uid) throw new Error("you need to be logged in to use this feature");
    const db = getFirestore(getApp());
    const coll = collection(db, COLLECTION.SAVED);
    const query_ = query(coll, where("uid", "==", uid));
    const snapshot = await getCountFromServer(query_);
    const count = snapshot.data().count;
    return count;
  } catch (error: any) {
    notify("Error");
  }
};

export const getAllSavedTemplates = async (uid: string) => {
  try {
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
          "data" | "img" | "name" | "templateId" | "timestamp" | "type" | "uid"
        >),
      });
    });
    return saved;
  } catch (error: any) {
    console.log(error);
    notify(error.message ?? "failed to fetch templates");
    return [];
  }
};

export const getOneSavedTemplate = async (id: string) => {
  try {
    const db = getFirestore(getApp());
    const docRef = doc(db, COLLECTION.SAVED, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SAVED;
    } else {
      throw new Error("No document found");
    }
  } catch (error: any) {
    notify(error?.message ?? "We couldn't find a template");
  }
};

export const deleteOneSavedTemplate = async (id: string) => {
  try {
    if (!id) throw new Error("No document specified");
    const db = getFirestore(getApp());
    const docRef = doc(db, COLLECTION.SAVED, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef).then((res) => {
        notify("template deleted");
      });
    } else {
      throw new Error("This file may have already been deleted");
    }
  } catch (error: any) {
    notify(
      error.message ?? "We encountered a problem while deleting this file"
    );
  }
};

export const getAllActiveTemplates = async () => {
  const db = getFirestore(getApp());
  const querySnapshot = await getDocs(collection(db, COLLECTION.TEMPLATES));
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
    receipts: Pick<DOC, "id" | "img" | "name" | "type" | "data">[];
    pos: Pick<DOC, "id" | "img" | "name" | "type" | "data">[];
  };
};

export const getOneTemplate = async (id: string) => {
  const db = getFirestore(getApp());
  const docRef = doc(db, COLLECTION.TEMPLATES, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as DOC;
  } else {
    return null;
  }
};

export const updatePaid = async (uid: string, paid: boolean) => {
  const db = getFirestore(getApp());

  const docRef = doc(db, COLLECTION.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      timestamp: serverTimestamp(),
      paid: paid,
    });
    return true;
  }

  log.error("no user found in DB", { uid, action: "purchase" });
  return false;
};

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

export enum COLLECTION {
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


export const fetchCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
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

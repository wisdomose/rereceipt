import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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
} from "firebase/firestore";
import { DOC, DOC_TYPES, POS, RECEIPT, SAVED } from "../types";
import { toast } from "react-toastify";
import { log } from "next-axiom";
import { pick } from ".";
enum COLLECTION {
  TEMPLATES = "templates",
  SAVED = "saved",
  USERS = "users",
}

enum IMAGES {
  GENERAL = "/",
  RECEIPTS = "/receipts/",
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
  const resp = await fetch("/api/billing/create", {
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
    .catch((err) => {});
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
  throw null;
};

// firestore
export const uploadFile = async ({
  file,
  name,
}: {
  file: File;
  name: string;
}) => {
  const storage = getStorage(getApp());
  const fileRef = ref(storage, IMAGES.RECEIPTS + name);

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

  const img = await uploadFile({ file: image, name: data.name });
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
export const saveProgress = async (
  data: Pick<SAVED, "data" | "name" | "type" | "img" | "templateId">,
  id?: string
) => {
  try {
    const auth = getAuth();
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const db = getFirestore(getApp());
    const coll = collection(db, COLLECTION.SAVED);

    if (!id) {
      const query_ = query(coll, where("uid", "==", uid));
      const snapshot = await getCountFromServer(query_);
      const count = snapshot.data().count;

      if (count === 5) return -1;
      await addDoc(collection(db, "saved"), {
        timestamp: serverTimestamp(),
        ...data,
        uid,
      });
    } else {
      console.log("updating");
      const ref = doc(db, COLLECTION.SAVED, id);
      await updateDoc(ref, {
        uid,
        timestamp: serverTimestamp(),
        ...data,
      });
    }

    console.log("file saved");
    toast("file saved", {
      position: "bottom-center",
      autoClose: 100000,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllSavedTemplates = async () => {
  const saved: SAVED[] = [];
  const auth = getAuth();
  if (!auth.currentUser) return saved;
  const uid = auth.currentUser.uid;

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
};

export const getOneSavedTemplate = async (id: string) => {
  const db = getFirestore(getApp());
  const docRef = doc(db, COLLECTION.SAVED, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as SAVED;
  } else {
    return null;
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
    receipts: Pick<DOC, "id" | "img" | "name" | "type">[];
    pos: Pick<DOC, "id" | "img" | "name" | "type">[];
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

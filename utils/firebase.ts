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
  query,
  where,
  collection,
  addDoc,
  getCountFromServer,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { DOC, DOC_TYPES } from "../types";

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
    })
    .catch((err) => {
      console.log(err);
    });
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
  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      auth.currentUser &&
        updateProfile(auth.currentUser, {
          displayName: `${lastname} ${firstname}`,
        });
    })
    .catch((err) => {});
};

export const logoutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
};

export const fetchCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};

export const uploadFile = async ({
  file,
  name,
}: {
  file: File;
  name: string;
}) => {
  const storage = getStorage(getApp());
  const fileRef = ref(storage, "/receipts/" + name);

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
export const createReceipt = async (
  data: Pick<DOC, "data" | "isActive" | "name" | "type">,
  image: File
) => {
  const db = getFirestore(getApp());

  const img = await uploadFile({ file: image, name: data.name });
  await addDoc(collection(db, "receipts"), {
    ...data,
    img,
  });
};

export const saveProgress = async (
  data: Pick<DOC, "data" | "name" | "type">
) => {
  const auth = getAuth();
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;

  const db = getFirestore(getApp());
  const coll = collection(db, "saved");
  const query_ = query(coll, where("uid", "==", uid));
  const snapshot = await getCountFromServer(query_);
  const count = snapshot.data().count;

  if (count === 5) return -1;
  await addDoc(collection(db, "saved"), {
    ...data,
    uid,
  });
};

export const getAllActiveReceipts = async () => {
  const db = getFirestore(getApp());
  const querySnapshot = await getDocs(collection(db, "receipts"));
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

export const getOneReceipt = async (id: string) => {
  const db = getFirestore(getApp());
  const docRef = doc(db, "receipts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as DOC;
  } else {
    return null;
  }
};

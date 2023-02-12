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
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { DOC } from "../types";

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

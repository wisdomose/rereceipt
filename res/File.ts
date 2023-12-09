import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IMAGES } from "../types";
import Firebase from "./Firebase";

export default class Media {
  storage;
  firebase;
  constructor() {
    this.firebase = new Firebase();
    this.storage = this.firebase.storage;
  }

  async uploadFile({
    file,
    name,
    folder,
  }: {
    file: File;
    name: string;
    folder: IMAGES;
  }) {
    const fileRef = ref(this.storage, folder + name);

    return await uploadBytes(fileRef, file).then((snapshot) => {
      return getDownloadURL(fileRef).then((url) => {
        return url;
      });
    });
  }
}

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTION, DOC, DOC_TYPES, SAVED } from "../types";
import { notify } from "../utils";
import Firebase from "./Firebase";

export default class Template {
  firebase;
  auth;
  user;
  db;
  app;

  constructor() {
    this.firebase = new Firebase();
    this.app = this.firebase.app;
    this.auth = this.firebase.auth;
    this.user = this.firebase.auth?.currentUser;
    this.db = this.firebase.db;

    this.saveProgress = this.saveProgress.bind(this);
    this.getAllSavedTemplates = this.getAllSavedTemplates.bind(this);
    this.getOneSavedTemplate = this.getOneSavedTemplate.bind(this);
    this.deleteOneSavedTemplate = this.deleteOneSavedTemplate.bind(this);
    this.getAllActiveTemplates = this.getAllActiveTemplates.bind(this);
    this.countNoOfSavedTemplates = this.countNoOfSavedTemplates.bind(this);
  }

  async getAllSavedTemplates() {
    return new Promise<SAVED[]>(async (resolve, reject) => {
      try {
        const saved: SAVED[] = [];
        if (!this.auth.currentUser) resolve(saved);
        const uid = this.auth.currentUser?.uid;

        console.info(`Getting all saved documents for ${uid}`);
        const db = this.db;

        const q = query(
          collection(db, COLLECTION.SAVED),
          where("uid", "==", uid)
        );

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
        resolve(saved);
      } catch (error: any) {
        notify(error.message ?? "failed to fetch templates");
        resolve([]);
      }
    });
  }

  async getOneSavedTemplate(id: string) {
    return new Promise<SAVED>(async (resolve, reject) => {
      try {
        console.info(`Getting saved document ${id}`);
        const db = this.db;
        const docRef = doc(db, COLLECTION.SAVED, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.info(`Saved document with id "${id}" exists`);
          const saved = docSnap.data() as SAVED;

          resolve(saved);
        } else {
          console.info(`No saved document with id "${id}" exists`);
          throw new Error("No document found");
        }
      } catch (error: any) {
        console.error(`No saved document found with id "${id}"`, error);
        notify(error?.message ?? "We couldn't find a template");
        reject(error?.message ?? "We couldn't find a template");
      }
    });
  }

  async deleteOneSavedTemplate(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        console.info(`Attempting to delete saved document ${id}`);
        if (!id) throw new Error("No document specified");
        const db = this.db;
        const docRef = doc(db, COLLECTION.SAVED, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await deleteDoc(docRef);
          console.info(`Deleted saved document ${id}`);
          notify("template deleted");
          resolve(true);
        } else {
          console.warn(
            `Saved document ${id} dosent exist or may have already been deleted`
          );
          throw new Error("This file may have already been deleted");
        }
      } catch (error: any) {
        console.error(`Failed to delete saved document ${id}`, error);
        notify(
          error.message ?? "We encountered a problem while deleting this file"
        );
        reject(error.code ?? error.message);
      }
    });
  }

  async getAllActiveTemplates() {
    return new Promise<{
      receipts: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
      pos: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
    }>(async (resolve, reject) => {
      try {
        console.info(`Getting all active templates`);
        const db = this.db;
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

        resolve({ receipts, pos } as unknown as {
          receipts: Pick<
            DOC,
            "id" | "img" | "template_name" | "type" | "data"
          >[];
          pos: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
        });
      } catch (error: any) {
        console.error(error.code);
        resolve({ receipts: [], pos: [] });
      }
    });
  }

  async countNoOfSavedTemplates() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser)
          throw new Error("you need to be logged in to use this feature");
        const uid = this.auth.currentUser?.uid;
        console.info(`counting no of saved templates for ${uid}`);
        const db = this.db;
        const coll = collection(db, COLLECTION.SAVED);
        const query_ = query(coll, where("uid", "==", uid));
        const snapshot = await getCountFromServer(query_);
        const count = snapshot.data().count;
        console.info(`${uid} has ${count} saved document(s)`);
        resolve(count);
      } catch (error: any) {
        notify("Error");
        reject(error.code ?? error.message);
      }
    });
  }

  // id optional if this is a new save
  // TODO: limit storage space
  async saveProgress({
    data,
    id,
    spaces,
  }: {
    data: Pick<SAVED, "data" | "template_name" | "type" | "img" | "templateId">;
    id?: string;
    spaces?: number;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = this.auth;
        const db = this.db;

        if (!auth.currentUser)
          throw new Error("you need to be logged in to use this feature");
        const uid = auth.currentUser.uid;

        if (!id) {
          console.info(`Saving a new document for ${uid}`);
          // const count = await countNoOfSavedTemplates(uid);

          // if (count === spaces)
          // throw new Error("you have used up your save spaces");

          const doc = await addDoc(collection(db, "saved"), {
            timestamp: serverTimestamp(),
            ...data,
            uid,
          });
          console.info(`Document created with id ${doc.id}`);
          resolve(doc.id);
        } else {
          console.info(`Updating saved document ${id}`);
          const ref = doc(db, COLLECTION.SAVED, id);
          await updateDoc(ref, {
            uid,
            timestamp: serverTimestamp(),
            ...data,
          });
          console.info(`Updated saved document ${id}`);
          resolve(id);
        }
      } catch (error: any) {
        console.error(`Error saving template`, error);
        notify(error.message ?? "failed to save receipt");
        reject(error.code ?? error.message);
      }
    });
  }
}

// return new Promise(async(resolve,reject)=>{})

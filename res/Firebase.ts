import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export default class Firebase {
  app;
  auth;
  db;
  storage;
  currentUser;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.currentUser = this.auth.currentUser;

    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }
}

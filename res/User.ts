import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import Firebase from "./Firebase";
import { string } from "zod";
import { notify } from "../utils";
import { IMAGES } from "../types";
import Rereceipt from "./Rereceipt";
import Media from "./File";

export default class User {
  firebase;
  auth;
  user;
  db;
  app;
  media;

  constructor() {
    this.firebase = new Firebase();
    this.app = this.firebase.app;
    this.auth = this.firebase.auth;
    this.user = this.firebase.auth?.currentUser;
    this.db = this.firebase.db;
    this.media = new Media();
    // Bind the methods to the current instance
    this.createUserWithEmailAndPassword =
      this.createUserWithEmailAndPassword.bind(this);
    this.loginInWithEmailAndPassword =
      this.loginInWithEmailAndPassword.bind(this);
    this.googleAuth = this.googleAuth.bind(this);
    this.signOut = this.signOut.bind(this);
    this.sendResetPasswordMail = this.sendResetPasswordMail.bind(this);
    this.updateUserPassword = this.updateUserPassword.bind(this);
    this.updateUserProfileImage = this.updateUserProfileImage.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
  }

  async createUserWithEmailAndPassword({
    email,
    password,
    firstname,
    lastname,
  }: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Signup with Email initiated`);
        const user = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        if (user.user) {
          updateProfile(user.user, {
            displayName: `${lastname} ${firstname}`,
          });

          resolve(user);
        }
      } catch (error: any) {
        reject(error.code);
        console.error(`Signup with Email failed`, error);
      }
    });
  }
  async loginInWithEmailAndPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    return new Promise(async (resolve, reject) => {
      await signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          resolve(this.user);
        })
        .catch((error) => {
          reject(error.code);
          // const errorCode = error.code;
          // const errorMessage = error.message;
        });
    });
  }
  async googleAuth() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider)
      .then((result) => {
        console.info(`Signup with Google initiated`);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error("Something went wrong");
        const user = result.user;
      })
      .catch((err) => {
        console.error(`Sign in with Google failed`, err);
      });
  }
  async sendResetPasswordMail(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = this.auth;
        console.info(`Forgot password for ${email} initiated`);
        if (!string().email().safeParse(email).success)
          throw new Error("A valid email is required");
        await sendPasswordResetEmail(auth, email);
        console.info(`Forgot password for ${email} sent`);
        notify("Password reset mail sent. Check your mailbox");
        resolve(true);
      } catch (error: any) {
        console.error(
          `sendResetEmail errored with "${error.message}" for email ${email}` ??
            `sendResetEmail errored failed to send reset email to ${email}`,
          error
        );
        notify(error.code ?? "failed to send reset email");
        reject(error.code ?? error.message);
      }
    });
  }
  async signOut() {
    await this.auth.signOut();
  }
  async updateUserPassword(password: string) {
    return new Promise(async (resolve, reject) => {
      const auth = this.auth;
      if (!this.user) {
        console.error(`Update password accessed by a user who isn't loggedin`);
        notify("you need to be logged in to perform this operation");
        reject("you need to be logged in to perform this operation");
        return;
      }

      try {
        const a = await updatePassword(this.user, password);
        console.info(`Password changed for ${this.user.email}`);
        notify("password changed sucessfully");
        resolve(true);
      } catch (error: any) {
        console.error(`Error occured during Password changed`, error.code);
        notify(error?.code ?? "Failed to update password");
        reject(error.code);
      }
    });
  }
  async updateUserProfile({ phoneNumber }: { phoneNumber?: string }) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = this.auth.currentUser;

        if (!user) {
          console.info(
            `Profiile update attempted by a user who isn't loggedin`
          );
          notify("you need to be logged in");
          reject("you need to be logged in");
          return;
        }

        const update: Record<string, any> = {
          phoneNumber: phoneNumber ?? user.phoneNumber,
        };

        // remove null fields
        Object.keys(update).forEach((key) => {
          if (
            typeof update[key] !== "string" ||
            (update[key] ?? "").length === 0
          ) {
            delete update[key];
          }
        });

        // update
        await updateProfile(user, update);
        console.info(`Profiile update sucessful for ${user.email}`);
        notify("Profile updated sucessfully");

        resolve(true);
      } catch (error: any) {
        console.error(
          `updateUserProfile - message:${error?.message} code:${error?.code}` ??
            "Failed to update profile",
          error
        );
        notify(error?.code ?? "Failed to update profile");
        reject(error.code ?? error.message);
      }
    });
  }
  async updateUserProfileImage(image: File) {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = this.auth;
        const user = this.auth.currentUser;

        if (!user) {
          notify("you need to be logged in");
          throw new Error("Invalid operation");
        }

        console.info(`Profiile update image initiated`);

        let url = "";

        await this.media
          .uploadFile({
            file: image,
            name: user.displayName
              ? user.displayName?.replaceAll(" ", "-")
              : new Date().getTime().toString(),
            folder: IMAGES.PROFILE,
          })
          .then((res) => {
            url = res;
          });

        const update = {
          photoURL: url,
        };

        // update
        await updateProfile(user, update)
          .then((res) => {
            console.info(`Profiile image update sucessful for ${user.email}`);
            notify("Profile image updated");
          })
          .catch((error) => {
            console.error(
              `Profiile image update failed for ${user.email}`,
              error
            );
            notify(error?.code ?? "Failed to update profile image");
          });

        resolve(true);
      } catch (error: any) {
        console.error(`Profiile image update failed`, error);
        notify("Failed to update profile image");
        reject(error.code ?? error.message);
      }
    });
  }
}

// return new Promise(async(resolve,reject)=>{})

import { getApp, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContextProvider from "../store/user/user";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import ErrorBoundary from "../components/layout/ErrorBoundary";
export { reportWebVitals } from "next-axiom";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  // measurementId: process.env.REACT_APP_measurementId,
};

initializeApp(firebaseConfig);
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(getFirestore(), "localhost", 8080);
  connectAuthEmulator(getAuth(), "http://localhost:9099");
  connectStorageEmulator(getStorage(), "localhost", 9199);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <Head>
        <title>Rereceipt</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </UserContextProvider>
  );
}

export default MyApp;

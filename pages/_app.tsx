import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { ToastContainer } from "react-toastify";

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

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>

      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}

export default MyApp;

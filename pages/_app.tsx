import Head from "next/head";
import EditorProvider from "../store/editor/store";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EditorProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <Component {...pageProps} />
    </EditorProvider>
  );
}

export default MyApp;

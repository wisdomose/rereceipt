import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="logo.png" type="image/x-icon" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Moulpali&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        ></link>

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Rereceipt</title>
        <meta name="title" content="Rereceipt" />
        <meta
          name="description"
          content="Effortlessly design and export professional-looking receipts with our customizable templates"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rereceipt.cc" />
        <meta property="og:title" content="rereceipt.cc" />
        <meta
          property="og:description"
          content="Effortlessly design and export professional-looking receipts with our customizable templates"
        />
        <meta property="og:image" content="./logo.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rereceipt.cc" />
        <meta property="twitter:title" content="rereceipt.cc" />
        <meta
          property="twitter:description"
          content="Effortlessly design and export professional-looking receipts with our customizable templates"
        />
        {/* <meta property="twitter:site" content="@betahuhn"/> */}
        <meta
          property="twitter:image"
          content="./logo.png"
        />

        <link
          rel="icon"
          type="image/png"
          href="./logo.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

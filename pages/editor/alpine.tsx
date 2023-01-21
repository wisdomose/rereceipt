import Head from "next/head";
import { UseEditorProps } from "../../store/editor/type";
import Alpine from "../../modules/editors/Alpine";
import { useRouter } from "next/router";
import receipts from "../../receipts/index";
import useEditor from "../../store/editor/useEditor";

export default function AlpineWrapper() {
  const router = useRouter();
  const { pdfFile, previewMode, ref } = useEditor();

  if (!router.query.receipt) return null;

  const receipt = receipts.find(
    (receipt) => receipt.default.name === router.query.receipt
  );

  if (!receipt) {
    return <p>invalid file</p>;
  }

  const { Editor, Image } = receipt.default;

  return (
    <>
      <Head>
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
      </Head>

      <Alpine receipt={router.query.receipt as UseEditorProps["receipt"]}>
        {/* {previewMode ? <Pdf structure={structure} /> : <Editor />} */}
        {previewMode ? <Image ref={ref} /> : <Editor />}
      </Alpine>
    </>
  );
}

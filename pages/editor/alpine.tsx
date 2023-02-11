import { UseEditorProps } from "../../store/editor/type";
import Alpine from "../../modules/editors/Alpine";
import { useRouter } from "next/router";
import receipts from "../../receipts/index";
import useEditor from "../../store/editor/useEditor";
import { useEffect } from "react";
import EditorProvider from "../../store/editor/store";
import Page from "../../components/layout/Page";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import logo from "../../src/img/icons/logo.png";
import { FiSettings } from "react-icons/fi";

export default function AlpineWrapper() {
  return (
    <EditorProvider>
      <Wrapped />
    </EditorProvider>
  );
}

function Wrapped() {
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
    // <Page isProtected={true}>
    //   <Page.Body>
    <>
      <nav className="bg-black/80 flex justify-between items-center h-14 box-border max-w-screen">
        {/* w-14 */}
        <Link
          href="/"
          className="text-gray-50 hover:bg-gray-50/10 focus:bg-gray-50/10 w-14 h-full mr-3 flex items-center justify-center focus:ring-0 focus:outline-none"
        >
          <img
            src={logo.src}
            alt="logo"
            className="w-full h-6 object-contain"
          />
          {/* <FiChevronLeft className="text-2xl" />
          <p>back</p> */}
          {/* <FiMenu className="text-2xl" /> */}
        </Link>
      </nav>
      <Alpine receipt={router.query.receipt as UseEditorProps["receipt"]}>
        {/* {previewMode ? <Pdf structure={structure} /> : <Editor />} */}
        {previewMode ? <Image ref={ref} /> : <Editor />}
      </Alpine>
    </>
    //   </Page.Body>
    // </Page>
  );
}

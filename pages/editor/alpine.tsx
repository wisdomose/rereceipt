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
import { getOneTemplate } from "../../utils/firebase";
import { useState } from "react";
import { DOC, POS, RECEIPT } from "../../types";
import NavBar from "../../components/layout/NavBar";

export default function AlpineWrapper() {
  const router = useRouter();
  const [receipt, setReceipt] = useState<DOC | null>(null);

  useEffect(() => {
    const id = router.query.receipt;
    if (!id || typeof id !== "string") return;

    getOneTemplate(id).then((structure) => {
      if (!structure) throw "No receipt found";
      setReceipt(structure);
    });
  }, [router.query.receipt]);

  return (
    <EditorProvider>
      <Wrapped data={receipt} />
    </EditorProvider>
  );
}

function Wrapped({ data }: { data: DOC | null }) {
  const { pdfFile, previewMode, ref } = useEditor();

  if (!data) return <p>invalid file</p>;

  const file = receipts.find((receipt) => receipt.default.name === data.name);

  if (!file) return <p>invalid file</p>;

  const { Editor, Image } = file.default;

  return (
    // <Page isProtected={true}>
    //   <Page.Body>
    <>
      <NavBar isLoggedIn={!false} />
      <Alpine
        name={data.name}
        structure={data.data}
        type={data.type}
        img={data.img}
      >
        {/* {previewMode ? <Pdf structure={structure} /> : <Editor />} */}
        {previewMode ? <Image ref={ref} /> : <Editor />}
      </Alpine>
    </>
    //   </Page.Body>
    // </Page>
  );
}

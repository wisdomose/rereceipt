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
import Loader from "../../components/layout/Loader";
import PaidProtected from "../../components/layout/PaidProtected";
import useUser from "../../store/user/useUser";
import { findReceipt, notify } from "../../utils";

export default function AlpineWrapper() {
  const router = useRouter();
  const [receipt, setReceipt] = useState<DOC | null>(null);
  const { loading, loggedIn, user } = useUser();

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.replace("/no-access");
    }
  }, [loading, loggedIn]);

  useEffect(() => {
    const id = router.query.receipt;
    if (!id || typeof id !== "string") return;

    getOneTemplate(id)
      .then((structure) => {
        if (!structure) throw "No receipt found";
        setReceipt(structure);
      })
      .catch((err) => {
        notify(err.message ?? "an error occured");
      });
  }, [router.query.receipt]);

  if (!receipt || !loggedIn || loading) return <Loader />;

  return (
    <PaidProtected>
      <EditorProvider>
        <NavBar isLoggedIn={loggedIn} user={user} />
        <Wrapped data={receipt} />
      </EditorProvider>
    </PaidProtected>
  );
}

function Wrapped({ data }: { data: DOC }) {
  const { pdfFile, previewMode, ref } = useEditor();

  const file = findReceipt(data.template_name);
  if (!file) return <p>invalid file</p>;

  const { Editor, Image } = file;

  return (
    // <Page isProtected={true}>
    //   <Page.Body>
    <>
      <Alpine
        name={data.template_name}
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

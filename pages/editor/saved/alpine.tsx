import Alpine from "../../../modules/editors/Alpine";
import { useRouter } from "next/router";
import receipts from "../../../receipts/index";
import useEditor from "../../../store/editor/useEditor";
import { useEffect } from "react";
import EditorProvider from "../../../store/editor/store";
import { getOneSavedTemplate } from "../../../utils/firebase";
import { useState } from "react";
import { SAVED } from "../../../types";
import Loader from "../../../components/layout/Loader";
import NavBar from "../../../components/layout/NavBar";
import PaidProtected from "../../../components/layout/PaidProtected";
import useUser from "../../../store/user/useUser";
import { findReceipt } from "../../../utils";

export default function AlpineWrapper() {
  const router = useRouter();
  const [receipt, setReceipt] = useState<SAVED | null>(null);
  const [loading, setLoading] = useState(true);
  const { loading: loadingUser, loggedIn } = useUser();

  useEffect(() => {
    if (!loadingUser && !loggedIn) {
      router.replace("/no-access");
    }
  }, [loadingUser, loggedIn]);

  useEffect(() => {
    const id = router.query.receipt;
    if (!id || typeof id !== "string") return;

    getOneSavedTemplate(id)
      .then((structure) => {
        if (!structure) throw "No receipt found";
        setReceipt(structure);
        setLoading(false);
      })
      .catch((err) => {
        router.replace("/saved");
      });
  }, [router.query.receipt]);

  if (loading || loadingUser || !loggedIn) return <Loader />;

  return (
    <PaidProtected>
      <EditorProvider>
        <Wrapped data={receipt} />
      </EditorProvider>
    </PaidProtected>
  );
}

function Wrapped({ data }: { data: SAVED | null }) {
  const { pdfFile, previewMode, ref } = useEditor();

  if (!data) return <p>invalid file</p>;

  const file = findReceipt(data.data.settings.id);

  if (!file) return <p>invalid file</p>;

  const { Editor, Image } = file;

  return (
    <>
      <NavBar isLoggedIn={!false} />
      <Alpine
        name={data.name}
        structure={data.data}
        type={data.type}
        img={data.img}
        saved={true}
        templateId={data.templateId}
      >
        {/* {previewMode ? <Pdf structure={structure} /> : <Editor />} */}
        {previewMode ? <Image ref={ref} /> : <Editor />}
      </Alpine>
    </>
  );
}

import { UseEditorProps } from "../../store/editor/type";
import Alpine from "../../modules/editors/Alpine";
import { useRouter } from "next/router";
import receipts from "../../receipts/index";
import useEditor from "../../store/editor/useEditor";
import { useEffect } from "react";

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
      <Alpine receipt={router.query.receipt as UseEditorProps["receipt"]}>
        {/* {previewMode ? <Pdf structure={structure} /> : <Editor />} */}
        {previewMode ? <Image ref={ref} /> : <Editor />}
      </Alpine>
    </>
  );
}

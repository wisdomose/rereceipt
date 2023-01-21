import { useContext, useEffect } from "react";
import { EditorStore } from "./store";
import { Context, UseEditorProps } from "./type";
import receipts from "../../receipts";

export default function useEditor<T extends Context>(props?: UseEditorProps) {
  const store = useContext(EditorStore);

  useEffect(() => {
    if (!props?.receipt) return;
    const receipt = receipts.find(
      (receipt) => receipt.default.name === props.receipt
    );
    if (!receipt) return;
    const { Pdf, name, structure } = receipt.default;
    // @ts-ignore
    store.updatePdfFile(<Pdf structure={store.structure} />);
    store.updateName(name);
    store.updateStructure(structure);
  }, [props?.receipt]);

  useEffect(() => {
    if (!props?.receipt) return;
    const receipt = receipts.find(
      (receipt) => receipt.default.name === props.receipt
    );
    if (!receipt) return;
    const { Pdf } = receipt.default;

    store?.structure && // @ts-ignore
      store.updatePdfFile(<Pdf structure={store.structure} />);
  }, [store?.structure, props?.receipt]);

  return store as T;
}

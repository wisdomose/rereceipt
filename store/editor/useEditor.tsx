import { useContext, useEffect } from "react";
import { EditorStore } from "./store";
import { Context, UseEditorProps } from "./type";
import receipts from "../../receipts";
import { findReceipt } from "../../utils";

export default function useEditor<T extends Context>(props?: UseEditorProps) {
  const store = useContext(EditorStore);

  /**
   * TODO
   * - in the pdf file, make the structure props not required
   */
  useEffect(() => {
    if (!props || !props?.name || !props?.structure) return;

    const receipt = findReceipt(props.name ?? "");

    if (!receipt) return;
    const { Pdf } = receipt;

    // @ts-ignore
    store.updatePdfFile(<Pdf structure={store.structure} />);
    // store.updateName(props.name);
    store.updateStructure(props.structure);
  }, [props?.name]);

  // when the structure changes, update the pdf component of the receipt to hold the latest structure

  // NOTE another approach could be to just render the component when the user is exporting so as to remove this extra useEffect

  useEffect(() => {
    if (!props?.name) return;
    const receipt = findReceipt(props.name ?? "");

    if (!receipt) return;
    const { Pdf } = receipt;

    store?.structure && // @ts-ignore
      store.updatePdfFile(<Pdf structure={store.structure} />);
  }, [store?.structure, props?.name]);

  return store as T;
}

import { SetStateAction, Dispatch } from "react";
import * as receipts from "../../receipts";
import { POS, RECEIPT } from "../../types";

export type Pdf = JSX.Element;

export const formats = ["jpeg", "png", "svg"] as const;
// export const formats = ["pdf", "jpeg", "png", "svg"] as const;

export type Format = typeof formats[number];

export type Context = {
  updatePdfFile: (f?: Pdf) => void;
  updateName: (name: string) => void;
  updatePreviewMode: (value: boolean) => void;
  updateStructure: (structure: Record<string, any>) => void;
  exportFile: () => Promise<void>;
  setStructure: Dispatch<SetStateAction<{}>>;
  updateFormat: (format: Format) => void;
  format: Format;
  pdfFile?: Pdf;
  previewMode: boolean;
  name: string;
  ref: any;
  isLoading: boolean;
  structure: RECEIPT | POS;
};

export type UseEditorProps = {
  name: string;
  // name: keyof typeof receipts.default;
  structure: RECEIPT | POS;
};

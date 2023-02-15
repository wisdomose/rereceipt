import { SetStateAction, Dispatch } from "react";
import * as receipts from "../../receipts";
import { DOC_TYPES, FONT_FAMILY, FONT_SIZE, POS, RECEIPT } from "../../types";

export type Pdf = JSX.Element;

export const formats = ["jpeg", "png", "svg"] as const;
// export const formats = ["pdf", "jpeg", "png", "svg"] as const;

export type Format = typeof formats[number];

export type Context = {
  updatePdfFile: (f?: Pdf) => void;
  updateName: (name: string) => void;
  updatePreviewMode: (value: boolean) => void;
  updateStructure: (structure: Context["structure"]) => void;
  exportFile: () => Promise<void>;
  setStructure: Dispatch<SetStateAction<Context["structure"]>>;
  updateFormat: (format: Format) => void;
  updateFont: (value: FONT_FAMILY) => void;
  updateFontSize: (value: FONT_SIZE) => void;
  updateWidth: (value: string) => void;
  format: Format;
  pdfFile?: Pdf;
  previewMode: boolean;
  name: string;
  ref: any;
  isLoading: boolean;
  structure: (RECEIPT & POS) | undefined;
};

export type UseEditorProps = {
  name: string;

  // name: keyof typeof receipts.default;
  structure: RECEIPT | POS;
};

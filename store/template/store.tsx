import { Dispatch, SetStateAction, createContext } from "react";
import { DOC_TYPES, RECEIPT } from "../../types";

export const TemplateContext = createContext<{
  receipt?: Required<RECEIPT>;
  base?: Required<RECEIPT>;
  template_name: string;
  isActive: boolean;
  type: DOC_TYPES;
  img: string;
  setReceipt: Dispatch<SetStateAction<Required<RECEIPT> | undefined>>;
  // setBase: Dispatch<SetStateAction<Required<RECEIPT> | undefined>>;
  updateType: (value: DOC_TYPES) => void;
  toggleIsActive: () => void;
  updateImg: (value: string) => void;
}>({
  template_name: "",
  isActive: false,
  receipt: undefined,
  base: undefined,
  img: "",
  type: DOC_TYPES.RECEIPT,
  updateImg: () => {},
  setReceipt: () => {},
  // setBase: () => {},
  updateType: () => {},
  toggleIsActive: () => {},
});

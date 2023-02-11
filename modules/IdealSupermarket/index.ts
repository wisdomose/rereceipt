import Image from "./Image";
import Pdf from "./Pdf";
import structure from "./structure";
import Editor from "./editor";
import IdealSupermarket from "../../src/img/ideal supermarket.jpg";
import { DOC_TYPES } from "../../types";

export default {
  name: "ideal supermarket",
  Image,
  Pdf,
  structure,
  Editor,
  img: IdealSupermarket,
  category: DOC_TYPES.RECEIPT,
};

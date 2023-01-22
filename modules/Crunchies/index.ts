import Image from "./Image";
import Pdf from "./Pdf";
import structure from "./structure.json";
import Editor from "./editor";
import img from "../../src/img/crunchies.jpg";
import { CATEGORIES } from "../../receipts/types";

const a = {
  name: "crunchies",
  Image,
  Pdf,
  structure,
  Editor,
  img,
  category: CATEGORIES.RECEIPT,
};

export default a;

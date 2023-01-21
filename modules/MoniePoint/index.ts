import Image from "./Image";
import Pdf from "./Pdf";
import structure from "./structure.json";
import Editor from "./editor";
import MoniePoint from "../../src/img/monie point.jpg";
import { CATEGORIES } from "../../receipts/types";

const a = {
  name: "monie point",
  Image,
  Pdf,
  structure,
  Editor,
  img: MoniePoint,
  category: CATEGORIES.POS,
};

export default a;

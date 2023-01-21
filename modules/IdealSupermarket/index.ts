import Image from "./Image";
import Pdf from "./Pdf";
import structure from "./structure.json";
import Editor from "./editor";
import IdealSupermarket from "../../src/img/ideal supermarket.jpg";
import { CATEGORIES } from "../../receipts/types";

export default {
  name: "ideal supermarket",
  Image,
  Pdf,
  structure,
  Editor,
  img: IdealSupermarket,
  category: CATEGORIES.RECEIPT,
};

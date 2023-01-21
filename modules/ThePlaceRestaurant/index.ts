import Image from "./Image";
import Pdf from "./Pdf";
import structure from "./structure.json";
import Editor from "./editor";
import img from "../../src/img/the place restaurant.jpg";
import { CATEGORIES } from "../../receipts/types";

const a = {
  name: "the place restaurant",
  Image,
  Pdf,
  structure,
  Editor,
  img,
  category: CATEGORIES.RECEIPT,
};

export default a;

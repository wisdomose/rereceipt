import { toast } from "react-toastify";
import { ITEM, SETTING } from "../types";
import receipts from "../receipts";

// functions
export function genStyle(elem: ITEM) {
  let style: Record<string, any> = {};
  if (!elem) return {};
  Object.keys(elem).forEach((field) => {
    switch (field) {
      case "text_align":
        style.textAlign = elem[field];
        break;
      case "transform":
        style.textTransform = elem[field];
        break;
      case "font_weight":
        style.fontWeight = elem[field];
        break;
      case "font_size":
        style.fontSize = elem[field];
        break;
      default:
        break;
    }
  });
  return style;
}

export function genPdfStyle(elem: ITEM) {
  let style: Record<string, any> = {};
  if (!elem) return {};
  Object.keys(elem).forEach((field) => {
    switch (field) {
      case "text_align":
        enum ALIGN {
          end = "right",
          left = "left",
          center = "center",
        }
        // @ts-ignore
        style.textAlign = ALIGN[elem[field]];
        break;
      case "transform":
        style.textTransform = elem[field];
        break;
      case "font_weight":
        style.fontWeight = elem[field];
        break;
      case "font_size":
        style.fontSize = elem[field];
        break;
      default:
        break;
    }
  });
  return style;
}

export function genEditorStyle(elem: SETTING) {
  let style: Record<string, any> = {};

  Object.keys(elem).forEach((field) => {
    switch (field) {
      case "font_family":
        style.fontFamily = elem[field];
        break;
      case "width":
        style.width = elem[field];
        break;
      case "font_size":
        style.fontSize = elem[field];
        break;
      default:
        break;
    }
  });
  return style;
}

export function pick<T extends Record<string, any>>(obj: T, pick: string[]) {
  let temp = { ...obj };
  Object.keys(temp).map((key) => {
    if (!pick.includes(key)) {
      delete temp[key];
    }
  });
  return temp;
}

export function omit<T extends Record<string, any>>(obj: T, omit: string[]) {
  let temp = { ...obj };
  Object.keys(temp).map((key) => {
    if (omit.includes(key)) {
      delete temp[key];
    }
  });
  return temp;
}

export function notify(text: string) {
  toast(text, {
    toastId: text,
  });
}

const month = [
  "Jan",
  "Feb",
  "Mch",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export function dateToString(date: string) {
  const v = new Date(date);

  return `${month[v.getMonth()]} ${v.getMonth()}, ${v.getFullYear()}`;
}

export function findReceipt(id: string) {
  const receipt = receipts.find((receipt) => receipt.default.name === id);
  if (!receipt) return;
  const data = receipt.default;

  return data;
}

export function openInNewTab(link: string) {
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.click();
}

export function capsFirst(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

// check if two objects are equal to support deeply nested objects and multiple value types
function isEqual(obj1: Record<string, any>, obj2: Record<string, any>) {
  let variant = false;

  const keys = Object.keys(obj1);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (variant) {
      break;
    }

    if (Array.isArray(obj1[key])) {
    } else {
      switch (typeof obj1[key]) {
        case "object":
          break;
        case "number":
        case "boolean":
        case "string":
          variant = obj1[key] === obj2[key];
          break;
        default:
          break;
      }
    }
  }

  return variant;
}

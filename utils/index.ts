import { ITEM, SETTING } from "../types";

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
  Object.keys(obj).map((key) => {
    if (!pick.includes(key)) {
      delete obj[key];
    } 
  });
  return obj;
}
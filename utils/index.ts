// types
export type Elem = {
  label: string;
  text_align: string;
  transform: string;
  font_weight: string;
  font_size?: string;
};

type EditorSettings = {
  font_family: string;
  font_size: string;
  width: string;
};

// functions
export function genStyle(elem: Elem) {
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

export function genPdfStyle(elem: Elem) {
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

export function genEditorStyle(elem: EditorSettings) {
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

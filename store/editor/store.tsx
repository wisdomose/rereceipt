import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Context, Format, Pdf, formats } from "./type";
import { useRouter } from "next/router";
import { toPng, toJpeg, toCanvas, toSvg } from "html-to-image";
import jspdf from "jspdf";

export const EditorStore = createContext<Context>({
  updatePdfFile: () => {},
  updatePreviewMode: () => {},
  updateFormat: () => {},
  exportFile: async () => {},
  updateName: () => {},
  updateStructure: () => {},
  setStructure: () => {},
  format: formats[0],
  pdfFile: undefined,
  previewMode: false,
  name: "document",
  ref: {},
  isLoading: false,
  structure: {},
});

export default function EditorProvider(props: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<Pdf>();
  const [name, setName] = useState("document");
  const [structure, setStructure] = useState<Context["structure"]>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [format, setFormat] = useState<Context["format"]>(formats[0]);
  const router = useRouter();
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      setPdfFile(undefined);
      setName("document");
      setStructure({});
      setPreviewMode(false);
      setFormat(formats[0]);
      console.log("unmounted");
    };
  }, [router.asPath]);

  useEffect(() => {
    if (previewMode) {
      ref.current = ref.current;
    }
  }, [previewMode]);

  // BUG: when downloading an image, the name of the file isn't the current name
  const downloadImage = useCallback(
    (data: { data: string; format: Format }) => {
      // console.log(data);
      saveAs(data.data, name + "." + data.format);
    },
    [name]
  );
  // async function downloadPdf() {
  //   setIsLoading(true);
  //   try {
  //     if (!pdfFile) return;
  //     await pdf(pdfFile)
  //       .toBlob()
  //       .then((res) => {
  //         saveAs(res, name + ".pdf");
  //       });
  //   } catch (err: any) {
  //     console.error(err);
  //     console.log(err.message);
  //   }
  //   setIsLoading(false);
  // }

  async function exportFile() {
    function filter(node: any) {
      return node.tagName !== "i";
    }

    try {
      if (!ref?.current) {
        console.log("Image still rendering");
        return;
      }

      const options = { quality: 1, pixelRatio: 2 };

      switch (format) {
        // case "pdf":
        //   await toCanvas(ref.current, { ...options }).then((png) => {
        //     // const img = new Image();
        //     // img.src = png;
        //     console.log({
        //       width: png.width,
        //       width2: png.scrollWidth,
        //       height: png.height,
        //       height2: png.scrollHeight,
        //     });
        //     // downloadImage({ data: png, format: "svg" });

        //     const pdf = new jspdf({ unit: "px" });
        //     // pdf.pdf.addSvgAsImage(svg, 0, 0, img.width, img.height);
        //     pdf.addImage(png, "JPEG", 0, 0, png.width, png.height);
        //     // pdf.addImage(png, "PNG", 0, 0, img.width, img.height);
        //     pdf.save(name + ".pdf");
        //   });
        //
        // break;
        case "jpeg":
          await toJpeg(ref.current, options).then(function (dataUrl) {
            downloadImage({ data: dataUrl, format: "jpeg" });
          });
          break;
        case "png":
          await toPng(ref.current, options).then(function (dataUrl) {
            downloadImage({ data: dataUrl, format: "png" });
          });
          break;
        case "svg":
          await toSvg(ref.current, { ...options, filter }).then(function (
            dataUrl
          ) {
            downloadImage({ data: dataUrl, format: "svg" });
          });
          break;
        default:
          break;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const updatePdfFile = (file?: Pdf) => setPdfFile(file);
  const updateName = (name: string) => setName(name);
  const updateStructure = (structure: Context["structure"]) =>
    setStructure(structure);
  const updatePreviewMode = (value: boolean) => setPreviewMode(value);
  const updateFormat = (value: Context["format"]) => setFormat(value);

  const value = {
    updatePdfFile,
    updateName,
    updateFormat,
    updatePreviewMode,
    exportFile,
    updateStructure,
    setStructure,
    format,
    name,
    ref,
    pdfFile,
    previewMode,
    isLoading,
    structure,
  };

  return (
    <EditorStore.Provider value={value}>{props.children}</EditorStore.Provider>
  );
}

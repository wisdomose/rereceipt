import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useToImage } from "@hcorta/react-to-image";
import { Context, Pdf, formats } from "./type";
import { useRouter } from "next/router";

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

  // BUG: when downloading an image, the name of the file isn't the current name
  const downloadImage = useCallback(
    (data: Record<string, any>) => {
      saveAs(data.data, name + "." + data.format);
    },
    [name]
  );

  const { ref, isLoading, getJpeg, getPng, getSvg } = useToImage(
    {
      pixelRatio: 3,
    },
    downloadImage
  );

  async function downloadPdf() {
    try {
      if (!pdfFile) return;
      await pdf(pdfFile)
        .toBlob()
        .then((res) => {
          saveAs(res, name + ".pdf");
        });
    } catch (err: any) {
      console.error(err);
      console.log(err.message);
    }
  }

  async function exportFile() {
    try {
      switch (format) {
        // case "pdf":
        //   await downloadPdf();
        //   break;
        case "jpeg":
          await getJpeg();
          break;
        case "png":
          await getPng();
          break;
        case "svg":
          await getSvg();
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

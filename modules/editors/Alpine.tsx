import { ReactNode, useRef, useCallback, useState, useEffect } from "react";
import useEditor from "../../store/editor/useEditor";
import { UseEditorProps, formats } from "../../store/editor/type";
import EditorZoom from "../../components/layout/EditorZoom";
import { Disclosure, Menu, Popover } from "@headlessui/react";
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEyeOff,
  FiMinus,
  FiPlus,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import {
  DOC_TYPES,
  EDITING_MODE,
  FONT_FAMILY,
  FONT_SIZE,
  POS,
  RECEIPT,
} from "../../types";
import { useRouter } from "next/router";
import Button from "../../components/button";
import useUser from "../../store/user/useUser";
import { overrideTailwindClasses } from "tailwind-override";
import { notify } from "../../utils";
import Rereceipt from "../../res/Rereceipt";
import useFetcher from "../../hooks/useFetcher";

type Props = Pick<UseEditorProps, "name"> & {
  children: ReactNode;
  type: DOC_TYPES;
  img: string;
  saved?: boolean;
  templateId?: string;
  structure: RECEIPT & POS;
};

export default function Alpine({ saved = false, templateId, ...props }: Props) {
  const { template } = new Rereceipt();
  const {
    structure,
    editingMode,
    updateEditingMode,
    previewMode,
    updatePreviewMode,
  } = useEditor({
    name: props.name,
    structure: props.structure,
  });

  const { loading: deleteLoading, error: deleteError, wrapper: deleteWrapper, data: deleteData } = useFetcher();
  const { loading: saveLoading, error: saveError, wrapper: saveWrapper, data: saveData } = useFetcher();
  const { loading: saveNewLoading, error: saveNewError, wrapper: saveNewWrapper, data: saveNewData } = useFetcher();

  useEffect(() => {
    if (!deleteData) return;
    router.replace("/saved");
  }, [deleteData])
  useEffect(() => {
    if (!saveData) return;
    notify("file saved");
  }, [saveData])
  useEffect(() => {
    if (!saveNewData) return;
    router.push(`/editor/saved/alpine?receipt=${saveNewData}`);
    notify("file saved");
  }, [saveNewData])

  /**
   * In a saved document, this is the id of the saved document.
   * In the templates page, this is the id of a template
   */
  const [docId, setDocId] = useState("");

  const { loading, loggedIn, spaces } = useUser();

  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", (e) => {
        e.preventDefault();

        const msg =
          "Do you want to exit this page? you may have unsaved changes";

        e.returnValue = msg;

        return msg;
      });

      return () => window.removeEventListener("beforeunload", () => { });
    }
  }, []);

  useEffect(() => {
    let id = router.query.receipt;
    if (!id || typeof id !== "string") return;
    setDocId(id);
  }, [router.query.receipt]);

  const save = useCallback(async () => {
    if (!structure) return;

    if (saved) {
      if (!templateId) return;
      template && await saveWrapper(() => template.saveProgress({
        data: {
          type: props.type,
          img: props.img,
          data: structure,
          template_name: props.name,
          templateId: templateId,
        },
        id: docId,
      }))
    } else {
      template &&
        await saveNewWrapper(() => template.saveProgress({
          data: {
            type: props.type,
            img: props.img,
            data: structure,
            template_name: props.name,
            templateId: docId,
          },
          spaces,
        }))
    }
  }, [props.name, docId, structure, spaces]);

  async function deleteOne() {
    saved
      ? template && await deleteWrapper(() => template.deleteOneSavedTemplate(docId))
      : null;
  }



  return (
    <div className="h-screen scrollbar">
      {/* <div className="h-[calc(100%_-_77px)]"> */}
      <div className="h-full grid grid-rows-[max-content,1fr]">
        {/* toolbar */}
        <div className="w-full">
          <nav className="w-full py-1 px-6 md:pr-14 flex justify-end items-center flex-wrap gap-2 md:gap-6">
            <Select
              items={Object.values(EDITING_MODE)}
              current={editingMode}
              update={(mode) => updateEditingMode(mode)}
              block
              btnStyle="px-3 gap-3 py-1 border-gray5"
            />

            {saved && (
              <button
                className="border border-gray5 rounded-lg py-[10px] px-3"
                onClick={deleteOne}
              >
                <FiTrash2 />
              </button>
            )}

            <button
              className="border border-gray5 rounded-lg py-[10px] px-3"
              onClick={() => updatePreviewMode(!previewMode)}
            >
              {previewMode ? <FiEyeOff /> : <FiEye />}
            </button>

            <Popover className="relative lg:hidden">
              {({ open }: { open: boolean }) => (
                <>
                  <Popover.Button className="border border-gray5 rounded-lg py-[10px] px-3">
                    <FiSettings />
                  </Popover.Button>
                  <Popover.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md z-10" />
                  <div
                    className={`z-10 fixed max-h-[calc(100vh_-_154px)] h-auto left-6 top-[77px] flex items-center justify-center ${open ? "right-6" : "right-full"
                      }`}
                  >
                    <Popover.Panel className="bg-white w-[501px] max-w-[90vw] mx-auto rounded-xl aspect-auto relative max-h-screen overflow-auto">
                      <SideBar />
                    </Popover.Panel>
                  </div>
                </>
              )}
            </Popover>

            <Button
              label="save"
              onClick={save}
              disabled={!loggedIn || loading}
              minimal
              className="py-2 border-gray5 text-sm" //6px
              loading={saveLoading}
            />
          </nav>
        </div>

        {/* editor */}
        <div className="h-full lg:grid">
          <div className="grid h-full lg:grid-cols-[1fr,max-content]">
            <EditorZoom ref={ref}>{props.children}</EditorZoom>
            {/* sidebar */}
            <div className="w-[250px] border-l border-l-[#828282] h-full text-[#4F4F4F] absolute right-full lg:static lg:right-0">
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideBar() {
  const {
    updateFormat,
    isLoading,
    previewMode,
    updatePreviewMode,
    name,
    format,
    updateName,
    exportFile,
    updateFont,
    updateFontSize,
    updateWidth,
    structure,
  } = useEditor();

  if (!structure) return null;

  return (
    <>
      {/* mode selector */}
      <div className="flex gap-4 p-3 border-b-[1px] border-[#828282]">
        <button
          className={`capitalize text-sm ${!previewMode ? "font-semibold" : "font-normal"
            }`}
          onClick={() => updatePreviewMode(false)}
        >
          builder
        </button>
        <button
          className={`capitalize text-sm ${previewMode ? "font-semibold" : "font-normal"
            }`}
          onClick={() => updatePreviewMode(true)}
        >
          preview
        </button>
      </div>

      {/* settings */}
      <div className="p-3 border-b-[1px] border-[#828282]">
        <Disclosure>
          {({ open: disOpen }: { open: boolean }) => (
            <>
              <div className="flex justify-between items-center">
                <p
                  className={`text-sm ${disOpen ? "font-semibold " : "font-normal"
                    }`}
                >
                  Settings
                </p>
                <Disclosure.Button>
                  {disOpen ? <FiMinus /> : <FiPlus />}
                </Disclosure.Button>
              </div>
              <Disclosure.Panel>
                <div className="mt-5">
                  {/* font family */}
                  <>
                    <p className="text-xs capitalize mb-1 font-semibold">
                      font family
                    </p>
                    <Select
                      current={structure.settings.font_family}
                      items={Object.values(FONT_FAMILY)}
                      update={updateFont}
                      isFont
                    />
                  </>

                  {/* font size */}
                  <>
                    <p className="text-xs capitalize mb-1 mt-3 font-semibold">
                      font size
                    </p>
                    <Select
                      current={structure.settings.font_size}
                      items={Object.values(FONT_SIZE)}
                      update={updateFontSize}
                    />
                  </>

                  {/* width */}
                  <>
                    <p className="text-xs capitalize mb-1 mt-3 font-semibold">
                      width
                    </p>
                    <input
                      type="number"
                      className="text-sm rounded-md flex items-center justify-between px-2 uppercase border border-gray-300 w-full bg-transparent py-1 focus:outline-none"
                      min={100}
                      max={500}
                      value={structure.settings.width.slice(0, -2)}
                      onChange={(e) => {
                        updateWidth(e.target.value + "px");
                      }}
                    />
                  </>
                  {/* color */}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>

      {/* export */}
      <div className="p-3 border-b-[1px] border-[#828282]">
        <Disclosure>
          {({ open: disOpen }: { open: boolean }) => (
            <>
              <div className="flex justify-between items-center">
                <p
                  className={`text-sm ${disOpen ? "font-semibold " : "font-normal"
                    }`}
                >
                  Export
                </p>
                <Disclosure.Button>
                  {disOpen ? <FiMinus /> : <FiPlus />}
                </Disclosure.Button>
              </div>
              <Disclosure.Panel>
                {/* <div className=""> */}
                <div className="grid gap-4 grid-cols-[1fr,max-content] mt-5">
                  <input
                    type="text"
                    className="w-full text-sm bg-transparent border-0 border-b-[1px] border-gray-300 rounded-0 overflow-hidden focus:outline-none"
                    value={name}
                    onChange={(e) => updateName(e.target.value)}
                  />

                  <Menu>
                    {({ open }: { open: boolean }) => (
                      <div className="relative inline-block overflow-visible">
                        <Menu.Button className="text-sm flex items-center justify-center uppercase">
                          <span className="text-sm">{format}</span>
                          {open ? (
                            <FiChevronDown className="text-gray-300" />
                          ) : (
                            <FiChevronUp className="text-gray-300" />
                          )}
                        </Menu.Button>
                        <Menu.Items className="absolute top-0 right-0 bg-[#FAFAFA] min-w-max shadow-lg pb-2">
                          {formats.map((displayFormat) => (
                            <Menu.Item key={displayFormat}>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => updateFormat(displayFormat)}
                                  className={`text-sm grid grid-cols-[16px,1fr] items-center gap-2 px-1 pt-2 ${active ? "" : "text-gray-700"
                                    }`}
                                >
                                  {displayFormat === format ? (
                                    <FiCheck />
                                  ) : (
                                    <span></span>
                                  )}
                                  <span>{displayFormat}</span>
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </div>
                    )}
                  </Menu>
                </div>

                <button
                  className="text-sm border-[1px] border-gray-500 block mt-5 w-full py-1 pb-2 rounded-md"
                  onClick={
                    isLoading
                      ? undefined
                      : () => {
                        updatePreviewMode(true);
                        exportFile();
                      }
                  }
                >
                  {!isLoading ? `export ${name}` : "loading"}
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}

type SelectProps = {
  current: any;
  update: (value: any) => void;
  items: any[];
  style?: Record<string, any>;
  block?: boolean;
  btnStyle?: string;
  isFont?: boolean;
};

function Select({
  update,
  items,
  current,
  style,
  block = false,
  btnStyle = "",
  isFont = false,
}: SelectProps) {
  return (
    <Menu>
      {({ open }: { open: boolean }) => (
        <div
          className={`relative inline-block overflow-visible ${block ? "w-fit" : "w-full"
            }`}
        >
          <Menu.Button
            className={overrideTailwindClasses(
              `border border-gray-300 text-sm rounded-md flex items-center justify-between px-2 uppercase w-full ${btnStyle}`
            )}
            style={style}
          >
            <span className="text-sm py-1 lowercase">{current}</span>
            {open ? (
              <FiChevronDown className="text-gray-400" />
            ) : (
              <FiChevronUp className="text-gray-400" />
            )}
          </Menu.Button>

          <Menu.Items className="absolute right-0 w-full bg-[#FAFAFA] min-w-max shadow-lg pb-2 z-10">
            {items.map((item) => (
              <Menu.Item key={item}>
                {({ active }: { active: boolean }) => (
                  <button
                    className={`text-sm grid grid-cols-[16px,1fr] items-center gap-2 px-1 pt-2 w-full ${active ? "font-semibold" : ""
                      }`}
                    onClick={() => update(item)}
                  >
                    {item === current ? <FiCheck /> : <span></span>}
                    <span
                      className="block text-start w-full"
                      style={{
                        ...style,
                        fontFamily: isFont ? item : undefined,
                      }}
                    >
                      {item}
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </div>
      )}
    </Menu>
  );
}

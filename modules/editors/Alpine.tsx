import { ReactNode, useEffect, useRef, useCallback } from "react";
import useEditor from "../../store/editor/useEditor";
import { UseEditorProps, formats } from "../../store/editor/type";
import EditorZoom from "../../components/layout/EditorZoom";
import { Disclosure, Menu, Popover } from "@headlessui/react";
import {
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiMinus,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import Link from "next/link";
import logo from "../../src/img/icons/logo.png";
import {
  DOC_TYPES,
  FONT_FAMILY,
  FONT_SIZE,
  POS,
  RECEIPT,
  SAVED,
} from "../../types";
import { saveProgress } from "../../utils/firebase";
import { useRouter } from "next/router";
import Button from "../../components/button";
import useUser from "../../store/user/useUser";

type Props = Pick<UseEditorProps, "name"> & {
  children: ReactNode;
  type: DOC_TYPES;
  img: string;
  saved?: boolean;
  templateId?: string;
  structure: RECEIPT & POS;
};

export default function Alpine({ saved = false, templateId, ...props }: Props) {
  const { structure } = useEditor({
    name: props.name,
    structure: props.structure,
  });

  const { loading, loggedIn } = useUser();

  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);

  const save = useCallback(async () => {
    let id = router.query.receipt;

    if (!id || typeof id !== "string" || !structure) return;
    if (saved) {
      if (!templateId) return;
      await saveProgress(
        {
          type: props.type,
          img: props.img,
          data: structure,
          name: props.name,
          templateId: templateId,
        },
        id
      );
    } else {
      await saveProgress({
        type: props.type,
        img: props.img,
        data: structure,
        name: props.name,
        templateId: id,
      });
    }
  }, [props.name, router.query.receipt, structure]);

  return (
    <div className="h-screen scrollbar">
      {/* <div className="h-[calc(100%_-_77px)]"> */}
      <div className="h-full grid grid-rows-[max-content,1fr]">
        <nav className="w-full h-14 pl-14 pr-4 flex justify-end items-center gap-6">
          <Select
            items={["Standard", "Simple"]}
            current={"Standard"}
            update={() => {}}
            block
            btnStyle="px-3 gap-3"
          />

          <Button label="Save" onClick={save} disabled={!loggedIn || loading} />
        </nav>
        <div className="h-full lg:grid ">
          <div className="grid lg:grid-cols-[1fr,max-content]">
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
          className={`capitalize text-sm ${
            !previewMode ? "font-semibold" : "font-normal"
          }`}
          onClick={() => updatePreviewMode(false)}
        >
          builder
        </button>
        <button
          className={`capitalize text-sm ${
            previewMode ? "font-semibold" : "font-normal"
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
                  className={`text-sm ${
                    disOpen ? "font-semibold " : "font-normal"
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
                      style={{ fontFamily: structure.settings.font_family }}
                      update={updateFont}
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
                  className={`text-sm ${
                    disOpen ? "font-semibold " : "font-normal"
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
                        <Menu.Items className="absolute top-0 right-0 bg-black min-w-max shadow-lg pb-2">
                          {formats.map((displayFormat) => (
                            <Menu.Item key={displayFormat}>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => updateFormat(displayFormat)}
                                  className={`text-sm grid grid-cols-[16px,1fr] items-center gap-2 px-1 pt-2 ${
                                    active ? "" : "text-gray-50/50"
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
};
function Select({
  update,
  items,
  current,
  style,
  block = false,
  btnStyle,
}: SelectProps) {
  return (
    <Menu>
      {({ open }: { open: boolean }) => (
        <div
          className={`relative inline-block overflow-visible ${
            block ? "w-fit" : "w-full"
          }`}
        >
          <Menu.Button
            className={`text-sm rounded-md flex items-center justify-between px-2 uppercase border border-gray-300 w-full ${
              btnStyle ? btnStyle : ""
            }`}
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
                    className={`text-sm grid grid-cols-[16px,1fr] items-center gap-2 px-1 pt-2 w-full ${
                      active ? "font-semibold" : ""
                    }`}
                    onClick={() => update(item)}
                  >
                    {item === current ? <FiCheck /> : <span></span>}
                    <span className="block text-start w-full" style={style}>
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

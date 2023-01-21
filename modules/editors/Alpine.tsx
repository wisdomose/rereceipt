import { ReactNode, useEffect, useRef } from "react";
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

type Props = {
  receipt: UseEditorProps["receipt"];
  children: ReactNode;
};

export default function Alpine(props: Props) {
  const {} = useEditor({
    receipt: props.receipt,
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ref.current?.scrollTo(
    //   (ref?.current?.scrollWidth ?? 0) / 2 -
    //     (ref?.current?.clientWidth ?? 0) / 2,
    //   (ref?.current?.scrollHeight ?? 0) / 2 -
    //     (ref?.current?.clientWidth ?? 0) / 2
    // );
  }, []);

  return (
    <div className="bg-gray-200 h-full grid grid-rows-[max-content,1fr]">
      <nav className="bg-black/80 flex justify-between items-center h-14 box-border max-w-screen">
        {/* w-14 */}
        <Link
          href="/"
          className="text-gray-50 hover:bg-gray-50/10 focus:bg-gray-50/10 h-full pr-3 flex items-center justify-center focus:ring-0 focus:outline-none"
        >
          <FiChevronLeft className="text-2xl" />
          <p>back</p>
          {/* <FiMenu className="text-2xl" /> */}
        </Link>

        {/* sidemenu */}
        <Popover className="lg:hidden">
          {({ open }: { open: boolean }) => (
            <>
              <Popover.Button className="text-gray-50 hover:bg-gray-50/10 focus:bg-gray-50/10  h-full w-14 flex items-center justify-center focus:ring-0 focus:outline-none">
                <FiSettings />
              </Popover.Button>
              <Popover.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 " />
              <Popover.Panel
                className={`w-[250px] bg-black/80 h-full text-gray-200 fixed top-0 z-50 ${
                  open ? "right-0" : "right-full"
                }`}
              >
                <SideBar />
              </Popover.Panel>
            </>
          )}
        </Popover>

        <p className="bg-gray-200 text-xs px-2 rounded-full h-fit mr-5">
          0.0.0 - BETA
        </p>
      </nav>

      <div className="h-full  lg:grid lg:grid-cols-[max-content,1fr,max-content]">
        <div className="w-[200px] bg-black/80 h-full absolute -left-full lg:left-0 lg:static"></div>

        <EditorZoom ref={ref}>{props.children}</EditorZoom>

        {/* sidebar */}
        <div className="w-[250px] bg-black/80 h-full text-gray-200 absolute right-full lg:static lg:right-0">
          <SideBar />
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
  } = useEditor();

  return (
    <>
      {/* mode selector */}
      <div className="flex gap-4 p-3 border-b-[1px] border-gray-200/50">
        <button
          className={`capitalize text-sm ${
            !previewMode ? "font-bold text-white" : "font-normal"
          }`}
          onClick={() => updatePreviewMode(false)}
        >
          builder
        </button>
        <button
          className={`capitalize text-sm ${
            previewMode ? "font-bold text-white" : "font-normal"
          }`}
          onClick={() => updatePreviewMode(true)}
        >
          preview
        </button>
      </div>

      {/* export */}
      <div className="p-3 border-b-[1px] border-gray-200/50">
        <Disclosure>
          {({ open: disOpen }: { open: boolean }) => (
            <>
              <div className="flex justify-between items-center">
                <p
                  className={`text-sm ${
                    disOpen ? "font-bold text-white" : "font-normal"
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
                    className="w-full text-sm bg-transparent text-gray-200 border-0 border-b-[1px] rounded-0 overflow-hidden focus:outline-none"
                    value={name}
                    onChange={(e) => updateName(e.target.value)}
                  />

                  <Menu>
                    {({ open }: { open: boolean }) => (
                      <div className="relative inline-block overflow-visible">
                        <Menu.Button className="text-sm flex items-center justify-center uppercase">
                          <span className="text-sm">{format}</span>
                          {open ? (
                            <FiChevronDown className="text-gray-400" />
                          ) : (
                            <FiChevronUp className="text-gray-400" />
                          )}
                        </Menu.Button>
                        <Menu.Items className="absolute top-0 right-0 bg-black min-w-max shadow-lg pb-2">
                          {formats.map((displayFormat) => (
                            <Menu.Item key={displayFormat}>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => updateFormat(displayFormat)}
                                  className={`text-sm grid grid-cols-[16px,1fr] items-center gap-2 px-1 pt-2 ${
                                    active ? "text-white" : "text-gray-50/50"
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

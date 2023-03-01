import { ReactNode, forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { RiFocus2Line } from "react-icons/ri";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import useEditor from "../../store/editor/useEditor";
import { EDITING_MODE } from "../../types";

const EditorZoom = forwardRef<HTMLDivElement, { children: ReactNode }>(
  (props, ref) => {
    const { editingMode , previewMode} = useEditor();
    // bg-[#F2F2F2]

    if (editingMode === EDITING_MODE.BASIC && !previewMode) {
      return (
        <section
          className="overflow-auto relative h-full w-full scrollbar"
          ref={ref}
        >
          <div className="absolute inset-0">
            <div className="grid place-items-center h-full w-full">
              {props.children}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section
        className="overflow-auto relative h-full max-h-screen w-full scrollbar bg-[#F2F2F2]"
        ref={ref}
      >
        <TransformWrapper
          initialScale={0.5}
          minScale={0.5}
          doubleClick={{ disabled: true }}
          wheel={{ wheelDisabled: false }}
          panning={{ disabled: false, excluded: ["input"] }}
          centerOnInit={true}
          centerZoomedOut={true}
        >
          {({ centerView }) => (
            <>
              <TransformComponent
                wrapperStyle={{
                  position: "absolute",
                  inset: "0",
                  width: "100%",
                  height: "100%",
                }}
                contentStyle={{
                  width: "100%",
                }}
              >
                <div className="grid place-items-center min-h-[500vh] w-full">
                  {props.children}
                </div>
              </TransformComponent>

              {/* focus on the editor / bring it into view */}
              <button
                className="absolute right-5 bottom-5 p-2 opacity-50 hover:opacity-100 hover:bg-gray-400/50 rounded-md"
                onClick={() => centerView()}
              >
                <RiFocus2Line />
              </button>
            </>
          )}
        </TransformWrapper>
      </section>
    );
  }
);
EditorZoom.displayName = "EditorZoom";
export default EditorZoom;

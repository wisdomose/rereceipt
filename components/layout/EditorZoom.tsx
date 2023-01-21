import { ReactNode, forwardRef } from "react";
import { RiFocus2Line } from "react-icons/ri";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default forwardRef<HTMLDivElement, { children: ReactNode }>(
  (props, ref) => {
    return (
      <section
        className="overflow-auto relative h-full max-h-screen w-full scrollbar"
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
                  {/* <div className="min-w-[100vw] min-h-[100vh] w-full h-full bg-green-700 grid place-items-center  box-content"> */}
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

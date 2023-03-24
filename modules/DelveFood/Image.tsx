import { DIVIDER } from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { genEditorStyle, genStyle } from "../../utils";
import { Props } from "./types";
import { forwardRef } from "react";

const Image = forwardRef<any, Props>(({ data }, ref) => {
  const { structure: str } = useEditor();

  const structure = data ?? str;
  if (!structure) return null;

  return (
    <div ref={ref}>
      <div style={{ width: structure.settings.width }}>
        <div
          style={genEditorStyle(structure.settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          <>
            {/* name */}
            <p style={genStyle(structure.name)}>{structure.name.label}</p>
            {/* location */}
            <p style={genStyle(structure.location)}>
              {structure.location.label}
            </p>
            {/* contacts */}
            <p style={genStyle(structure.contacts)}>
              {structure.contacts.label}
            </p>
            <div className="flex items-center flex-nowrap">
              <p className="uppercase mr-1">name:</p>
              <p style={genStyle(structure.customer_name)}>
                {structure.customer_name.label}
              </p>
            </div>
          </>

          {/* start */}
          <div className="flex justify-between items-center flex-nowrap w-full mb-1">
            {/* time */}
            <div className="flex flex-row items-center justify-end">
              <p className="whitespace-nowrap mr-1">Time:</p>
              <span style={genStyle(structure.time_in)}>
                {structure.time_in.label}
              </span>
            </div>

            {/* date */}
            <div className="flex flex-row items-center">
              <p className="whitespace-nowrap mr-1">Date:</p>
              <span style={genStyle(structure.date)}>
                {structure.date.label}
              </span>
            </div>
          </div>
          {/* end */}

          {/* products */}
          <div className="relative group table table-fixed w-full">
            {structure.products.map(({ data: product }, index) => (
              <div key={index} className="table-row">
                {product.map((col, position) => (
                  <p
                    className="table-cell"
                    key={col.label + position}
                    style={{
                      ...genStyle(col),
                    }}
                  >
                    {col.label}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-2 mb-1 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          {/* total */}
          <div className="flex flex-nowrap items-center justify-end gap-5">
            <p className="text-end capitalize text-[16px] font-bold">Total</p>
            <p style={genStyle(structure.total)}>{structure.total.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Image;

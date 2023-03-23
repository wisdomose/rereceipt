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
            <p className="flex flex-no-wrap gap-1">
              <p className="block whitespace-nowrap">front desk:</p>
              <span
                style={genStyle(structure.contacts)}
                className="break-words overflow-hidden self-start justify-start"
              >
                {structure.contacts.label}
              </span>
            </p>
            <div className="flex items-center justify-end flex-nowrap">
              <p className="capitalize mr-1">receipt no:</p>
              <p style={genStyle(structure.receipt_no)}>
                {structure.receipt_no.label}
              </p>
            </div>
            <div className="flex items-center justify-end flex-nowrap mb-2">
              <p className="capitalize mr-1">date:</p>
              <p style={genStyle(structure.date)}>{structure.date.label}</p>
            </div>
          </>

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

          {/* total */}
          <div className="flex flex-nowrap items-center justify-end gap-5 my-2">
            <p className="uppercase font-bold">Total</p>
            <p style={genStyle(structure.total)}>{structure.total.label}</p>
          </div>

          <div className="flex items-center flex-nowrap">
            <p className="uppercase mr-1">guest:</p>
            <p style={genStyle(structure.customer_name)}>
              {structure.customer_name.label}
            </p>
          </div>
          <div className="flex items-center flex-nowrap">
            <p className="uppercase mr-1">filled:</p>
            <p style={genStyle(structure.time_in)}>{structure.time_in.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Image;

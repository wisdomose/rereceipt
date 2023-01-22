import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { genEditorStyle, genStyle } from "../../utils";
import { Props, Structure } from "./types";
import { forwardRef } from "react";

const Image = forwardRef<any, Props>((props, ref) => {
  const { structure } = useEditor<
    Omit<Context, "structure"> & { structure: Structure }
  >();

  if (Object.keys(structure).length === 0) return null;

  return (
    <div ref={ref}>
      <div style={{ width: structure.settings.width }}>
        <div
          style={genEditorStyle(structure.settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          {/* heading */}
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
          </>

          {/* start */}
          <div className="table w-full my-2">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell ">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">invoice:</p>
                  <span style={genStyle(structure.receipt_no)}>
                    {structure.receipt_no.label}
                  </span>
                </div>
              </div>

              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row justify-end items-center">
                  <p className="whitespace-nowrap mr-1">Date:</p>
                  <span style={genStyle(structure.date)}>
                    {structure.date.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="table-row">
              {/* cus no */}
              <div className="table-cell"></div>

              {/* time */}
              <div className="table-cell ">
                <div className="flex flex-row items-center justify-end">
                  <p className="whitespace-nowrap mr-1">Time:</p>
                  <span style={genStyle(structure.time)}>
                    {structure.time.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* end */}

          {/* products */}
          <div className="relative group table table-fixed w-full">
            {structure.products.map((product, index) => (
              <div key={index} className="table-row">
                {product.map((col, position) => (
                  <p
                    className="table-cell"
                    key={col.label + position}
                    style={{
                      ...genStyle(col),
                      width:
                        position === 0
                          ? "50%"
                          : 50 / (product.length - 1) + "%",
                    }}
                  >
                    {col.label}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-1" style={genStyle(structure.total_quantity)}>
            {structure.total_quantity.label}
          </p>

          {/* total */}
          <div className="table ml-auto mt-4">
            <div className="table-row">
              <div className="table-cell text-end capitalize">
                Total n <span className="inline-block w-4"></span>
              </div>
              <div className="table-cell">
                <p style={genStyle(structure.total)}>{structure.total.label}</p>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell text-end capitalize">
                cash paid n <span className="inline-block w-4"></span>
              </div>
              <div className="table-cell">
                <p style={genStyle(structure.total)}>{structure.total.label}</p>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell text-end capitalize">
                change n <span className="inline-block w-4"></span>
              </div>
              <div className="table-cell">
                <p style={genStyle(structure.change)}>
                  {structure.change.label}
                </p>
              </div>
            </div>
          </div>

          {/* footer message */}
          <div className="my-8">
            <p style={genStyle(structure.footer_message)}>
              {structure.footer_message.label}
            </p>
          </div>

          {/* cashire name */}
          <p style={genStyle(structure.cashier_name)}>
            {structure.cashier_name.label}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Image;

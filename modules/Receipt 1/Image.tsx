import ImageTable from "../../components/editor/ImageTable";
import { DIVIDER } from "../../components/editor/table";
import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { ITEM, RECEIPT, RECEIPT_KEYS } from "../../types";
import { capsFirst, genEditorStyle, genStyle } from "../../utils";
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
            <p style={genStyle(structure.name)}>{structure.name.label}</p>
            <p style={genStyle(structure.location)}>
              {structure.location.label}
            </p>
            <p style={genStyle(structure.contacts)}>
              {structure.contacts.label}
            </p>
          </>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell ">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1">Receipt #:</p>
                  <span style={genStyle(structure.receipt_no)}>
                    {structure.receipt_no.label}
                  </span>
                </div>
              </div>

              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row justify-start items-center">
                  <p className="whitespace-nowrap mr-1">Date:</p>
                  <span style={genStyle(structure.date)}>
                    {structure.date.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="table-row">
              {/* time */}
              <div className="table-cell ">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1">Time:</p>
                  <span style={genStyle(structure.time_in)}>
                    {structure.time_in.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* end */}
          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          <ImageTable
            hasHeader
            divider={DIVIDER.EQUAL_TO}
            structure={structure}
          />

          {/* products
          <div className="relative group table table-fixed w-full">
            {structure.products.map(({ data: product }, index) => (
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
          </div> */}

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Subtotal..........
            </p>
            <p style={genStyle(structure.sub_total)}>
              {structure.sub_total.label}
            </p>
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Received..........
            </p>
            <p style={genStyle(structure.total)}>{structure.total.label}</p>
          </div>

          {/* start */}
          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          <p className="mt-1" style={genStyle(structure.status)}>
            {structure.status.label}
          </p>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap mb-2">
            {DIVIDER.DASH.padStart(100, DIVIDER.DASH)}
          </div>
          {/* end */}

          <div className="flex justify-between">
            <div>
              <p style={genStyle(structure.payment_type)}>
                {structure.payment_type.label}
              </p>
            </div>

            <div>
              <p style={genStyle(structure.total)}>{structure.total.label}</p>
            </div>
          </div>


          {/* footer */}
          <div className="flex justify-between mt-6">
            <div>
              <div className="tracking-[2px] overflow-hidden text-clip whitespace-nowrap">
                {DIVIDER.DASH.padStart(14, DIVIDER.DASH)}
              </div>
              <p className="text-center">
                {capsFirst("Managers sign")}
              </p>
            </div>

            <div>
              <div className="tracking-[2px] overflow-hidden text-clip whitespace-nowrap">
                {DIVIDER.DASH.padStart(14, DIVIDER.DASH)}
              </div>
              <p className="text-center">
                {capsFirst("Customer sign")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Image;

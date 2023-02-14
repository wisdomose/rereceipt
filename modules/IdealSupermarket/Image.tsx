import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { Props } from "./types";
import { forwardRef } from "react";
import { genEditorStyle, genStyle } from "../../utils";
import { RECEIPT } from "../../types";

const Image = forwardRef<any, Props>((props, ref) => {
  const { structure } = useEditor<
    Omit<Context, "structure"> & { structure: RECEIPT }
  >();
  const getStructure = () => structure as Required<RECEIPT>;
  if (Object.keys(structure).length === 0) return null;

  return (
    <div ref={ref}>
      <div style={{ width: getStructure().settings.width }}>
        <div
          style={genEditorStyle(getStructure().settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          <p style={genStyle(getStructure().name)}>
            {getStructure().name.label}
          </p>
          <p
            style={genStyle(getStructure().location)}
            className="w-3/4 mx-auto"
          >
            {getStructure().location.label}
          </p>
          <div className="flex flex-row gap-1 mx-auto w-fit items-center">
            <p>TEL:</p>
            {getStructure().contacts.label}
          </div>
          <p style={genStyle(getStructure().email)}>
            {getStructure().email.label}
          </p>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* metadata */}
          <div className="table w-full">
            <div className="table-row">
              <div className="table-cell">Receipt of Purchase(Inc Tax)</div>
              <div className="table-cell">
                <div className="flex justify-end gap-1">
                  <div style={genStyle(getStructure().date)}>
                    {getStructure().date.label}
                  </div>
                  <div style={genStyle(getStructure().time_in)}>
                    {getStructure().time_in.label}
                  </div>
                </div>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">Staff</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().cashier_name)}
              >
                {getStructure().cashier_name.label}
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">Device</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().device)}
              >
                {getStructure().device.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* <div className="relative group"> */}

          {/* products */}
          <div className="relative group table table-fixed w-full">
            {getStructure().products.map(({ data: product }, index) => (
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

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* total */}
          <div className="table w-full">
            <div className="table-row">
              <div className="table-cell whitespace-nowrap pr-2">Sub Total</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().sub_total)}
              >
                {getStructure().sub_total.label}
              </div>
            </div>
            <div className="table-row w-full">
              <div className="table-cell">Total</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().total)}
              >
                {getStructure().total.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* payment method */}

          <div className="table w-full">
            <div className="table-row">
              <div className="table-cell uppercase">payment by tender</div>
              <div className="table-cell uppercase text-end">amount</div>
            </div>
            <div className="table-row w-full">
              <div
                className="table-cell"
                style={genStyle(getStructure().payment_type)}
              >
                {getStructure().payment_type.label}
              </div>
              <div
                className="table-cell"
                style={genStyle(getStructure().total)}
              >
                {getStructure().total.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* tax */}
          <div className="grid grid-cols-3 w-full">
            <div className="flex flex-col">
              <div className="table-cell uppercase">tax rate</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().tax_rate)}
              >
                {getStructure().tax_rate.label} vat
              </div>
            </div>
            <div className="flex flex-col">
              <div className="table-cell uppercase text-end">percentage</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().tax_percentage)}
              >
                {getStructure().tax_percentage.label}%
              </div>
            </div>
            <div className="flex flex-col">
              <div className="table-cell uppercase text-end">percentage</div>
              <div
                className="table-cell"
                style={genStyle(getStructure().tax_paid)}
              >
                {getStructure().tax_paid.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>
          <p style={genStyle(getStructure().footer_message_01)}>
            {getStructure().footer_message_01.label}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Image;

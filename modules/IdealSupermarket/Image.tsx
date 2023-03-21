import useEditor from "../../store/editor/useEditor";
import { Props } from "./types";
import { forwardRef } from "react";
import { genEditorStyle, genStyle } from "../../utils";

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
          <p style={genStyle(structure.name)}>{structure.name.label}</p>
          <p style={genStyle(structure.location)} className="w-3/4 mx-auto">
            {structure.location.label}
          </p>

          <p className="mx-auto w-fit">TEL: {structure.contacts.label}</p>

          <p style={genStyle(structure.email)}>{structure.email.label}</p>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* metadata */}
          <div className="flex flex-col w-full">
            <div className="flex items-start w-full justify-between flex-nowrap">
              <p>
                Receipt of Purchase{" "}
                <span className="break-keep inline-block">(Inc Tax)</span>
              </p>
              <div className="flex justify-end gap-1">
                <p style={genStyle(structure.date)}>{structure.date.label}</p>
                <p style={genStyle(structure.time_in)}>
                  {structure.time_in.label}
                </p>
              </div>
            </div>
            <div className="flex w-full justify-between flex-nowrap">
              <p>Staff</p>
              <p style={genStyle(structure.cashier_name)}>
                {structure.cashier_name.label}
              </p>
            </div>
            <div className="flex w-full justify-between flex-nowrap">
              <p className="table-cell">Device</p>
              <p className="table-cell" style={genStyle(structure.device)}>
                {structure.device.label}
              </p>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* <div className="relative group"> */}

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
          <div className="flex flex-col w-full">
            <div className="flex w-full justify-between flex-nowrap">
              <p className=" whitespace-nowrap pr-2">Sub Total</p>
              <p className="" style={genStyle(structure.sub_total)}>
                {structure.sub_total.label}
              </p>
            </div>
            <div className="flex w-full justify-between flex-nowrap">
              <p className="">Total</p>
              <p className="" style={genStyle(structure.total)}>
                {structure.total.label}
              </p>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* payment method */}

          <div className="grid grid-cols-2 w-full">
            <div className="flex flex-col items-start">
              <p className="uppercase">payment by tender</p>
              <p style={genStyle(structure.payment_type)}>
                {structure.payment_type.label}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="uppercase text-end">amount</p>
              <p style={genStyle(structure.total)}>{structure.total.label}</p>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* tax */}
          <div className="grid grid-cols-3 w-full">
            <div className="flex flex-col">
              <p className="uppercase text-left">tax rate</p>
              <p style={genStyle(structure.tax_rate)}>
                {structure.tax_rate.label}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="uppercase text-end">percentage</p>
              <p style={genStyle(structure.tax_percentage)}>
                {structure.tax_percentage.label}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="uppercase text-end">tax</p>
              <p style={genStyle(structure.tax_paid)}>
                {structure.tax_paid.label}
              </p>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>
          <p style={genStyle(structure.footer_message_01)}>
            {structure.footer_message_01.label}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Image;

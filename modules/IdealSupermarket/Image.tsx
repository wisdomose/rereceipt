import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { Props, Structure } from "./types";
import { forwardRef } from "react";
import { genEditorStyle, genStyle } from "../../utils";

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
          <p style={genStyle(structure.title)}>{structure.title.label}</p>
          <p style={genStyle(structure.location)} className="w-3/4 mx-auto">
            {structure.location.label}
          </p>
          <div className="flex flex-row gap-1 mx-auto w-fit items-center">
            <p>TEL:</p>
            {structure.contacts.map((contact) => (
              <p key={contact.label} style={genStyle(contact)}>
                {contact.label}
              </p>
            ))}
          </div>
          <p style={genStyle(structure.email)}>{structure.email.label}</p>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* metadata */}
          <div className="table w-full">
            <div className="table-row">
              <div className="table-cell">Receipt of Purchase(Inc Tax)</div>
              <div className="table-cell">
                <div className="flex justify-end gap-1">
                  <div style={genStyle(structure.date)}>
                    {structure.date.label}
                  </div>
                  <div style={genStyle(structure.time)}>
                    {structure.time.label}
                  </div>
                </div>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">Staff</div>
              <div className="table-cell" style={genStyle(structure.staff)}>
                {structure.staff.label}
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">Device</div>
              <div className="table-cell" style={genStyle(structure.device)}>
                {structure.device.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* <div className="relative group"> */}

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

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* total */}
          <div className="table w-full">
            <div className="table-row">
              <div className="table-cell whitespace-nowrap pr-2">Sub Total</div>
              <div className="table-cell" style={genStyle(structure.sub_total)}>
                {structure.sub_total.label}
              </div>
            </div>
            <div className="table-row w-full">
              <div className="table-cell">Total</div>
              <div className="table-cell" style={genStyle(structure.total)}>
                {structure.total.label}
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
                style={genStyle(structure.payment_type)}
              >
                {structure.payment_type.label}
              </div>
              <div className="table-cell" style={genStyle(structure.amount)}>
                {structure.amount.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>

          {/* tax */}
          <div className="grid grid-cols-3 w-full">
            <div className="flex flex-col">
              <div className="table-cell uppercase">tax rate</div>
              <div className="table-cell" style={genStyle(structure.tax_rate)}>
                {structure.tax_rate.label} vat
              </div>
            </div>
            <div className="flex flex-col">
              <div className="table-cell uppercase text-end">percentage</div>
              <div
                className="table-cell"
                style={genStyle(structure.tax_percentage)}
              >
                {structure.tax_percentage.label}%
              </div>
            </div>
            <div className="flex flex-col">
              <div className="table-cell uppercase text-end">percentage</div>
              <div className="table-cell" style={genStyle(structure.tax_paid)}>
                {structure.tax_paid.label}
              </div>
            </div>
          </div>

          <div className="my-2 h-[1px] rounded-full bg-gray-700"></div>
          <p style={genStyle(structure.footer_message)}>
            {structure.footer_message.label}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Image;

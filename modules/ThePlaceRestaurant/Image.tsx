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
          <>
            <p style={genStyle(structure.name)}>{structure.name.label}</p>
            <p style={genStyle(structure.location)}>
              {structure.location.label}
            </p>
            <p style={genStyle(structure.email)}>{structure.email.label}</p>
          </>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
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
                <div className="flex flex-row justify-end items-center">
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
                  <span style={genStyle(structure.time)}>
                    {structure.time.label}
                  </span>
                </div>
              </div>

              {/* cus no */}
              <div className="table-cell">
                <div className="flex flex-row justify-end items-center">
                  <p className="whitespace-nowrap mr-1">Cus No:</p>
                  <span style={genStyle(structure.customer_no)}>
                    {structure.customer_no.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="table-row">
              {/* cashier name */}
              <div className="table-cell">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1">Cashier Name:</p>
                  <span style={genStyle(structure.cashier_name)}>
                    {structure.cashier_name.label}
                  </span>
                </div>
              </div>
              <div className="table-cell"></div>
            </div>
          </div>
          {/* end */}

          <div className="mt-1">
            <p style={genStyle(structure.order_type)}>
              {structure.order_type.label}
            </p>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          {/* products */}
          <div className="relative group table table-fixed w-full">
            {structure.products.map((product, index) => (
              <div key={index} className="table-row">
                {product.map((col, position) => (
                  <p
                    className="table-cell"
                    key={col.label}
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

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Subtotal..........
            </p>
            <p style={genStyle(structure.subtotal)}>
              {structure.subtotal.label}
            </p>
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Received..........
            </p>
            <p style={genStyle(structure.total)}>{structure.total.label}</p>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          <p style={genStyle(structure.status)}>{structure.status.label}</p>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            --------------------------------------------
          </div>

          <div className="flex justify-between">
            <div>
              <p style={genStyle(structure.payment_type)}>
                {structure.payment_type.label}
              </p>
            </div>
            <div>
              <div className="flex flex-row mx-auto w-full items-center">
                <p className="whitespace-nowrap capitalize">#</p>
                <p style={genStyle(structure.receipt_no)}>
                  {structure.receipt_no.label}
                </p>
              </div>
            </div>
            <div>
              <p style={genStyle(structure.total)}>{structure.total.label}</p>
            </div>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            --------------------------------------------
          </div>

          {/* footer */}
          <div className="w-1/2 mx-auto">
            <p style={genStyle(structure.footer_message)}>
              {structure.footer_message.label}
            </p>
            <p style={genStyle(structure.contacts)}>
              {structure.contacts.label}
            </p>
            <div className="flex flex-row items-center">
              <p className="whitespace-nowrap mr-1">WhatsApp only:</p>
              <p style={genStyle(structure.whatsapp)}>
                {structure.whatsapp.label}
              </p>
            </div>
          </div>

          {/* billing */}
          <div className="mt-2">
            <p className="">Remark:</p>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill prepared by:
              </p>
              <p style={genStyle(structure.bill_prepared_by)}>
                {structure.bill_prepared_by.label}
              </p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill printed time:
              </p>
              <p style={genStyle(structure.time)}>{structure.time.label}</p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill settled by:
              </p>
              <p style={genStyle(structure.bill_prepared_by)}>
                {structure.bill_prepared_by.label}
              </p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">payment type:</p>
              <p style={genStyle(structure.payment_type)}>
                {structure.payment_type.label}
              </p>
            </div>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ---------------------------------------------------
          </div>
        </div>
      </div>
    </div>
  );
});

export default Image;

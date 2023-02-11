import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { ITEM, RECEIPT, RECEIPT_KEYS } from "../../types";
import { genEditorStyle, genStyle } from "../../utils";
import { Props } from "./types";
import { forwardRef } from "react";

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
          <>
            <p style={genStyle(getStructure().name)}>{getStructure().name.label}</p>
            <p style={genStyle(getStructure().location)}>
              {getStructure().location.label}
            </p>
            <p style={genStyle(getStructure().email)}>{getStructure().email.label}</p>
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
                  <span style={genStyle(getStructure().receipt_no)}>
                    {getStructure().receipt_no.label}
                  </span>
                </div>
              </div>

              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row justify-end items-center">
                  <p className="whitespace-nowrap mr-1">Date:</p>
                  <span style={genStyle(getStructure().date)}>
                    {getStructure().date.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="table-row">
              {/* time */}
              <div className="table-cell ">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1">Time:</p>
                  <span style={genStyle(getStructure().time_in)}>
                    {getStructure().time_in.label}
                  </span>
                </div>
              </div>

              {/* cus no */}
              <div className="table-cell">
                <div className="flex flex-row justify-end items-center">
                  <p className="whitespace-nowrap mr-1">Cus No:</p>
                  <span style={genStyle(getStructure().customer_no)}>
                    {getStructure().customer_no.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="table-row">
              {/* cashier name */}
              <div className="table-cell">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1">Cashier Name:</p>
                  <span style={genStyle(getStructure().cashier_name)}>
                    {getStructure().cashier_name.label}
                  </span>
                </div>
              </div>
              <div className="table-cell"></div>
            </div>
          </div>
          {/* end */}

          <div className="mt-1">
            <p style={genStyle(getStructure().order_type)}>
              {getStructure().order_type.label}
            </p>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          {/* products */}
          <div className="relative group table table-fixed w-full">
            {getStructure().products.map((product, index) => (
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

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Subtotal..........
            </p>
            <p style={genStyle(getStructure().sub_total)}>
              {getStructure().sub_total.label}
            </p>
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize mr-1">
              Received..........
            </p>
            <p style={genStyle(getStructure().total)}>{getStructure().total.label}</p>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>

          <p style={genStyle(getStructure().status)}>{getStructure().status.label}</p>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            --------------------------------------------
          </div>

          <div className="flex justify-between">
            <div>
              <p style={genStyle(getStructure().payment_type)}>
                {getStructure().payment_type.label}
              </p>
            </div>
            <div>
              <div className="flex flex-row mx-auto w-full items-center">
                <p className="whitespace-nowrap capitalize">#</p>
                <p style={genStyle(getStructure().receipt_no)}>
                  {getStructure().receipt_no.label}
                </p>
              </div>
            </div>
            <div>
              <p style={genStyle(getStructure().total)}>{getStructure().total.label}</p>
            </div>
          </div>

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            --------------------------------------------
          </div>

          {/* footer */}
          <div className="w-1/2 mx-auto">
            <p style={genStyle(getStructure().footer_message_01)}>
              {getStructure().footer_message_01.label}
            </p>
            <p style={genStyle(getStructure().contacts)}>
              {getStructure().contacts.label}
            </p>
            <div className="flex flex-row items-center">
              <p className="whitespace-nowrap mr-1">WhatsApp only:</p>
              <p style={genStyle(getStructure().whatsapp)}>
                {getStructure().whatsapp.label}
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
              <p style={genStyle(getStructure().cashier_name)}>
                {getStructure().cashier_name.label}
              </p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill printed time:
              </p>
              <p style={genStyle(getStructure().time_in)}>{getStructure().time_in.label}</p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill settled by:
              </p>
              <p style={genStyle(getStructure().cashier_name)}>
                {getStructure().cashier_name.label}
              </p>
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">payment type:</p>
              <p style={genStyle(getStructure().payment_type)}>
                {getStructure().payment_type.label}
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

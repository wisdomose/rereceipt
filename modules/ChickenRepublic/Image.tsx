import ImageTable from "../../components/editor/ImageTable";
import { DIVIDER } from "../../components/editor/table";
import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { RECEIPT } from "../../types";
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
          {/* heading */}
          <>
            {/* name */}
            <p style={genStyle(structure.name)}>{structure.name.label}</p>
            {/* location */}
            <p style={genStyle(structure.location)}>
              {structure.location.label}
            </p>
            {/* contacts */}
            {/* <p style={genStyle(structure.contacts)}>
              {structure.contacts.label}
            </p> */}
          </>

          {/* start */}
          <div className="table w-full my-2">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell ">
                <div className="flex flex-row items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">ticket:</p>
                  <span style={genStyle(structure.receipt_no)}>
                    {structure.receipt_no.label}
                  </span>
                </div>
              </div>

              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row justify-end items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">Date:</p>
                  <span style={genStyle(structure.date)}>
                    {structure.date.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* end */}

          {/* products */}
          <ImageTable
            largeCol={1}
            hasHeader
            divider={DIVIDER.DASH}
            structure={structure}
          />

          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {"_".padStart(100, "_")}
          </div>

          {/* total */}
          <div className="flex flex-row">
            <p
              style={genStyle(structure.order_type)}
              className="w-full grid place-items-center"
            >
              {structure.order_type.label}
            </p>

            <div className="ml-auto max-w-[50%] flex flex-col justify-end items-end overflow-hidden">
              <div className="flex justify-between w-full">
                <p className="table-cell text-end uppercase">sub total</p>
                <p style={genStyle(structure.total)}>{structure.total.label}</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="table-cell text-end uppercase">vat 5%</p>
                <p style={genStyle(structure.tax_paid)}>
                  {structure.tax_paid.label}
                </p>
              </div>
              <div className="w-[50%] tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
                {"=".padStart(100, "=")}
              </div>
              <div className="flex justify-between w-full">
                <p className="table-cell text-end uppercase">total tax</p>
                <p style={genStyle(structure.total)}>{structure.total.label}</p>
              </div>
              <div className="w-[50%] tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
                {"=".padStart(100, "=")}
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-end uppercase text-xl">total</p>
                <p style={genStyle(structure.total)}>{structure.total.label}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex justify-between w-[40%]">
              <p className="uppercase">received</p>
              <p style={genStyle(structure.total)}>{structure.total.label}</p>
            </div>
            <div className="flex justify-between w-[40%]">
              <p className="uppercase">change</p>
              <p style={genStyle(structure.change)}>{structure.change.label}</p>
            </div>
          </div>
          <div className="flex justify-between w-[70%] mt-2">
            <p style={genStyle(structure.payment_type)}>
              {structure.payment_type.label}
            </p>
            <p style={genStyle(structure.total)}>{structure.total.label}</p>
          </div>

          {/* footer message */}
          <div className="mt-4">
            <p style={genStyle(structure.footer_message_01)}>
              {structure.footer_message_01.label}
            </p>
            <p style={genStyle(structure.footer_message_02)}>
              {structure.footer_message_02.label}
            </p>
            <p style={genStyle(structure.footer_message_03)}>
              {structure.footer_message_03.label}
            </p>

            <div className="flex justify-between items-center">
              <p style={genStyle(structure.time_in)}>
                <span className="inline-block pr-2 uppercase">it</span>
                {structure.time_in.label}
              </p>
              <p style={genStyle(structure.time_out)}>
                <span className="inline-block pr-2 uppercase">ft</span>
                {structure.time_out.label}
              </p>
            </div>

            <div className="flex items-center justify-center mt-4">
              <p style={genStyle(structure.footer_message_04)}>
                {structure.footer_message_04.label}
              </p>
              <p style={genStyle(structure.cashier_name)}>
                {structure.cashier_name.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Image;

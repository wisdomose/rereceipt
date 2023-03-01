import { Dialog, Popover } from "@headlessui/react";
import { useState } from "react";
import useTable from "../../hooks/useTable";
import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import {
  FONT_WEIGHT,
  POS_KEY,
  RECEIPT,
  RECEIPT_KEY,
  TEXT_ALIGN,
  TEXT_TRANSFORM,
} from "../../types";
import Input from "./input";
import BaseInput from "../input";
import {
  RiInsertColumnRight,
  RiInsertRowBottom,
  RiDeleteColumn,
  RiDeleteRow,
} from "react-icons/ri";
import {
  FiDelete,
  FiEdit,
  FiEdit2,
  FiPlayCircle,
  FiPlusCircle,
  FiTrash,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Button from "../button";
import useInput from "../../hooks/useInput";

export enum DIVIDER {
  DASH = "-",
  EQUAL_TO = "=",
}

export type TableProps = {
  label?: RECEIPT_KEY | POS_KEY;
  headerDivider?: DIVIDER;
  subDetails?: boolean;
  subLabels?: string[];
  largeCol?: number;
  basic?: boolean;
};

// TODO: IF A TABLE HAS ONLY ONE ROW, IT CANNOT BE DELETED.
// TODO: TO DELETE THE ROW, YOU HAVE TO DELETE THE WHOLE TABLE (add a delete btn)

export default function Table<T extends Record<string, any>>({
  headerDivider,
  subDetails = false,
  subLabels,
  largeCol = 0,
  basic = false,
}: TableProps) {
  const label = "products";
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  const { structure, setStructure } = useEditor();
  const [name, nameOptions, updateName] = useInput("");
  const [amount, amountOptions, updateAmount] = useInput("");
  const [qty, qtyOptions, updateQty] = useInput("");
  const [unit, unitOptions, updateUnit] = useInput("");

  const { addColumn, addRow, deleteColumn, deleteRow } = useTable();

  const btnStyle =
    "p-2 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const svgStyle = "w-4 h-auto";

  if (!structure) return null;

  if (basic) {
    return (
      <div className="md:col-span-2 overflow-hidden">
        <p className={`block capitalize mb-2 text-[#4F4F4F] text-base`}>
          {label.replaceAll("_", " ")}
        </p>
        {structure.products.length === 1 ? (
          <p className="mb-5 mt-3 text-center text-[#BDBDBD]">no products</p>
        ) : (
          <div className="w-full overflow-auto">
            <table className="mb-5 mt-3 w-full min-w-[500px] text-[#4F4F4F]">
              <thead>
                <tr className="">
                  {structure[label][0].data.map((cell) => (
                    <th
                      key={cell.label}
                      className="text-start py-6 font-medium"
                    >
                      {cell.label}
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {structure[label].slice(1).map((row, id) => (
                  <tr key={"row" + id} className="border-t">
                    {row.data.map((cell, cellId) => (
                      <td key={`${id}${cellId}`} className="py-6">
                        {/* {cell.label} */}
                        <Input
                          label="products"
                          // +1 because i am slicing the heading from the table
                          index={[id + 1, cellId]}
                          basic
                        />
                      </td>
                    ))}
                    <td className="flex items-center gap-4 py-6 h-full">
                      {/* delete product */}
                      <button
                        className="group border rounded-lg py-[10px] px-3"
                        onClick={() => {
                          console.log("deleted");
                          deleteRow(id);
                        }}
                      >
                        <FiTrash2 className="group-hover:text-[#EF5DA8] focus:text-[#EF5DA8]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={addRow}
          // onClick={onOpen}
          className="flex items-center justify-center gap-4 text-[#EF5DA8]"
        >
          <FiPlusCircle />
          <span>add product</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative group/table">
      {/* menu bar */}
      <div className="absolute hidden group-focus-within/table:flex flex-col left-0 -top-0 -translate-x-[150%] w-fit bg-white shadow-md rounded-sm overflow-hidden">
        <button className={btnStyle} onClick={addColumn}>
          <RiInsertColumnRight className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={() => addRow()}>
          <RiInsertRowBottom className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={deleteColumn}>
          <RiDeleteColumn className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={() => deleteRow()}>
          <RiDeleteRow className={svgStyle} />
        </button>
      </div>

      <div className="w-full">
        <div className="table" tabIndex={-1}>
          {structure[label].map(({ data: row }, index, elems) => (
            <>
              <div
                key={index}
                className={`table-row w-full ${
                  headerDivider && index == 0 ? "table-equal" : ""
                }`}
              >
                {row.map((cell, position) => (
                  <div
                    className="table-cell"
                    style={{
                      width:
                        row.length <= 4
                          ? position === largeCol
                            ? "50%"
                            : 50 / (row.length - 1) + "%"
                          : 100 / row.length + "%",
                    }}
                    key={cell.label + position}
                  >
                    <Input label={label} index={[index, position]} />
                    {cell?.items && (
                      <>
                        {(cell.items as Record<string, any>[]).map(
                          (item, innerIndex) => (
                            <>
                              <Input
                                label={label}
                                subLabel="items"
                                index={[index, position, innerIndex]}
                              />
                              {/* <br /> */}
                            </>
                          )
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* divider */}
              {/* {headerDivider && index == 0 && (
                  <div className="table-row w-full mb-2">
                    <p className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap bg-green-200">
                      ============================================================
                    </p>
                  </div>
                )} */}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

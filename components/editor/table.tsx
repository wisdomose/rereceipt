import useTable from "../../hooks/useTable";
import useEditor from "../../store/editor/useEditor";
import { POS_KEY, RECEIPT_KEY } from "../../types";
import Input from "./input";
import {
  RiInsertColumnRight,
  RiInsertRowBottom,
  RiDeleteColumn,
  RiDeleteRow,
} from "react-icons/ri";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";

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
  const { structure, setStructure } = useEditor();

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
                          deleteRow(id + 1);
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
            // <>
            <div
              key={"row" + index}
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
                  key={`${index}${position}`}
                >
                  <Input label={label} index={[index, position]} />
                  {cell?.items && (
                    <>
                      {(cell.items as Record<string, any>[]).map(
                        (item, innerIndex) => (
                          <>
                            <Input
                              key={`${index}${position}${innerIndex}`}
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
              {/* divider */}
              {/* {headerDivider && index == 0 && (
                  <div className="table-row w-full mb-2">
                    <p className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap bg-green-200">
                      ============================================================
                    </p>
                  </div>
                )} */}
              {/* </> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

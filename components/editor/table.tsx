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
import { BiLayerPlus, BiLayerMinus } from "react-icons/bi";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";

export enum DIVIDER {
  DASH = "_",
  EQUAL_TO = "=",
}

export type TableProps = {
  label?: RECEIPT_KEY | POS_KEY;
  headerDivider?: DIVIDER;
  divider?: DIVIDER;
  subDetails?: boolean;
  subLabels?: string[];
  largeCol?: number;
  basic?: boolean;
  hasHeader?: boolean;
};

// TODO: IF A TABLE HAS ONLY ONE ROW, IT CANNOT BE DELETED.
// TODO: TO DELETE THE ROW, YOU HAVE TO DELETE THE WHOLE TABLE (add a delete btn)

export default function Table<T extends Record<string, any>>({
  headerDivider,
  subDetails = false,
  subLabels,
  divider,
  largeCol = 0,
  basic = false,
  hasHeader = true,
}: TableProps) {
  const label = "products";
  const { structure, setStructure } = useEditor();

  const {
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    deleteSubColumn,
    addSubColumn,
  } = useTable();

  const btnStyle =
    "p-2 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const svgStyle = "w-4 h-auto";

  if (!structure) return null;

  if (basic) {
    return (
      <div className="md:col-span-2 overflow-hidden">
        <p className={`block capitalize mb-2 font-semibold text-[#4F4F4F] text-base`}>
          {label.replaceAll("_", " ")}
        </p>
        {structure.products.length === (hasHeader ? 1 : 0) ? (
          <p className="mb-5 mt-3 text-center text-[#BDBDBD]">no products</p>
        ) : (
          <div className="w-full overflow-auto">
            <table className="mb-5 mt-3 w-full min-w-[500px] text-[#4F4F4F]">
              {hasHeader && (
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
              )}
              <tbody>
                {structure[label].slice(hasHeader ? 1 : 0).map((row, id) => (
                  <tr key={"row" + id} className="border-t">
                    {row.data.map((cell, cellId) => (
                      <td key={`${id}${cellId}`} className="py-6">
                        <Input
                          label="products"
                          // +1 because i am slicing the heading from the table
                          index={[id + (hasHeader ? 1 : 0), cellId]}
                          basic
                        />
                      </td>
                    ))}
                    <td className="flex items-center gap-4 py-6 h-full">
                      {/* delete product */}
                      <button
                        className="group border rounded-lg py-[10px] px-3"
                        onClick={() => {
                          deleteRow(id + (hasHeader ? 1 : 0));
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
      <div className="absolute hidden group-focus-within/table:flex flex-col left-0 -top-0 -translate-x-[150%] w-fit bg-white shadow-md rounded-sm overflow-hidden z-10">
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
        <button className={btnStyle} onClick={() => addSubColumn()}>
          <BiLayerPlus className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={() => deleteSubColumn()}>
          <BiLayerMinus className={svgStyle} />
        </button>
      </div>

      <div style={{ maxWidth: structure.settings.width }}>
        <div className="table" tabIndex={-1}>
          {hasHeader && (
            <>
              <div className={`table-row w-full`}>
                {structure[label][0].data.map((header, index) => (
                  <div
                    className="table-cell"
                    style={{
                      width:
                        structure[label][0].data.length <= 4
                          ? index === largeCol
                            ? "50%"
                            : 50 / (structure[label][0].data.length - 1) + "%"
                          : 100 / structure[label][0].data.length + "%",
                    }}
                    key={`${header.label}${index}`}
                  >
                    <Input label={label} index={[0, index]} />
                  </div>
                ))}
              </div>
            </>
          )}
          {hasHeader && divider && (
            <div className="table-row overflow-hidden">
              <td
                className="table-cell overflow-hidden w-full"
                colSpan={structure[label][0].data.length}
              >
                <div
                  className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap"
                  style={{
                    maxWidth:
                      Number(structure.settings.width.slice(0, -2)) - 12 + "px",
                  }}
                >
                  {divider.padStart(100, divider)}
                </div>
              </td>
            </div>
          )}
          {structure[label]
            .slice(hasHeader ? 1 : 0)
            .map(({ data: row }, index) => (
              <div key={"row" + index} className={`table-row w-full`}>
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
                    <Input
                      label={label}
                      index={[index + (hasHeader ? 1 : 0), position]}
                    />
                    {cell?.items && (
                      <>
                        {cell.items.map((item, innerIndex) => (
                          <Input
                            key={`${index}${position}${innerIndex}`}
                            label={label}
                            subLabel="items"
                            index={[
                              index + (hasHeader ? 1 : 0),
                              position,
                              innerIndex,
                            ]}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

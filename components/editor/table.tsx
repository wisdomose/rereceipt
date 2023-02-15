import useTable from "../../hooks/useTable";
import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { POS_KEY, RECEIPT, RECEIPT_KEY } from "../../types";
import Input from "./input";
import {
  RiInsertColumnRight,
  RiInsertRowBottom,
  RiDeleteColumn,
  RiDeleteRow,
} from "react-icons/ri";

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
};

// TODO: IF A TABLE HAS ONLY ONE ROW, IT CANNOT BE DELETED.
// TODO: TO DELETE THE ROW, YOU HAVE TO DELETE THE WHOLE TABLE (add a delete btn)

export default function Table<T extends Record<string, any>>({
  headerDivider,
  subDetails = false,
  subLabels,
  largeCol = 0,
}: TableProps) {
  const label = "products";
  const { structure } = useEditor();

  const { addColumn, addRow, deleteColumn, deleteRow } = useTable();

  const btnStyle =
    "p-2 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const svgStyle = "w-4 h-auto";

  if (!structure) return null;

  return (
    <div className="relative group/table">
      {/* menu bar */}
      <div className="absolute hidden group-focus-within/table:flex flex-col left-0 -top-0 -translate-x-[150%] w-fit bg-white shadow-md rounded-sm overflow-hidden">
        <button className={btnStyle} onClick={addColumn}>
          <RiInsertColumnRight className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={addRow}>
          <RiInsertRowBottom className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={deleteColumn}>
          <RiDeleteColumn className={svgStyle} />
        </button>
        <button className={btnStyle} onClick={deleteRow}>
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

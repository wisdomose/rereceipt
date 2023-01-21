import useTable from "../../hooks/useTable";
import useEditor from "../../store/editor/useEditor";
import Input from "./input";
import {
  RiInsertColumnRight,
  RiInsertRowBottom,
  RiDeleteColumn,
  RiDeleteRow,
} from "react-icons/ri";

export type TableProps = {
  label: string;
};

// TODO: IF A TABLE HAS ONLY ONE ROW, IT CANNOT BE DELETED.
// TODO: TO DELETE THE ROW, YOU HAVE TO DELETE THE WHOLE TABLE (add a delete btn)

export default function Table<T extends Record<string, any>>({
  label,
}: TableProps) {
  const { structure } = useEditor();

  const { addColumn, addRow, deleteColumn, deleteRow } = useTable<T>({
    label: "products",
  });

  const btnStyle =
    "p-2 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const svgStyle = "w-4 h-auto";

  if (Object.keys(structure).length === 0) return null;

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
      <div className="table w-full" tabIndex={-1}>
        {(structure[label] as Record<string, any>[]).map((row, index) => (
          <div key={index} className="table-row w-full">
            {(row as Record<string, any>[]).map((cell, position) => (
              <div
                className="table-cell"
                style={{
                  width:
                    row.length <= 4
                      ? position === 0
                        ? "50%"
                        : 50 / (row.length - 1) + "%"
                      : 100 / row.length + "%",
                }}
                key={cell.label + position}
              >
                <Input label="products" index={[index, position]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

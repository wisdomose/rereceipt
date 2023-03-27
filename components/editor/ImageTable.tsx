import useEditor from "../../store/editor/useEditor";
import { POS, RECEIPT } from "../../types";
import { genStyle } from "../../utils";
import { TableProps } from "./table";

export default function ImageTable({
  divider,
  largeCol,
  hasHeader,
  structure,
}: Pick<TableProps, "divider" | "hasHeader" | "largeCol"> & {
  structure: RECEIPT;
}) {
  const label = "products";

  if (!structure) return null;

  return (
    <div style={{ maxWidth: structure.settings.width, overflow: "hidden" }} className="w-full">
      <div
        className="table w-full"
        tabIndex={-1}
      >
        {hasHeader && (
          <>
            <div className={`table-row w-full`}>
              {structure[label][0].data.map((header, index) => (
                <div
                  className="table-cell"
                  style={{
                    width:
                      structure[label][0].data.length <= 4 || largeCol
                        ? index === largeCol
                          ? "50%"
                          : 50 / (structure[label][0].data.length - 1) + "%"
                        : 100 / structure[label][0].data.length + "%",
                    ...genStyle(header),
                  }}
                  key={`${header.label}`}
                >
                  {header.label}
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
                    Number(structure.settings.width.slice(0, -2)) + "px",
                }}
              >
                {divider.padStart(100, divider)}
              </div>
            </td>
          </div>
        )}
        {structure[label]
          .slice(hasHeader ? 1 : 0)
          .map(({ data: row }, index, elems) => (
            // <>
            <div key={"row" + index} className={`table-row w-full`}>
              {row.map((cell, position) => (
                <div
                  className="table-cell"
                  style={{
                    width:
                      row.length <= 4 && largeCol
                        ? position === largeCol
                          ? "50%"
                          : 50 / (row.length - 1) + "%"
                        : 100 / row.length + "%",
                    ...genStyle(cell),
                  }}
                  key={`cell${index}${position}`}
                >
                  {cell.label}
                  {cell?.items && (
                    <>
                      {cell.items.map((item, innerIndex) => (
                        <p
                          key={`item${index}${position}${innerIndex}`}
                          style={genStyle(item)}
                        >
                          {item.label}
                        </p>
                      ))}
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
  );
}

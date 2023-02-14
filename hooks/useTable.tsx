import { TableProps } from "../components/editor/table";
import useEditor from "../store/editor/useEditor";
import { FONT_WEIGHT, RECEIPT, TEXT_ALIGN, TEXT_TRANSFORM } from "../types";

export default function useTable<T extends RECEIPT>() {
  const { setStructure } = useEditor();
  const label = "products";

  const addRow = () => {
    setStructure((s: T) => {
      let table = s[label];
      let length = table[0].data.length;

      let row = [];
      for (let i = 0; i < length; i++) {
        row.push({
          label: "",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.NORMAL,
          font_weight: FONT_WEIGHT.NORMAL,
        });
      }

      table.push({ data: row });

      return { ...s, [label]: table };
    });
  };

  const addColumn = () => {
    setStructure((s: T) => {
      const headerFontSize = s[label][0].data[0].font_size;
      (s[label] as Record<string, any>[]).map((col, index) => {
        return col.push({
          label: "",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.NORMAL,
          font_weight: FONT_WEIGHT.NORMAL,
          font_size: index === 0 ? headerFontSize : "",
        });
      });

      return { ...s };
    });
  };

  const deleteColumn = () => {
    setStructure((s: T) => {
      s[label].map(({ data: col }) => {
        return col.splice(col.length - 1, 1);
      });
 
      return { ...s };
    });
  };

  const deleteRow = () => {
    setStructure((s: T) => {
      s[label].splice(s[label].length - 1, 1);
      return { ...s };
    });
  };

  return { addColumn, addRow, deleteColumn, deleteRow };
}

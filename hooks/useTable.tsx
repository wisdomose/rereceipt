import { TableProps } from "../components/editor/table";
import useEditor from "../store/editor/useEditor";
import { FONT_WEIGHT, RECEIPT, TEXT_ALIGN, TEXT_TRANSFORM } from "../types";

export default function useTable() {
  const { setStructure } = useEditor();
  const label = "products";

  const addRow = () => {
    setStructure((s) => {
      if (s === undefined) return;
      const newState = { ...s };
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

      table = [...table, { data: row }];
      newState[label] = table;

      return newState;
    });
  };

  const addColumn = () => {
    setStructure((s) => {
      if (s === undefined) return s;
      const headerFontSize = s[label][0].data[0].font_size;
      s[label].map(({ data: row }, index) => {
        row.push({
          label: "",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.NORMAL,
          font_weight: FONT_WEIGHT.NORMAL,
          font_size: index === 0 ? headerFontSize : undefined,
        });
      });

      return { ...s };
    });
  };

  const deleteColumn = () => {
    setStructure((s) => {
      if (s === undefined) return s;
      s[label].map(({ data: col }) => {
        return col.length === 1 ? col : col.splice(col.length - 1, 1);
      });

      return { ...s };
    });
  };

  const deleteRow = (row?: number) => {
    setStructure((s) => {
      if (s === undefined) return s;
      let table = [...s[label]];
      if (table.length === 1) return { ...s };
      const delIndex = row ? row : table.length - 1;
      table.splice(delIndex, 1);
      return { ...s, [label]: [...table] };
    });
  };

  return { addColumn, addRow, deleteColumn, deleteRow };
}

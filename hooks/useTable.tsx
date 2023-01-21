import { TableProps } from "../components/editor/table";
import useEditor from "../store/editor/useEditor";

export default function useTable<T extends Record<string, any>>({ label }: Pick<TableProps, "label">) {
  const { setStructure } = useEditor();

  const addRow = () => {
    setStructure((s: T) => {
      let table = s[label];
      let length = table[0].length;

      let row = [];
      for (let i = 0; i < length; i++) {
        row.push({
          label: "",
          text_align: "left",
          transform: "lowercase",
          font_weight: "normal",
        });
      }

      table.push(row);

      return { ...s, [label]: table };
    });
  };

  const addColumn = () => {
    setStructure((s: T) => {
      const headerFontSize = s[label][0].font_size;
      (s[label] as Record<string, any>[]).map((col, index) => {
        return col.push({
          label: "",
          text_align: "left",
          transform: "lowercase",
          font_weight: "normal",
          font_size: index === 0 ? headerFontSize : "",
        });
      });

      return { ...s };
    });
  };

  const deleteColumn = () => {
    setStructure((s: T) => {
      (s[label] as Record<string, any>[]).map((col) => {
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

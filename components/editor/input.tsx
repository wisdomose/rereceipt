import { useState, useEffect, useCallback } from "react";
import {
  FiAlignRight,
  FiAlignLeft,
  FiAlignCenter,
  FiBold,
} from "react-icons/fi";
import {
  RxLetterCaseCapitalize,
  RxLetterCaseUppercase,
  RxLetterCaseLowercase,
} from "react-icons/rx";
import useEditor from "../../store/editor/useEditor";
import {
  FONT_WEIGHT,
  ITEM,
  POS_KEY,
  RECEIPT_KEY,
  TEXT_ALIGN,
  TEXT_TRANSFORM,
} from "../../types";

type Props = {
  label: RECEIPT_KEY | POS_KEY;
  subLabel?: string;
  index?: number | number[];
};

export default function Input(props: Props) {
  const { structure, setStructure } = useEditor();
  const defaultValue = {
    label: "",
    font_weight: FONT_WEIGHT.NORMAL,
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.NORMAL,
  };

  const [value, setValue] = useState<ITEM>(defaultValue);

  // get the cell to be edited
  const getElem = useCallback(() => {
    if (props.index != undefined && Array.isArray(props.index)) {
      return !props.subLabel
        ? structure[props.label][props.index[0]][props.index[1]]
        : structure[props.label][props.index[0]][props.index[1]][
            props.subLabel
          ][props.index[2]];
    } else if (typeof props.index === "number") {
      return structure[props.label][props.index];
    } else {
      return structure[props.label];
    }
  }, [structure]);

  useEffect(() => {
    if (Object.keys(structure).length > 0) setValue(getElem());
  }, [structure]);

  if (Object.keys(structure).length === 0) return null;

  const btnStyle =
    "p-2 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const svgStyle = "w-4 h-auto";

  // move the changes in the local component to global state
  function propagateChange() {
    if (props.index != undefined && Array.isArray(props.index)) {
      if (props.subLabel) {
        setStructure((s: Record<string, any>) => {
          const index = props.index;
          if (!Array.isArray(index)) return;

          let newState = { ...s };
          let table: Record<string, any>[][] = newState[props.label];
          let row = table[index[0]];
          let field = row[index[1]];
          field[props.subLabel as string][index[2]] = value;
          row[index[1]] = field;
          table[index[0]] = row;
          newState[props.label] = table;
          return newState;
        });
      } else {
        setStructure((s: Record<string, any>) => {
          const index = props.index;
          if (!Array.isArray(index)) return;

          let newState = { ...s };
          let table: Record<string, any>[][] = newState[props.label];
          let row = table[index[0]];
          row[index[1]] = value;
          table[index[0]] = row;
          newState[props.label] = table;
          return newState;
        });
      }
    } else if (typeof props.index === "number") {
      setStructure((s: Record<string, any>) => {
        const index = props.index;
        if (typeof index != "number") return;

        let row = s[props.label]; // get the row
        let cell = row[index]; // get the cell
        cell = { ...cell, ...value }; // edit the cell
        row[index] = cell;

        return { ...s, [props.label]: row }; // append row to state
      });
    } else {
      setStructure((s) => ({
        ...s,
        // @ts-ignore
        [props.label]: { ...s[props.label], ...value },
      }));
    }
  }

  // edit the local state
  function actionHandler(update: Partial<ITEM>) {
    setValue((v) => ({ ...value, ...update }));
  }

  // get the different properties of the cell
  function getProp(key: keyof ITEM) {
    !value && console.log(props.label, value);
    return value[key] || "inherit";
  }

  return (
    <div className="relative group/input">
      {/* settings tray */}
      <div className="absolute hidden group-focus-within/input:flex -top-0 -translate-y-[150%] w-fit bg-white shadow-md rounded-sm overflow-hidden z-50">
        <button
          className={btnStyle}
          onClick={() => {
            actionHandler({ ...value, text_align: TEXT_ALIGN.LEFT });
          }}
        >
          <FiAlignLeft className={svgStyle} />
        </button>
        <button
          className={btnStyle}
          onClick={() => {
            actionHandler({ text_align: TEXT_ALIGN.CENTER });
          }}
        >
          <FiAlignCenter className={svgStyle} />
        </button>
        <button
          className={btnStyle}
          onClick={() => {
            actionHandler({ text_align: TEXT_ALIGN.END });
          }}
        >
          <FiAlignRight className={svgStyle} />
        </button>
        <button
          className={
            btnStyle +
            " " +
            `${
              getProp("font_weight") === FONT_WEIGHT.BOLD
                ? "bg-gray-100"
                : "bg-transparent"
            }`
          }
          onClick={() => {
            actionHandler({
              font_weight:
                getProp("font_weight") === FONT_WEIGHT.BOLD
                  ? FONT_WEIGHT.NORMAL
                  : FONT_WEIGHT.BOLD,
            });
          }}
        >
          <FiBold className={svgStyle} />
        </button>
        <button
          className={btnStyle}
          onClick={() => {
            actionHandler({
              transform:
                getProp("transform") === TEXT_TRANSFORM.CAPITALIZE
                  ? TEXT_TRANSFORM.UPPERCASE
                  : getProp("transform") === TEXT_TRANSFORM.UPPERCASE
                  ? TEXT_TRANSFORM.LOWERCASE
                  : TEXT_TRANSFORM.CAPITALIZE,
            });
          }}
        >
          {getProp("transform") === TEXT_TRANSFORM.CAPITALIZE ? (
            <RxLetterCaseUppercase className={svgStyle} />
          ) : getProp("transform") === TEXT_TRANSFORM.UPPERCASE ? (
            <RxLetterCaseLowercase className={svgStyle} />
          ) : (
            <RxLetterCaseCapitalize className={svgStyle} />
          )}
        </button>
      </div>

      {/* input */}
      <div>
        <input
          type="text"
          className={`bg-gray-100 border-white border w-full focus:outline-none focus:shadow-inner ${getProp(
            "transform"
          )}`}
          value={value.label.toLowerCase()}
          onTouchStart={(e) => e.stopPropagation()}
          onChange={(e) => {
            actionHandler({ label: e.target.value });
          }}
          onBlur={() => {
            propagateChange();
          }}
          style={{
            fontSize: getProp("font_size") ?? "",
            fontWeight: getProp("font_weight"),
            textAlign: getProp("text_align") as any,
          }}
        />
      </div>
    </div>
  );
}

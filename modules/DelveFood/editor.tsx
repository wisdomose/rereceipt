import Input from "../../components/editor/input";
import { genEditorStyle, omit } from "../../utils";
import Table, { DIVIDER } from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { EDITING_MODE } from "../../types";
import Basic from "../editors/Basic";

export default function Editor() {
  const { structure, editingMode } = useEditor();

  if (structure === undefined) return <p>no structure</p>;

  if (editingMode === EDITING_MODE.BASIC) {
    return (
      <Basic structure={structure}>
        <Input label="name" id="name" basic />
        <Input label="location" id="location" basic />
        <Input label="contacts" id="contacts" basic />
        <Input label="customer_name" basic />
        <Input label="date" id="date" basic />
        <Input label="time_in" id="time_in" basic />
        <Input label="total" id="total" basic />
        <Table basic hasHeader={true} />
      </Basic>
    );
  }

  return (
    <>
      <section style={{ width: structure.settings.width }}>
        <div
          style={genEditorStyle(structure.settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          <div className="text-center">
            <Input label="name" />
          </div>
          <div className="text-center">
            <Input label="location" />
          </div>
          <Input label="contacts" />

          <div className="flex items-center flex-nowrap">
            <p className="uppercase mr-1">name</p>
            <Input label="customer_name" />
          </div>

          {/* start */}
          <div className="flex justify-between flex-nowrap items-center w-full mb-2">
            {/* time */}
            <div className="flex flex-row items-center">
              <p>Time: </p>
              <Input label="time_in" />
            </div>

            {/* date */}
            <div className="flex flex-row items-center">
              <p>Date: </p>
              <Input label="date" />
            </div>
          </div>
          {/* end */}

          <Table label="products" />

          <div className="mt-2 mb-1 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          <div className="flex items-center flex-nowrap mt-1">
            <p className="text-[16px] font-bold">TOTAL</p>
            <Input label="total" />
          </div>
        </div>
      </section>
    </>
  );
}

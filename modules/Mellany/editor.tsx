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
        <Input label="contacts" id="contacts" labelName="front desk" basic />
        <Input label="receipt_no" id="receipt_no" basic />
        <Input label="date" id="date" basic />
        <Input label="customer_name" labelName="guest" basic />
        <Input label="time_in" id="time_in" basic labelName="filled" />
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

          <div className="flex items-center flex-nowrap">
            <p className="capitalize mr-1">front desk</p>
            <Input label="contacts" />
          </div>

          <div className="flex justify-end flex-nowrap items-center w-full">
            <div className="flex flex-row items-center uppercase">
              <p>receipt no: </p>
              <Input label="receipt_no" />
            </div>
          </div>
          <div className="flex justify-end flex-nowrap items-center w-full">
            <div className="flex flex-row items-center uppercase">
              <p className="uppercase">date: </p>
              <Input label="date" />
            </div>
          </div>

          <Table label="products" />

          <div className="flex items-center flex-nowrap mt-1">
            <p className="font-bold">TOTAL</p>
            <Input label="total" />
          </div>

          <div className="flex items-center flex-nowrap">
            <p className="uppercase mr-1">guest</p>
            <Input label="customer_name" />
          </div>
          <div className="flex items-center flex-nowrap">
            <p className="uppercase mr-1">filled</p>
            <Input label="time_in" />
          </div>
        </div>
      </section>
    </>
  );
}

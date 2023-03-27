import Input from "../../components/editor/input";
import { capsFirst, genEditorStyle, omit } from "../../utils";
import Table, { DIVIDER } from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { useCallback } from "react";
import { EDITING_MODE } from "../../types";

export default function Editor() {
  const { structure, editingMode } = useEditor();

  if (structure === undefined) return <p>no structure</p>;

  if (editingMode === EDITING_MODE.BASIC) {
    return (
      <section className="w-full">
        <div
          style={genEditorStyle(
            omit({ ...structure.settings }, ["width", "font_size", "font_family"])
          )}
          className={`text-black mx-auto lg:max-w-4xl grid md:grid-cols-2 gap-12 my-0 px-6 md:px-14 lg:px-6 py-12`}
        >
          <Input label="name" id="name" basic />
          <Input label="location" id="location" basic />
          <Input label="contacts" id="contact" basic />
          <Input label="receipt_no" id="receipt_no" basic />
          <Input label="date" id="date" basic />
          <Input label="time_in" id="time_in" basic />
          <Input label="sub_total" id="sub_total" basic />
          <Input label="total" id="total" basic />
          <Input label="status" id="status" basic />
          <Input label="payment_type" id="payment_type" basic />
          <Table basic />
        </div>
      </section>
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
          <div className="text-center">
            <Input label="contacts" />
          </div>

          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>
          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="whitespace-nowrap mr-1">Receipt #:</p>
                  <Input label="receipt_no" />
                </div>
              </div>
              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="mr-1">Date: </p>
                  <Input label="date" />
                </div>
              </div>
            </div>

            <div className="table-row">
              {/* time */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="mr-1">Time: </p>
                  <Input label="time_in" />
                </div>
              </div>
            </div>
          </div>
          {/* end */}
          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>

          {/* <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div> */}
          <Table label="products" hasHeader divider={DIVIDER.EQUAL_TO} />
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">Subtotal..........</p>
            <Input label="sub_total" />
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">Received..........</p>
            <Input label="total" />
          </div>
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.EQUAL_TO.padStart(100, DIVIDER.EQUAL_TO)}
          </div>
          <Input label="status" />
          <div className="mt-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {DIVIDER.DASH.padStart(100, DIVIDER.DASH)}
          </div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">
                <Input label="payment_type" />
              </div>
              <div className="table-cell">
                <Input label="total" />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex justify-between mt-6">
            <div>
              <div className="tracking-[2px] overflow-hidden text-clip whitespace-nowrap">
                {DIVIDER.DASH.padStart(14, DIVIDER.DASH)}
              </div>
              <p className="text-center">{capsFirst("Managers sign")}</p>
            </div>

            <div>
              <div className="tracking-[2px] overflow-hidden text-clip whitespace-nowrap">
                {DIVIDER.DASH.padStart(14, DIVIDER.DASH)}
              </div>
              <p className="text-center">{capsFirst("Customer sign")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Input from "../../components/editor/input";
import Table from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { EDITING_MODE } from "../../types";
import { genEditorStyle, omit } from "../../utils";

export default function Editor() {
  const { structure, editingMode } = useEditor();

  if (structure === undefined) return <p>no structure</p>;

  if (editingMode === EDITING_MODE.BASIC) {
    return (
      <section className="w-full">
        <div
          style={genEditorStyle(
            omit({ ...structure.settings }, ["width", "font_size"])
          )}
          className={`text-black mx-auto lg:max-w-4xl grid md:grid-cols-2 gap-12 my-0 px-6 md:px-14 lg:px-6 py-12`}
        >
          <Input label="name" id="name" basic />
          <Input label="location" id="location" basic />
          <Input label="contacts" id="contacts" basic />
          <Input label="email" id="email" basic />
          <Input label="date" id="date" basic />
          <Input label="time_in" id="time_in" basic />
          <Input label="cashier_name" id="cashier_name" basic />
          <Input label="device" id="device" basic />
          <Input label="sub_total" id="sub_total" basic />
          <Input label="total" id="total" basic />
          <Input label="payment_type" id="payment_type" basic />
          <Input label="tax_percentage" id="tax_percentage" basic />
          <Input label="tax_rate" id="tax_rate" basic />
          <Input label="tax_paid" id="tax_paid" basic />
          <Input label="footer_message_01" id="receipt_no" basic />
          <Table basic />
        </div>
      </section>
    );
  }

  return (
    <section style={{ width: structure.settings.width }}>
      <div
        style={genEditorStyle(structure.settings)}
        className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
      >
        <div>
          <Input label="name" />
        </div>
        <div>
          <Input label="location" />
        </div>
        <div className="flex flex-row mx-auto w-fit items-center">
          <p className="mr-1">TEL:</p>
          <Input label="contacts" />
        </div>
        <div>
          <Input label="email" />
        </div>

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        {/* metadata */}
        <div className="table">
          <div className="table-row">
            <div className="table-cell">Receipt of Purchase(Inc Tax)</div>
            <div className="table-cell">
              <div className="flex">
                <Input label="date" />
                <Input label="time_in" />
              </div>
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell">Staff</div>
            <div className="table-cell">
              <Input label="cashier_name" />
            </div>
          </div>
          <div className="table-row">
            <div className="table-cell">Device</div>
            <div className="table-cell">
              <Input label="device" />
            </div>
          </div>
        </div>

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        {/* products */}
        <Table label="products" />

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        {/* total */}
        <div className="table w-full">
          <div className="table-row">
            <div className="table-cell whitespace-nowrap pr-2">Sub Total</div>
            <div className="table-cell">
              <Input label="sub_total" />
            </div>
          </div>
          <div className="table-row w-full">
            <div className="table-cell">Total</div>
            <div className="table-cell">
              <Input label="total" />
            </div>
          </div>
        </div>

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        <div className="table w-full">
          <div className="table-row">
            <div className="table-cell uppercase">payment by tender</div>
            <div className="table-cell uppercase text-end">amount</div>
          </div>
          <div className="table-row w-full">
            <div className="table-cell">
              <Input label="payment_type" />
            </div>
            <div className="table-cell">
              <Input label="total" />
            </div>
          </div>
        </div>

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        <div className="grid grid-cols-3 w-full">
          <div className="flex flex-col">
            <div className="table-cell uppercase">tax rate</div>
            <div className="table-cell">
              <Input label="tax_rate" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="table-cell uppercase text-end">percentage</div>
            <div className="table-cell">
              <Input label="tax_percentage" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="table-cell uppercase text-end">percentage</div>
            <div className="table-cell">
              <Input label="tax_paid" />
            </div>
          </div>
        </div>

        <div className="my-2 h-[1px] rounded-full bg-gray-700 tracking-[5px] overflow-hidden text-clip whitespace-nowrap"></div>

        <Input label="footer_message_01" />
      </div>
    </section>
  );
}

import Input from "../../components/editor/input";
import Table from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { genEditorStyle } from "../../utils";

export default function Editor() {
  const { structure } = useEditor();

  if (Object.keys(structure).length == 0) return <p>no structure</p>;

  // console.log(structure);

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

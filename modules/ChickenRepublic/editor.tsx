// import structure from "./structure.json";
import Input from "../../components/editor/input";
import { genEditorStyle, omit } from "../../utils";
import Table, { DIVIDER } from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";
import { EDITING_MODE } from "../../types";

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
          <Input label="receipt_no" id="receipt_no" basic />
          <Input label="date" id="date" basic />
          <Input label="sub_total" id="sub_total" basic />
          <Input label="tax_paid" id="tax_paid" basic />
          <Input label="order_type" id="order_type" basic />
          <Input label="total" id="total" basic />
          <Input label="change" id="change" basic />
          <Input label="payment_type" id="payment_type" basic />
          <Input label="time_in" id="time_in" basic />
          <Input label="time_out" id="time_out" basic />
          <Input label="cashier_name" id="cashier_name" basic />
          <Input label="footer_message_01" id="footer_message_01" basic />
          <Input label="footer_message_02" id="footer_message_02" basic />
          <Input label="footer_message_03" id="footer_message_03" basic />

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
          {/* <Input label="contacts" /> */}

          {/* start */}
          <div className="table w-full my-2">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">ticket:</p>
                  <Input label="receipt_no" />
                </div>
              </div>
              {/* date */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">date:</p>
                  <Input label="date" />
                </div>
              </div>
            </div>
          </div>
          {/* end */}

          <Table
            label="products"
            largeCol={1}
            headerDivider={DIVIDER.EQUAL_TO}
            divider={DIVIDER.DASH}
          />

          {/* divider */}
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            {"_".padStart(100, "_")}
          </div>

          <>
            <div className="flex justify-end flex-row mx-auto w-full items-center mt-4">
              <p className="whitespace-nowrap capitalize">
                sub total <span className="inline-block w-4"></span>
              </p>
              <Input label="sub_total" />
            </div>
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap capitalize">
                vat 5% <span className="inline-block w-4"></span>
              </p>
              <Input label="tax_paid" />
            </div>
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <Input label="order_type" />
              <div className="w-1/6"></div>
            </div>
            {/* divider */}
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <div className="ml-auto overflow-hidden text-clip whitespace-nowrap">
                =========
              </div>
            </div>
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap capitalize font-bold">
                total tax <span className="inline-block w-4"></span>
              </p>
              <Input label="tax_paid" />
            </div>
            {/* divider */}
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <div className="ml-auto overflow-hidden text-clip whitespace-nowrap">
                =========
              </div>
            </div>
            <div className="flex justify-end flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap capitalize font-bold text-lg tracking-tighter">
                total <span className="inline-block w-4"></span>
              </p>
              <Input label="total" />
            </div>
          </>

          <>
            {/* start */}
            <div className="table w-full my-2">
              <div className="table-row">
                {/* receipt no */}
                <div className="table-cell">
                  <div className="flex flex-row mx-auto w-fit items-center">
                    <p className="whitespace-nowrap mr-1 uppercase">received</p>
                    <Input label="total" />
                  </div>
                </div>
                {/* date */}
                <div className="table-cell">
                  <div className="flex flex-row mx-auto w-fit items-center">
                    <p className="whitespace-nowrap mr-1 uppercase font-bold">
                      change
                    </p>
                    <Input label="change" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between">
              {/* payment type */}
              <Input label="payment_type" />
              {/* total */}
              <Input label="total" />
            </div>

            {/* end */}
          </>

          <div className="flex flex-col w-full justify-between my-4">
            <Input label="footer_message_01" />
            <Input label="footer_message_02" />
            <Input label="footer_message_03" />
          </div>

          {/* time */}
          <div className="flex w-full justify-between">
            {/* time in*/}
            <div className="flex flex-row items-center">
              <p className="mr-1 uppercase">it: </p>
              <Input label="time_in" />
            </div>

            {/* time out*/}
            <div className="flex flex-row items-center">
              <p className="mr-1 uppercase">ft: </p>
              <Input label="time_out" />
            </div>
          </div>

          <div className="flex items-center w-full justify-center">
            <Input label="footer_message_04" />
            <Input label="cashier_name" />
          </div>
        </div>
      </section>
    </>
  );
}

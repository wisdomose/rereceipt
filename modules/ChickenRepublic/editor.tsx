// import structure from "./structure.json";
import Input from "../../components/editor/input";
import { genEditorStyle } from "../../utils";
import Table, { DIVIDER } from "../../components/editor/table";
import useEditor from "../../store/editor/useEditor";

export default function Editor() {
  const { structure } = useEditor();

  if (structure === undefined) return <p>no structure</p>;

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
          />

          {/* divider */}
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
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

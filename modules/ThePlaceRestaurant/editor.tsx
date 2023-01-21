import structure from "./structure.json";
import Input from "../../components/editor/input";
import { genEditorStyle } from "../../utils";
import Table from "../../components/editor/table";

export default function Editor() {
  const data = structure;

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
            <Input label="email" />
          </div>
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
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
                  <Input label="time" />
                </div>
              </div>

              {/* cus no */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="whitespace-nowrap mr-1">Cus No: </p>
                  <Input label="customer_no" />
                </div>
              </div>
            </div>

            <div className="table-row">
              {/* cashier name */}
              <div className="flex flex-row mx-auto w-fit items-center">
                <p className="mr-1 whitespace-nowrap">Cashier Name: </p>
                <Input label="cashier_name" />
              </div>

              <div></div>
            </div>
          </div>
          {/* end */}

          <div className="mt-2">
            <Input label="order_type" />
          </div>
          
          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>
          <Table label="products" />
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">Subtotal..........</p>
            <Input label="subtotal" />
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">Received..........</p>
            <Input label="total" />
          </div>
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ============================================================
          </div>
          <Input label="status" />
          <div className="mt-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ---------------------------------------------------
          </div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">
                <Input label="payment_type" />
              </div>
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-full items-center">
                  <p className="whitespace-nowrap capitalize">#</p>
                  <Input label="receipt_no" />
                </div>
              </div>
              <div className="table-cell">
                <Input label="total" />
              </div>
            </div>
          </div>
          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ---------------------------------------------------
          </div>
          
          {/* footer */}
          <>
            <Input label="footer_message" />
            <Input label="contacts" />
            <div className="flex flex-row mx-auto w-3/4 items-center">
              <p className="whitespace-nowrap mr-1">WhatsApp only:</p>
              <Input label="whatsapp" />
            </div>
          </>

          {/* billing */}
          <>
            <p className="mt-2">Remark:</p>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill prepared by:
              </p>
              <Input label="bill_prepared_by" />
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill printed time:
              </p>
              <Input label="time" />
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">
                bill settled by:
              </p>
              <Input label="bill_prepared_by" />
            </div>
            <div className="flex flex-row mx-auto w-full items-center">
              <p className="whitespace-nowrap mr-1 capitalize">payment type:</p>
              <Input label="payment_type" />
            </div>
          </>

          <div className="my-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            ---------------------------------------------------
          </div>
        </div>
      </section>
    </>
  );
}

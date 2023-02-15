import Input from "../../components/editor/input";
import { genEditorStyle } from "../../utils";
import Table from "../../components/editor/table";
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
          <Input label="contacts" />

          {/* start */}
          <div className="table w-full my-2">
            <div className="table-row">
              {/* receipt no */}
              <div className="table-cell">
                <div className="flex flex-row mx-auto w-fit items-center">
                  <p className="whitespace-nowrap mr-1 uppercase">invoice:</p>
                  <Input label="receipt_no" />
                </div>
              </div>
              {/* date */}
              <div className="table-cell">
                <Input label="date" />
              </div>
            </div>
            {/* time */}
            <div className="table-row">
              <div className="table-cell"></div>

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

          <Table label="products" />

          <div className="mt-1">
            <Input label="total_qty" />
          </div>

          <div className="flex justify-end flex-row mx-auto w-full items-center mt-4">
            <p className="whitespace-nowrap capitalize">
              Total n <span className="inline-block w-4"></span>
            </p>
            <Input label="total" />
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">
              cash paid n <span className="inline-block w-4"></span>
            </p>
            <Input label="total" />
          </div>
          <div className="flex justify-end flex-row mx-auto w-full items-center">
            <p className="whitespace-nowrap capitalize">
              change n <span className="inline-block w-4"></span>
            </p>
            <Input label="change" />
          </div>

          {/* footer */}
          <div className="my-8">
            <Input label="footer_message_01" />
          </div>

          {/* billing */}
          <>
            <Input label="cashier_name" />
          </>
        </div>
      </section>
    </>
  );
}

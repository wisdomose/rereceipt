import Input from "../../components/editor/input";
import { genEditorStyle, omit } from "../../utils";
import Table from "../../components/editor/table";
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
          <Input label="contacts" id="contacts" basic />
          <Input label="receipt_no" id="receipt_no" basic />
          <Input label="date" id="date" basic />
          <Input label="time_in" id="time_in" basic />
          <Input label="total" id="total" basic />
          <Input
            label="total_qty"
            id="total_qty"
            labelName="total quantity"
            basic
          />
          <Input label="change" id="change" basic />
          <Input label="cashier_name" id="cashier_name" basic />
          <Input label="footer_message_01" id="footer_message_01" basic />
          <Table basic hasHeader={false} />
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

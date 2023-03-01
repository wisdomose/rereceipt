import structure from "./structure";
import Input from "../../components/editor/input";
import { genEditorStyle, omit } from "../../utils";
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
          <Input label="merchant_name" id="merchant_name" basic />
          <Input label="merchant_address" id="merchant_address" basic />
          <Input label="payment_type" id="payment_type" basic />
          <Input label="receipt_no" id="receipt_no" basic />
          <Input label="terminal_id" id="terminal_id" basic />
          <Input label="date" id="date" basic />
          <Input label="time" id="time" basic />
          <Input label="card_type" id="card_type" basic />
          <Input label="card_exp" id="card_exp" basic />
          <Input label="card_client" id="card_client" basic />
          <Input label="pan" id="pan" basic />
          <Input label="aid" id="aid" basic />
          <Input label="amount" id="amount" basic />
          <Input label="response_code" id="response_code" basic />
          <Input label="message" id="message" basic />
          <Input label="stan" id="stan" basic />
          <Input label="rrn" id="rrn" basic />
          <Input label="footer_message_01" id="footer_message_01" basic />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* <div className="mx-auto w-fit m-5">
          <Image ref={ref} />
        </div> */}

      {/* <div className="mx-auto w-fit m-5">
          <Pdf structure={s} />
        </div> */}

      <section style={{ width: structure.settings.width }}>
        <div
          style={genEditorStyle(structure.settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          <p className="text-center">**** CUSTOMER’S COPY ****</p>
          <div className="text-center">
            <Input label="merchant_name" />
          </div>
          <div className="text-center">
            <Input label="merchant_address" />
          </div>
          <div className="text-center">
            <Input label="payment_type" />
          </div>

          {/* receipt no */}
          <div className="flex flex-row mx-auto w-fit items-center">
            <p className="mr-1">RECEIPT NO:</p>
            <Input label="receipt_no" />
          </div>

          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            .................................................
          </div>

          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              <p className="table-cell">TERMINAL :</p>
              <Input label="terminal_id" />
            </div>
            <div className="table-row">
              <p className="table-cell">DATE :</p>
              <Input label="date" />
            </div>
            <div className="table-row">
              <p className="table-cell">TIME :</p>
              <Input label="time" />
            </div>
            <div className="table-row">
              <p className="table-cell">CARD :</p>
              <Input label="card_type" />
            </div>
            <div className="table-row">
              <p className="table-cell">CARD EXP. :</p>
              <Input label="card_exp" />
            </div>
            <div className="table-row">
              <p className="table-cell">CLIENT :</p>
              <Input label="card_client" />
            </div>
            <div className="table-row">
              <p className="table-cell">PAN :</p>
              <Input label="pan" />
            </div>
            <div className="table-row">
              <p className="table-cell">AID :</p>
              <Input label="aid" />
            </div>
          </div>
          {/* end */}

          <div className="table text-center mx-auto my-[6px]">
            <div>************************</div>
            <div className="flex font-semibold mb-[1.6px]">
              <p>NGN</p>
              <Input label="amount" />
            </div>
            <div>************************</div>
          </div>

          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              <p className="table-cell">RESPONSE CODE :</p>
              <Input label="response_code" />
            </div>
            <div className="table-row">
              <p className="table-cell">MESSAGE :</p>
              <Input label="message" />
            </div>
            <div className="table-row">
              <p className="table-cell">STAN :</p>
              <Input label="stan" />
            </div>
            <div className="table-row">
              <p className="table-cell">RRN :</p>
              <Input label="rrn" />
            </div>
          </div>
          {/* end */}

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            .................................................
          </div>

          <Input label="footer_message_01" />
        </div>
      </section>
    </>
  );
}

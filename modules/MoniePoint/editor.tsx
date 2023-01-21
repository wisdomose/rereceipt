import structure from "./structure.json";
import Input from "../../components/editor/input";
import { genEditorStyle } from "../../utils";

export default function Editor() {
  const btnStyle =
    "h-4 w-4 grid place-items-center hover:text-black hover:bg-gray-100 text-gray-900";

  const data = structure;

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
            <Input label="name" />
          </div>
          <div className="text-center">
            <Input label="location" />
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
              <Input label="terminal" />
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
              <Input label="client" />
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

          <Input label="footer_message" />
        </div>
      </section>
    </>
  );
}

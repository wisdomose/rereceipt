import { Context } from "../../store/editor/type";
import useEditor from "../../store/editor/useEditor";
import { POS } from "../../types";
import { genEditorStyle, genStyle } from "../../utils";
import { Props } from "./types";
import { forwardRef } from "react";

const Image = forwardRef<any, Props>((props, ref) => {
  const { structure } = useEditor<
    Omit<Context, "structure"> & { structure: Required<POS> }
  >();

  if (Object.keys(structure).length === 0) return null;

  return (
    <div ref={ref}>
      <div style={{ width: structure.settings.width }}>
        <div
          style={genEditorStyle(structure.settings)}
          className={`bg-white text-black mx-auto my-0 px-1 py-[6px]`}
        >
          <p className="text-center">**** CUSTOMER’S COPY ****</p>
          <p style={genStyle(structure.merchant_name)}>
            {structure.merchant_name.label}
          </p>
          <p style={genStyle(structure.merchant_address)}>
            {structure.merchant_address.label}
          </p>
          <p style={genStyle(structure.payment_type)}>
            {structure.payment_type.label}
          </p>
          <p className="text-center">
            RECEIPT NO:{" "}
            <span style={genStyle(structure.receipt_no)}>
              {structure.receipt_no.label}
            </span>
          </p>

          <div className="mb-2 tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            .................................................
          </div>

          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              <p className="table-cell">TERMINAL :</p>
              <p style={genStyle(structure.terminal_id)}>
                {structure.terminal_id.label}
              </p>
            </div>
            <div className="table-row">
              <p className="table-cell">DATE :</p>
              <p style={genStyle(structure.date)}>{structure.date.label}</p>
            </div>
            <div className="table-row">
              <p className="table-cell">TIME :</p>
              <p style={genStyle(structure.time)}>{structure.time.label}</p>
            </div>
            <div className="table-row">
              <p className="table-cell">CARD :</p>
              <p style={genStyle(structure.card_type)}>
                {structure.card_type.label}
              </p>
            </div>
            <div className="table-row">
              <p className="table-cell">CARD EXP. :</p>
              <p style={genStyle(structure.card_exp)}>
                {structure.card_exp.label}
              </p>
            </div>
            <div className="table-row">
              <p className="table-cell">CLIENT :</p>
              <p style={genStyle(structure.card_client)}>{structure.card_client.label}</p>
            </div>
            <div className="table-row">
              <p className="table-cell">PAN :</p>
              <p style={genStyle(structure.pan)}>{structure.pan.label}</p>
            </div>
            <div className="table-row">
              <p className="table-cell">AID :</p>
              <p style={genStyle(structure.aid)}>{structure.aid.label}</p>
            </div>
          </div>
          {/* end */}

          <div className="table text-center mx-auto my-[6px] overflow-hidden">
            <div>************************</div>
            <p style={genStyle(structure.amount)} className="mb-[1.6px]">
              NGN{structure.amount.label}
            </p>
            <div>************************</div>
          </div>

          {/* start */}
          <div className="table w-full">
            <div className="table-row">
              <p className="table-cell">RESPONSE CODE :</p>
              <p style={genStyle(structure.response_code)}>
                {structure.response_code.label}
              </p>
            </div>
            <div className="table-row">
              <p className="table-cell">MESSAGE :</p>
              <p style={genStyle(structure.message)}>
                {structure.message.label}
              </p>
            </div>
            <div className="table-row">
              <p className="table-cell">STAN :</p>
              <p style={genStyle(structure.stan)}>{structure.stan.label}</p>
            </div>
            <div className="table-row">
              <p className="table-cell">RRN :</p>
              <p style={genStyle(structure.rrn)}>{structure.rrn.label}</p>
            </div>
          </div>
          {/* end */}

          <div className="tracking-[5px] overflow-hidden text-clip whitespace-nowrap">
            .................................................
          </div>
          <p style={genStyle(structure.footer_message_01)}>
            {structure.footer_message_01.label}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Image;

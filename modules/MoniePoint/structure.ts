import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  POS,
  TEXT_ALIGN,
  TEXT_TRANSFORM,
} from "../../types";

const structure: POS = {
  merchant_name: {
    label: "TOPMCAND TEMPERATE JUNIOR",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  merchant_address: {
    label: "7B SPRING ROAD CALABAR MUNICIPALITY",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  payment_type: {
    label: "CARD PAYMENT",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.BOLD,
  },
  receipt_no: {
    label: "0000002060",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  terminal_id: {
    label: "20709CUC",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  date: {
    label: "Fri Dec 9 2022",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time: {
    label: "6 : 20 : 13 PM",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  card_type: {
    label: "VERVE",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  card_client: {
    label: "INSTANT /VERVE",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  card_exp: {
    label: "2303",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  bin: {
    label: "506107",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  l4n: {
    label: "2302",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  pan: {
    label: "506107*********2302",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  aid: {
    label: "A0000003710001",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  amount: {
    label: "1,000",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.BOLD,
  },

  response_code: {
    label: "00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  message: {
    label: "Transaction Approved",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  stan: {
    label: "001677",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  rrn: {
    label: "000000001677",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  footer_message_01: {
    label: "Thanks, call again!",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  settings: {
    font_family: FONT_FAMILY.RALEWAY,
    font_size: FONT_SIZE.TEXT_08,
    width: "220px",
  },
};

export default structure;

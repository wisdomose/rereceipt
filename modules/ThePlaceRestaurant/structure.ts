import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  RECEIPT,
  TEXT_ALIGN,
  TEXT_TRANSFORM,
} from "../../types";

const structure: Partial<RECEIPT> = {
  name: {
    label: "The Place Restaurant",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
    font_size: FONT_SIZE.INHERIT,
  },
  location: {
    label: "Ikoyi Plaza, Lagos,",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  email: {
    label: "customerservice@theplace.com.ng",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  receipt_no: {
    label: "30980",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  date: {
    label: "12/21/2022",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time_in: {
    label: "11:34:20 AM",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  customer_no: {
    label: "",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  cashier_name: {
    label: "",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  order_type: {
    label: "Take-Away",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  sub_total: {
    label: "1,600.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  total: {
    label: "1,600.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  status: {
    label: "settled",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  payment_type: {
    label: "GTB",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  footer_message_01: {
    label: "Thank You For Patronizing!!! For feedbacks and enquiries",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  contacts: {
    label: " 0818262824, 08183742775",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  whatsapp: {
    label: "07086742998",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  products: [
    {
      data: [
        {
          label: "Item Name",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "Unit",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "Qty",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "AMOUNT",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "VMm - J/rice & Curr",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "portion",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "2",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "1,600.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
  ],
  settings: {
    font_family: FONT_FAMILY.MOULPALI,
    font_size: FONT_SIZE.TEXT_08,
    width: "190px",
  },
};

export default structure;

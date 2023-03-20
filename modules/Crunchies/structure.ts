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
    label: "Crunchies Fried Chicken",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.BOLD,
  },
  location: {
    label: "39 NDIDEM USANG ISO (MARIAN)ROAD. CALABAR, CROSS RIVER STATE.",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  contacts: {
    label: " 08038294125, 08035455517",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
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
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time_in: {
    label: "11:34:20 AM",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  total: {
    label: "1,600.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  change: {
    label: "0.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  cashier_name: {
    label: "Deborah",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  footer_message_01: {
    label: "Thank you for your patronage",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  products: [
    {
      data: [
        {
          label: "1.00 X MOI MOI",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "500.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "1.00 X MOI MOI",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "500.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "1.00 X MOI MOI",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "500.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
  ],
  total_qty: {
    label: "3.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  settings: {
    font_family: FONT_FAMILY.UBUNTU_MONO,
    font_size: FONT_SIZE.TEXT_12,
    width: "255px",
    id: "crunchies",
  },
};

export default structure;

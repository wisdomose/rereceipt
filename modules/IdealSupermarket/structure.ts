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
    label: "Ideal Supermarket",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.BOLD,
    font_size: FONT_SIZE.TEXT_16,
  },
  location: {
    label: "KM 31 Lekki-Epe Expressway Opp. Bogije Bus Stop Ibeju-lekki, Lagos",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  contacts: {
    label: "808 381 7713",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  email: {
    label: "idealnetworksolutionsng@gmail.com",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.LOWERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  date: {
    label: "20/12/2022",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time_in: {
    label: "13:38:24",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  cashier_name: {
    label: "PETER .A. COSMA",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  device: {
    label: "ideal",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  products: [
    {
      data: [
        {
          label: "product",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "price",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "qty",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "amount",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "VM - F/rice & Curry",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "170.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "10",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "1000.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "COKE, FANTA, SPRITE, LIMCA",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "170.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "15",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "2550.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "FIVE ALIVE APPL, TROP, B",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "450.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "2",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
        {
          label: "900.00",
          text_align: TEXT_ALIGN.END,
          transform: TEXT_TRANSFORM.CAPITALIZE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
  ],
  total_qty: {
    label: "29",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  sub_total: {
    label: "5320.00",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  total: {
    label: "5320.00",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.BOLD,
    font_size: FONT_SIZE.TEXT_16,
  },
  tax_rate: {
    label: "7.50",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  tax_percentage: {
    label: "7.50",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  tax_paid: {
    label: "369.00",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  payment_type: {
    label: "cash",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  footer_message_01: {
    label: "Goods sold in good condition are not returnable",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  settings: {
    font_family: FONT_FAMILY.MOULPALI,
    font_size: FONT_SIZE.TEXT_08,
    width: "220px",
    id: "ideal supermarket",
  },
};

export default structure;

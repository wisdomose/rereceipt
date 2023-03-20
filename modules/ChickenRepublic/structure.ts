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
    label: "CHICKEN REPUBLIC",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  location: {
    label: "7 Sani Abacha Road,GRA Phase 3 Port harcourt",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  receipt_no: {
    label: "EF4T  --T004-35139",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  date: {
    label: "12-12-2022",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time_in: {
    label: "3:05:38  PM",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  time_out: {
    label: "3:10:24  PM",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  sub_total: {
    label: "22,500.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  total: {
    label: "23,625.00",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  change: {
    label: "0.00",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  cashier_name: {
    label: "OBOHO GODWIN",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  footer_message_01: {
    label: "*** THANK YOU ***",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  footer_message_02: {
    label: "“O”utstanding “S”ervice “E”verytime",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  footer_message_03: {
    label: "(OSE)",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  footer_message_04: {
    label: "You have been served by:",
    text_align: TEXT_ALIGN.CENTER,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },

  tax_rate: {
    label: "5%",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  tax_paid: {
    label: "369.00",
    text_align: TEXT_ALIGN.END,
    transform: TEXT_TRANSFORM.CAPITALIZE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  payment_type: {
    label: "debit cards",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.NORMAL,
  },
  order_type: {
    label: "Take Away",
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.UPPERCASE,
    font_weight: FONT_WEIGHT.BOLD,
  },

  products: [
    {
      data: [
        {
          label: "QTY",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "DESCRIPTION",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "PRICE",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "AMOUNT",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
    {
      data: [
        {
          label: "15",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "REFUEL MAX",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
          items: [
            {
              label: "1PC SPICY FRIED CHICKEN",
              text_align: TEXT_ALIGN.LEFT,
              transform: TEXT_TRANSFORM.UPPERCASE,
              font_weight: FONT_WEIGHT.NORMAL,
            },
            {
              label: "FRIED RICE",
              text_align: TEXT_ALIGN.LEFT,
              transform: TEXT_TRANSFORM.UPPERCASE,
              font_weight: FONT_WEIGHT.NORMAL,
            },
            {
              label: "COLESLAW",
              text_align: TEXT_ALIGN.LEFT,
              transform: TEXT_TRANSFORM.UPPERCASE,
              font_weight: FONT_WEIGHT.NORMAL,
            },
            {
              label: "PET DRINK 35CL",
              text_align: TEXT_ALIGN.LEFT,
              transform: TEXT_TRANSFORM.UPPERCASE,
              font_weight: FONT_WEIGHT.NORMAL,
            },
          ],
        },

        {
          label: "1,500.00",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },

        {
          label: "22,500.00",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.UPPERCASE,
          font_weight: FONT_WEIGHT.NORMAL,
        },
      ],
    },
  ],

  settings: {
    font_family: FONT_FAMILY.UBUNTU_MONO,
    font_size: FONT_SIZE.TEXT_08,
    width: "255px",
    id: "chicken republic",
  },
};

export default structure;

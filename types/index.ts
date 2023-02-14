enum DOC_TYPES {
  POS = "pos",
  RECEIPT = "receipt",
  INVOICE = "invoice",
}

enum TEXT_ALIGN {
  CENTER = "center",
  LEFT = "left",
  END = "end",
}

enum TEXT_TRANSFORM {
  CAPITALIZE = "capitalize",
  LOWERCASE = "lowercase",
  UPPERCASE = "uppercase",
  NORMAL = "normal",
}

enum FONT_WEIGHT {
  NORMAL = "normal",
  BOLD = "bold",
}

enum FONT_SIZE {
  TEXT_02 = "2px",
  TEXT_04 = "4px",
  TEXT_08 = "8px",
  TEXT_12 = "12px",
  TEXT_14 = "14px",
  TEXT_16 = "16px",
  INHERIT = "inherit",
}

enum FONT_FAMILY {
  MOULPALI = "Moulpali",
  RALEWAY = "Raleway",
  UBUNTU_MONO = "Ubuntu Mono",
  INHERIT = "inherit",
}

type ITEM = {
  label: string;
  text_align: TEXT_ALIGN;
  transform: TEXT_TRANSFORM;
  font_weight: FONT_WEIGHT;
  font_size?: FONT_SIZE;
};

type SETTING = {
  font_family: FONT_FAMILY;
  font_size: FONT_SIZE;
  width: string;
};

type DOC = {
  id: string;
  type: DOC_TYPES;
  name: string;
  isActive: boolean;
  img: string;
  data: RECEIPT | POS;
};

type PRODUCT = ITEM & { items?: ITEM[] };

const RECEIPT_KEYS = [
  "name",
  "location",
  "email",
  "receipt_no",
  "date",
  "time_in",
  "time_out",
  "change",
  "contacts",
  "products",
  "whatsapp",
  "tax_rate",
  "tax_percentage",
  "tax_paid",
  "device",
  "total_qty",
  "customer_no",
  "customer_name",
  "cashier_name",
  "order_type",
  "payment_type",
  "sub_total",
  "total",
  "status",
  "footer_message_01",
  "footer_message_02",
  "footer_message_03",
  "footer_message_04",
  "footer_message_05",
] as const;

type RECEIPT_KEY = typeof RECEIPT_KEYS[number];

// pan = {bin}******{l4n}
const POS_KEYS = [
  "merchant_name",
  "merchant_address",
  "merchant_tel",
  "merchant_id",
  "bin",
  "l4n",
  "terminal_id",
  "attendant",
  "amount",
  "status",
  "card_type",
  "payment_type",
  "aid",
  "tvr",
  "rrn",
  "date",
  "time",
  "app_version",
  "receipt_no",
  "card_exp",
  "pan",
  "stan",
  "card_name",
  "card_client",
  "response_code",
  "message",
  "bank",
  "footer_message_01",
  "footer_message_02",
  "footer_message_03",
  "footer_message_04",
  "footer_message_05",
  "email",
  "cvmr",
  "ptsp",
  "terminal_order_no",
  "trace_no",
  "auth_code",
  "refrence",
] as const;

type POS_KEY = typeof POS_KEYS[number];

type RECEIPT = Omit<
  {
    settings: SETTING;
  } & Partial<Record<RECEIPT_KEY, ITEM>>,
  "products"
> & { products: { data: PRODUCT[] }[] };

type POS = Partial<Record<POS_KEY, ITEM>> & {
  settings: SETTING;
};

export type { RECEIPT, RECEIPT_KEY, POS_KEY, POS, DOC, ITEM, SETTING, PRODUCT };

export {
  TEXT_ALIGN,
  TEXT_TRANSFORM,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  RECEIPT_KEYS,
  POS_KEYS,
  DOC_TYPES,
};

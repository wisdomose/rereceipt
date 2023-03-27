import { Disclosure, Listbox, Menu, Switch } from "@headlessui/react";
import Page from "../../components/layout/Page";
import {
  FONT_WEIGHT,
  TEXT_TRANSFORM,
  FONT_SIZE,
  FONT_FAMILY,
  TEXT_ALIGN,
  RECEIPT_KEYS,
  RECEIPT_KEY,
  RECEIPT,
  ITEM,
  DOC_TYPES,
  SETTING,
} from "../../types";
import Input from "../../components/input";
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  Fragment,
  useRef,
} from "react";
import { FiCheck, FiImage } from "react-icons/fi";
import Button from "../../components/button";
import Image from "next/image";
import { createTemplate } from "../../utils/firebase";
import { useRouter } from "next/router";
import useUser from "../../store/user/useUser";
import Loader from "../../components/layout/Loader";
import withState from "../../hooks/withState";
import useInput from "../../hooks/useInput";
import { TemplateContext } from "../../store/template/store";
import {
  RiInsertRowBottom,
  RiDeleteRow,
  RiInsertColumnRight,
  RiDeleteColumn,
} from "react-icons/ri";
/*
  TODO
  - loading state for when the receipt is being uploaded
  - after saving, reset state
  - give accurate error messages for when each required value isn't present
*/

export default function Create() {
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<DOC_TYPES>(DOC_TYPES.RECEIPT);
  const file = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [img, setImg] = useState("");
  const [receipt, setReceipt] = useState<RECEIPT | undefined>(undefined);
  const [base, setBase] = useState<RECEIPT | undefined>(undefined);
  const [setting, setSetting] = useState<SETTING>({
    font_family: FONT_FAMILY.UBUNTU_MONO,
    font_size: FONT_SIZE.TEXT_12,
    width: "200",
  });
  const { user, loading } = useUser();
  const { loading: saveLoading, wrapper } = withState();
  const [template_name, template_nameOptions] = useInput("");

  const defaultItem: ITEM = {
    label: "",
    font_weight: FONT_WEIGHT.NORMAL,
    font_size: FONT_SIZE.INHERIT,
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.NORMAL,
  };

  const router = useRouter();

  const updateType = (value: DOC_TYPES) => setType(value);

  const toggleIsActive = () => setIsActive((s) => !s);

  const updateImg = (value: string) => setImg(value);

  // for settings
  const updateFontFamily = (value: FONT_FAMILY) => {
    setSetting((setting) => {
      setting.font_family = value;
      return { ...setting };
    });
  };

  // for settings
  const updateFontSize = (value: FONT_SIZE) => {
    setSetting((setting) => {
      setting.font_size = value;
      return { ...setting };
    });
  };

  async function create() {
    if (!image || !template_name || !receipt) {
      alert("something is left");
      return;
    }

    await createTemplate(
      {
        data: {
          ...receipt,
          settings: { ...setting, width: `${setting.width}px` },
        },
        type,
        isActive,
        template_name,
      },
      image
    ).then(() => {
      router.reload();
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", (e) => {
        e.preventDefault();

        const msg =
          "Do you want to exit this page? you may have unsaved changes";

        e.returnValue = msg;

        return msg;
      });

      return () => window.removeEventListener("beforeunload", () => {});
    }
  }, []);

  useEffect(() => {
    let data = {
      products: [
        { data: [defaultItem, defaultItem, defaultItem] },
        { data: [defaultItem, defaultItem, defaultItem] },
        { data: [defaultItem, defaultItem, defaultItem] },
      ],
      settings: {
        font_family: FONT_FAMILY.INHERIT,
        font_size: FONT_SIZE.TEXT_12,
        width: "200px",
      },
    };
    RECEIPT_KEYS.map((key) => {
      data = { [key]: { ...defaultItem }, ...data };
    });
    // @ts-ignore
    setReceipt({ ...data });
    // if (base !== undefined) {
    //   console.log("update base");
    // }
    // @ts-ignore
    setBase({ ...data });
  }, []);

  // 404
  useEffect(() => {
    if (user && user?.email !== "wisdomose05@gmail.com") {
      router.replace("/ind");
    }
  }, [user]);

  const disabled = !image || !template_name || !setting.width || !template_name;
  const value = {
    isActive,
    template_name,
    receipt,
    type,
    img,
    base,
    // setBase,
    setReceipt,
    updateImg,
    updateType,
    toggleIsActive,
  };

  if (loading) return <Loader />;

  return (
    <TemplateContext.Provider value={value}>
      <Page isProtected={true}>
        <Page.Body>
          <div className="py-9">
            {/* image */}
            <div className="flex flex-col items-end">
              <div className="h-[50vh] w-full">
                {image ? (
                  <div className="relative h-full">
                    <Image
                      alt=""
                      src={URL.createObjectURL(image)}
                      className="w-full h-full object-center object-contain"
                      fill
                    />
                  </div>
                ) : (
                  <FiImage className="h-full w-full" />
                )}
              </div>
              <br />
              {/* file btn */}
              <label className="bg-black/80 text-white rounded-md px-6 py-3 cursor-pointer focus:bg-black/70 hover:bg-black/70">
                {file ? "Change" : "Upload"} image
                <input
                  type="file"
                  accept="image/*"
                  name="file"
                  id="file"
                  ref={file}
                  className="hidden"
                  onChange={() => {
                    if (file?.current?.files && file?.current?.files.length > 0)
                      setImage(file?.current?.files[0]);
                  }}
                />
              </label>
            </div>
            <br />

            {/* metadata - firebase special properties */}
            {/* general settings for the receipt */}
            <>
              <p className="font-bold text-lg mb-4">Settings</p>
              <div className="grid md:grid-cols-2 gap-5">
                <Select
                  label="font family"
                  items={Object.values(FONT_FAMILY)}
                  initial={setting.font_family}
                  onChange={updateFontFamily}
                  required
                />

                <Select
                  label="font size"
                  items={Object.values(FONT_SIZE)}
                  initial={setting.font_size}
                  onChange={updateFontSize}
                  required
                />

                <Select
                  initial={type}
                  items={Object.values(DOC_TYPES)}
                  label="type of document"
                  onChange={updateType}
                  required
                />

                <Input
                  label="width"
                  value={setting.width}
                  onChange={(e) =>
                    setSetting((s) => {
                      s.width = e.target.value;
                      return { ...s };
                    })
                  }
                  id="width"
                  type="number"
                  placeholder="width"
                  labelClassName="font-semibold"
                  required
                />

                <Input
                  label="id"
                  {...template_nameOptions}
                  id="id"
                  type="text"
                  placeholder="unique identifier"
                  labelClassName="font-semibold"
                  required
                />

                <div>
                  <p className="block capitalize mb-1 font-semibold">
                    is active
                  </p>
                  <Toggle initial={isActive} onChange={toggleIsActive} />
                </div>
              </div>
            </>

            {/* schema properties */}
            <div className="my-9">
              <p className="font-bold text-lg mb-4">Schema</p>
              <div className="grid grid-cols-1 mx-auto gap-4">
                {[...RECEIPT_KEYS]
                  .sort()
                  .map((key) =>
                    key === "products" ? (
                      <TTable key={key} />
                    ) : (
                      <Field name={key as RECEIPT_KEY} key={key} />
                    )
                  )}
              </div>
            </div>

            <Button
              label="create"
              onClick={() => wrapper(create)}
              disabled={disabled}
              loading={saveLoading}
            />
          </div>
        </Page.Body>
      </Page>
    </TemplateContext.Provider>
  );
}

/*
  TODO - HOW TO IMPROVE THIS COMPONENT
  - no need for the intermediate states passed to the select component
  - find a way to remove them
  - only the receipt state can use this component it should not be so
  - create a part for tables
*/
export function Field({ name }: { name: RECEIPT_KEY }) {
  const { receipt, setReceipt, base } = useContext(TemplateContext);
  const [fontWeight, setFontWeight] = useState<FONT_WEIGHT>(FONT_WEIGHT.NORMAL);
  const [transform, setTransform] = useState<TEXT_TRANSFORM>(
    TEXT_TRANSFORM.NORMAL
  );
  const [fontSize, setFontSize] = useState<FONT_SIZE>(FONT_SIZE.INHERIT);
  const [textAlign, setTextAlign] = useState<TEXT_ALIGN>(TEXT_ALIGN.END);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (!receipt || name == "products") return;
    setFontWeight(receipt[name].font_weight);
    setTransform(receipt[name].transform);
    receipt[name].font_size &&
      setFontSize(receipt[name].font_size as FONT_SIZE);
    setTextAlign(receipt[name].text_align);
  }, [receipt, name]);

  useEffect(() => {
    if (!receipt || !base || name == "products") return;
    const changed = Object.keys(receipt[name]).find((key) => {
      const k = key as keyof ITEM;
      return receipt[name][k] !== base[name][k];
    });
    setChanged(!!changed);
  }, [receipt, base]);

  const updateFontWeight = (value: FONT_WEIGHT) => {
    if (name === "products") return;
    setReceipt((state) => {
      if (!state) return state;
      let receipt = { ...state };
      let item = { ...receipt[name] };
      item.font_weight = value;

      receipt[name] = item;

      return { ...receipt };
    });
  };
  const updateTransform = (value: TEXT_TRANSFORM) => {
    if (name === "products") return;

    setReceipt((state) => {
      if (!state) return state;
      let receipt = { ...state };
      let item = { ...receipt[name] };
      item.transform = value;

      receipt[name] = item;

      return { ...receipt };
    });
  };
  const updateFontSize = (value: FONT_SIZE) => {
    if (name === "products") return;

    setReceipt((state) => {
      if (!state) return state;
      let receipt = { ...state };
      let item = { ...receipt[name] };
      item.font_size = value;

      receipt[name] = item;

      return { ...receipt };
    });
  };
  const updateTextAlign = (value: TEXT_ALIGN) => {
    if (name === "products") return;

    setReceipt((state) => {
      if (!state) return state;
      let receipt = { ...state };
      let item = { ...receipt[name] };
      item.text_align = value;

      receipt[name] = item;

      return { ...receipt };
    });
  };
  const updateName = (value: string) => {
    if (name === "products") return;
    setReceipt((state) => {
      if (!state) return state;
      let receipt = { ...state };
      let item = { ...receipt[name] };
      item.label = value;

      receipt[name] = item;

      return { ...receipt };
    });
  };

  if (!receipt || !base || name === "products") return null;

  return (
    <Disclosure>
      {({ open }: { open: boolean }) => (
        <div className="w-full relative">
          <Disclosure.Button
            className={`p-4 bg-gray-200 w-full border-2 text-left text-lg text-gray-900 font-semibold ${
              open ? "rounded-t-md" : "rounded-md"
            }
            ${changed ? " border-green-500" : " border-transparent"}
            `}
          >
            {name}
          </Disclosure.Button>
          <Disclosure.Panel className="p-4 shadow-md rounded-b-md  w-full z-20 bg-white">
            {/* LABEL */}
            <Input
              key={name}
              id={name}
              label="label"
              type="text"
              placeholder={name}
              value={receipt[name].label}
              labelClassName="font-semibold"
              onChange={(e) => {
                updateName(e.target.value);
              }}
            />
            <br />
            <div className="grid md:grid-cols-2 gap-5">
              <Select
                initial={fontWeight}
                items={Object.values(FONT_WEIGHT)}
                label="font weight"
                onChange={updateFontWeight}
              />

              <Select
                initial={transform}
                items={Object.values(TEXT_TRANSFORM)}
                label="transform"
                onChange={updateTransform}
              />

              <Select
                initial={fontSize}
                items={Object.values(FONT_SIZE)}
                label="font size"
                onChange={updateFontSize}
              />

              <Select
                initial={textAlign}
                items={Object.values(TEXT_ALIGN)}
                label="text align"
                onChange={updateTextAlign}
              />
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

export function Select({
  initial,
  items,
  label,
  onChange,
  required = false,
}: {
  initial: any;
  items: string[];
  label: string;
  required?: boolean;
  onChange: (item: any) => void;
}) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className="relative">
      <Listbox value={value} onChange={setValue}>
        <Listbox.Label className="block capitalize mb-1 font-semibold">
          {label}
          {required && <span className="text-red-600 pl-1">*</span>}
        </Listbox.Label>
        <Listbox.Button className="w-full rounded-md px-3 py-3 bg-gray-200 text-left focus:outline-none focus:ring-2 focus:shadow-lg">
          {value}
        </Listbox.Button>
        <Listbox.Options className="w-full rounded-md translate-y-2 bg-gray-200 focus:outline-none focus:ring-2 absolute overflow-hidden z-10">
          {items.map((item) => (
            <Listbox.Option value={item} as={Fragment} key={item}>
              {({
                active,
                selected,
              }: {
                active: boolean;
                selected: boolean;
              }) => (
                <li
                  className={`px-3 cursor-pointer  grid grid-cols-[16px,1fr] items-center gap-2 ${
                    active
                      ? "hover:bg-gray-500/20 bg-gray-500/20 focus:bg-gray-500/20"
                      : ""
                  }`}
                >
                  {selected ? (
                    <FiCheck className="w-full h-4" />
                  ) : (
                    <svg className="w-full h-4"></svg>
                  )}
                  <span>{item}</span>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

export function Toggle({
  initial,
  onChange,
}: {
  initial: boolean;
  onChange: () => void;
}) {
  return (
    <Switch checked={initial} onChange={() => onChange()} as={Fragment}>
      {({ checked }: { checked: boolean }) => (
        <button
          className={`group w-9 focus:outline-none bg-gray-200 h-4 rounded-full relative ${
            checked ? "ring-2" : ""
          }`}
        >
          <div
            className={`group-hover:scale-110 group-focus:scale-110 h-5 w-5 rounded-full  absolute left-0 top-1/2 -translate-y-1/2 ${
              checked
                ? "translate-x-full bg-blue-400"
                : "-translate-x-0 bg-gray-400"
            }`}
          ></div>
        </button>
      )}
    </Switch>
  );
}

export function TTable() {
  const { receipt, setReceipt } = useContext(TemplateContext);
  const [changed, setChanged] = useState(false);
  const label = "products";

  const addRow = () => {
    setReceipt((s) => {
      if (s === undefined) return;
      const newState = { ...s };
      let table = s.products;
      let length = table[0].data.length;

      let row = [];
      for (let i = 0; i < length; i++) {
        row.push({
          label: "",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.NORMAL,
          font_weight: FONT_WEIGHT.NORMAL,
        });
      }

      table = [...table, { data: row }];
      newState.products = table;

      return newState;
    });
  };

  const deleteRow = (row?: number) => {
    setReceipt((s) => {
      if (s === undefined) return s;
      let table = [...s[label]];
      if (table.length === 1) return { ...s };
      const delIndex = row ? row : table.length - 1;
      table.splice(delIndex, 1);
      return { ...s, [label]: [...table] };
    });
  };

  const deleteColumn = () => {
    setReceipt((s) => {
      if (s === undefined) return s;
      s[label].map(({ data: col }) => {
        return col.length === 1 ? col : col.splice(col.length - 1, 1);
      });

      return { ...s };
    });
  };

  const addColumn = () => {
    setReceipt((s) => {
      if (s === undefined) return s;
      const headerFontSize = s[label][0].data[0].font_size;
      s[label].map(({ data: row }, index) => {
        row.push({
          label: "",
          text_align: TEXT_ALIGN.LEFT,
          transform: TEXT_TRANSFORM.NORMAL,
          font_weight: FONT_WEIGHT.NORMAL,
          font_size: index === 0 ? headerFontSize : undefined,
        });
      });

      return { ...s };
    });
  };

  if (!receipt) return null;

  return (
    <Disclosure>
      {({ open }: { open: boolean }) => (
        <div className="w-full relative">
          <Disclosure.Button
            className={`p-4 bg-gray-200 w-full border-2 text-left text-lg text-gray-900 font-semibold ${
              open ? "rounded-t-md" : "rounded-md"
            }
            ${changed ? " border-green-500" : " border-transparent"}
            `}
          >
            products
          </Disclosure.Button>
          <Disclosure.Panel className="p-4 shadow-md rounded-b-md  w-full z-20 bg-white">
            <div className="overflow-hidden">
              <button
                className="border border-gray5 rounded-lg py-[10px] px-3"
                onClick={addRow}
              >
                <RiInsertRowBottom />
              </button>
              <button
                className="border border-gray5 rounded-lg py-[10px] px-3 ml-3"
                onClick={() => deleteRow()}
              >
                <RiDeleteRow />
              </button>
              <button
                className="border border-gray5 rounded-lg py-[10px] px-3 ml-3"
                onClick={() => addColumn()}
              >
                <RiInsertColumnRight />
              </button>
              <button
                className="border border-gray5 rounded-lg py-[10px] px-3 ml-3"
                onClick={() => deleteColumn()}
              >
                <RiDeleteColumn />
              </button>
              <div className="w-full overflow-auto">
                <table className="mb-5 mt-3 w-full min-w-[500px] text-[#4F4F4F]">
                  <tbody>
                    {receipt.products.map((row, rowId) => (
                      <tr key={rowId}>
                        {row.data.map((col, colId) => (
                          <TInput
                            index={[rowId, colId]}
                            key={`${rowId}${colId}`}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function TInput({ index }: { index: number[] }) {
  const { receipt, setReceipt } = useContext(TemplateContext);

  const onChange = (value: string) => {
    setReceipt((s) => {
      if (s === undefined) return;
      const label = "products";

      let newState = { ...s };
      let table = newState[label];
      let row = table[index[0]].data;
      row[index[1]] = { ...row[index[1]], label: value };
      table[index[0]] = { data: row };
      newState[label] = table;
      return newState;
    });
  };

  return (
    <td className="relative">
      <input
        type="text"
        value={receipt?.products[index[0]].data[index[1]].label}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full rounded-md px-3 py-3 text-[#4F4F4F] bg-[#F2F2F2] focus:outline-none focus:ring-1 focus:shadow-lg ring-[#EF5DA8]"
      />
    </td>
  );
}

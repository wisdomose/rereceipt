import { Disclosure, Listbox, Menu, Switch } from "@headlessui/react";
import Page from "../../components/layout/Page";
import useInput from "../../hooks/useInput";
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
import { NormalizeError } from "next/dist/shared/lib/utils";

// settings: ,

const CreateContext = createContext<{
  receipt?: Required<RECEIPT>;
  name: string;
  isActive: boolean;
  type: DOC_TYPES;
  img: string;
  setReceipt: Dispatch<SetStateAction<Required<RECEIPT> | undefined>>;
  updateType: (value: DOC_TYPES) => void;
  toggleIsActive: () => void;
  updateName: (value: string) => void;
  updateImg: (value: string) => void;
}>({
  name: "",
  isActive: false,
  receipt: undefined,
  img: "",
  type: DOC_TYPES.RECEIPT,
  updateImg: () => {},
  setReceipt: () => {},
  updateType: () => {},
  updateName: () => {},
  toggleIsActive: () => {},
});

export default function Create() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<DOC_TYPES>(DOC_TYPES.RECEIPT);
  const file = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [img, setImg] = useState("");
  const [receipt, setReceipt] = useState<Required<RECEIPT> | undefined>(
    undefined
  );
  const [setting, setSetting] = useState<SETTING>({
    font_family: FONT_FAMILY.UBUNTU_MONO,
    font_size: FONT_SIZE.TEXT_12,
    width: "200",
  });

  const defaultItem: ITEM = {
    label: "",
    font_weight: FONT_WEIGHT.NORMAL,
    font_size: FONT_SIZE.INHERIT,
    text_align: TEXT_ALIGN.LEFT,
    transform: TEXT_TRANSFORM.NORMAL,
  };

  const updateType = (value: DOC_TYPES) => setType(value);

  const toggleIsActive = () => setIsActive((s) => !s);

  const updateName = (value: string) => setName(value);

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

  useEffect(() => {
    let receipt: RECEIPT = {
      products: [[defaultItem, defaultItem, defaultItem]],
      settings: {
        font_family: FONT_FAMILY.INHERIT,
        font_size: FONT_SIZE.TEXT_12,
        width: "200px",
      },
    };
    RECEIPT_KEYS.map((key) => {
      receipt = { ...receipt, [key]: { ...defaultItem } };
    });
    // @ts-ignore
    setReceipt(receipt);
  }, []);

  const value = {
    isActive,
    name,
    receipt,
    setReceipt,
    type,
    img,
    updateImg,
    updateType,
    toggleIsActive,
    updateName,
  };

  return (
    <CreateContext.Provider value={value}>
      <Page isProtected={true}>
        <Page.Body>
          <div className="py-9">
            {/* image */}
            <div className="flex flex-col items-end">
              <div className="h-[50vh] w-full">
                {image ? (
                  <Image
                    alt=""
                    src={URL.createObjectURL(image)}
                    className="w-full h-full object-center object-contain"
                  />
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
                />

                <Select
                  label="font size"
                  items={Object.values(FONT_SIZE)}
                  initial={setting.font_size}
                  onChange={updateFontSize}
                />

                <Input
                  label="name"
                  value={name}
                  onChange={(e) => updateName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="name"
                  labelClassName="font-semibold"
                />

                <Select
                  initial={type}
                  items={Object.values(DOC_TYPES)}
                  label="type of document"
                  onChange={updateType}
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
                {RECEIPT_KEYS.map((receipt) => (
                  <Field name={receipt} key={receipt} />
                ))}
              </div>
            </div>

            <Button label="create" onClick={() => {}} />
          </div>
        </Page.Body>
      </Page>
    </CreateContext.Provider>
  );
}

/*
  TODO - HOW TO IMPROVE THIS COMPONENT
  - label input not working for all fields
  - no need for the intermediate states passed to the select component
  - find a way to remove them
  - only the receipt state can use this component it should not be so
  - create a part for tables
*/
function Field({ name }: { name: RECEIPT_KEY }) {
  const { receipt, setReceipt } = useContext(CreateContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fontWeight, setFontWeight] = useState<FONT_WEIGHT>(FONT_WEIGHT.NORMAL);
  const [transform, setTransform] = useState<TEXT_TRANSFORM>(
    TEXT_TRANSFORM.NORMAL
  );
  const [fontSize, setFontSize] = useState<FONT_SIZE>(FONT_SIZE.INHERIT);
  const [textAlign, setTextAlign] = useState<TEXT_ALIGN>(TEXT_ALIGN.LEFT);

  useEffect(() => {
    if (!receipt || isInitialized || name == "products") return;
    setFontWeight(receipt[name].font_weight);
    setTransform(receipt[name].transform);
    receipt[name].font_size &&
      setFontSize(receipt[name].font_size as FONT_SIZE);
    setTextAlign(receipt[name].text_align);

    setIsInitialized(true);
  }, []);

  const updateFontWeight = (value: FONT_WEIGHT) => {
    if (name === "products") return;
    setReceipt((receipt) => {
      if (!receipt) return receipt;
      receipt[name].font_weight = value;
      return { ...receipt };
    });
  };
  const updateTransform = (value: TEXT_TRANSFORM) => {
    if (name === "products") return;

    setReceipt((receipt) => {
      if (!receipt) return receipt;
      receipt[name].transform = value;
      return { ...receipt };
    });
  };
  const updateFontSize = (value: FONT_SIZE) => {
    if (name === "products") return;

    setReceipt((receipt) => {
      if (!receipt) return receipt;
      receipt[name].font_size = value;
      return { ...receipt };
    });
  };
  const updateTextAlign = (value: TEXT_ALIGN) => {
    if (name === "products") return;

    setReceipt((receipt) => {
      if (!receipt) return receipt;
      receipt[name].text_align = value;
      return { ...receipt };
    });
  };
  const updateName = (value: string) => {
    if (name === "products") return;

    setReceipt((receipt) => {
      if (!receipt) return receipt;
      receipt[name].label = value;
      return { ...receipt };
    });
  };

  if (!receipt || name === "products") return null;

  return (
    <Disclosure>
      {({ open }: { open: boolean }) => (
        <div className="w-full relative">
          <Disclosure.Button
            className={`p-4 bg-gray-200 w-full text-left text-lg text-gray-900 font-semibold ${
              open ? "rounded-t-md" : "rounded-md"
            }`}
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

function Select({
  initial,
  items,
  label,
  onChange,
}: {
  initial: any;
  items: string[];
  label: string;
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

function Toggle({
  initial,
  onChange,
}: {
  initial: boolean;
  onChange: () => void;
}) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    onChange();
  }, [value]);

  return (
    <Switch checked={value} onChange={setValue} as={Fragment}>
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

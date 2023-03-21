import { Disclosure, Listbox, Menu, Switch } from "@headlessui/react";
import Page from "../../../components/layout/Page";
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
} from "../../../types";
import Input from "../../../components/input";
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { FiCheck, FiImage } from "react-icons/fi";
import Button from "../../../components/button";
import Image from "next/image";
import {
  createTemplate,
  getOneTemplate,
  updateTemplate,
} from "../../../utils/firebase";
import { useRouter } from "next/router";
import useUser from "../../../store/user/useUser";
import Loader from "../../../components/layout/Loader";
import withState from "../../../hooks/withState";
import useInput from "../../../hooks/useInput";
import { Field, Select, TTable, Toggle } from "../create";
import { notify, omit } from "../../../utils";
import { TemplateContext } from "../../../store/template/store";
import { log } from "next-axiom";

/*
  TODO
  - loading state for when the receipt is being uploaded
  - after saving, reset state
  - give accurate error messages for when each required value isn't present
*/

export default function Edit() {
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
  const { loading: updateLoading, wrapper } = withState();
  const [template_name, template_nameOptions, updateTemplate_name] =
    useInput("");
  const [initialized, setInitialized] = useState(false);
  const [id, setId] = useState(""); // id of the template

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

  const update = useCallback(async () => {
    if (!template_name || !receipt) {
      alert("something is left");
      return;
    }

    await updateTemplate(id, {
      data: {
        ...receipt,
        settings: { ...setting, width: `${setting.width}px` },
      },
      type,
      isActive,
      template_name,
      image,
    }).then(() => {
      router.reload();
    });
  }, [isActive, template_name, receipt, type, setting, image]);

  useEffect(() => {
    const id = router.query.receipt;
    if (!id || typeof id !== "string" || initialized) return;

    setId(id);

    getOneTemplate(id)
      .then((structure) => {
        if (!structure) throw "No receipt found";
        setReceipt(omit(structure.data, ["settings"]));
        !base && setBase(omit(structure.data, ["settings"]));
        setSetting({
          ...structure.data.settings,
          width: structure.data.settings.width.replace(/[a-zA-Z]/g, ""),
        });
        setIsActive(structure.isActive);
        setType(structure.type);
        setImg(structure.img);
        updateTemplate_name(structure.template_name);
        setInitialized(true);
      })
      .catch((err) => {
        alert(err.message ?? `No template found with id "${id}"`);
        router.push("/create");
        // notify(err.message ?? "an error occured");
      });
  }, [router.query.receipt, initialized]);

  // 404
  useEffect(() => {
    if (user && user?.email !== "wisdomose05@gmail.com") {
      router.replace("/");
    }
  }, [user]);

  const disabled = (!img && !image) || !setting.width || !template_name;
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

  if (loading || !initialized) return <Loader />;

  return (
    <TemplateContext.Provider value={value}>
      <Page isProtected={true}>
        <Page.Body>
          <div className="py-9">
            {/* image */}
            <div className="flex flex-col items-end">
              <div className="h-[50vh] w-full">
                {img || image ? (
                  <div className="relative h-full">
                    <Image
                      alt=""
                      src={image ? URL.createObjectURL(image) : img}
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

                {/* <Input
                  label="name"
                  value={name}
                  onChange={(e) => updateName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="name"
                  labelClassName="font-semibold"
                  required
                /> */}

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
              {receipt && (
                <div className="grid grid-cols-1 mx-auto gap-4">
                  {Object.keys(receipt)
                    .sort()
                    .map((key) =>
                      key === "products" ? (
                        <TTable />
                      ) : (
                        <Field name={key as RECEIPT_KEY} key={key} />
                      )
                    )}
                </div>
              )}
            </div>

            <Button
              label="Update"
              onClick={() => wrapper(update)}
              disabled={disabled}
              loading={updateLoading}
            />
          </div>
        </Page.Body>
      </Page>
    </TemplateContext.Provider>
  );
}

import { ChangeEvent, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Props = {
  value: string;
  label?: string;
  labelClassName?: string;
  type: "password" | "text" | "number" | "email";
  placeholder?: string;
  id: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: Props) {
  const [type, setType] = useState(props.type);
  return (
    <div className="w-full relative">
      {props.label && (
        <label
          htmlFor={props.id}
          className={`block capitalize mb-1 ${
            props.labelClassName ? props.labelClassName : ""
          }`}
        >
          {props.label}
          {props.required && <span className="text-red-600 pl-1">*</span>}
        </label>
      )}
      <input
        id={props.id}
        type={type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className="w-full rounded-md px-3 py-3 bg-gray-200 focus:outline-none focus:ring-2 focus:shadow-lg"
      />

      {props.type === "password" && (
        <button
          type="button"
          className="absolute rounded-tr-md rounded-br-md p-4 right-0 bg-transparent text-6 hover:bg-black/10 hover:text-black"
          onClick={() =>
            setType((s) => (s === "password" ? "text" : "password"))
          }
        >
          {type === "text" ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  );
}

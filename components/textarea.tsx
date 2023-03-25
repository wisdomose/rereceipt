import { ChangeEvent, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Props = {
  value: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea({
  disabled = false,
  rows = 5,
  cols = 5,
  ...props
}: Props) {
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
      <textarea
        rows={rows}
        cols={cols}
        name={props.name}
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={disabled ? undefined : props.onChange}
        disabled={disabled}
        className="w-full rounded-md px-3 py-3 bg-gray-200 focus:outline-none focus:ring-2 focus:shadow-lg"
      ></textarea>
    </div>
  );
}

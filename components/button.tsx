type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
};

/* 
  TODO
  - loading button state
*/

export default function Button({
  type = "submit",
  disabled = false,
  onClick = () => {},
  block = false,
  ...props
}: Props) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`text-white font-semibold rounded-md px-6 py-3 ${
        disabled
          ? "bg-black/50 cursor-not-allowed"
          : "bg-black/80 focus:bg-black/90 hover:bg-black/90 "
      } ${block ? "w-full" : ""}`}
    >
      {props.label}
    </button>
  );
}

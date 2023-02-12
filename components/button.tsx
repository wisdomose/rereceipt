type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  type = "submit",
  disabled = false,
  onClick = () => {},
  ...props
}: Props) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`text-white rounded-md px-6 py-3 ${
        disabled
          ? "bg-black/50 cursor-not-allowed"
          : "bg-black/80 focus:bg-black/70 hover:bg-black/70 "
      }`}
    >
      {props.label}
    </button>
  );
}

type Props = {
  label: string;
  onClick: () => void;
  type?: "button" | "submit";
};

export default function Button({ type = "submit", ...props }: Props) {
  return (
    <button
      type={type}
      onClick={props.onClick}
      className="bg-black/80 text-white rounded-md px-6 py-3 focus:bg-black/70 hover:bg-black/70"
    >
      {props.label}
    </button>
  );
}

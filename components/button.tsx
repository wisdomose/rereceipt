import Link from "next/link";
import { overrideTailwindClasses } from "tailwind-override";

type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
  minimal?: boolean;
  className?: string;
  href?: string;
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
  minimal = false,
  className = "",
  href,
  ...props
}: Props) {
  const classStyles = overrideTailwindClasses(`
      ${
        minimal
          ? "border border-[#4F4F4F] rounded-lg py-2 px-3"
          : `text-white font-semibold rounded-md px-6 py-3${
              disabled
                ? " bg-black/50 cursor-not-allowed"
                : " bg-black/80 focus:bg-black/90 hover:bg-black/90"
            }`
      }
      ${block ? " w-full" : ""}
      ${className}`);

  return (
    <>
      {href ? (
        <Link href={disabled ? "" : href} className={classStyles}>
          {props.label}
        </Link>
      ) : (
        <button
          type={type}
          onClick={disabled ? undefined : onClick}
          className={classStyles}
        >
          {props.label}
        </button>
      )}
    </>
  );
}

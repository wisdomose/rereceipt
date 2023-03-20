import Link from "next/link";
import { overrideTailwindClasses } from "tailwind-override";

type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
  loading?: boolean;
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
  loading = false,
  minimal = false,
  className = "",
  href,
  ...props
}: Props) {
  const classStyles = overrideTailwindClasses(`
  relative 
      ${
        minimal
          ? "border border-gray2 h-fit rounded-lg py-2 px-3 text-xs"
          : `text-white font-semibold rounded-md px-6 py-3${
              disabled && !minimal
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
          <span className={`${loading ? "text-transparent" : ""}`}>
            {props.label}
          </span>
          {loading && (
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square h-[70%]">
              <div className="aspect-square h-full w-full rounded-full bg-transparent border-2 border-white border-b-gray-600 animate-spin"></div>
            </div>
          )}
        </button>
      )}
    </>
  );
}

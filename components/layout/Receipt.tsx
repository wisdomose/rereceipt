import Image from "next/image";
import Link from "next/link";
import { DOC } from "../../types";

type ReceiptProps = Pick<DOC, "img" | "name"> & { href: string };

export default function Receipt({ name, img, href }: ReceiptProps) {
  return (
    <Link
      href={href}
      className="group bg-white shadow-md text-center hover:shadow-slate-500/50 focus:shadow-slate-500/50 focus:outline-none"
    >
      <div key={name}>
        <div className="w-full h-44 overflow-hidden object-cover relative">
          <Image
            src={img}
            alt={name}
            className="w-full object-cover object-top"
            quality={70}
            fill
          />
        </div>
        <p className="py-2 group-hover:font-semibold group-focus:font-semibold capitalize">
          {name}
        </p>
      </div>
    </Link>
  );
}

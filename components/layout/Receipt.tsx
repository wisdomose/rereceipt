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
      <div className="w-full aspect-square overflow-hidden object-cover relative">
        <Image
          src={img}
          alt={name}
          className="w-full object-cover object-top"
          quality={70}
          fill
        />
      </div>
    </Link>
  );
}

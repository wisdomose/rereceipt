import Image from "next/image";
import Link from "next/link";
import { DOC } from "../../types";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { findReceipt } from "../../utils";

type ReceiptProps = Pick<DOC, "img" | "template_name" | "data"> & {
  href: string;
};

export default function Receipt({ template_name, href, data }: ReceiptProps) {
  const ref = useRef(null);
  const [img, setImg] = useState("");
  const receipt = findReceipt(template_name);
  const { Image: Mg } = receipt ?? {};

  const Imgg = Mg && <Mg ref={ref} data={data} />;
  const options = { quality: 1, pixelRatio: 2 };

  useEffect(() => {
    if (Mg && ref?.current) {
      toPng(ref.current, options).then(function (dataUrl) {
        setImg(dataUrl);
      });
    }
  }, [Mg]);

  return (
    <Link
      href={href}
      className="group bg-white shadow-md text-center hover:shadow-slate-500/50 focus:shadow-slate-500/50 focus:outline-none"
    >
      <div className="w-full aspect-square overflow-hidden object-cover relative">
        <div className="absolute bottom-full">{Imgg}</div>
        {img && (
          <Image
            src={img}
            alt=""
            className="w-full object-cover object-top"
            quality={70}
            fill
          />
        )}
      </div>
    </Link>
  );
}

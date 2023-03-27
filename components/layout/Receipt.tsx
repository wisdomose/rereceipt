import Link from "next/link";
import { DOC } from "../../types";
import { useRef, useState, useEffect } from "react";
import { toSvg } from "html-to-image";
import { findReceipt } from "../../utils";

type ReceiptProps = Pick<DOC, "img" | "template_name" | "data"> & {
  href: string;
};

export default function Receipt({ template_name, href, data }: ReceiptProps) {
  const ref = useRef(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState("");
  const receipt = findReceipt(template_name);
  const { Image: Mg } = receipt ?? {};

  const Imgg = Mg && <Mg ref={ref} data={data} />;
  const options = { quality: 1, pixelRatio: 2 };

  useEffect(() => {
    if (Mg && ref?.current) {
      // toCanvas(ref.current, options).then(function (dataUrl) {
      //   ref2.current && ref2.current.appendChild(dataUrl);
      //   // setImg(dataUrl);
      // });

      toSvg(ref.current, options).then(function (dataUrl) {
        if (ref2.current) {
          ref2.current.style.backgroundImage = `url('${dataUrl}')`;
          ref2.current.style.backgroundSize = `100%`;
          ref2.current.style.backgroundRepeat = `no-repeat`;
        }
      });
    }
  }, [Mg]);

  return (
    <Link
      href={href}
      className="group bg-white shadow-md text-center hover:shadow-slate-500/50 focus:shadow-slate-500/50 focus:outline-none"
    >
      <div className="w-full aspect-square overflow-hidden object-cover relative" ref={ref2}>
        <div className="absolute bottom-full">{Imgg}</div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import img from "../src/img/assets/404.png";
import Link from "next/link";

export default function F04() {
  return (
    <div className="h-full grid place-items-center text-[#4F4F4F]">
      <div className="h-fit w-full">
        <div className="relative w-full sm:w-1/2 md:w-1/3 mx-auto aspect-square">
          <Image src={img} alt="" fill />
        </div>
        <p className="text-sm max-w-[402] text-center">
          return to{" "}
          <Link href="/" className="font-semibold underline">
            homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

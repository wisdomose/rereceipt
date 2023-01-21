import { Popover } from "@headlessui/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { FiMenu, FiSettings } from "react-icons/fi";
import receipts from "../receipts";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "../receipts/types";

export default function Home() {
  return (
    <>
      <nav className="bg-black/80 flex justify-between items-center h-14 box-border max-w-screen">
        <button className="text-gray-50  hover:bg-gray-50/10 focus:bg-gray-50/10 h-full w-14 flex items-center justify-center focus:ring-0 focus:outline-none">
          <FiMenu className="text-2xl" />
        </button>

        <p className="bg-gray-200 text-xs px-2 rounded-full mr-5">
          0.0.0 - BETA
        </p>
      </nav>
      <main className="max-w-7xl mx-auto">
        <div className="p-6 sm:p-10">
          <p className="font-bold">POS</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {receipts
              .filter((receipt) => receipt.default.category === CATEGORIES.POS)
              .map((receipt) => (
                <Receipt receipt={receipt.default} />
              ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <p className="font-bold">RECEIPTS</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {receipts
              .filter(
                (receipt) => receipt.default.category === CATEGORIES.RECEIPT
              )
              .map((receipt) => (
                <Receipt receipt={receipt.default} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Receipt({ receipt }: { receipt: typeof receipts[number]["default"] }) {
  return (
    <Link
      href={"/editor/alpine?receipt=" + receipt.name}
      className="group bg-white shadow-md text-center hover:shadow-slate-500/50 focus:shadow-slate-500/50 focus:outline-none"
    >
      <div key={receipt.name}>
        <div className="w-full h-24 overflow-hidden object-cover">
          <Image
            src={receipt.img}
            alt={receipt.name}
            className="w-full"
            quality={70}
          />
        </div>
        <p className="py-2 group-hover:font-semibold group-focus:font-semibold capitalize">
          {receipt.name}
        </p>
      </div>
    </Link>
  );
}

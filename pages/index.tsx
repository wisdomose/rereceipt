import receipts from "../receipts";
import Image from "next/image";
import Link from "next/link";
import Page from "../components/layout/Page";
import { DOC_TYPES } from "../types";

export default function Home() {
  return (
    <Page isProtected={true} active="dashboard">
      {/* <Page.Nav></Page.Nav> */}
      <Page.Body>
        <div className="px-1 py-6 sm:p-10">
          <p className="font-bold">POS</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {receipts
              .filter((receipt) => receipt.default.category === DOC_TYPES.POS)
              .map((receipt) => (
                <Receipt receipt={receipt.default} key={receipt.default.name} />
              ))}
          </div>
        </div>

        <div className="px-1 py-6 sm:p-10">
          <p className="font-bold">RECEIPTS</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {receipts
              .filter(
                (receipt) => receipt.default.category === DOC_TYPES.RECEIPT
              )
              .map((receipt) => (
                <Receipt receipt={receipt.default} key={receipt.default.name} />
              ))}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}

function Receipt({ receipt }: { receipt: typeof receipts[number]["default"] }) {
  return (
    <Link
      href={"/editor/alpine?receipt=" + receipt.name}
      className="group bg-white shadow-md text-center hover:shadow-slate-500/50 focus:shadow-slate-500/50 focus:outline-none"
    >
      <div key={receipt.name}>
        <div className="w-full h-44 overflow-hidden object-cover">
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

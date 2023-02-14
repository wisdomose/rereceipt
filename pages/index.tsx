import receipts from "../receipts";
import Image from "next/image";
import Link from "next/link";
import Page from "../components/layout/Page";
import { DOC, DOC_TYPES } from "../types";
import { getAllActiveReceipts } from "../utils/firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const [receiptReceipts, setReceiptReceipts] = useState<
    Pick<DOC, "id" | "img" | "name" | "type">[]
  >([]);
  const [posReceipts, setPosReceipts] = useState<
    Pick<DOC, "id" | "img" | "name" | "type">[]
  >([]);
  useEffect(() => {
    getAllActiveReceipts().then((a) => {
      setReceiptReceipts(a.receipts);
      setPosReceipts(a.pos);
    });
  }, []);

  return (
    <Page isProtected={true} active="dashboard">
      {/* <Page.Nav></Page.Nav> */}
      <Page.Body>
        <>
          {posReceipts.length > 0 && (
            <div className="px-1 py-6 sm:p-10">
              <p className="font-bold">POS</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                {posReceipts && (
                  <>
                    {posReceipts
                      .filter((route) => route.type === DOC_TYPES.POS)
                      .map((route) => (
                        <Receipt {...route} key={route.id} />
                      ))}
                  </>
                )}
              </div>
            </div>
          )}

          {receiptReceipts.length > 0 && (
            <div className="px-1 py-6 sm:p-10">
              <p className="font-bold">RECEIPTS</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                {receiptReceipts && (
                  <>
                    {receiptReceipts
                      .filter((route) => route.type === DOC_TYPES.RECEIPT)
                      .map((route) => (
                        <Receipt {...route} key={route.id} />
                      ))}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      </Page.Body>
    </Page>
  );
}

function Receipt({ name, img, id }: Pick<DOC, "id" | "img" | "name" | "type">) {
  return (
    <Link
      href={"/editor/alpine?receipt=" + id}
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

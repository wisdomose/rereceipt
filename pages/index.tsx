import receipts from "../receipts";
import Image from "next/image";
import Link from "next/link";
import Page from "../components/layout/Page";
import { DOC, DOC_TYPES } from "../types";
import { getAllActiveTemplates } from "../utils/firebase";
import { useEffect, useState } from "react";
import Receipt from "../components/layout/Receipt";

export default function Home() {
  const [receiptReceipts, setReceiptReceipts] = useState<
    Pick<DOC, "id" | "img" | "name" | "type">[]
  >([]);
  const [posReceipts, setPosReceipts] = useState<
    Pick<DOC, "id" | "img" | "name" | "type">[]
  >([]);
  useEffect(() => {
    getAllActiveTemplates().then((a) => {
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
                        <Receipt
                          href={"/editor/alpine?receipt=" + route.id}
                          {...route}
                          key={route.id}
                        />
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
                        <Receipt
                          href={"/editor/alpine?receipt=" + route.id}
                          {...route}
                          key={route.id}
                        />
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

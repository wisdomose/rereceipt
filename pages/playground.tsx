import Page from "../components/layout/Page";
import { DOC, DOC_TYPES } from "../types";
import { useEffect, useState } from "react";
import Receipt from "../components/layout/Receipt";
import Loader from "../components/layout/Loader";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
import Template from "../res/Template";
import useFetcher from "../hooks/useFetcher";
import Rereceipt from "../res/Rereceipt";

export default function Playground() {
  // const [open, setOpen] = useState(getRandomBoolean());
  const [receiptReceipts, setReceiptReceipts] = useState<
    Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[]
  >([]);
  const [posReceipts, setPosReceipts] = useState<
    Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[]
  >([]);
  // const { loggedIn, loading, paid, trial, paidLoading } = useUser();
  const router = useRouter();
  // const [loadingTemplates, setLoadingTemplates] = useState(false);
  const rereceipt = new Rereceipt();
  const template = rereceipt.template;

  const { wrapper, loading, data, error } = useFetcher<{
    receipts: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
    pos: Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[];
  }>();

  useEffect(() => {
    (async function () {
      template && await wrapper(template.getAllActiveTemplates)
    })()
  }, [template])

  useEffect(() => {
    if (!data) return;
    console.log(data, loading)
    setReceiptReceipts(data.receipts);
    setPosReceipts(data.pos);
  }, [data])

  // const onClose = () => setOpen(false);

  if (loading)
    return (
      <Page isProtected>
        {/* <PaidProtected open={open}> */}
        <Loader />
        {/* </PaidProtected> */}
      </Page>
    );

  return (
    <Page isProtected>
      {/* <PaidProtected open={open}> */}
      {/* <Page.Nav></Page.Nav> */}
      <Page.Body>
        <>
          <div className="py-10">
            <motion.h3
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0, type: "spring" }}
              className="text-3xl font-medium"
            >
              Pick Template
            </motion.h3>
            <motion.p
              className="text-sm"
              initial={{ x: "-10%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              select a template to start creating your receipt
            </motion.p>
          </div>
          {loading ? (
            <div className="my-14 flex items-center justify-center">
              <Spinner />
            </div>
          ) : posReceipts.length > 0 || receiptReceipts.length > 0 ? (
            <>
              {posReceipts.length > 0 && (
                <div className="px-1 py-6 sm:p-10">
                  <p className="font-bold">POS</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
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
                // <div className="px-1 py-6 sm:p-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
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
                // </div>
              )}
            </>
          ) : posReceipts.length == 0 || receiptReceipts.length == 0 ? (
            <div className="my-14 text-center text-gray-500">
              <motion.p
                initial={{ y: "10%", scale: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                No templates found
              </motion.p>
            </div>
          ) : (
            <div className="my-14 text-center text-gray-500">
              <motion.p
                initial={{ y: "10%", scale: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              >
                An error occured fetching templates
              </motion.p>
            </div>
          )}

          {/* sub expired */}
        </>
      </Page.Body>
      {/* </PaidProtected> */}
    </Page>
  );
}

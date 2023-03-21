import Page from "../components/layout/Page";
import { DOC, DOC_TYPES } from "../types";
import { getAllActiveTemplates } from "../utils/firebase";
import { useEffect, useState } from "react";
import Receipt from "../components/layout/Receipt";
import { Dialog } from "@headlessui/react";
import party from "../src/img/assets/celebration.png";
import Image from "next/image";
import Button from "../components/button";
import useUser from "../store/user/useUser";
import Loader from "../components/layout/Loader";
import { useRouter } from "next/router";
import PaidProtected from "../components/layout/PaidProtected";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
function getRandomBoolean() {
  // Generate a random number between 1 and 100
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  // Return true if the random number is 1-5
  return randomNumber <= 5;
}

export default function Playground() {
  const [open, setOpen] = useState(getRandomBoolean());
  const [receiptReceipts, setReceiptReceipts] = useState<
    Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[]
  >([]);
  const [posReceipts, setPosReceipts] = useState<
    Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[]
  >([]);
  const { loggedIn, loading, paid, trial, paidLoading } = useUser();
  const router = useRouter();
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (paid || trial || (!loggedIn && open)) setLoadingTemplates(true);
    getAllActiveTemplates()
      .then((a) => {
        setReceiptReceipts(a.receipts);
        setPosReceipts(a.pos);
      })
      .finally(() => {
        setLoadingTemplates(false);
      });
  }, [paid, trial, open, loggedIn, paidLoading]);

  useEffect(() => {
    if (!loading && !loggedIn && !open) {
      router.replace("/no-access");
    }
  }, [loggedIn, open, loading]);

  const onClose = () => setOpen(false);

  if (loading)
    return (
      <Page>
        <PaidProtected open={open}>
          <Loader />
        </PaidProtected>
      </Page>
    );

  return (
    <Page>
      <PaidProtected open={open}>
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
            {loadingTemplates ? (
              <div className="my-14 flex items-center justify-center">
                <Spinner />
              </div>
            ) : posReceipts.length > 0 || receiptReceipts.length > 0 ? (
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
                  // <div className="px-1 py-6 sm:p-10">
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

            {/* free trial prompt - if you are not logged in and you are given a free trial */}
            <Dialog
              open={!loggedIn && open}
              onClose={onClose}
              className="relative z-50"
            >
              <Dialog.Backdrop className="fixed inset-0 bg-black/10 backdrop-blur-md" />
              <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-square relative flex flex-col items-center justify-center px-6 py-10 isolate">
                  <div className="absolute w-full h-1/2 top-0 -z-10">
                    <Image
                      src={party}
                      alt=""
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <h3 className="font-semibold text-3xl">Congratulations</h3>
                  <p className="text-center text-lg pt-4 pb-9 max-w-[358px]">
                    You now have access to one free trial for the day
                  </p>
                  <Button label="Awesome!" onClick={onClose} />
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* sub expired */}
          </>
        </Page.Body>
      </PaidProtected>
    </Page>
  );
}

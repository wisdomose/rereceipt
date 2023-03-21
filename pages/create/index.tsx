import Page from "../../components/layout/Page";
import { DOC, DOC_TYPES } from "../../types";
import { getAllActiveTemplates, getAllTemplates } from "../../utils/firebase";
import { useEffect, useState } from "react";
import Receipt from "../../components/layout/Receipt";
import { Dialog } from "@headlessui/react";
import party from "../../src/img/assets/celebration.png";
import Image from "next/image";
import Button from "../../components/button";
import useUser from "../../store/user/useUser";
import Loader from "../../components/layout/Loader";
import { useRouter } from "next/router";
import PaidProtected from "../../components/layout/PaidProtected";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
function getRandomBoolean() {
  // Generate a random number between 1 and 100
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  // Return true if the random number is 1-5
  return randomNumber <= 5;
}

export default function CreateListAll() {
  const [open, setOpen] = useState(getRandomBoolean());
  const [docs, setDocs] = useState<
    Pick<DOC, "id" | "img" | "template_name" | "type" | "data">[]
  >([]);
  const { loggedIn, loading, user } = useUser();
  const router = useRouter();
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    if (loading || !loggedIn) return;
    setLoadingTemplates(true);
    getAllTemplates()
      .then((a) => {
        setDocs(a);
      })
      .finally(() => {
        setLoadingTemplates(false);
      });
  }, [open, loggedIn]);

  useEffect(() => {
    if (
      (!loading && !loggedIn && !open) ||
      (user && user.email !== "wisdomose05@gmail.com")
    ) {
      router.replace("/no-access");
    }
  }, [loggedIn, open, loading, user]);

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
      <Page.Body>
        <>
          <div className="py-10 flex justify-between">
            <div>
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

            <Button label="Create" href="/create/create" />
          </div>
          {loadingTemplates ? (
            <div className="my-14 flex items-center justify-center">
              <Spinner />
            </div>
          ) : docs.length > 0 ? (
            <div className="px-1 py-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <>
                  {docs.map((route) => (
                    <Receipt
                      href={"/create/" + route.id}
                      {...route}
                      key={route.id}
                    />
                  ))}
                </>
              </div>
            </div>
          ) : docs.length == 0 ? (
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
        </>
      </Page.Body>
    </Page>
  );
}

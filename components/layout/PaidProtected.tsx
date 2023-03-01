import { ReactElement, useEffect, useState } from "react";
import useUser from "../../store/user/useUser";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import Button from "../button";
import loadingImg from "../../src/img/assets/loading.png";
import Loader from "./Loader";

export default function PaidProtected({
  children,
  open = false,
}: {
  children: ReactElement;
  open?: boolean;
}) {
  const { loggedIn, loading, paid, trial, paidLoading } = useUser();
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const [noAccess, setNoAccess] = useState(true);

  useEffect(() => {
    if (((!paid && !trial && loggedIn) || (!loggedIn && !open)) && !loading) {
      setNoAccess(true);
      setInitialized(true);
    } else {
      setInitialized(true);
      setNoAccess(false);
    }
  }, [paid, trial, open, loggedIn, paidLoading, loading]);

  const onSubClose = () => router.push("/billing");

  if (loading || !initialized) {
    return <Loader />;
  }

  return (
    <>
      <Dialog
        open={noAccess && !loading && initialized}
        onClose={() => {}}
        className="relative z-50"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-black/10 backdrop-blur-md" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-auto relative flex flex-col items-center justify-center px-6 py-10 isolate">
            <div className="relative w-1/3 aspect-square">
              <Image
                src={loadingImg}
                alt=""
                fill
                className="object-cover object-top"
              />
            </div>

            <h3 className="font-semibold text-3xl text-center pt-2">
              Subscription required
            </h3>
            <p className="text-center text-lg pt-4 pb-9 max-w-[358px]">
              you currently do not have an active subscription to access this
              page
            </p>
            <Button label="Upgrade" onClick={onSubClose} />
          </Dialog.Panel>
        </div>
      </Dialog>
      {!noAccess && !loading && initialized && <>{children}</>}
    </>
  );
}

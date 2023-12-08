import Page from "../components/layout/Page";
import { useState, useEffect } from "react";
import { SAVED } from "../types";
import Link from "next/link";
import Receipt from "../components/layout/Receipt";
import Loader from "../components/layout/Loader";
import oops from "../src/img/assets/oops.png";
import Image from "next/image";
import useUser from "../store/user/useUser";
import useFetcher from "../hooks/useFetcher";
import Rereceipt from "../res/Rereceipt";

export default function Saved() {
  const [saved, setSaved] = useState<SAVED[]>([]);
  const { loading } = useUser();
  const [count, setCount] = useState<number | undefined>(undefined);
  const { spaces } = useUser();
  const { template } = new Rereceipt()

  const { wrapper: savedTemplatesWrapper, data: savedTemplatesData, loading: savedTemplatesLoading } = useFetcher<SAVED[]>();
  const { wrapper: countTemplatesWrapper, data: countTemplatesData, loading: countTemplatesLoading } = useFetcher<number>();

  useEffect(() => {
    if (loading) return;
    template && savedTemplatesWrapper(template.getAllSavedTemplates)
    template && countTemplatesWrapper(template.countNoOfSavedTemplates)

    // const auth = getAuth();
    // onAuthStateChanged(auth, (user) => {
    //   if (!user) return;
    //   getAllSavedTemplates(user.uid)
    //     .then((res) => {
    //       setSaved(res);
    //     })
    //     .catch((err) => {})
    //     .finally(() => {
    //       setLoading(false);
    //     });
    //   countNoOfSavedTemplates(user.uid).then((res) => {
    //     setCount(res);
    //   });
    // });
  }, [loading]);

  useEffect(() => {
    if (!savedTemplatesData) return;

    setSaved(savedTemplatesData)
  }, [savedTemplatesData])

  useEffect(() => {
    if (!countTemplatesData) return;

    setCount(countTemplatesData)
  }, [countTemplatesData])

  if (savedTemplatesLoading || countTemplatesLoading)
    return (
      <Page isProtected>
        <Page.Body>
          <Loader />
        </Page.Body>
      </Page>
    );
  return (
    <Page isProtected>
      <Page.Body>
        {!savedTemplatesLoading && saved.length > 0 ? (
          <>
            <div className="py-10 border-b border-b-gray-300 flex justify-between gap-14 items-center">
              <div>
                <h3 className="text-3xl font-medium capitalize">
                  Saved templates
                </h3>
                <p className="text-sm">pick up from where you last stopped</p>
              </div>

              {spaces > 0 ? (
                <p>
                  {count}/{spaces} slots used
                </p>
              ) : (
                <p>{count} slot{(count ?? 0) > 1 ? "s" : ""} used</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
              {saved?.map((saved) => (
                <Receipt
                  href={`/editor/saved/alpine?receipt=${saved.id}`}
                  {...saved}
                  key={saved.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-full grid place-items-center text-[#4F4F4F]">
            <div className="h-fit w-full">
              <div className="relative w-full sm:w-1/2 md:w-1/3 mx-auto aspect-square">
                <Image alt="" src={oops} className="" fill />
              </div>
              <h3 className="text-3xl font-medium text-center">Oops!</h3>
              <p className="text-sm max-w-[402] text-center">
                You do not have any saved templates.
                <br />
                try{" "}
                <Link href="/playground" className="font-semibold underline">
                  creating
                </Link>{" "}
                one
              </p>
            </div>
          </div>
        )}
      </Page.Body>
    </Page>
  );
}

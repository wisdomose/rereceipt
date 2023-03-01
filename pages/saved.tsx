import Page from "../components/layout/Page";
import { useState, useEffect } from "react";
import {
  countNoOfSavedTemplates,
  getAllSavedTemplates,
} from "../utils/firebase";
import { SAVED } from "../types";
import Link from "next/link";
import Receipt from "../components/layout/Receipt";
import Loader from "../components/layout/Loader";
import oops from "../src/img/assets/oops.png";
import Image from "next/image";

export default function Saved() {
  const [saved, setSaved] = useState<SAVED[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    getAllSavedTemplates()
      .then((res) => {
        setSaved(res);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
    countNoOfSavedTemplates().then((res) => {
      setCount(res);
    });
  }, []);

  if (loading) return <Loader />;
  return (
    <Page isProtected>
      <Page.Body>
        {saved && saved.length > 0 ? (
          <>
            <div className="py-10 border-b border-b-gray-300 flex justify-between gap-14 items-center">
              <div>
                <h3 className="text-3xl font-medium capitalize">
                  Saved templates
                </h3>
                <p className="text-sm">pick up from where you last stopped</p>
              </div>

              <p>{count}/5 slots used</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
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
          <div className="h-full grid place-items-center">
            <div className="relative w-1/4 aspect-square">
              <Image alt="" src={oops} className="" fill />
            </div>
            <h3 className="text-3xl font-medium">Oops!</h3>
            <p className="text-sm max-w-[402px] text-center">
              You do not have any saved templates.
              <br />
              try{" "}
              <Link href="/playground" className="font-semibold underline">
                creating
              </Link>{" "}
              one
            </p>
          </div>
        )}
      </Page.Body>
    </Page>
  );
}

import Page from "../components/layout/Page";
import { useState, useEffect } from "react";
import { getAllSavedTemplates } from "../utils/firebase";
import { SAVED } from "../types";
import Link from "next/link";
import Receipt from "../components/layout/Receipt";

export default function Saved() {
  // If undefined, it means no user
  const [saved, setSaved] = useState<SAVED[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSavedTemplates()
      .then((res) => {
        setSaved(res);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>loading</p>;

  if (saved === undefined) return <p>login to view saved documents</p>;

  return (
    <Page isProtected>
      <Page.Body>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {saved?.map((saved) => (
            <Receipt
              href={`/editor/saved/alpine?receipt=${saved.id}`}
              {...saved}
              key={saved.id}
            />
          ))}
        </div>
      </Page.Body>
    </Page>
  );
}

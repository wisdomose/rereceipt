import { useRouter } from "next/router";
import Page from "../components/layout/Page";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, []);

  return (
    <Page>
      <Page.Body>
        <p>homepage</p>
      </Page.Body>
    </Page>
  );
}

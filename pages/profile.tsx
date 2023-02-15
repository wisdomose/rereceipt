import Page from "../components/layout/Page";
import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/firebase";

export default function Profile() {
  const [user, setUser] = useState<Record<string, any>>({});

  useEffect(() => {
    const user = fetchCurrentUser();

    if (user) {
      setUser(user);
    } else {
    }
  }, []);
  return (
    <Page isProtected>
      <Page.Body>
        <div></div>
      </Page.Body>
    </Page>
  );
}

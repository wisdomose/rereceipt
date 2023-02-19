import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../../utils/firebase";

export const UserContext = createContext<{}>({});

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user.uid).then((data) => {
          data && setUser(data);
        });
      } else {
      }
    });
  }, []);
  const value = { user };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

import {
  IdTokenResult,
  User,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../../utils/firebase";

export const UserContext = createContext<{
  user: (User & Record<string, any>) | null;
  loading: boolean;
  loggedIn: boolean;
}>({
  user: null,
  loading: true,
  loggedIn: false,
});

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<(User & Record<string, any>) | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user.uid).then((data) => {
          data && setUser({ ...data, ...user });
        });
        setLoggedIn(true);
        setLoading(false);
      } else {
        setLoggedIn(false);
        setLoading(false);
      }
    });
  }, []);
  const value = { user, loading, loggedIn };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

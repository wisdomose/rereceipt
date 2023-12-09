import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../../utils/firebase";
import parser from "cron-parser";
import { Timestamp } from "firebase/firestore";
import Rereceipt from "../../res/Rereceipt";

export const UserContext = createContext<{
  user: (User & Record<string, any>) | null;
  loading: boolean;
  loggedIn: boolean;
  spaces: number;
}>({
  user: null,
  loading: true,
  loggedIn: false,
  spaces: 0,
});

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { auth } = new Rereceipt();
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // 0 loading
  // 5 basic
  // 20 standard
  // -1 unlimited
  const [spaces, setSpaces] = useState(0);


  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user);
      setLoggedIn(state => !!user);
      setLoading(false)
    })
  }, [user]);

  const value = { user, loading, loggedIn, spaces };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

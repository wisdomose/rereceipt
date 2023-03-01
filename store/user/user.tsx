import {
  IdTokenResult,
  User,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../../utils/firebase";
import useSubscriptions from "../../hooks/useSubscriptions";
import parser from "cron-parser";
import { Timestamp } from "firebase/firestore";

export const UserContext = createContext<{
  user: (User & Record<string, any>) | null;
  loading: boolean;
  loggedIn: boolean;
  trial: boolean;
  paid: boolean;
  paidLoading: boolean;
}>({
  user: null,
  loading: true,
  loggedIn: false,
  paid: false,
  trial: false,
  paidLoading: true,
});

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<(User & Record<string, any>) | null>(null);
  const { subscription } = useSubscriptions(user?.billing);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [trial, setTrial] = useState(false);
  const [paidLoading, setPaidLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user.uid).then((data) => {
          setUser({ ...data, ...user });
        });
        setLoggedIn(true);
        setLoading(false);
      } else {
        setLoggedIn(false);
        setLoading(false);
        setPaidLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setPaidLoading(true);
    const trial =
      new Timestamp(user.trial_ends_in.seconds, user.trial_ends_in.nanoseconds)
        .toDate()
        .getTime() > Date.now();
    setTrial(trial);

    if (subscription) {
      const p = parser.parseExpression(subscription.cron_expression);
      const future = p.next().toDate().getTime();
      const now = new Date().getTime();
      const paid = future > now;
      setPaid(paid);
      setTrial(paid ? false : trial);
    }

    setPaidLoading(false);
  }, [user, subscription]);

  const value = { user, loading, loggedIn, paid, trial, paidLoading };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

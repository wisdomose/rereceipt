import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../../utils/firebase";
import useSubscriptions, {
  SUBSCRIPTION_STATUS,
} from "../../hooks/useSubscriptions";
import parser from "cron-parser";
import { Timestamp } from "firebase/firestore";

export const UserContext = createContext<{
  user: (User & Record<string, any>) | null;
  loading: boolean;
  loggedIn: boolean;
  trial: boolean;
  paid: boolean;
  paidLoading: boolean;
  spaces: number;
}>({
  user: null,
  loading: true,
  loggedIn: false,
  paid: false,
  trial: false,
  paidLoading: true,
  spaces: 0,
});

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<(User & Record<string, any>) | null>(null);
  const { subscription, subscriptionLoading } = useSubscriptions(user?.billing);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [trial, setTrial] = useState(false);
  const [paidLoading, setPaidLoading] = useState(true);
  // 0 loading
  // 5 basic
  // 20 standard
  // -1 unlimited
  const [spaces, setSpaces] = useState(0);

  async function updateUser(user: User) {
    await fetchUserDetails(user.uid)
      .then((data) => {
        setUser({ ...user, ...data });
      })
      .catch((err) => {});
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateUser(user);
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
    if (!user || subscriptionLoading || !subscription) return;
    setPaidLoading(true);
    const trial =
      new Timestamp(user.trial_ends_in.seconds, user.trial_ends_in.nanoseconds)
        .toDate()
        .getTime() > Date.now();
    setTrial(trial);

    if (subscription) {
      // set paid or trial
      const p = parser.parseExpression(subscription.cron_expression);
      const future = p.next().toDate().getTime();
      const now = new Date().getTime();
      const paid = future > now;
      setPaid(paid);
      setTrial(paid ? false : trial);

      // set storage spaces based on the type
      const space =
        subscription.plan.name === "basic"
          ? 5
          : subscription.plan.name === "standard"
          ? 20
          : subscription.plan.name === "premium"
          ? -1
          : 0;

      setSpaces(space);
    }

    setPaidLoading(false);
  }, [user, subscription, subscriptionLoading]);

  const value = { user, loading, loggedIn, paid, trial, paidLoading, spaces };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

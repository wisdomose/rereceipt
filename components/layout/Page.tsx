import { ReactElement, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import NavBar from "./NavBar";
import Loader from "./Loader";
import { overrideTailwindClasses } from "tailwind-override";

export const routes = [
  {
    label: "playground",
    href: "/playground",
    secured: false,
    showOnLogIn: true,
  },
  {
    label: "pricing",
    href: "/pricing",
    secured: false,
    showOnLogIn: true,
  },
  {
    label: "saved",
    href: "/saved",
    secured: true,
    showOnLogIn: true,
  },
  {
    label: "profile",
    href: "/profile",
    secured: true,
    showOnLogin: true,
  },
  {
    label: "billing",
    href: "/billing",
    secured: true,
    showOnLogIn: true,
  },
  {
    label: "login",
    href: "/auth/login",
    secured: false,
    showOnLogIn: false,
  },
];

type Props = {
  children: ReactElement | ReactElement[];
  className?: string;
};
type PageProps = Props & {
  isProtected?: boolean;
  active?: typeof routes[number]["label"];
};

export default function Page({ isProtected = false, ...props }: PageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && isProtected && !user) {
      router.replace("/no-access");
    }
  }, [loading, user, isProtected]);

  if (loading) return <Loader />;
  return (
    <>
      <NavBar isLoggedIn={!!user} user={user} />
      {props.children}
    </>
  );
}

Page.Body = function Body({ className = "", children }: Props) {
  return (
    <main
      className={overrideTailwindClasses(
        `max-w-7xl mx-auto px-6 pb-6 md:pb-14 md:px-14 ${className}`
      )}
    >
      {children}
    </main>
  );
};

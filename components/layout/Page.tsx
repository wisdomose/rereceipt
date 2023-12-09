import { ReactElement, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import NavBar from "./NavBar";
import Loader from "./Loader";
import { overrideTailwindClasses } from "tailwind-override";
import Footer from "./footer";
import User from "../../res/User";
import Firebase from "../../res/Firebase";
import Rereceipt from "../../res/Rereceipt";
import useUser from "../../store/user/useUser";

export const routes = [
  {
    label: "playground",
    href: "/playground",
    secured: true,
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
  const { loading, loggedIn } = useUser();

  useEffect(() => {
    if (!loading && !loggedIn && isProtected) {
      router.replace("/no-access");
    }
  }, [loading, loggedIn, isProtected]);

  if (loading || !loggedIn && isProtected) return <Loader />;

  return (
    <>
      <NavBar />
      {props.children}
      <Footer />
    </>
  );
}

Page.Body = function Body({ className = "", children }: Props) {
  return (
    <>
      <main
        className={overrideTailwindClasses(
          `max-w-7xl mx-auto px-6 pb-6 md:pb-14 md:px-14 ${className}`
        )}
      >
        {children}
      </main>
    </>
  );
};

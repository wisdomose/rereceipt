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

export default function Page(props: PageProps) {
  return (
    <Protected {...props}>
      {({ user, loading }) => {
        if (loading) return <Loader />;

        return (
          <>
            <NavBar isLoggedIn={!!user} user={user} />
            {props.children}
          </>
        );
      }}
    </Protected>
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

export function Protected(
  props: Pick<PageProps, "isProtected"> & {
    children: (props: { user: User | null; loading: boolean }) => ReactElement;
  }
) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // redirect if no user is loggedin
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
        props.isProtected && router.replace("/no-access");
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && props.isProtected && !user) {
      props.isProtected && router.replace("/no-access");
    }
  }, [loading]);

  return <>{props.children({ user, loading })}</>;
}

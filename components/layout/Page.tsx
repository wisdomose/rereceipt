import { ReactElement, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import {
  FiDollarSign,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { logoutUser } from "../../utils/firebase";
import { User } from "firebase/auth";
import { BiSave } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import useWidth from "../../hooks/useWidth";
import logo from "../../src/img/icons/logo.png";
import NavBar from "./NavBar";
import Loader from "./Loader";

export const routes = [
  {
    label: "dashboard",
    href: "/playground",
    icon: RxDashboard,
    protected: false,
  },
  // {
  //   label: "templates",
  //   href: "/templates",
  //   icon: BiBrush,
  //   protected: true,
  // },
  {
    label: "saved",
    href: "/saved",
    icon: BiSave,
    protected: true,
  },
  {
    label: "profile",
    href: "/profile",
    icon: FiUser,
    protected: true,
  },
  {
    label: "billing",
    href: "/billing",
    icon: FiDollarSign,
    protected: true,
  },
  {
    label: "login",
    href: "/auth/login",
    icon: FiLogIn,
    protected: false,
  },
  // {
  //   label: "signup",
  //   href: "/auth/signup",
  //   icon: FiUserPlus,
  //   protected: false,
  // },
] as const;

const version = "0.0.0 - BETA";

type Props = {
  children: ReactElement | ReactElement[];
};
type PageProps = Props & {
  isProtected?: boolean;
  active?: typeof routes[number]["label"];
};

export default function Page(props: PageProps) {
  return (
    <Protected {...props}>
      {({ user, loading }) => {
        if ((props.isProtected && !user) || loading) return <Loader />;

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

// small screen menu or logged out menu
const Nav = (props: Pick<PageProps, "active"> & { loggedIn: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const width = useWidth();
  const toggleIsOpen = () => setIsOpen((s) => !s);

  return (
    <>
      <nav className="bg-black/80 flex justify-between items-center h-14 box-border max-w-screen">
        <Link href="/" className="flex items-center justify-center w-14 h-full">
          <img
            src={logo.src}
            alt="Logo"
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* links */}
        <div className="hidden md:flex">
          {routes.map((route) => {
            const showProtected = props.loggedIn
              ? true
              : route.protected
              ? false
              : true;
            return !showProtected ? null : (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center text-white w-full px-6 py-4 ${
                  props?.active === route.label
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <route.icon className="w-6 h-auto" />
                <span className="inline-block ml-2 capitalize text-base">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>

        {width < 768 && (
          <button
            className="text-gray-50 hover:bg-gray-50/10 focus:bg-gray-50/10 h-full w-14 flex items-center justify-center focus:ring-0 focus:outline-none"
            onClick={toggleIsOpen}
          >
            <FiMenu className="text-2xl" />
          </button>
        )}

        {/* <button onClick={logoutUser} className="text-gray-50  mr-5">
          <FiLogOut className="text-xl" />
        </button> */}
      </nav>

      {/* side content */}
      {isOpen && (
        <div className="fixed bg-black/80 h-full top-0 w-[300px] z-20">
          {/* close btn */}
          <button
            onClick={toggleIsOpen}
            className="text-white bg-black/80 absolute right-0 translate-x-full p-4 pl-2 rounded-tr-full rounded-br-full translate-y-1/2"
          >
            <FiX className="h-4 w-4" />
          </button>

          {/* links */}
          {props.loggedIn ? (
            <>
              {routes.map((route) => (
                <>
                  {!route.protected ? null : (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`flex items-center text-white w-full px-6 py-4 ${
                        props?.active === route.label
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <route.icon className="w-6 h-auto" />
                      <span className="inline-block ml-2 capitalize text-base">
                        {route.label}
                      </span>
                    </Link>
                  )}
                </>
              ))}
            </>
          ) : (
            <>
              {routes.map((route) => (
                <>
                  {route.protected ? null : (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`flex items-center text-white w-full px-6 py-4 ${
                        props?.active === route.label
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <route.icon className="w-6 h-auto" />
                      <span className="inline-block ml-2 capitalize text-base">
                        {route.label}
                      </span>
                    </Link>
                  )}
                </>
              ))}
            </>
          )}

          {/* footer */}
          <div className="absolute bottom-6 w-full">
            {props.loggedIn && (
              <button
                className={`flex items-center justify-center text-white w-full px-6 py-4 hover:bg-white/10`}
                onClick={logoutUser}
              >
                <FiLogOut />
                <span className="inline-block ml-2 capitalize text-base">
                  logout
                </span>
              </button>
            )}
            <p className="text-xs text-white/50 text-center">{version}</p>
          </div>
        </div>
      )}

      {/* backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-10"
          onClick={toggleIsOpen}
        ></div>
      )}
    </>
  );
};

Page.Body = function Body(props: Props) {
  return (
    <main className="max-w-[1512px] mx-auto px-6 pb-6 md:pb-14">{props.children}</main>
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
    });

    setLoading(false);
  }, []);

  return <>{props.children({ user, loading })}</>;
}

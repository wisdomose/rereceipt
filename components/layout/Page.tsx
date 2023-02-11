import { ReactElement, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import {
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { logoutUser } from "../../utils/firebase";
import { User } from "firebase/auth";
import { BiBrush, BiSave } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import useWidth from "../../hooks/useWidth";
import logo from "../../src/img/icons/logo.png";

const routes = [
  {
    label: "dashboard",
    href: "/",
    icon: RxDashboard,
    protected: true,
  },
  {
    label: "templates",
    href: "/templates",
    icon: BiBrush,
    protected: true,
  },
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
    label: "login",
    href: "/auth/login",
    icon: FiLogIn,
    protected: false,
  },
  {
    label: "signup",
    href: "/auth/signup",
    icon: FiUserPlus,
    protected: false,
  },
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const width = useWidth();

  // redirect if no user is loggedin
  useEffect(() => {
    if (props.isProtected) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(auth.currentUser);
        } else {
          router.replace("/auth/login");
        }
      });
    }
  }, []);

  if (props.isProtected && !user) return null;
  // at least md for side menu and logged in
  else if (props.isProtected && width > 768 && user) {
    return (
      <div className="h-full grid grid-cols-[300px,1fr]">
        <nav className="bg-black/80 h-full flex flex-col items-start py-6 relative">
          <div className="px-6 mb-6">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="dp"
                className="rounded-full h-24 w-24"
              />
            ) : (
              <FiUser className="rounded-full h-24 w-24 text-white bg-white/10" />
            )}
            <p className="text-white mt-3">{user?.displayName ?? "no name"}</p>
          </div>

          {routes.map((route) => (
            <>
              {route.protected ? (
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
              ) : null}
            </>
          ))}

          <div className="absolute bottom-6 w-full">
            <button
              className={`flex items-center justify-center text-white w-full px-6 py-4 hover:bg-white/10`}
              onClick={logoutUser}
            >
              <FiLogOut />
              <span className="inline-block ml-2 capitalize text-base">
                logout
              </span>
            </button>
            <p className="text-xs text-white/50 text-center">{version}</p>
          </div>
        </nav>

        <main>{props.children}</main>
      </div>
    );
  }

  return (
    <>
      <Nav loggedIn={!!user} />
      {props.children}
    </>
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
  return <main className="max-w-7xl mx-auto px-4">{props.children}</main>;
};

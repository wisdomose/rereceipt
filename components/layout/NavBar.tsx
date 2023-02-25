import Link from "next/link";
import { routes } from "./Page";
import { FiLogOut, FiUser } from "react-icons/fi";
import { logoutUser } from "../../utils/firebase";
import logoDark from "../../src/img/icons/logo.png";
import Image, { StaticImageData } from "next/image";
import useUser from "../../store/user/useUser";
import { Menu } from "@headlessui/react";
import { User } from "firebase/auth";

const version = "0.0.0 - BETA";

export default function NavBar({
  isLoggedIn,
  user,
  logo = logoDark,
}: {
  isLoggedIn: boolean;
  user?: User | null;
  logo?: StaticImageData;
}) {
  return (
    <nav className="flex justify-between items-center py-5 px-14 relative">
      {/* logo */}
      <Link
        href="/"
        className="flex items-center justify-center relative overflow-hidden w-8 h-8"
      >
        <Image
          src={logo}
          alt="Logo"
          className="w-full object-contain object-top"
          fill
        />
      </Link>

      <div className="flex items-center font-semibold text-[#4F4F4F] text-sm gap-14">
        <div className="flex items-center font-semibold text-[#4F4F4F] text-sm gap-14">
          <Link
            href="/playground"
            className="capitalize group focus:outline-none"
          >
            playground
            <div className="h-[2px] w-full rounded-full relative overflow-hidden">
              <div className="h-full w-0 bg-[rgb(59_130_246_/_0.5)] group-hover:w-full group-focus:w-full  duration-150"></div>
            </div>
          </Link>
          {isLoggedIn && (
            <>
              {routes.map((route) => (
                <>
                  {route.protected ? (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="capitalize group focus:outline-none"
                    >
                      {route.label}
                      <div className="h-[2px] w-full rounded-full relative overflow-hidden">
                        <div className="h-full w-0 bg-[rgb(59_130_246_/_0.5)]  group-hover:w-full group-focus:w-full duration-150"></div>
                      </div>
                    </Link>
                  ) : null}
                </>
              ))}
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link href="/auth/login" className="capitalize group">
                login
                <div className="h-[2px] w-full rounded-full relative overflow-hidden">
                  <div className="h-full w-0 bg-[rgb(59_130_246_/_0.5)] group-hover:w-full group-focus:w-full  duration-150"></div>
                </div>
              </Link>
              <button className="border border-[#4F4F4F] rounded-lg py-2 px-3">
                Create account
              </button>
            </>
          )}
        </div>

        {isLoggedIn && (
          <Menu>
            <div className="relative">
              <Menu.Button className="relative rounded-full overflow-hidden h-8 w-8">
                {user?.photoURL ? (
                  <Image
                    fill
                    src={user.photoURL}
                    alt="dp"
                    className="object-cover"
                  />
                ) : (
                  <FiUser className="rounded-full h-8 w-8 object-contain object-center text-[#4f4f4f] bg-white/10" />
                )}
              </Menu.Button>
              <Menu.Items
                className={`absolute top-full right-0 bg-white shadow-md translate-y-[10%] list-none z-20`}
              >
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <li>
                      <button
                        className={`flex items-center justify-center w-full px-6 py-4 ${
                          active ? "text-[rgb(59_130_246_/_0.8)]" : ""
                        }`}
                        onClick={logoutUser}
                      >
                        <FiLogOut />
                        <span className="inline-block ml-2 capitalize text-xs font-normal">
                          logout
                        </span>
                      </button>
                    </li>
                  )}
                </Menu.Item>
              </Menu.Items>
            </div>
          </Menu>
        )}
      </div>
    </nav>
  );
}

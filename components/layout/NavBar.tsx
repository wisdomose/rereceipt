import Link from "next/link";
import { routes } from "./Page";
import { FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";
import { logoutUser } from "../../utils/firebase";
import logoDark from "../../src/img/icons/logo.png";
import Image, { StaticImageData } from "next/image";
import useUser from "../../store/user/useUser";
import { Dialog, Menu, Popover } from "@headlessui/react";
import { User } from "firebase/auth";
import { useState } from "react";
import { motion } from "framer-motion";

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
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="flex justify-between items-center py-5 px-6 md:px-14 relative">
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

        <div className="flex items-center font-semibold text-[#4F4F4F] text-sm gap-6 md:gap-14">
          {/* medium screen and above */}
          <div className="hidden md:flex items-center font-semibold text-[#4F4F4F] text-sm gap-14">
            <>
              {routes
                .filter((a) =>
                  isLoggedIn ? a.showOnLogIn || a.secured : !a.secured
                )
                .map((route, index) => (
                  <motion.div
                    key={route.href}
                    initial={{ y: "-200%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.5 }}
                  >
                    <Link
                      href={route.href}
                      className="capitalize group focus:outline-none"
                    >
                      {route.label}
                      <div className="h-[2px] w-full rounded-full relative overflow-hidden">
                        <div className="h-full w-0 bg-[rgb(59_130_246_/_0.5)]  group-hover:w-full group-focus:w-full duration-150"></div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </>

            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/signup"
                  className="border border-[#4F4F4F] rounded-lg py-2 px-3"
                >
                  Create account
                </Link>
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
                      sizes="96px"
                    />
                  ) : (
                    <FiUser className="rounded-full text-lg object-contain object-center text-[#4f4f4f] bg-white/10" />
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

          <Popover className="relative z-50 md:hidden flex items-center justify-center">
            {({ open }: { open: boolean }) => (
              <>
                <Popover.Button>
                  <FiMenu className="text-lg" />
                </Popover.Button>

                {open && (
                  <>
                    <Popover.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md" />
                    <div className="fixed max-h-[calc(100vh_-_154px)] h-auto left-6 right-6 top-[77px] flex items-center justify-center">
                      <Popover.Panel
                        className="bg-white h-full w-full overflow-hidden rounded-xl  relative flex flex-col items-start justify-start isolate pb-3"
                        static
                      >
                        {/* header */}
                        <div className="flex px-6 pb-3 pt-6 justify-between w-full">
                          <p></p>
                          <Popover.Button className="border p-2 rounded-md">
                            <FiX className="text-[rgb(229, 231, 235)]" />
                          </Popover.Button>
                        </div>
                        {/* {isLoggedIn && ( */}
                        <>
                          {routes
                            .filter((a) =>
                              isLoggedIn
                                ? a.showOnLogIn || a.secured
                                : !a.secured
                            )
                            .map((route) => (
                              <Popover.Button
                                as={Link}
                                key={route.href}
                                href={route.href}
                                className="capitalize group focus:outline-none px-6 py-3 w-full focus:bg-[rgb(59_130_246_/_0.1)] focus:text-[rgb(59_130_246_/_0.7)]"
                              >
                                {route.label}
                              </Popover.Button>
                            ))}
                        </>
                        {/* )} */}

                        {!isLoggedIn && (
                          <>
                            <Popover.Button
                              as={Link}
                              href="/auth/signup"
                              className="border border-[#4F4F4F] rounded-lg py-2 px-3 mx-6 my-3 w-[calc(100%_-_48px)] text-center "
                            >
                              Create account
                            </Popover.Button>
                          </>
                        )}
                      </Popover.Panel>
                    </div>
                  </>
                )}
              </>
            )}
          </Popover>
        </div>
      </nav>
    </div>
  );
}

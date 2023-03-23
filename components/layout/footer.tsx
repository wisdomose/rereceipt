import { FiMail, FiPhoneCall } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import logoDark from "../../src/img/icons/logo.png";
import Image from "next/image";
import Link from "next/link";
import { capsFirst } from "../../utils";

const routes = [
  {
    label: "contact",
    href: "/contact",
  },
  {
    label: "pricing",
    href: "/pricing",
  },
];

const support = [
  {
    label: "support@rereceipt.cc",
    icon: <FiMail />,
  },
  {
    label: "support@rereceipt.cc",
    icon: <FiMail />,
  },
  {
    label: "support@rereceipt.cc",
    icon: <FiMail />,
  },
];
export default function Footer() {
  return (
    <footer className="flex flex-col items-center bg-white/40">
      <div className="w-full py-[50px]">
        <div className="max-w-7xl mx-auto flex flex-wrap flex-col sm:flex-row px-6 gap-10 w-full justify-around ">
          <div>
            <div className="flex items-center gap-3">
              <Image src={logoDark} alt="" width={50} />
              <span className="font-bold capitalize text-xl">Rereceipt</span>
            </div>
            <p className="max-w-[30ch] mt-3 leading-7">
              Effortlessly design and export professional-looking receipts and
              invoices with ease
            </p>
          </div>
          <div>
            <p className="text-black font-bold capitalize text-lg mb-5">
              quick links
            </p>
            <ul className="flex flex-col gap-3">
              {routes.map((route) => (
                <li
                  key={route.label}
                  className="flex items-center gap-[2px] text-gray1"
                >
                  <Link href={route.href} className="group">
                    {capsFirst(route.label)}
                    <div className="h-[2px] w-full rounded-full relative overflow-hidden">
                      <div className="h-full w-0 bg-[rgb(59_130_246_/_0.5)]  group-hover:w-full group-focus:w-full duration-150"></div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-black font-bold capitalize text-lg mb-5">
              support
            </p>
            <ul>
              <li className="flex items-center gap-1 text-gray1">
                <FiMail />
                <a
                  href="mailto:support@rereceipt.cc"
                  onFocus={(e) => {
                    e.target.classList.toggle("grad__text");
                  }}
                  onMouseOver={(e) => {
                    // @ts-ignore
                    e.target.classList.add("grad__text");
                  }}
                  onMouseLeave={(e) => {
                    // @ts-ignore
                    e.target.classList.remove("grad__text");
                  }}
                  onBlur={(e) => {
                    e.target.classList.remove("grad__text");
                  }}
                >
                  support@rereceipt.cc
                </a>
              </li>
              <li className="flex items-center gap-1 text-gray1 my-3">
                <BsWhatsapp />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wa.me/+2349039392400"
                  onFocus={(e) => {
                    e.target.classList.toggle("grad__text");
                  }}
                  onMouseOver={(e) => {
                    // @ts-ignore
                    e.target.classList.add("grad__text");
                  }}
                  onMouseLeave={(e) => {
                    // @ts-ignore
                    e.target.classList.remove("grad__text");
                  }}
                  onBlur={(e) => {
                    e.target.classList.remove("grad__text");
                  }}
                >
                  +2349039392400
                </a>
              </li>
              <li className="flex items-center gap-1 text-gray1">
                <FiPhoneCall />
                <a
                  href="tel:+2349039392400"
                  onFocus={(e) => {
                    e.target.classList.toggle("grad__text");
                  }}
                  onMouseOver={(e) => {
                    // @ts-ignore
                    e.target.classList.add("grad__text");
                  }}
                  onMouseLeave={(e) => {
                    // @ts-ignore
                    e.target.classList.remove("grad__text");
                  }}
                  onBlur={(e) => {
                    e.target.classList.remove("grad__text");
                  }}
                >
                  +2349039392400
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-7xl mx-auto flex w-full justify-around border-t border-t-gray4 py-[30px] ">
          {/* <div className="w-full border-t border-t-gray4 py-[30px] "> */}
          <p className="">
            &copy; 2023 <span>Rereceipt</span> - all rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

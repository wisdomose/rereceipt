import { useRouter } from "next/router";
import Page from "../components/layout/Page";
import { useEffect, useRef, useState } from "react";
import receipt_illustrations from "../src/img/assets/receipt-illustration.png";
import Image from "next/image";
import Button from "../components/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const features = [
  {
    heading: "Pick a template",
    content: "Choose from our suite of well crafted receipts to begin",
    color: "bg-pattern-red",
  },
  {
    heading: "Customize it",
    content: "Change the look and feel to suit your needs. OWN IT",
    color: "bg-pattern-orange",
  },
  {
    heading: "export",
    content: "Export to a wide range of formats png, jpeg, svg, pdf",
    color: "bg-pattern-purple",
  },
];

const features2 = [
  {
    icon: (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.9425 5.95001C32.2094 5.28339 30.2906 5.28339 28.5575 5.95001L19.905 9.27501C19.1973 9.54692 18.5887 10.0269 18.1593 10.6518C17.73 11.2766 17.5001 12.0169 17.5 12.775V15.5275C18.3301 15.423 19.1699 15.423 20 15.5275V12.7775C19.9997 12.5249 20.076 12.2781 20.2189 12.0696C20.3617 11.8612 20.5643 11.701 20.8 11.61L29.455 8.28251C30.6104 7.83809 31.8896 7.83809 33.045 8.28251L41.6975 11.61C41.9332 11.701 42.1358 11.8612 42.2786 12.0696C42.4215 12.2781 42.4978 12.5249 42.4975 12.7775V32.2275C42.4973 32.4797 42.4207 32.726 42.2779 32.9339C42.1352 33.1418 41.9328 33.3017 41.6975 33.3925L34.9975 35.97V37.2275C34.9975 37.7375 34.9375 38.2375 34.8175 38.7175L42.595 35.7275C43.3027 35.4556 43.9113 34.9756 44.3407 34.3507C44.77 33.7259 44.9999 32.9856 45 32.2275V12.775C44.9999 12.0169 44.77 11.2766 44.3407 10.6518C43.9113 10.0269 43.3027 9.54692 42.595 9.27501L33.9425 5.95001ZM40.2275 13.2375C40.1084 12.9283 39.8714 12.679 39.5685 12.5444C39.2657 12.4099 38.9218 12.4011 38.6125 12.52L31.6975 15.18C31.4086 15.2911 31.0889 15.2911 30.8 15.18L23.885 12.52C23.7309 12.4562 23.5656 12.4239 23.3988 12.425C23.232 12.4261 23.0671 12.4606 22.9138 12.5264C22.7606 12.5922 22.622 12.688 22.5064 12.8082C22.3907 12.9283 22.3002 13.0704 22.2404 13.2261C22.1805 13.3818 22.1523 13.5478 22.1576 13.7146C22.1629 13.8813 22.2015 14.0452 22.2711 14.1968C22.3407 14.3484 22.44 14.4845 22.563 14.5971C22.686 14.7097 22.8304 14.7965 22.9875 14.8525L29.9025 17.5125C30.7691 17.8458 31.7284 17.8458 32.595 17.5125L39.51 14.8525C39.8192 14.7334 40.0685 14.4964 40.2031 14.1935C40.3376 13.8907 40.3464 13.5468 40.2275 13.2375ZM27.7275 25.7375C27.6084 25.4283 27.3714 25.179 27.0685 25.0444C26.7657 24.9099 26.4218 24.9011 26.1125 25.02L18.75 27.8525L11.385 25.02C11.0754 24.901 10.7311 24.9099 10.428 25.0447C10.1249 25.1794 9.88777 25.4291 9.76875 25.7388C9.64973 26.0484 9.6586 26.3926 9.79339 26.6957C9.92818 26.9988 10.1779 27.236 10.4875 27.355L17.5 30.05V36.275C17.5 36.6065 17.6317 36.9245 17.8661 37.1589C18.1005 37.3933 18.4185 37.525 18.75 37.525C19.0815 37.525 19.3995 37.3933 19.6339 37.1589C19.8683 36.9245 20 36.6065 20 36.275V30.05L27.01 27.3525C27.3192 27.2334 27.5685 26.9964 27.7031 26.6935C27.8376 26.3907 27.8464 26.0468 27.7275 25.7375ZM21.4425 18.45C19.7094 17.7834 17.7906 17.7834 16.0575 18.45L7.405 21.775C6.69732 22.0469 6.08867 22.5269 5.65933 23.1518C5.22998 23.7766 5.0001 24.5169 5 25.275V37.225C5.0001 37.9831 5.22998 38.7234 5.65933 39.3482C6.08867 39.9731 6.69732 40.4531 7.405 40.725L16.055 44.055C17.7889 44.7223 19.7086 44.7223 21.4425 44.055L30.095 40.7275C30.8022 40.4552 31.4103 39.975 31.8392 39.3502C32.2681 38.7254 32.4976 37.9853 32.4975 37.2275V25.2775C32.4976 24.5197 32.2681 23.7796 31.8392 23.1548C31.4103 22.53 30.8022 22.0498 30.095 21.7775L21.4425 18.45ZM16.955 20.7825C18.1104 20.3381 19.3896 20.3381 20.545 20.7825L29.1975 24.11C29.4332 24.201 29.6358 24.3612 29.7786 24.5696C29.9215 24.7781 29.9978 25.0249 29.9975 25.2775V37.2275C29.9973 37.4797 29.9207 37.726 29.7779 37.9339C29.6352 38.1418 29.4328 38.3017 29.1975 38.3925L20.545 41.725C19.3896 42.1694 18.1104 42.1694 16.955 41.725L8.3 38.3925C8.06508 38.3019 7.86301 38.1424 7.72027 37.9349C7.57752 37.7275 7.50074 37.4818 7.5 37.23V25.28C7.49974 25.0274 7.57604 24.7806 7.71885 24.5721C7.86167 24.3637 8.06429 24.2035 8.3 24.1125L16.955 20.785V20.7825Z"
          fill="black"
        />
      </svg>
    ),
    header: "Multiple files supported",
    content: "export receipts in jpeg, png, svg, pdf format",
  },
  {
    icon: (
      <svg
        width="51"
        height="50"
        viewBox="0 0 51 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.17517 1.98368C6.18337 1.97557 4.26531 2.3577 2.53259 3.20126C12.8062 6.15653 21.3213 11.5039 28.7407 18.3411C27.7663 13.8745 24.794 9.80301 20.9892 6.83915C19.9011 7.65458 18.2817 7.66971 16.9701 6.91239C15.6613 6.15653 14.8676 4.74999 15.0261 3.40282C12.7615 2.50077 10.4221 1.99286 8.17498 1.98368H8.17517ZM18.0995 2.63065C17.5902 2.64686 17.1702 2.87235 16.9733 3.21346C16.6372 3.79569 16.9196 4.77352 17.8857 5.33143C18.8519 5.88934 19.8386 5.6451 20.1748 5.06288C20.5107 4.48065 20.2314 3.49979 19.2652 2.94178C18.9029 2.7328 18.5362 2.63827 18.2032 2.63065C18.1686 2.62967 18.1335 2.62948 18.0997 2.63065H18.0995ZM13.8759 9.84803L3.60056 27.6551C4.18376 28.4806 4.87917 29.0506 6.05417 29.126L16.354 11.2764C15.5698 10.7578 14.7427 10.2824 13.8759 9.84803ZM32.8973 10.4584L31.1975 11.5111L30.1995 18.0206L33.941 12.2468L32.8973 10.4584ZM19.1919 16.4857L17.0587 17.8009L18.4625 19.4917L26.8762 19.0278L19.1919 16.4858V16.4857ZM39.6753 16.5527L39.3061 16.6656L21.6211 22.1252L21.2549 22.2412L21.0781 22.583L16.9459 30.6763L16.5919 31.3721L17.2237 31.8299L38.3692 47.1863L39.3581 47.9034L39.7639 46.7501L48.4127 22.1954L48.672 21.463L47.9885 21.0909L40.0143 16.739L39.6755 16.5528L39.6753 16.5527ZM39.477 18.5242L45.6567 21.8994L39.2143 23.8861L35.9675 19.6075L39.4769 18.5242H39.477ZM34.1089 20.1812L37.3589 24.4598L27.7461 27.4261L28.0176 22.061L34.109 20.1811L34.1089 20.1812ZM26.1621 22.6348L25.8906 28L19.3261 30.0264L22.5275 23.7578L26.1623 22.6348H26.1621ZM45.9375 23.7213L39.5625 41.8273L39.9593 25.5676L45.9376 23.7213H45.9375ZM38.1191 26.1353L37.7222 42.3951L28.0726 29.2389L38.119 26.1353H38.1191ZM26.2262 29.8065L36.1201 43.2982L20.1349 31.6894L26.2262 29.8066V29.8065Z"
          fill="black"
        />
      </svg>
    ),
    header: "Simple and intuitive editor",
    content: "export receipts in jpeg, png, svg, pdf format",
  },
  {
    icon: (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40.375 9.125V15.375H9.125V9.125H40.375ZM40.375 6H9.125C8.2962 6 7.50134 6.32924 6.91529 6.91529C6.32924 7.50134 6 8.2962 6 9.125V15.375C6 16.2038 6.32924 16.9987 6.91529 17.5847C7.50134 18.1708 8.2962 18.5 9.125 18.5H40.375C41.2038 18.5 41.9987 18.1708 42.5847 17.5847C43.1708 16.9987 43.5 16.2038 43.5 15.375V9.125C43.5 8.2962 43.1708 7.50134 42.5847 6.91529C41.9987 6.32924 41.2038 6 40.375 6ZM15.375 24.75V40.375H9.125V24.75H15.375ZM15.375 21.625H9.125C8.2962 21.625 7.50134 21.9542 6.91529 22.5403C6.32924 23.1263 6 23.9212 6 24.75V40.375C6 41.2038 6.32924 41.9987 6.91529 42.5847C7.50134 43.1708 8.2962 43.5 9.125 43.5H15.375C16.2038 43.5 16.9987 43.1708 17.5847 42.5847C18.1708 41.9987 18.5 41.2038 18.5 40.375V24.75C18.5 23.9212 18.1708 23.1263 17.5847 22.5403C16.9987 21.9542 16.2038 21.625 15.375 21.625ZM40.375 24.75V40.375H24.75V24.75H40.375ZM40.375 21.625H24.75C23.9212 21.625 23.1263 21.9542 22.5403 22.5403C21.9542 23.1263 21.625 23.9212 21.625 24.75V40.375C21.625 41.2038 21.9542 41.9987 22.5403 42.5847C23.1263 43.1708 23.9212 43.5 24.75 43.5H40.375C41.2038 43.5 41.9987 43.1708 42.5847 42.5847C43.1708 41.9987 43.5 41.2038 43.5 40.375V24.75C43.5 23.9212 43.1708 23.1263 42.5847 22.5403C41.9987 21.9542 41.2038 21.625 40.375 21.625Z"
          fill="black"
        />
      </svg>
    ),
    header: "Flexible templates",
    content: "highly customizable templates",
  },
];

export default function Home() {
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let position = 0;

    const interval = setInterval(() => {
      if (ref.current === null) return;
      position += 1;
      ref.current.style.backgroundPositionX = position + "px";
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home__container">
      <Page>
        {/* <Page.Body > */}
        <header className="grid lg:grid-cols-[535px,1fr] place-items-center min-h-[calc(100vh_-_78px)] px-6 md:px-14 max-w-7xl mx-auto">
          <motion.div
            className="relative lg:hidden h-full grid place-items-center"
            animate={{
              scale: [0, 1, 0.1, 1],
              rotate: [0, 10, -10, 5, -5, 0],
            }}
            transition={{
              scale: {
                type: "spring",
              },
              rotate: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 3,
              },
            }}
          >
            <Image src={receipt_illustrations} alt="" className="bg-cover" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="text-5xl leading-[60px] md:leading-[70px] md:text-6xl 6xl:text-7xl font-bold 6xl:leading-[85px] grad__text"
            >
              The Only Receipt Generation Tool You’ll Ever Need
            </motion.h1>
            <motion.p
              initial={{ x: "200%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xl leading-9 mt-5 text-[#4F4F4F]"
            >
              Say goodbye to manual receipts and hello to effortless
              record-keeping with our all-in-one receipt generation tool
            </motion.p>
            <motion.div
              initial={{ x: "200%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Button label="Get Started" className="rounded-full mt-7" />
            </motion.div>
          </div>
          <motion.div
            className="relative hidden overflow-hidden lg:grid h-full place-items-center"
            animate={{
              scale: [0, 1, 0.1, 1],
              rotate: [0, 10, -10, 5, -5, 0],
            }}
            transition={{
              scale: {
                type: "spring",
              },
              rotate: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 3,
              },
            }}
          >
            <Image src={receipt_illustrations} alt="" className="bg-cover" />
          </motion.div>
        </header>

        <section className="section-bg px-6 md:px-14 pt-20 pb-40" ref={ref}>
          <h4 className="text-3xl leading-10 font-bold text-center text-[#4F4F4F]">
            How Does Rereceipt Work?
          </h4>
          <p className="max-w-[575px] mx-auto text-center text-xl leading-9 text-[#4F4F4F]px-14">
            Effortlessly design and export professional-looking receipts with
            our customizable templates
          </p>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 justify-between gap-14 mt-14 max-w-7xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.heading} {...feature} />
            ))}
          </div>
        </section>

        <section className="pb-14 relative md:px-14 px-6">
          <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-14 lg:grid-cols-3 items-start">
            {features2.map((feature) => (
              <Card2 key={feature.header} {...feature} />
            ))}
          </div>

          <div className="mt-[220px] mb-14 flex flex-col items-center gap-9">
            <p className="text-3xl leading-10 font-bold text-center text-[#4F4F4F] max-w-[964px] mx-auto">
              Start your risk-free trial today! No credit card needed.
            </p>
            <p className="text-xl">Join now and unlock 7 days of unlimited access</p>
            <Button
              label="Get Started"
              className="rounded-full mx-auto block"
              href="/billing"
            />
          </div>
        </section>
        {/* </Page.Body> */}
      </Page>
    </div>
  );
}

export function Card2(props: typeof features2[number]) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    isInView && setInitialized(true);
  }, [isInView]);

  return (
    <div className="lg:max-w-[253px]" ref={ref}>
      {props.icon}
      <p
        className="text-xl font-semibold my-5"
        ref={ref}
        style={{
          transform: initialized ? "none" : "translateX(-50px)",
          opacity: initialized ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        {props.header}
      </p>
      <p
        style={{
          transform: initialized ? "none" : "translateX(-200px)",
          opacity: initialized ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        {props.content}
      </p>
    </div>
  );
}

export function Card(props: typeof features[number]) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    isInView && setInitialized(true);
  }, [isInView]);

  return (
    <div
      ref={ref}
      style={{
        transform: initialized ? "none" : "translateY(200px)",
        opacity: initialized ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
      className={`p-12 text-white w-full ${props.color}`}
    >
      <p className="text-3xl font-semibold">{props.heading}</p>
      <p className="text-xl leading-9 font-light mt-5">{props.content}</p>
    </div>
  );
}

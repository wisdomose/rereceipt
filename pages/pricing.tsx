import { FiCheck, FiX } from "react-icons/fi";
import Page from "../components/layout/Page";
import Button from "../components/button";
import useSubscriptions, {
  Plan,
  Subscription,
} from "../hooks/useSubscriptions";
import Loader from "../components/layout/Loader";
import { useState, useEffect } from "react";
import useUser from "../store/user/useUser";

export const defaultPrices = [
  {
    price: "2,500",
    type: "basic",
    color: "#FCDDEC",
    popular: false,
    active: true,
    options: [
      {
        label: "5 storage spaces",
        included: true,
      },
      {
        label: "variants",
        included: false,
      },
    ],
  },
  {
    price: "4,000",
    type: "standard",
    color: "#C6C6EC",
    popular: true,
    active: true,
    options: [
      {
        label: "20 storage spaces",
        included: true,
      },
      {
        label: "variants",
        included: true,
      },
    ],
  },
  {
    price: "7,000",
    type: "premium",
    color: "#BFF4D5",
    popular: false,
    active: false,
    options: [
      {
        label: "unlimited storage spaces",
        included: true,
      },
      {
        label: "variants",
        included: true,
      },
    ],
  },
];

export type Price = typeof defaultPrices[number] &
  Pick<Plan, "plan_code"> &
  Partial<Pick<Subscription, "email_token" | "status" | "subscription_code">>;

export default function Pricing() {
  const { plans, plansLoading } = useSubscriptions();
  const [prices, setPrices] = useState<Price[]>([]);
  const { loggedIn, loading } = useUser();
  useEffect(() => {
    if (plansLoading) return;
    let p: any[] = [];

    defaultPrices.forEach((price) => {
      const plan = plans.find(
        (plan) => plan.name.toLowerCase() === price.type.toLowerCase()
      );
      if (plan) {
        p.push({
          ...price,
          price: plan.amount,
          plan_code: plan.plan_code,
          email_token: undefined,
          subscription_code: undefined,
          status: undefined,
        });
      }
    });
    setPrices(p);
  }, [plans, plansLoading]);

  if (plansLoading || loading)
    return (
      <Page>
        <Loader />
      </Page>
    );
  return (
    <Page>
      <div className="min-h-[calc(100vh_-_78px)] section-marks">
        <Page.Body>
          <div className="pt-5 md:pt-14">
            <h1 className="text-4xl leading-[50px] sm:text-5xl sm:leading-[70px] md:text-6xl md:leading-[78px] font-bold text-center max-w-[788px] mx-auto text-[#333333]">
              Our pricing is simple with no hidden fees
            </h1>
            <p className="text-xl text-center text-[#333333] pt-4 md:pt-0">
              pricing plans for businesses and individuals
            </p>

            <div className="flex flex-wrap gap-14 justify-center md:justify-center items-end w-full max-w-[1000px] mx-auto pt-14 lg:pt-20">
              {prices.map((price) => (
                <div key={price.type} className="w-full max-w-[276px]">
                  {price.popular && (
                    <div className="bg-black text-center text-[#FAFAFA] rounded-t-xl py-2">
                      Popular
                    </div>
                  )}
                  <div
                    className={`border-2 border-[#333333] px-7 py-10 bg-[#FAFAFA] ${
                      price.popular ? "rounded-b-xl border-t-0" : "rounded-xl"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div
                        className={`w-14 h-14 rounded-lg pricing__style`}
                        style={{ backgroundColor: price.color }}
                      ></div>
                      <div>
                        <p className="text-2xl font-bold capitalize">
                          {price.type}
                        </p>
                        <p>
                          <span className="font-bold">₦{price.price}</span> /
                          mth
                        </p>
                      </div>
                    </div>
                    <ul className="py-7 flex flex-col gap-4">
                      {price.options.map((option) => (
                        <li
                          key={option.label}
                          className="flex gap-4 items-center"
                        >
                          {option.included ? <FiCheck /> : <FiX />}
                          <p>{option.label}</p>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={
                        loggedIn ? `/billing?plan=${price.plan_code}` : "/auth/login"
                      }
                      className="block text-center"
                      label={price.active ? "Get started" : "coming soon"}
                      block
                      disabled={!price.active}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Page.Body>
      </div>
      {/* <Footer /> */}
    </Page>
  );
}

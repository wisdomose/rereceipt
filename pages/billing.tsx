import Head from "next/head";
import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import useInput from "../hooks/useInput";
import Script from "next/script";
import useUser from "../store/user/useUser";
import useSubscriptions, {
  Plan,
  SUBSCRIPTION_STATUS,
  Subscription,
} from "../hooks/useSubscriptions";
import { FiCheck, FiMail, FiX } from "react-icons/fi";
import { BiCreditCard } from "react-icons/bi";
import { dateToString, notify } from "../utils";
import { useCallback, useEffect, useRef, useState } from "react";
import parser from "cron-parser";
import Spinner from "../components/Spinner";
import { Price, defaultPrices } from "./pricing";
import axios from "axios";
import Loader from "../components/layout/Loader";
import { useRouter } from "next/router";

const pad = (v: string | number) => {
  const value = v.toString();
  return value.length == 1 ? "0" + value : value;
};

export default function Billing() {
  const [email, value, updateEmail] = useInput("");
  const { user, loading, trial, paid } = useUser();
  const {
    subscriptions,
    subscription,
    transactions,
    plans,
    plansLoading,
    subscriptionLoading,
    subscriptionsLoading,
    transactionsLoading,
  } = useSubscriptions(user?.billing);
  const timerRef = useRef<HTMLHeadingElement>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const router = useRouter();
  // used to select the plan for first purchase
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  function submit() {
    //@ts-ignore
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      plan: selectedPlan,
      channels: ["card"],

      // add to the billing collection in db since it is sucessful but set confirmed to false
      callback: function (response: any) {
        console.log(response);
        //this happens after the payment is completed successfully
        var reference = response.reference;
        notify("Payment complete! Reference: " + reference);
        // Make an AJAX call to your server with the reference to verify the transaction
        fetch(`/api/verify/${reference}`);
      },
      // onClose: function () {
      //   alert("Transaction was not completed, window closed.");
      // },
    });

    handler.openIframe();
  }

  async function init() {
    await axios("/api/billing/init", {
      method: "POST",
      data: {
        email,
        plan: selectedPlan,
      },
    }).then((res) => {
      console.log(res.data);
      notify(res.data.message);
      if (res.data.status) {
        const a = document.createElement("a");
        a.href = res.data.data.authorization_url;
        a.target = "_blank";
        a.click();
      }
    });
  }

  useEffect(() => {
    if (!subscription) return;

    const timer = timerRef?.current;
    if (subscription && timer !== null) {
      if (
        subscription.status === SUBSCRIPTION_STATUS.NON_RENEWING ||
        subscription.status === SUBSCRIPTION_STATUS.ACTIVE
      ) {
        const interval = setInterval(() => {
          const p = parser.parseExpression(subscription.cron_expression);
          const future = p.next().toDate().getTime();
          const now = new Date().getTime();

          const distance = future - now;

          if (distance < 0) {
            clearInterval(interval);
            timer.innerHTML = `-:-:-:-`;
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            timer.innerHTML = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(
              seconds
            )}`;
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [subscription]);

  useEffect(() => {
    if (plansLoading || subscriptionsLoading) return;
    let p: any[] = [];

    defaultPrices.forEach((price) => {
      const plan = plans.find(
        (plan) => plan.name.toLowerCase() === price.type.toLowerCase()
      );
      if (plan) {
        const sub = subscriptions.find(
          (sub) => sub.plan.plan_code === plan.plan_code
        );
        p.push({
          ...price,
          price: plan.amount,
          plan_code: plan.plan_code,
          email_token: sub?.email_token,
          subscription_code: sub?.subscription_code,
          status: sub?.status,
        });
      }
    });
    setPrices(p);
  }, [plans, subscriptions, subscriptionsLoading, plansLoading]);

  useEffect(() => {
    selectedPlan && router.push(`/billing?plan=${selectedPlan}`);
  }, [selectedPlan]);

  useEffect(() => {
    typeof router.query.plan === "string" && setSelectedPlan(router.query.plan);   
  }, [router.query.plan]);

  useEffect(() => {
    if (user) updateEmail(user.email ?? "");
  }, [user]);

  const enable = useCallback(
    async (code: string, token: string) => {
      if (!subscription) return;

      await axios({
        url: `/api/billing/enable?code=${code}&token=${token}`,
        method: "POST",
      })
        .then((res) => {
          notify(res.data.message);
        })
        .catch((err: any) => {});
    },
    [subscription]
  );

  const disable = useCallback(
    async (code: string, token: string) => {
      if (!subscription) return;
      await axios({
        url: `/api/billing/disable?code=${code}&token=${token}`,
        method: "POST",
      })
        .then((res) => {
          notify(res.data.message);
        })
        .catch((err: any) => {});
    },
    [subscription]
  );

  const create = useCallback(
    async (customer: string, plan: string) => {
      if (!subscription) return;

      await axios({
        url: `/api/billing/create?customer=${customer}&plan=${plan}`,
        method: "POST",
      })
        .then((res) => {
          notify(res.data.message);
        })
        .catch((err: any) => {});
    },
    [subscription]
  );

  const update = useCallback(async () => {
    if (!subscription) return;
    await axios({
      url: `/api/billing/update?code=${subscription.subscription_code}`,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data.link);
      })
      .catch((err: any) => {});
  }, [subscription]);

  const updateSelectedPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  if (loading || !user) return <Loader />;

  return (
    <>
    
      <Page isProtected>
        <Page.Body>
          {/* header */}
          <div className="py-10 border-b border-b-gray-300 flex justify-between gap-14 items-center">
            {/* title */}
            <div className="">
              <h3 className="text-3xl font-medium">Billing</h3>
              <p className="text-sm">manage your subscription here</p>
            </div>
            {/* countdown */}
            <div>
              <p className="text-sm">Next subscription in</p>
              <h3 className="text-3xl font-medium" ref={timerRef}>
                -:-:-:-
              </h3>
            </div>
          </div>

          {/* active card */}
          <>
            {subscriptionLoading ? (
              <div className="my-14 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {subscription ? (
                  <div className="bg-[#333333] flex justify-between p-5 items-start text-[#E0E0E0] font-normal rounded-lg mt-12 w-full sm:w-fit sm:gap-8 mb-14 text-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div>
                        <BiCreditCard className="w-7 h-auto" />
                      </div>
                      <div>
                        <p>
                          Master ending with{" "}
                          <span className="font-semibold">
                            {subscription.authorization.last4}
                          </span>
                        </p>
                        <p>
                          Expiry{" "}
                          <span className="font-semibold">
                            {subscription.authorization.exp_month}/
                            {subscription.authorization.exp_year}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FiMail />
                          <span>{subscription.customer.email}</span>
                        </p>
                      </div>
                    </div>

                    <button className="hover:text-white focus:text-white hover:underline focus:underline">
                      edit
                    </button>
                  </div>
                ) : (
                  <div className="my-14 text-center text-gray-500">
                    <p>You do not have an active subscription</p>
                  </div>
                )}
              </>
            )}
          </>

          {plansLoading || subscriptionsLoading ? (
            <div className="my-14 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex justify-center 2xl:justify-between flex-wrap gap-6">
              {prices.map((price) => {
                const active =
                  subscription?.plan?.plan_code === price.plan_code;
                const firstPurchase = subscriptions.length === 0;
                const hasPurchased = !!price.subscription_code;
                const action = firstPurchase
                  ? () => updateSelectedPlan(price.plan_code)
                  : active
                  ? () =>
                      disable(
                        price.subscription_code as string,
                        price.email_token as string
                      )
                  : hasPurchased
                  ? () =>
                      enable(
                        price.subscription_code as string,
                        price.email_token as string
                      )
                  : !hasPurchased
                  ? () =>
                      create(
                        user.billing.customer_code as string,
                        price.plan_code as string
                      )
                  : undefined;
                return (
                  <div
                    key={price.type}
                    className="border-2 rounded-xl p-6 border-black max-w-[380px] w-full"
                  >
                    <div className="flex flex-col xl:flex-row md:gap-6">
                      <div>
                        <p className="uppercase border-2 border-black rounded-full px-5 w-fit">
                          {price.type}
                        </p>
                        <p className="pt-6 text-4xl">₦{price.price}</p>
                        <p className="pt-6 pb-6 md:pb-0 ">per month</p>
                      </div>

                      <ul className="flex gap-5 flex-col">
                        {price.options.map((option) => (
                          <li
                            key={option.label}
                            className="flex gap-5 items-center"
                          >
                            <div>{option.included ? <FiCheck /> : <FiX />}</div>
                            <p>{option.label}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      label={
                        firstPurchase && selectedPlan === price.plan_code
                          ? "Selected"
                          : price.status === SUBSCRIPTION_STATUS.ACTIVE
                          ? "Disable plan"
                          : active
                          ? price.status ?? "Current plan"
                          : "Upgrade plan"
                      }
                      block
                      className="mt-7"
                      onClick={action}
                      disabled={
                        (firstPurchase && selectedPlan === price.plan_code) ||
                        (price.status !== SUBSCRIPTION_STATUS.ACTIVE && active)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          <>
            {!subscriptionsLoading && subscriptions.length >= 0 && (
              <div>
                <form
                  className="max-w-md mx-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    init();
                  }}
                >
                  <Input
                    {...value}
                    id="email"
                    label="email"
                    placeholder="email"
                    type="email"
                    required
                  />
                  <br />
                  <Button label="pay" type="submit" />
                </form>
              </div>
            )}
          </>

          <div className="py-10 border-b border-b-gray-300">
            <h3 className="text-3xl font-medium">Billing history</h3>
            <p className="text-sm">view previous purchases made by you</p>
          </div>

          {/* billing history */}
          <>
            {transactionsLoading ? (
              <div className="my-14 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {transactions?.length > 0 ? (
                  <div className="mt-14 overflow-hidden">
                    <div className="overflow-auto">
                      <div className="min-w-[500px]">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-start pl-3 py-6">
                                Billing date
                              </th>
                              <th className="text-start py-6">Amount</th>
                              <th className="text-start py-6">Card</th>
                              <th className="text-end py-6 pr-3">Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {transactions.map((transaction) => (
                              <tr className="border-t" key={transaction.id}>
                                <td className="py-6 pl-3">
                                  {transaction.paidAt ? (
                                    <>{dateToString(transaction.paidAt)}</>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="py-6 text-start">
                                  {transaction.currency}{" "}
                                  {transaction.amount / 100}
                                </td>
                                <td className="py-6 text-start">
                                  {transaction.authorization.bin} ......{" "}
                                  {transaction.authorization.last4}
                                </td>
                                <td className="py-6 pr-3 text-end flex justify-end items-center">
                                  <div
                                    className={`text-sm px-4 py-1 border rounded-full w-fit m ${
                                      transaction.status === "success"
                                        ? "border-green-700 text-green-700"
                                        : "border-red-700 text-red-700"
                                    }`}
                                  >
                                    {transaction.status === "success"
                                      ? "paid"
                                      : "error"}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-14 text-center text-gray-500">
                    <p>No transactions yet</p>
                  </div>
                )}
              </>
            )}
          </>

          {/* <div className="my-6">
            
          </div> */}
        </Page.Body>
      </Page>
    </>
  );
}

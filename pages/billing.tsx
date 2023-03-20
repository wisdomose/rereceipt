import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import useInput from "../hooks/useInput";
import useUser from "../store/user/useUser";
import useSubscriptions, {
  SUBSCRIPTION_STATUS,
} from "../hooks/useSubscriptions";
import { FiCheck, FiMail, FiX } from "react-icons/fi";
import { BiCreditCard } from "react-icons/bi";
import { capsFirst, dateToString, notify, openInNewTab } from "../utils";
import { useCallback, useEffect, useRef, useState } from "react";
import parser from "cron-parser";
import Spinner from "../components/Spinner";
import { Price, defaultPrices } from "./pricing";
import axios from "axios";
import Loader from "../components/layout/Loader";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
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
  const [notice, setNotice] = useState<string | null>(null);

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

  const init = useCallback(async () => {
    const plan = plans.find((plan) => plan.plan_code === selectedPlan);
    if (!plan) {
      notify("Select a valid plan");
      return;
    }
    await axios("/api/billing/init", {
      method: "POST",
      data: {
        email,
        plan: selectedPlan,
      },
    })
      .then((res) => {
        if (res.data.status) {
          openInNewTab(res.data.data.authorization_url);
        } else {
          notify(res.data.message);
        }
      })
      .catch((err) => {
        notify(err.message);
      });
  }, [plans, selectedPlan]);

  useEffect(() => {
    if (!subscription) return;

    if (subscription.status === SUBSCRIPTION_STATUS.ATTENTION) {
      setNotice("There was an error billing your account");
    } else if (subscription.status === SUBSCRIPTION_STATUS.NON_RENEWING) {
      setNotice(
        "After this month, you will not have access to your priviledges"
      );
    }

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
            timer.innerHTML = `${pad(days)}d:${pad(hours)}h:${pad(
              minutes
            )}m:${pad(seconds)}s`;
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [subscription]);

  useEffect(() => {
    if (plansLoading || subscriptionLoading) return;
    let p: any[] = [];

    defaultPrices.forEach((price) => {
      const plan = plans.find(
        (plan) => plan.name.toLowerCase() === price.type.toLowerCase()
      );
      if (plan && subscription?.plan.plan_code === plan.plan_code) {
        p.push({
          ...price,
          price: plan.amount,
          plan_code: plan.plan_code,
          email_token: subscription?.email_token,
          subscription_code: subscription?.subscription_code,
          status: subscription?.status,
        });
      } else if (plan) {
        p.push({
          ...price,
          price: plan.amount,
          plan_code: plan.plan_code,
          email_token: "",
          subscription_code: "",
          status: "",
        });
      }
    });
    setPrices(p);
  }, [plans, subscription, subscriptionLoading, plansLoading]);

  useEffect(() => {
    typeof router.query.plan === "string" && setSelectedPlan(router.query.plan);
  }, [router.query.plan]);

  useEffect(() => {
    if (user) updateEmail(user.email ?? "");
  }, [user]);

  const enable = useCallback(async (code: string, token: string) => {
    await axios({
      url: `/api/billing/enable?code=${code}&token=${token}`,
      method: "POST",
    })
      .then((res) => {
        notify(res.data.message);
        router.reload();
      })
      .catch((err: any) => {});
  }, []);

  const disable = useCallback(async (code: string, token: string) => {
    await axios({
      url: `/api/billing/disable?code=${code}&token=${token}`,
      method: "POST",
    })
      .then((res) => {
        notify(res.data.message);
        router.reload();
      })
      .catch((err: any) => {});
  }, []);

  const create = useCallback(
    async (customer: string, plan: string) => {
      await axios({
        url: `/api/billing/create?customer=${customer}&plan=${plan}&id=${
          user?.billing?.id ?? ""
        }`,
        method: "POST",
      })
        .then((res) => {
          notify(res.data.message);
          router.reload();
        })
        .catch((err: any) => {});
    },
    [user]
  );

  const update = useCallback(async () => {
    if (!subscription) return;
    await axios({
      url: `/api/billing/update?code=${subscription.subscription_code}`,
      method: "GET",
    })
      .then((res) => {
        openInNewTab(res.data.link);
      })
      .catch((err: any) => {});
  }, [subscription]);

  const updateSelectedPlan = (plan: string) => {
    setSelectedPlan(plan);
    router.push(`/billing?plan=${selectedPlan}`);
  };

  if (loading)
    return (
      <Page isProtected>
        <Page.Body>
          <Loader />
        </Page.Body>
      </Page>
    );

  if (!user) {
    return (
      <Page isProtected>
        <Page.Body>
          <p>you need to be logged in</p>
        </Page.Body>
      </Page>
    );
  }

  return (
    <>
      <Page isProtected>
        <Page.Body>
          {/* @ts-ignore */}
          <>{notice && <marquee>{notice}</marquee>}</>
          {/* header */}
          <div className="py-10 border-b border-b-gray-300 flex justify-between gap-14 items-center">
            {/* title */}
            <div className="">
              <motion.h3
                initial={{ x: "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0, type: "spring" }}
                className="text-3xl font-medium"
              >
                Billing
              </motion.h3>

              <motion.p
                className="text-sm"
                initial={{ x: "-10%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                manage your subscription here
              </motion.p>
            </div>
            {/* countdown */}
            <div>
              <motion.p
                className="text-sm"
                initial={{ x: "50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0, type: "spring" }}
              >
                {paid
                  ? "Next payment due in"
                  : trial
                  ? "Trial ends in"
                  : "loading..."}
              </motion.p>
              <motion.h3
                className="text-3xl font-medium"
                initial={{ x: "10%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                ref={timerRef}
              >
                -:-:-:-
              </motion.h3>
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
                          {capsFirst(subscription.authorization.card_type)}{" "}
                          ending with{" "}
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

                    <button
                      className="hover:text-white focus:text-white hover:underline focus:underline"
                      onClick={update}
                    >
                      edit
                    </button>
                  </div>
                ) : (
                  <div className="my-14 text-center text-gray-500">
                    <motion.p
                      initial={{ y: "10%", scale: 0, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      You do not have an active subscription
                    </motion.p>
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
            <div className="flex justify-center 2xl:justify-between flex-wrap lg:flex-nowrap gap-6 isolate">
              {prices.map((price, index) => {
                const active =
                  subscription?.plan?.plan_code === price.plan_code;
                const nonRenewing =
                  price?.status === SUBSCRIPTION_STATUS.NON_RENEWING;
                const attention =
                  price?.status === SUBSCRIPTION_STATUS.ATTENTION;
                const completed =
                  price?.status === SUBSCRIPTION_STATUS.COMPLETED;
                const cancelled =
                  price?.status === SUBSCRIPTION_STATUS.CANCELLED;
                const hasPurchased = !!price.subscription_code;
                const firstPurchase = subscriptions.length === 0;

                const action = firstPurchase
                  ? () => updateSelectedPlan(price.plan_code)
                  : active && nonRenewing
                  ? () =>
                      create(
                        user.billing.customer_code as string,
                        price.plan_code as string
                      )
                  : active
                  ? () =>
                      disable(
                        price.subscription_code as string,
                        price.email_token as string
                      )
                  : () =>
                      create(
                        user.billing.customer_code as string,
                        price.plan_code as string
                      );

                return (
                  <motion.div
                    initial={{ y: "10%", scale: 0, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.5, type: "spring" }}
                    key={price.type}
                    className={`border-2 rounded-xl p-6 border-black max-w-[380px] w-full bg-[#FAFAFA] ${
                      active ? "active__pricing" : ""
                    }`}
                  >
                    <div className="flex flex-col xl:flex-row md:gap-6">
                      <div>
                        <div
                          className={`w-fit rounded-full p-[2px] oveflow-hidden ${
                            active ? "grad__border" : "bg-black"
                          }`}
                        >
                          <div className="bg-[#fafafa] rounded-full overflow-hidden ">
                            <p
                              className={`uppercase rounded-full px-5 w-fit ${
                                active ? "grad__text" : ""
                              }`}
                            >
                              {price.type}
                            </p>
                          </div>
                        </div>
                        <p className={`pt-6 text-4xl`}>₦{price.price}</p>
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
                          : firstPurchase
                          ? "Select"
                          : active && nonRenewing
                          ? "Enable plan"
                          : active
                          ? "Disable plan"
                          : nonRenewing
                          ? "Upgrade plan"
                          : "Upgrade plan"
                      }
                      block
                      className="mt-7"
                      onClick={action}
                      disabled={
                        firstPurchase && selectedPlan === price.plan_code
                        // (price.status !== SUBSCRIPTION_STATUS.ACTIVE && active)
                      }
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          <>
            {!subscriptionsLoading &&
              subscriptions.length === 0 &&
              prices.length > 0 && (
                <motion.div
                  className="max-w-[100px] mx-auto mt-14"
                  initial={{ y: "10%", scale: 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                >
                  <Button label="Pay" type="submit" onClick={init} block />
                </motion.div>
              )}
          </>

          <div className="py-10 border-b border-b-gray-300">
            <motion.h3
              className="text-3xl font-medium"
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0, type: "spring" }}
            >
              Billing history
            </motion.h3>
            <motion.p
              className="text-sm"
              initial={{ x: "-10%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              view previous purchases made by you
            </motion.p>
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
                    <motion.p
                      initial={{ y: "10%", scale: 0, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      No transactions yet
                    </motion.p>
                  </div>
                )}
              </>
            )}
          </>
        </Page.Body>
      </Page>
    </>
  );
}

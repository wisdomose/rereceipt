import Head from "next/head";
import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import useInput from "../hooks/useInput";
import Script from "next/script";
import useUser from "../store/user/useUser";
import useSubscriptions, {
  SUBSCRIPTION_STATUS,
} from "../hooks/useSubscriptions";
import { FiMail } from "react-icons/fi";
import { BiCreditCard } from "react-icons/bi";
import { dateToString } from "../utils";
import { useEffect, useRef, useState } from "react";
import parser from "cron-parser";
import Spinner from "../components/Spinner";

const pad = (v: string | number) => {
  const value = v.toString();
  return value.length == 1 ? "0" + value : value;
};

export default function Billing() {
  const [email, value] = useInput("");
  const { user, trial, paid } = useUser();
  const {
    subscriptions,
    subscription,
    transactions,
    subscriptionLoading,
    subscriptionsLoading,
    transactionsLoading,
  } = useSubscriptions(user?.billing);
  const timerRef = useRef<HTMLHeadingElement>(null);

  function submit() {
    //@ts-ignore
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      plan: "PLN_4kq104zdx40zgc8",
      channels: ["card"],

      // add to the billing collection in db since it is sucessful but set confirmed to false
      callback: function (response: any) {
        console.log(response);
        //this happens after the payment is completed successfully
        var reference = response.reference;
        alert("Payment complete! Reference: " + reference);
        // Make an AJAX call to your server with the reference to verify the transaction
        fetch(`/api/verify/${reference}`);
      },
      // onClose: function () {
      //   alert("Transaction was not completed, window closed.");
      // },
    });

    handler.openIframe();
  }

  useEffect(() => {
    if (!subscription) return;

    const timer = timerRef?.current;
    if (subscription && timer !== null) {
      if (subscription.status === SUBSCRIPTION_STATUS.NON_RENEWING) {
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


  return (
    <>
      <Script
        strategy="beforeInteractive"
        crossOrigin=""
        src="https://js.paystack.co/v1/inline.js"
      />
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
                  <div className="bg-[#333333] flex justify-between p-5 items-start text-[#E0E0E0] font-normal rounded-lg mt-12">
                    <div>
                      <p className="text-3xl capitalize">
                        {subscription.plan.name}
                      </p>
                      <p>{subscription.plan.description}</p>

                      <div className="flex items-center gap-6 mt-10">
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

          <>
            {subscriptions.map((subscription) => (
              <div key={subscription.id}>
                <p>{subscription.plan.name}</p>
                <p>{subscription.status}</p>
              </div>
            ))}
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
                  <table className="mt-14 w-full">
                    <thead>
                      <tr>
                        <th className="text-start pl-3 py-6">Billing date</th>
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
                            {transaction.currency} {transaction.amount / 100}
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
                ) : (
                  <div className="my-14 text-center text-gray-500">
                    <p>No transactions yet</p>
                  </div>
                )}
              </>
            )}
          </>

          {/* <div className="my-6">
            <form
              className="max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
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
          </div> */}
        </Page.Body>
      </Page>
    </>
  );
}

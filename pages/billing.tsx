import Head from "next/head";
import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import useInput from "../hooks/useInput";
import Script from "next/script";
import useUser from "../store/user/useUser";
import useSubscriptions from "../hooks/useSubscriptions";
import { FiMail } from "react-icons/fi";
import { BiCreditCard } from "react-icons/bi";

export default function Billing() {
  const [email, value] = useInput("");
  const { user } = useUser();
  const subscriptions = useSubscriptions(user?.billing?.id ?? "");

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
          <div className="py-10 border-b border-b-gray-300 flex justify-between items-center">
            {/* title */}
            <div className="">
              <h3 className="text-3xl font-medium">Billing</h3>
              <p className="text-sm">manage your subscription here</p>
            </div>
            {/* countdown */}
            <div>
              <p className="text-sm">Next subscription in</p>
              <h3 className="text-3xl font-medium">24:30:30</h3>
            </div>
          </div>

          {/* active card */}
          <div className="bg-[#333333] flex justify-between p-5 items-start text-[#E0E0E0] font-normal rounded-lg mt-12">
            <div>
              <p className="text-3xl">Basic</p>
              <p>
                unlimited access to all the beautiful rereceipt has to offer
              </p>

              <div className="flex items-center gap-6 mt-10">
                <div>
                  <BiCreditCard className="w-7 h-auto" />
                </div>
                <div>
                  <p>
                    Master ending with{" "}
                    <span className="font-semibold">3456</span>
                  </p>
                  <p>
                    Expiry <span className="font-semibold">30/456</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiMail />
                    <span>wisdomose05@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
            <button className="hover:text-white focus:text-white hover:underline focus:underline">
              edit
            </button>
          </div>

          <div className="py-10 border-b border-b-gray-300">
            <h3 className="text-3xl font-medium">Billing history</h3>
            <p className="text-sm">view previous purchases made by you</p>
          </div>

          <table className="mt-14 w-full max-w-[532px]">
            <thead>
              <tr>
                <th className="text-start pl-3 py-6">Billing date</th>
                <th className="text-start py-6">Amount</th>
                <th className="text-end py-6 pr-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="py-6 pl-3">Dec, 12 2002</td>
                <td className="py-6 text-start">$40.00</td>
                <td className="py-6 pr-3 text-end flex justify-end items-center">
                  <div className="text-sm px-4 py-1 border border-green-700 text-green-700 rounded-full w-fit m">paid</div>
                </td>
              </tr>
            </tbody>
          </table>

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

import Head from "next/head";
import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import useInput from "../hooks/useInput";
import Script from "next/script";
import useUser from "../store/user/useUser";
import useSubscriptions from "../hooks/useSubscriptions";

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
      {/* <Script crossOrigin="" strategy="beforeInteractive" src="https://js.paystack.co/v1/inline.js" onLoad={()=>("\n\n\nloaded script\n\n\n")} /> */}
      <Page isProtected>
        <Page.Body>
          <div className="my-6">
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
          </div>
        </Page.Body>
      </Page>
    </>
  );
}

import { useEffect, useState } from "react";
import Input from "../../components/input";
import useInput from "../../hooks/useInput";
import google from "../../src/img/icons/google.png";
import logoLight from "../../src/img/icons/logo-light.png";
import loginImg from "../../src/img/assets/login.png";
import {
  loginWithEmail,
  sendResetEmail,
  signUpWithGoogle,
} from "../../utils/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Button from "../../components/button";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/layout/NavBar";
import useWidth from "../../hooks/useWidth";
import { Dialog } from "@headlessui/react";
import { string } from "zod";
import withState from "../../hooks/withState";

export default function Login(p: any) {
  const [email, emailOption] = useInput("");
  const [forgotEmail, forgotEmailOption, updateForgotEmail] = useInput("");
  const [password, passwordOption] = useInput("");
  const router = useRouter();
  const width = useWidth();
  const [open, setOpen] = useState(false);
  const [loadingPasswordReset, setLoadingPasswordReset] = useState(false);
  const { loading, wrapper } = withState();
  const updateOpen = (value: boolean) => setOpen(value);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/playground");
      } else {
      }
    });
  }, []);

  // when the modal is closed, reset the state
  useEffect(() => {
    if (!open) updateForgotEmail("");
  }, [open]);

  async function resetPassword() {
    setLoadingPasswordReset(true);
    await sendResetEmail(forgotEmail);
    setLoadingPasswordReset(false);
  }

  return (
    <>
      <div className="md:absolute w-full z-20">
        <NavBar
          isLoggedIn={false}
          logo={width >= 768 ? logoLight : undefined}
        />
      </div>
      <main className="md:overflow-hidden md:h-screen">
        {/* <Page.Nav></Page.Nav> */}
        {/* <Page.Body> */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] lg:grid-cols-2 md:overflow-hidden md:h-screen">
          <div className="relative w-full overflow-hidden aspect-square md:h-screen">
            <Image
              src={loginImg}
              alt=""
              className="object-cover object-center"
              fill
            />
          </div>

          <div className="md:overflow-auto px-6">
            <form
              className="mx-auto w-full max-w-[447px] my-20 flex flex-col items-center"
              onSubmit={(e) => {
                e.preventDefault();
                wrapper(() => loginWithEmail({ email, password }));
              }}
            >
              <div className="flex flex-col w-full mb-10">
                <h1 className="text-left font-semibold text-3xl">Login</h1>
                <p className="text-sm">manage your subscription here</p>
              </div>
              <Input
                id="email"
                type="email"
                label="email"
                placeholder="email"
                labelClassName="font-semibold"
                {...emailOption}
              />
              <br />
              <Input
                id="password"
                type="password"
                label="password"
                placeholder="password"
                labelClassName="font-semibold"
                {...passwordOption}
              />
              <button
                className="text-xs text-right ml-auto hover:underline"
                onClick={() => updateOpen(true)}
                type="button"
              >
                forgot password?
              </button>
              <br />
              <Button
                type="submit"
                label="Submit"
                onClick={() => {}}
                block
                loading={loading}
              />

              <div className="relative w-full my-16">
                <div className="w-full h-[1px] bg-gray-900/50"></div>
                <p className="absolute font-semibold text-sm bg-gray-100 top-1/2 px-2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  OR
                </p>
              </div>

              {/* google */}
              <button
                type="button"
                className="h-14 px-9 py-5 bg-cover flex items-center bg-[#F2F2F2] rounded-md"
                onClick={signUpWithGoogle}
              >
                <Image
                  className="bg-cover h-10 w-10"
                  src={google}
                  alt="sign in with google"
                />
                <p className="font-semibold ml-5 text-[#4F4F4F] capitalize text-left">
                  Continue with Google
                </p>
              </button>

              <p className="text-sm mt-12">
                don’t have an account?{" "}
                <Link href="/auth/signup" className="underline font-semibold">
                  sign up
                </Link>
              </p>

              {/* facebook */}
              {/* <button
            type="button"
            className="h-14 mt-3 mb-6 w-3/4 bg-cover flex items-center bg-[#3A579B] px-5 rounded-md"
          >
            <img
              className="bg-cover h-10 w-10"
              src={fb.src}
              alt="sign in with google"
            />
            <p className="font-medium ml-5 text-white capitalize">
              Continue with facebook
            </p>
          </button> */}
            </form>
          </div>
        </div>

        {/* </Page.Body> */}
      </main>

      <Dialog
        className="relative z-50 flex items-center justify-center"
        open={open}
        onClose={() => updateOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md" />
        <div className="fixed inset-0 flex justify-center h-fit mt-[20vh]">
          <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-auto relative flex flex-col items-center justify-center isolate px-6 py-10 ">
            <div className=" w-full pb-6">
              <h2 className="text-center capitalize text-xl font-semibold">
                forgot password
              </h2>
              <p className="text-center pt-1 max-w-[80%] mx-auto">
                Enter the email address associated with your account
              </p>
            </div>
            <div className=" w-full min-w-[300px] max-w-[80%] mx-auto">
              <Input
                {...forgotEmailOption}
                placeholder="email"
                id="forgot-email"
                type="email"
              />
            </div>
            <Button
              label="Send reset link"
              className="mt-6"
              disabled={
                !forgotEmail || !string().email().safeParse(forgotEmail).success
              }
              onClick={resetPassword}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

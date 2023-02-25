import { useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Page, { Protected } from "../../components/layout/Page";
import Input from "../../components/input";
import useInput from "../../hooks/useInput";
import google from "../../src/img/icons/google.png";
import logoLight from "../../src/img/icons/logo-light.png";
import loginImg from "../../src/img/assets/login.png";
import { loginWithEmail, signUpWithGoogle } from "../../utils/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Button from "../../components/button";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/layout/NavBar";
import useWidth from "../../hooks/useWidth";

export default function Login(p: any) {
  const [email, emailOption] = useInput("");
  const [password, passwordOption] = useInput("");
  const router = useRouter();
  const width = useWidth();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/playground");
      } else {
      }
    });
  }, []);

  async function login() {
    await loginWithEmail({ email, password });
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
                login();
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
              <button className="text-xs text-right ml-auto hover:underline">
                forgot password?
              </button>

              <br />
              <Button type="submit" label="Submit" onClick={() => {}} block />

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
                <p className="font-semibold ml-5 text-[#4F4F4F] capitalize">
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
    </>
  );
}

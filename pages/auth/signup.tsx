import { useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Page from "../../components/layout/Page";
import Input from "../../components/input";
import useInput from "../../hooks/useInput";
import google from "../../src/img/icons/google.png";
import { signUpWithGoogle, signupWithEmail } from "../../utils/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Button from "../../components/button";
import Image from "next/image";
import NavBar from "../../components/layout/NavBar";
import useWidth from "../../hooks/useWidth";
import signupImg from "../../src/img/assets/signup.png";
import Link from "next/link";

export default function Signup(p: any) {
  const [email, emailOption] = useInput("");
  const [password, passwordOption] = useInput("");
  const [firstname, firstnameOption] = useInput("");
  const [lastname, lastnameOption] = useInput("");
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

  async function signup() {
    await signupWithEmail({ email, password, firstname, lastname });
  }

  const disabled = !firstname || !lastname || !password || !email;

  return (
    <>
      <div className="md:absolute w-full z-20">
        <NavBar
          isLoggedIn={false}
          // logo={width >= 768 ? logoLight : undefined}
        />
      </div>
      <main className="md:overflow-hidden md:h-screen">
        {/* <Page.Nav></Page.Nav> */}
        {/* <Page.Body> */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] lg:grid-cols-2 md:overflow-hidden md:h-screen">
          <div className="relative w-full overflow-hidden aspect-square md:h-screen">
            <Image
              src={signupImg}
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
                signup();
              }}
            >
              <div className="flex flex-col w-full mb-10">
                <h1 className="text-left font-bold text-2xl">
                  Sign up to Rereceipt
                </h1>
                <p>Sign up now and start your 7 days free trial</p>
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
              <br />

              <div className="w-full grid grid-cols-2 gap-10">
                <Input
                  id="firstname"
                  type="text"
                  label="firstname"
                  placeholder="firstname"
                  labelClassName="font-semibold"
                  {...firstnameOption}
                />
                <Input
                  id="lastname"
                  type="text"
                  label="lastname"
                  placeholder="lastname"
                  labelClassName="font-semibold"
                  {...lastnameOption}
                />
              </div>

              <br />
              <Button
                type="submit"
                label="Create account"
                onClick={() => {}}
                disabled={disabled}
                block
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
                already have an account?{" "}
                <Link href="/auth/login" className="underline font-semibold">
                  login
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* </Page.Body> */}
      </main>
    </>
  );
}

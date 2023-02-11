import { useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Page from "../../components/layout/Page";
import Input from "../../components/input";
import useInput from "../../hooks/useInput";
import google from "../../src/img/icons/google.png";
import {
  loginWithEmail,
  signUpWithGoogle,
  signupWithEmail,
} from "../../utils/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Button from "../../components/button";
import Image from "next/image";

export default function Login(p: any) {
  const [email, emailOption] = useInput("");
  const [password, passwordOption] = useInput("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      } else {
      }
    });
  }, []);

  async function login() {
    await loginWithEmail({ email, password });
  }

  return (
    <Page>
      {/* <Page.Nav></Page.Nav> */}
      <Page.Body>
        <form
          className="mx-auto max-w-md my-12 flex flex-col items-center"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          {/* <div className="flex flex-col w-full mb-10">
            <h1 className="text-left font-bold text-2xl">
              Sign up to Rereceipt
            </h1>
            <p>Sign up now and start your 7 days free trial</p>
          </div> */}
          <Input
            id="email"
            type="email"
            label="email"
            placeholder="email"
            {...emailOption}
          />
          <br />
          <Input
            id="password"
            type="password"
            label="password"
            placeholder="password"
            {...passwordOption}
          />

          <br />
          <Button type="submit" label="Submit" onClick={() => {}} />

          <div className="relative w-full my-12">
            <div className="w-full h-[1px] bg-gray-900/50"></div>
            <p className="absolute bg-gray-100 top-1/2 px-2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              OR
            </p>
          </div>

          {/* google */}
          <button
            type="button"
            className="h-14 lg:w-3/4 bg-cover flex items-center bg-white px-5 rounded-md"
            onClick={signUpWithGoogle}
          >
            <Image
              className="bg-cover h-10 w-10"
              src={google}
              alt="sign in with google"
            />
            <p className="font-medium ml-5 text-[#757575] capitalize">
              Continue with Google
            </p>
          </button>

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
      </Page.Body>
    </Page>
  );
}

import Page from "../components/layout/Page";
import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/firebase";
import useUser from "../store/user/useUser";
import Loader from "../components/layout/Loader";
import Image from "next/image";
import Input from "../components/input";
import useInput from "../hooks/useInput";
import Button from "../components/button";

export default function Profile() {
  const { user, loading } = useUser();
  const [email, emailOptions, updateEmail] = useInput("");
  const [phoneNumber, phoneNumberOptions, updatePhoneNumber] = useInput("");

  useEffect(() => {
    if (!user) return;
    updateEmail(user.email ?? "");
    updatePhoneNumber(user.phoneNumber ?? "");
  }, [user]);

  if (!user || loading) return <Loader />;

  return (
    <Page isProtected>
      <Page.Body>
        <div className="py-10 border-b border-b-gray-300">
          <h3 className="text-3xl font-medium">Profile</h3>
          <p className="text-sm">manage your profile</p>
        </div>
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-end gap-14 py-8 border-b border-b-gray-300">
            <div className="relative overflow-hidden w-24 aspect-square rounded-full">
              <Image fill src={user?.photoURL ?? ""} alt="" />
            </div>

            <button className="border h-fit border-[#4F4F4F] rounded-lg py-2 px-3 text-xs">
              Update picture
            </button>
          </div>
          <div className="grid grid-cols-2 gap-14 py-8 border-b border-b-gray-300">
            <p className="font-semibold">Email</p>
            <Input {...emailOptions} id="email" type="email" />
          </div>
          <div className="grid grid-cols-2 gap-14 py-8 border-b border-b-gray-300">
            <p className="font-semibold">Phone number</p>
            <Input {...phoneNumberOptions} id="phone-number" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-14 py-8">
            <p className="font-semibold">Password</p>
            <div>
              <Input {...emailOptions} id="email" type="email" />
              <br />
              <button className="border h-fit border-[#4F4F4F] rounded-lg py-2 px-3 text-xs">
                Update password
              </button>
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <Button label="Save changes" disabled />
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}

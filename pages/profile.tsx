import Page from "../components/layout/Page";
import { useState, useEffect, useRef } from "react";
import {
  fetchCurrentUser,
  updateLoggedInUserPassword,
  updateUserProfile,
} from "../utils/firebase";
import useUser from "../store/user/useUser";
import Loader from "../components/layout/Loader";
import Image from "next/image";
import Input from "../components/input";
import useInput from "../hooks/useInput";
import Button from "../components/button";
import { FiImage, FiUser } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { AvatarComponent } from "avatar-initials";

export default function Profile() {
  const { user, loading } = useUser();
  const [email, emailOptions, updateEmail] = useInput("");
  const [phoneNumber, phoneNumberOptions, updatePhoneNumber] = useInput("");
  const [newPassword, newPasswordOptions, updateNewPassword] = useInput("");
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const file = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [img, setImg] = useState("");
  const updateImg = (value: string) => setImg(value);
  const updateOpen = (value: boolean) => setOpen(value);
  const updateOpenPassword = (value: boolean) => setOpenPassword(value);

  async function updatePassword() {
    await updateLoggedInUserPassword(newPassword)
      .then((res) => {})
      .catch((err) => {});
  }

  async function updateProfile() {
    await updateUserProfile({ image, phoneNumber });
  }

  useEffect(() => {
    if (!user) return;
    updateEmail(user.email ?? "");
    updatePhoneNumber(user.phoneNumber ?? "");
  }, [user]);

  // when the update password modal is closed, clean the state
  useEffect(() => {
    if (!openPassword) updateNewPassword("");
  }, [openPassword]);

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
              {user?.photoURL || image ? (
                <Image
                  fill
                  src={
                    image ? URL.createObjectURL(image) : user?.photoURL ?? ""
                  }
                  className="object-cover object-center"
                  alt=""
                  sizes="96px"
                />
              ) : (
                <AvatarComponent
                  classes="w-full h-full object-cover rounded-full"
                  useGravatar={false}
                  fontWeight={700}
                  fontFamily="inter"
                  color="#5d5fef"
                  background="#e9e9e9"
                  initials={`${user.displayName?.split(" ")[0][0]}${
                    user.displayName?.split(" ")[1][0]
                  }`}
                />
              )}
            </div>

            <button
              className="border h-fit border-[#4F4F4F] rounded-lg py-2 px-3 text-xs"
              onClick={() => updateOpen(true)}
            >
              Update picture
            </button>
          </div>
          <div className="grid md:grid-cols-2 md:gap-14 py-8 border-b border-b-gray-300">
            <p className="font-semibold">Email</p>
            <Input {...emailOptions} id="email" type="email" disabled />
          </div>
          <div className="grid md:grid-cols-2 md:gap-14 py-8 border-b border-b-gray-300">
            <p className="font-semibold">Phone number</p>
            <Input {...phoneNumberOptions} id="phone-number" type="text" />
          </div>
          <div className="grid md:grid-cols-2 md:gap-14 py-8">
            <p className="font-semibold">Password</p>
            <div>
              <Input
                id="password"
                type="password"
                value="********"
                onChange={() => {}}
                disabled
              />
              <br />
              <button
                className="border h-fit border-[#4F4F4F] rounded-lg py-2 px-3 text-xs"
                onClick={() => updateOpenPassword(true)}
              >
                Update password
              </button>
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <Button
              label="Save changes"
              disabled={!image && phoneNumber === (user?.phoneNumber ?? "")}
              onClick={updateProfile}
            />
          </div>
        </div>

        {/* image */}
        <Dialog
          className="relative z-50 flex items-center justify-center"
          open={open}
          onClose={() => updateOpen(false)}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md" />
          <div className="fixed inset-0 flex justify-center h-fit mt-[20vh]">
            <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-auto relative flex flex-col items-center justify-center isolate px-6 py-10 ">
              {/* image */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative overflow-hidden w-24 aspect-square rounded-full">
                  {image ? (
                    <Image
                      alt=""
                      src={URL.createObjectURL(image)}
                      className="w-full h-full object-center object-cover"
                      fill
                      sizes="96px"
                    />
                  ) : (
                    <FiImage className="h-full w-full" />
                  )}
                </div>
                <br />
                {/* file btn */}
                <label className="bg-black/80 text-white rounded-md px-6 py-3 cursor-pointer focus:bg-black/70 hover:bg-black/70">
                  {!!file ? "Change" : "Upload"} image
                  <input
                    type="file"
                    accept="image/*"
                    name="file"
                    id="file"
                    ref={file}
                    className="hidden"
                    onChange={() => {
                      if (
                        file?.current?.files &&
                        file?.current?.files.length > 0
                      )
                        setImage(file?.current?.files[0]);
                    }}
                  />
                </label>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* password */}
        <Dialog
          className="relative z-50 flex items-center justify-center"
          open={openPassword}
          onClose={() => updateOpenPassword(false)}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md" />
          <div className="fixed inset-0 flex justify-center h-fit mt-[20vh]">
            <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-auto relative flex flex-col items-center justify-center isolate px-6 py-10 ">
              <Input
                {...newPasswordOptions}
                id="password"
                type="password"
                label="New password"
                labelClassName="font-semibold"
              />

              <Button
                label="Update password"
                disabled={newPassword.length < 6}
                className="mt-6"
                onClick={updatePassword}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      </Page.Body>
    </Page>
  );
}

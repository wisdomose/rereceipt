import Page from "../components/layout/Page";
import { useState, useEffect, useRef } from "react";
// import {
//   updateLoggedInUserPassword,
//   updateUserProfile,
//   updateUserProfileImage,
// } from "../utils/firebase";
import Loader from "../components/layout/Loader";
import Image from "next/image";
import Input from "../components/input";
import useInput from "../hooks/useInput";
import Button from "../components/button";
import { FiCamera, FiImage, FiUser } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { AvatarComponent } from "avatar-initials";
import withState from "../hooks/withState";
import { motion } from "framer-motion";
import User from "../res/User";
import Rereceipt from "../res/Rereceipt";

export default function Profile() {
  // const { user, loading } = useUser();
  const { user, currentUser } = new Rereceipt();
  // const user = rereceipt.user;

  const [email, emailOptions, updateEmail] = useInput("");
  const [phoneNumber, phoneNumberOptions, updatePhoneNumber] = useInput("");
  const [newPassword, newPasswordOptions, updateNewPassword] = useInput("");
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const updateOpen = (value: boolean) => setOpen(value);
  const updateOpenPassword = (value: boolean) => setOpenPassword(value);
  const { loading: updatePicLoading, wrapper: updatePicWrapper } = withState();
  const { loading: updateProfileLoading, wrapper: updateProfileWrapper } =
    withState();
  const { loading: updatePasswordLoading, wrapper: updatePasswordWrapper } =
    withState();

  useEffect(() => {
    if (!currentUser) return;
    updateEmail(currentUser.email ?? "");
    updatePhoneNumber(currentUser.phoneNumber ?? "");
  }, [currentUser]);

  // when the update password modal is closed, clean the state
  useEffect(() => {
    if (!openPassword) updateNewPassword("");
  }, [openPassword]);

  useEffect(() => {
    if (!open) {
      setImage(undefined);
      if (file.current) file.current.files = null;
    }
  }, [open]);

  // if (loading)
  //   return (
  //     <Page isProtected>
  //       <Page.Body>
  //         <Loader />
  //       </Page.Body>
  //     </Page>
  //   );

  if (!currentUser) {
    return (
      <Page isProtected>
        <Page.Body>
          <p>you need to be logged in</p>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page isProtected>
      <Page.Body>
        <div className="py-10 border-b border-b-gray-300">
          <motion.h3
            className="text-3xl font-medium"
            initial={{ x: "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0, type: "spring" }}
          >
            Profile
          </motion.h3>
          <motion.p
            className="text-sm"
            initial={{ x: "-10%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            manage your profile
          </motion.p>
        </div>
        <>
          <div className="flex items-end gap-14 py-8 border-b border-b-gray-300">
            <div className="relative overflow-hidden w-24 aspect-square rounded-full">
              {currentUser?.photoURL ? (
                <Image
                  fill
                  src={currentUser?.photoURL}
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
                  initials={`${currentUser.displayName?.split(" ")[0][0]}${currentUser.displayName?.split(" ")[1][0]
                    }`}
                />
              )}
            </div>

            <Button
              onClick={() => updateOpen(true)}
              label="Update picture"
              minimal
            />
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
                onChange={() => { }}
                disabled
              />
              <br />

              <Button
                onClick={() => updateOpenPassword(true)}
                label="Update password"
                minimal
              />
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <Button
              label="Save changes"
              disabled={phoneNumber === (currentUser.phoneNumber ?? "")}
              loading={updateProfileLoading}
              onClick={() =>
                user && updateProfileWrapper(() => user.updateUserProfile({ phoneNumber }))
              }
            />
          </div>
        </>

        {/* image */}
        <Dialog
          className="relative z-50 flex items-center justify-center"
          open={open}
          onClose={updatePicLoading ? () => { } : () => updateOpen(false)}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-md" />
          <div className="fixed inset-0 flex justify-center h-fit mt-[20vh]">
            <Dialog.Panel className="bg-white w-[501px] max-w-[90vw] overflow-hidden rounded-xl aspect-auto relative flex flex-col items-center justify-center isolate px-6 py-10 ">
              {/* image */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative overflow-hidden w-24 aspect-square rounded-full group ring-4">
                  <label className="bg-black/50 text-white rounded-md px-6 py-3 cursor-pointer focus:bg-black/70 hover:bg-black/70 hidden group-hover:z-10 group-focus:z-10 absolute inset-0 group-hover:grid group-focus:grid place-items-center">
                    <FiCamera className="text-3xl" />
                    <input
                      type="file"
                      accept="image/*"
                      name="file"
                      id="file"
                      ref={file}
                      className="h-full w-full hidden"
                      onChange={() => {
                        if (
                          file?.current?.files &&
                          file?.current?.files.length > 0
                        )
                          setImage(file?.current?.files[0]);
                      }}
                    />
                  </label>

                  {image || currentUser.photoURL ? (
                    <Image
                      alt=""
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : currentUser.photoURL || ""
                      }
                      className="w-full h-full object-center object-cover"
                      fill
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
                      initials={`${currentUser.displayName?.split(" ")[0][0]}${currentUser.displayName?.split(" ")[1][0]
                        }`}
                    />
                  )}
                </div>
                <br />

                <Button
                  label="Update Image"
                  disabled={!image}
                  onClick={
                    !image
                      ? undefined
                      : () =>
                        user && updatePicWrapper(() => user.updateUserProfileImage(image))
                  }
                  loading={updatePicLoading}
                />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* password */}
        <Dialog
          className="relative z-50 flex items-center justify-center"
          open={openPassword}
          onClose={() =>
            updatePasswordLoading ? () => { } : updateOpenPassword(false)
          }
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
                onClick={() =>
                  user && updatePasswordWrapper(() =>
                    user.updateUserPassword(newPassword)
                  )
                }
                loading={updatePasswordLoading}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      </Page.Body>
    </Page>
  );
}

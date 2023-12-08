import Image from "next/image";
import Link from "next/link";
import authorization from "../src/img/assets/authorization.png";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import User from "../res/User";
import Rereceipt from "../res/Rereceipt";

export default function NoAccess() {
  const router = useRouter();
  const rereceipt = new Rereceipt();
  const user = rereceipt.user;

  useEffect(() => {
    if(!user) return;
    
    onAuthStateChanged(user.auth, (user) => {
      if (user) {
        // router.replace("/profile");
      } else {
      }
    });
  }, [user]);

  return (
    <div className="h-full grid place-items-center text-[#4F4F4F]">
      <div className="h-fit w-full">
        <div className="relative w-2/3 sm:w-1/2 md:w-1/3 mx-auto aspect-square">
          <Image alt="" src={authorization} className="" fill priority/>
        </div>
        <p className="text-sm max-w-[402] text-center">
          you do not have access to this page.{" "}
          <Link href="/auth/login" className="font-semibold underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}

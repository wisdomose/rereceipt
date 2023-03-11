import Image from "next/image";
import Link from "next/link";
import authorization from "../src/img/assets/authorization.png";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function NoAccess() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/profile");
      } else {
      }
    });
  }, []);

  return (
    <div className="h-full grid place-items-center text-[#4F4F4F]">
      <div className="h-fit w-full">
        <div className="relative w-11/12 sm:w-1/2 md:w-1/3 mx-auto aspect-square">
          <Image alt="" src={authorization} className="" fill />
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

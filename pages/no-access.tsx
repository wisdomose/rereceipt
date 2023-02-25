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
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative w-1/4 aspect-square">
        <Image alt="" src={authorization} className="" fill />
      </div>
      <h3 className="text-3xl font-medium">Oops!</h3>
      <p className="text-sm max-w-[402px] text-center">
        you do not have access to this page.{" "}
        <Link href="/auth/login" className="font-semibold underline">
          login
        </Link>
      </p>
    </div>
  );
}

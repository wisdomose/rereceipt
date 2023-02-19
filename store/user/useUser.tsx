import { useContext } from "react";
import { UserContext } from "./user";

export default function useUser() {
  const store = useContext<Record<string, any>>(UserContext);

  return store;
}

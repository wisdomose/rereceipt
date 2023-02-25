import { useEffect, useState } from "react";
import useUser from "../store/user/useUser";
import { toast } from "react-toastify";

export default function useSubscriptions(customer: string) {
  const [subscriptions, setSubscriptions] = useState([]);
  let controller = new AbortController();

  async function getAllSubscriptions(customer: string) {
    const response = await fetch(
      `/api/billing/subscriptions?customer=${customer}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else if (response.status === 0) {
      throw new Error("Request was aborted");
    } else {
      const res = await response.json();
      return res;
    }
  }

  useEffect(() => {
    if (customer) {
      getAllSubscriptions(customer).then((data) => {
        setSubscriptions(data);
      });

      return () => {
        controller.abort();
      };
    }
  }, [customer]);

  return subscriptions;
}

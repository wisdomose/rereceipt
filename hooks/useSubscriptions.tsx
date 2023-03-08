import { useEffect, useState } from "react";
import axios from "axios";

export enum SUBSCRIPTION_STATUS {
  ACTIVE = "active",
  NON_RENEWING = "non-renewing",
  ATTENTION = "attention",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type Subscription = {
  id: number;
  domain: string;
  status: SUBSCRIPTION_STATUS;
  start: number;
  quantity: number;
  subscription_code: string;
  email_token: string;
  amount: number;
  cron_expression: string;
  next_payment_date: null;
  open_invoice: null;
  createdAt: string;
  integration: number;
  invoice_limit: number;
  split_code: null;
  payments_count: number;
  plan: Plan;
  authorization: Authorization;
  customer: Customer;
  most_recent_invoice: Invoice;
};

export type Plan = {
  id: number;
  domain: string;
  name: string;
  plan_code: string;
  description: null;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  currency: string;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

type Authorization = {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: number;
  signature: string;
  account_name: null;
};

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  metadata: null;
  risk_action: string;
  international_format_phone: null;
};

type Invoice = {
  subscription: number;
  integration: number;
  domain: string;
  invoice_code: string;
  customer: number;
  transaction: number;
  amount: number;
  period_start: string;
  period_end: string;
  status: string;
  paid: number;
  retries: number;
  authorization: number;
  paid_at: string;
  next_notification: string;
  notification_flag: null;
  description: null;
  id: number;
  created_at: string;
  updated_at: string;
};

type Transaction = {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  authorization: Authorization;
  metadata: {
    referrer: string;
  };
  log: {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: never[];
    history: {
      type: string;
      message: string;
      time: number;
    }[];
  };
  plan: {};
  fees: number;
  fees_split: null;
  split: {};
  subaccount: {};
  order_id: null;
  paidAt: string;
  createdAt: string;
  requested_amount: number;
  source: null;
  pos_transaction_data: null;
};

export default function useSubscriptions(props?: {
  id?: string;
  customer_code?: string;
}) {
  const { id, customer_code } = props ?? {};
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // loading
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  let controller = new AbortController();
  let planController = new AbortController();

  async function getAllSubscriptions(customer: string) {
    try {
      const response = await axios(
        `/api/billing/subscriptions?customer=${customer}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );
      if (!response) {
        throw new Error("Network response was not ok");
      } else if (response.status === 0) {
        throw new Error("Request was aborted");
      } else {
        const res = response.data;
        return res;
      }
    } catch (error) {
      return [];
    }
  }

  async function getAllTransactions(customer: string) {
    try {
      const response = await axios(
        `/api/billing/transaction?customer=${customer}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // signal: controller.signal,
        }
      );
      if (!response) {
        throw new Error("Network response was not ok");
      } else if (response.status === 0) {
        throw new Error("Request was aborted");
      } else {
        const res = response.data;
        return res;
      }
    } catch (error) {
      return [];
    }
  }

  useEffect(() => {
    if (id) {
      setSubscriptionLoading(true);
      setSubscriptionsLoading(true);
      setTransactionsLoading(true);

      getAllSubscriptions(id)
        .then((data) => {
          setSubscriptions(data);
          const sub1 = data.find(
            (subscription: Subscription) =>
              subscription.status === SUBSCRIPTION_STATUS.ACTIVE
          );
          const sub2 = data.find(
            (subscription: Subscription) =>
              subscription.status === SUBSCRIPTION_STATUS.NON_RENEWING
          );
          setSubscription(sub1 ? sub1 : sub2 ? sub2 : null);
        })
        .catch((err) => {
          console.log(`transaction - ${err.message}`);
        })
        .finally(() => {
          setSubscriptionLoading(false);
          setSubscriptionsLoading(false);
        });

      getAllTransactions(id)
        .then((data) => {
          setTransactions(data.data);
        })
        .catch((err) => {
          console.log(`transaction - ${err.message}`);
        })
        .finally(() => {
          setTransactionsLoading(false);
        });

      return () => {
        // controller.abort();
      };
    }
  }, [id]);

  // NOTE not needed now
  useEffect(() => {
    setPlansLoading(true);
    axios(`/api/billing/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: planController.signal,
    })
      .then(({ data }) => {
        setPlans(data.data);
      })
      .catch((err: any) => {
        console.log(err.message);
      })
      .finally(() => {
        setPlansLoading(false);
      });

    return () => {
      // planController.abort();
    };
  }, []);

  // useEffect(() => {
  //   if (!customer_code) return;
  //   axios(`/api/billing/customer/${customer_code}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     signal: planController.signal,
  //   })
  //     .then(({ data }) => {
  //       // console.log(data);
  //       // setPlans(data.data);
  //     })
  //     .catch((err: any) => {
  //       console.log(err.message);
  //     });

  //   return () => {
  //     planController.abort();
  //   };
  // }, [customer_code]);

  return {
    subscriptions,
    subscription,
    subscriptionLoading,
    subscriptionsLoading,
    plansLoading,
    transactionsLoading,
    plans,
    transactions,
  };
}

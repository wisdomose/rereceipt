import { useEffect, useState } from "react";
import axios from "axios";
import { log } from "next-axiom";

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

type PaystackCustomer = {
  transactions: never[];
  subscriptions: {
    id: number;
    domain: string;
    status: string;
    subscription_code: string;
    email_token: string;
    amount: number;
    cron_expression: string;
    next_payment_date: string;
    open_invoice: null;
    createdAt: string;
    integration: number;
    plan: {};
    authorization: {
      exp_month: null;
      exp_year: null;
      account_name: null;
    };
    customer: {
      international_format_phone: null;
    };
    invoices: never[];
    invoices_history: never[];
    invoice_limit: number;
    split_code: null;
    most_recent_invoice: null;
  }[];
  authorizations: {
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
    reusable: boolean;
    signature: string;
    account_name: null;
  }[];
  first_name: string;
  last_name: string;
  email: string;
  phone: null;
  metadata: null;
  domain: string;
  customer_code: string;
  risk_action: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  total_transactions: number;
  total_transaction_value: never[];
  dedicated_account: null;
  identified: boolean;
  identifications: null;
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

  // TODO - error states
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [plansError, setPlansError] = useState<string | null>(null);
  const [subscriptionsError, setSubscriptionsError] = useState<string | null>(
    null
  );
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

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

  // get all subscriptions and transactions for a user
  useEffect(() => {
    if (id) {
      setSubscriptionLoading(true);
      setSubscriptionsLoading(true);
      setTransactionsLoading(true);

      getAllSubscriptions(id)
        .then((data) => {
          setSubscriptions(data);
          // const sub1 = data.find(
          //   (subscription: Subscription) =>
          //     subscription.status === SUBSCRIPTION_STATUS.ACTIVE
          // );
          // const sub2 = data.find(
          //   (subscription: Subscription) =>
          //     subscription.status === SUBSCRIPTION_STATUS.NON_RENEWING
          // );

          // const sub3 = data.find(
          //   (subscription: Subscription) =>
          //     subscription.status === SUBSCRIPTION_STATUS.ATTENTION
          // );
          // setSubscription(sub1 ? sub1 : sub2 ? sub2 : sub3 ? sub3 : null);
        })
        .catch((err) => {
          console.log(`transaction - ${err.message}`);
          setSubscriptionsError("An error occured");
        })
        .finally(() => {
          // setSubscriptionLoading(false);
          setSubscriptionsLoading(false);
        });

      getAllTransactions(id)
        .then((data) => {
          setTransactions(data.data);
        })
        .catch((err) => {
          console.log(`transaction - ${err.message}`);
          setTransactionsError("An error occured");
        })
        .finally(() => {
          setTransactionsLoading(false);
        });

      return () => {
        // controller.abort();
      };
    }
  }, [id]);

  // fetch all plans
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
        setPlansError("An error occured");
      })
      .finally(() => {
        setPlansLoading(false);
      });

    return () => {
      // planController.abort();
    };
  }, []);

  // fetch a customers details and store the active subscription
  useEffect(() => {
    if (!customer_code || subscriptions.length === 0) return;

    setSubscriptionLoading(true);

    axios(`/api/billing/customer/${customer_code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: planController.signal,
    })
      // TODO: if customer.subscriptions array is empty
      .then(
        ({
          data,
        }: {
          data: { status: boolean; message: string; data: PaystackCustomer };
        }) => {
          const customer = data.data;
          const activeSub = customer.subscriptions[0];
          if (activeSub) {
            const subscription = subscriptions.find(
              (sub) => sub.subscription_code === activeSub.subscription_code
            );
            subscription && setSubscription(subscription);
          }
        }
      )
      .catch((err: any) => {
        log.error(err.message, err);
        console.log(err.message);
        setSubscriptionError("An error occured");
      })
      .finally(() => {
        setSubscriptionLoading(false);
      });

    // return () => {
    //   planController.abort();
    // };
  }, [customer_code, subscriptions]);

  return {
    subscriptions,
    subscription,
    subscriptionLoading,
    subscriptionsLoading,
    plansLoading,
    transactionsLoading,
    subscriptionError,
    subscriptionsError,
    plansError,
    transactionsError,
    plans,
    transactions,
  };
}

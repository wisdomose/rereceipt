// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SUBSCRIPTION_STATUS,
  Subscription,
} from "../../../hooks/useSubscriptions";

type Data = {
  status: boolean;
  customer_code?: string;
  id?: string;
};

// create a new customer
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return res.end();
  const customer = req.query.customer;
  const plan = req.query.plan;
  const id = req.query.id;

  if (!customer || typeof customer !== "string") return res.end();
  if (!plan || typeof plan !== "string") return res.end();
  if (!id || typeof id !== "string") return res.end();

  // disable all active subscriptions before creating a new subscription
  const subRes = await fetch(
    `https://api.paystack.co/subscription?customer=${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const subscriptions: {
    status: boolean;
    message: string;
    data: Subscription[];
  } = await subRes.json();

  async function deleteSub(subscription: Subscription) {
    await fetch(`https://api.paystack.co/subscription/disable`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        code: subscription.subscription_code,
        token: subscription.email_token,
      }),
    }).catch((err: any) => {
      console.log("Error " + err.message);
    });
  }

  for (let i = 0; i < subscriptions.data.length; i++) {
    const subscription = subscriptions.data[i];
    if (subscription.status === SUBSCRIPTION_STATUS.ACTIVE) {
      deleteSub(subscription);
    }
  }

  const response = await fetch(`https://api.paystack.co/subscription`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      customer,
      plan,
      start_date: new Date(),
    }),
  });

  const resp = await response.json();

  return res.json(resp);
}

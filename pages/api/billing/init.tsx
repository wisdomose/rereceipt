// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// create a new customer
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.end();
  const email = req.body.email;
  const plan = req.body.plan;

  if (!email || typeof email !== "string") return res.end();
  if (!plan || typeof plan !== "string") return res.end();

  const response = await fetch(
    `https://api.paystack.co/transaction/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email,
        amount: 1000,
        plan,
        channel: ["card"],
        callback_url: `/api/callback`,
      }),
    }
  );
  const resp = await response.json();

  return res.json(resp);
}

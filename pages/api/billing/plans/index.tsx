// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";

// create a new customer
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.end();

  const response = await fetch(`https://api.paystack.co/plan`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  const resp = await response.json();

  if (resp.status) {
    const plans = resp.data.map(
      ({
        name,
        interval,
        description,
        plan_code,
        amount,
        currency,
        id,
      }: Record<string, any>) => ({
        name,
        interval,
        description,
        plan_code,
        amount: amount / 100,
        currency,
        id,
      })
    );
    return res.json({
      ...resp,
      data: plans,
    });
  } else {
    log.warn("Fetching plans failed", res);
    return res.json(resp);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// create a new customer
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.end();

  const customer = req.query.customer;
  if (!customer || typeof customer !== "string") return res.end();

  const response = await fetch(`https://api.paystack.co/customer/${customer}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  const resp = await response.json();

  if (resp.status) {
    return res.json({
      ...resp,
    });
  } else {
    return res.json({
      status: false,
    });
  }
}

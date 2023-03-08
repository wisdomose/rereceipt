// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// enable a subscription
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ link: string }>
) {
  if (req.method !== "POST") return res.end();
  const code = req.query.code;
  const token = req.query.token;
  if (!code || typeof code !== "string") return res.end();
  if (!token || typeof token !== "string") return res.end();

  const response = await fetch(`https://api.paystack.co/subscription/enable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      code,
      token,
    }),
  });
  
  const resp = await response.json();

  if (resp.status) {
    return res.json(resp);
  } else {
    return res.json(resp);
  }
}

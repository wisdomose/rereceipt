// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// get a link to update account info or end billing
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ link: string }>
) {
  if (req.method !== "GET") return res.end();
  const code = req.query.code;
  if (!code || typeof code !== "string") return res.end();

  const response = await fetch(
    `https://api.paystack.co/subscription/${code}/manage/link`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  const resp = await response.json();

  if (resp.status) {
    return res.json(resp.data);
  } else {
    return res.json(resp.data);
  }
}

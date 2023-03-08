// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

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
  if (!customer || typeof customer !== "string") return res.end();
  if (!plan || typeof plan !== "string") return res.end();

  const response = await fetch(`https://api.paystack.co/subscription`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      customer,
      plan,
    }),
  });
  const resp = await response.json();

  return res.json(resp);
}
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method !== "POST") return res.end();

//   const response = await fetch(`https://api.paystack.co/customer`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//     },
//     body: JSON.stringify({
//       email: req.body.email,
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//     }),
//   });
//   const resp = await response.json();

//   if (resp.status) {
//     return res.json({
//       status: true,
//       customer_code: resp.data.customer_code,
//       id: resp.data.id,
//     });
//   } else {
//     return res.json({
//       status: false,
//     });
//   }
// }

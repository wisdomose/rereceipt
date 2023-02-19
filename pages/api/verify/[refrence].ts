// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

type Data = {
  name: string;
};

// expire the cookie
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query.refrence);
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${req.query.refrence}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  const resp = await response.json();

  // add card to billing accounts
  // add to history
  // update paid status of the user
  if (resp.status) {
    //   authorization: {
    //   authorization_code: 'AUTH_t8aux16jm4',
    //   bin: '408408',
    //   last4: '4081',
    //   exp_month: '12',
    //   exp_year: '2030',
    //   channel: 'card',
    //   card_type: 'visa ',
    //   bank: 'TEST BANK',
    //   country_code: 'NG',
    //   brand: 'visa',
    //   reusable: true,
    //   signature: 'SIG_dxUrjoXHsEYXJGVPYLmd',
    //   account_name: null,
    //   receiver_bank_account_number: null,
    //   receiver_bank: null
    // },
    // customer: {
    //   id: 112410344,
    //   first_name: 'Iyoriobhe',
    //   last_name: 'Osenemendia',
    //   email: 'wisdomose05@gmail.com',
    //   customer_code: 'CUS_wot7bwz7mlaosuh',
    //   phone: '',
    //   metadata: null,
    //   risk_action: 'default',
    //   international_format_phone: null
    // },
    // plan: 'PLN_w9e9s44wt6dijxo',
    // split: {},
    // order_id: null,
    // paidAt: '2023-02-19T00:24:16.000Z',
    // createdAt: '2023-02-19T00:24:13.000Z',
    //   amount: 300000,
    //   interval: 'monthly',
    //   send_invoices: true,
    //   send_sms: true,
    //   currency: 'NGN'
    // },
  }
  
  console.log(resp);

  res.end();
}

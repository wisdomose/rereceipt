// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";

// create a new customer
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.end();

  log.info(JSON.stringify({ dody: req.body, query: req.query }));

  return res.json({ dody: req.body, query: req.query });
}

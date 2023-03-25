import { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.json({
      status: false,
      message: "Invalid route",
    });
  }

  const { from, name, subject = "", message } = req.body;

  if (!from || !name || !subject || !message) {
    return res.json({
      status: false,
      message: "some fields are missing",
    });
  }

  try {
    log.info(`Creating transporter for ${from}`);
    let transporter = nodemailer.createTransport({
      host: "em1.host-ww.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    log.info(`Transporter created for ${from}`);

    await transporter.sendMail({
      from: from,
      envelope: {
        from: `${name} <${from}>`,
        to: process.env.SUPPORT_EMAIL,
      },
      to: process.env.SUPPORT_EMAIL, // list of receivers
      subject: subject, // Subject line
      text: message,
    });

    log.info(`Mail from ${from} sent`);

    return res.json({
      status: true,
      message: "mail sent",
    });
  } catch (error: any) {
    log.error("failed to send email", error);
    return res.json({
      status: false,
      message: error?.message ?? "failed to send email",
    });
  }
}

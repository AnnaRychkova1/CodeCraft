import type { NextApiRequest, NextApiResponse } from "next";
import sgMail, { MailDataRequired } from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, feedback } = req.body;

  if (!feedback) return res.status(400).json({ error: "Feedback is required" });

  const msg: MailDataRequired = {
    to: process.env.SENDGRID_TO!,
    from: process.env.SENDGRID_FROM!,
    replyTo: email,
    subject: "New CodeCraft Feedback",
    text: `Email: ${email || "Not provided"}\n\nFeedback:\n${feedback}`,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}

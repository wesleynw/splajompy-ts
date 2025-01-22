"use server";

import { Resend } from "resend";
import VerificationCodeTemplate from "../components/email-templates/VerificationCode";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSignInCodeEmail(email: string, code: string) {
  await resend.emails.send({
    from: "Splajompy <no-reply@splajompy.com>",
    to: email,
    subject: "Your sign-in code",
    react: VerificationCodeTemplate({ code }),
  });
}

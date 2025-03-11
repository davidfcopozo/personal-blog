import { SendMailOptions } from "nodemailer";

import { emailSender } from "./emailSender";
import emailVerified from "../templates/email-verified";
import { sendEmailVerifiedConfirmationProps } from "../typings/types";

export const sendEmailVerifiedConfirmation = async ({
  baseUrl,
  email,
}: sendEmailVerifiedConfirmationProps) => {
  const profileUrl = `${baseUrl}/profile`;

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: "Email Verification",
    html: emailVerified.replace(/\{\{app_url\}\}/g, profileUrl as string),
  };

  await emailSender(emailOptions);
};

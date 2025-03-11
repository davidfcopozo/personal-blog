import { SendMailOptions } from "nodemailer";
import { SendVerificationEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";
import verificationEmailTemplate from "../templates/verification-email";

export const sendVerificationEmail = async ({
  firstName,
  email,
  verificationToken,
  baseUrl,
}: SendVerificationEmailProps) => {
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const currentYear = new Date().getFullYear().toString();

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: "Email Verification",
    html: verificationEmailTemplate
      .replace(/\{\{verification_url\}\}/g, verificationUrl)
      .replace(/\{\{firstName\}\}/g, firstName as string)
      .replace(/\{\{year\}\}/g, currentYear as string),
  };

  await emailSender(emailOptions);
};

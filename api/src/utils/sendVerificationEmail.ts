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
      .replace(
        /\{\{logo_src\}\}/g,
        "https://lh3.googleusercontent.com/pw/AP1GczP42usITm10yc2j45bzIWFZnuLDmIrVLOr_aGpSqMnQqZiXxGEdAKbOv103csKm-18I8edfCNHjwzv4lXiCDllEns4BD6fJxG-08v1D2NOqGsqZ8L1W3gFqSTE95lxzKeL3RJqK6jlgvYDITEbrjsM=w605-h605-s-no-gm?authuser=0" as string
      )
      .replace(/\{\{year\}\}/g, currentYear as string),
  };

  await emailSender(emailOptions);
};

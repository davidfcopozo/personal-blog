import { SendMailOptions } from "nodemailer";
import { SendVerificationEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";

export const sendVerificationEmail = async ({
  firstName,
  email,
  verificationToken,
  baseUrl,
}: SendVerificationEmailProps) => {
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: "Email Verification",
    html: `
    <h4>Hello ${firstName}</h4>
    <br>
    <p>Please verify that you own this email address <strong>(${email})</strong> by clicking this link:</p>
    <br>
    <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>
    `,
  };

  await emailSender(emailOptions);
};

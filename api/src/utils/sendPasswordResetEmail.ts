import { SendMailOptions } from "nodemailer";
import { SendPasswordResetEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";
import passwordResetTemplate from "../templates/password-reset";

export const sendPasswordResetEmail = async ({
  firstName,
  email,
  token,
  baseUrl,
  proxyOrVPN,
  geoLocation,
  ip,
}: SendPasswordResetEmailProps) => {
  const passwordResetURL = `${baseUrl}/api/auth/reset-password?token=${token}`;
  const requestText =
    proxyOrVPN && geoLocation && ip
      ? `We received an unusual request from <span style="color: red"> ${geoLocation} - ip address: ${ip}</span> to reset the password for your account. If you made the request, to proceed with the password reset, click the button below otherwhise you can savely ignore this email:`
      : `We received a request to reset the password ${
          geoLocation &&
          `from <span style="color: #030712> ${geoLocation}</span>`
        } for your account. To proceed with the password reset, click the button below:`;

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: "Password Reset Request",
    html: passwordResetTemplate
      .replace(/\{\{name\}\}/g, firstName as string)
      .replace(/\{\{requestText\}\}/g, requestText as string)
      .replace(/\{\{email\}\}/g, email as string)
      .replace(/\{\{resetLink\}\}/g, passwordResetURL as string),
  };

  await emailSender(emailOptions);
};

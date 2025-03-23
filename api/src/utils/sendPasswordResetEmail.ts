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
  const currentTime = new Date().toLocaleString();

  // Process the template to handle conditional sections
  let processedTemplate = passwordResetTemplate;

  // Handle the proxy/VPN warning section
  if (proxyOrVPN) {
    processedTemplate = processedTemplate.replace(
      /\{\{#if_proxy\}\}([\s\S]*?)\{\{\/if_proxy\}\}/g,
      "$1"
    );
  } else {
    processedTemplate = processedTemplate.replace(
      /\{\{#if_proxy\}\}([\s\S]*?)\{\{\/if_proxy\}\}/g,
      ""
    );
  }

  // Replace other template variables
  processedTemplate = processedTemplate
    .replace(/\{\{name\}\}/g, firstName as string)
    .replace(/\{\{location\}\}/g, geoLocation as string)
    .replace(/\{\{ip\}\}/g, ip as string)
    .replace(/\{\{time\}\}/g, currentTime)
    .replace(/\{\{email\}\}/g, email as string)
    .replace(/\{\{resetLink\}\}/g, passwordResetURL as string);

  // Create request text that mentions location if available
  const requestText = `We received a request to reset the password for your account. If this was you, please use the button below to reset your password.`;

  processedTemplate = processedTemplate.replace(
    /\{\{requestText\}\}/g,
    requestText
  );

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: proxyOrVPN
      ? "🚨 SECURITY ALERT: Password Reset Request"
      : "Password Reset Request",
    html: processedTemplate,
  };

  await emailSender(emailOptions);
};

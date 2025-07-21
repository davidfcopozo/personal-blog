import { SendMailOptions } from "nodemailer";
import { SendPasswordResetEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";
import passwordResetTemplate from "../templates/password-reset";
import passwordResetTemplateEs from "../templates/password-reset-es";

export const sendPasswordResetEmail = async ({
  firstName,
  email,
  token,
  baseUrl,
  locale = "en",
  proxyOrVPN,
  geoLocation,
  ip,
}: SendPasswordResetEmailProps) => {
  const passwordResetURL = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(
    email as string
  )}`;
  const currentTime = new Date().toLocaleString();

  // Select template and subject based on locale
  const template =
    locale === "es" ? passwordResetTemplateEs : passwordResetTemplate;
  const subject =
    locale === "es" ? "Restablecer tu Contraseña" : "Reset Your Password";

  // Process the template to handle conditional sections
  let processedTemplate = template;

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
      ? locale === "es"
        ? "🚨 ALERTA DE SEGURIDAD: Solicitud de Restablecimiento de Contraseña"
        : "🚨 SECURITY ALERT: Password Reset Request"
      : subject,
    html: processedTemplate,
  };

  await emailSender(emailOptions);
};

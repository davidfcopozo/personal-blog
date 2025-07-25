import { SendMailOptions } from "nodemailer";
import { SendPasswordChangedEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";
import passwordChangedTemplate from "../templates/password-changed";
import passwordChangedTemplateEs from "../templates/password-changed-es";

export const sendPasswordChangedEmail = async ({
  firstName,
  email,
  baseUrl,
  locale = "en",
  proxyOrVPN,
  geoLocation,
  ip,
}: SendPasswordChangedEmailProps) => {
  const baseUrlWithoutApi = baseUrl.replace("/api", "");
  const securitySettingsUrl = `${baseUrlWithoutApi}/settings`;
  const currentTime = new Date().toLocaleString();

  // Select template and subject based on locale
  const template =
    locale === "es" ? passwordChangedTemplateEs : passwordChangedTemplate;
  const subject = locale === "es" ? "Contraseña Cambiada" : "Password Changed";

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
    .replace(/\{\{securitySettingsUrl\}\}/g, securitySettingsUrl as string);

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
        ? "🚨 ALERTA DE SEGURIDAD: Tu Contraseña Ha Sido Cambiada"
        : "🚨 SECURITY ALERT: Your Password Has Been Changed"
      : subject,
    html: processedTemplate,
  };

  await emailSender(emailOptions);
};

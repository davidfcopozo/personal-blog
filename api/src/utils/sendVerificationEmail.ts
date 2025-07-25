import { SendMailOptions } from "nodemailer";
import { SendVerificationEmailProps } from "../typings/utils";
import { emailSender } from "./emailSender";
import verificationEmailTemplate from "../templates/verification-email";
import verificationEmailTemplateEs from "../templates/verification-email-es";

export const sendVerificationEmail = async ({
  firstName,
  email,
  verificationToken,
  baseUrl,
  locale = "en",
}: SendVerificationEmailProps) => {
  const verificationUrl = `${baseUrl}/auth/email-verification/${verificationToken}?email=${encodeURIComponent(
    email as string
  )}`;

  const currentYear = new Date().getFullYear().toString();

  // Select template based on locale
  const template =
    locale === "es" ? verificationEmailTemplateEs : verificationEmailTemplate;

  // Select subject based on locale
  const subject =
    locale === "es"
      ? "Verificación de Correo Electrónico"
      : "Email Verification";

  const emailOptions: SendMailOptions = {
    from: process.env.SENDER_MAIL_USERNAME,
    to: email as string,
    subject: subject,
    html: template
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

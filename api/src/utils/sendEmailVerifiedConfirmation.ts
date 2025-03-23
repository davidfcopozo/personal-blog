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
    html: emailVerified
      .replace(/\{\{app_url\}\}/g, profileUrl as string)
      .replace(
        /\{\{logo_src\}\}/g,
        "https://lh3.googleusercontent.com/pw/AP1GczP42usITm10yc2j45bzIWFZnuLDmIrVLOr_aGpSqMnQqZiXxGEdAKbOv103csKm-18I8edfCNHjwzv4lXiCDllEns4BD6fJxG-08v1D2NOqGsqZ8L1W3gFqSTE95lxzKeL3RJqK6jlgvYDITEbrjsM=w605-h605-s-no-gm?authuser=0" as string
      )
      .replace(
        /\{\{success_check_src\}\}/g,
        "https://lh3.googleusercontent.com/pw/AP1GczOT75JS2G_li2lkLIj5F3DlpCQqPodIF-uXHljYxbWKtXw6zV24OZ-PL8VG4lBdXkM8bi_BUBRr6yDOoRsM_s0jGxG8ZWNpJyVp1-lvfMGMxyi29dNRsFoZkkQjVvJAhvNJNXrOR9B2uRyGF08ER9E=w605-h605-s-no-gm?authuser=0" as string
      )
      .replace(
        /\{\{github_src\}\}/g,
        "https://lh3.googleusercontent.com/pw/AP1GczPObhbpU10WJXv-V_iJ8irqZnF96B_DBtaPBTkrsEjYlybRw_HavTgt3Z2M928pWr-7dREFFHXFUCMM69Hp_WMlmQpH7ZzmIh11kF8G8d0PH8ephVJI7OTdKKe2uv8vm91l2nPJ0g7TohZ-lSbGYsA=w800-h600-s-no-gm?authuser=0" as string
      ),
  };

  await emailSender(emailOptions);
};

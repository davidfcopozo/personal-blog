import nodemailer, { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
import nodemailerMock from "nodemailer-mock";
dotenv.config();

const createTransporter = async () => {
  if (process.env.NODE_ENV === "test") {
    const transporter = nodemailerMock.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    return transporter;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
};

export const emailSender = async (emailOptions: SendMailOptions) => {
  let emailTransporter = await createTransporter();
  emailTransporter.sendMail(emailOptions);
};

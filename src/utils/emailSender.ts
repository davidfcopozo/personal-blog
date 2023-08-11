// import { google } from "googleapis";
require("dotenv").config();
const nodemailer = require("nodemailer");
// const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
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

export const emailSender = async (emailOptions: any) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

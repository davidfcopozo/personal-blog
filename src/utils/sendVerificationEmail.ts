const emailSender = require("./emailSender");

interface sendVerificationEmailProps {
  name: string;
  email: string;
  verificationToken: string;
  baseUrl: string;
}

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  baseUrl,
}: sendVerificationEmailProps) => {
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const emailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Email Verification",
    html: `
    <h4>Hello ${name}</h4>
    <br>
    <p>Please verify that you own this email address <strong>(${email})</strong> by clicking this link:</p>
    <br>
    <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>
    `,
  };

  await emailSender(emailOptions);
};

module.exports = sendVerificationEmail;

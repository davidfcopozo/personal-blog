const sendEmail = require("./emailSender");

interface sendPasswordResetEmail {
  name: string;
  email: string;
  token: string;
  baseUrl: string;
}

const sendPasswordResetEmail = async ({
  name,
  email,
  token,
  baseUrl,
}: sendPasswordResetEmail) => {
  const verificationUrl = `${baseUrl}/api/auth/reset-password?token=${token}`;

  const emailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Password Reset",
    html: `
    <h4>Hello ${name}</h4>
    <p>You recently requested to reset the password for your Indid Coding account. You can reset your password by clicking the link below:</p>
    <p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>
    <p>No changes have been made to your account yet.</p>
    <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.</p>
    <p>From David Francisco</p>
    `,
  };

  await sendEmail(emailOptions);
};

module.exports = sendPasswordResetEmail;

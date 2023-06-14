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
    <br>
    <p>You recently requested to reset the password for your [customer portal] account. You can reset your password by clicking the link below:</p>
    <br>
    <p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>
    <br>
    <p>No changes have been made to your account yet.</p>
    <br>
    <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.</p>
    `,
  };

  await emailSender(emailOptions);
};

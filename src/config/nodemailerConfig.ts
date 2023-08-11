require("dotenv").config();

module.exports = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
};

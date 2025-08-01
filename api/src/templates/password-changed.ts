const passwordChangedTemplate = `
<!DOCTYPE html>
<html
  lang="en"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no"
    />
    <title>Password Changed</title>
    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Segoe UI', sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
    <style>
      /* Reset styles */
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      div[style*='margin: 16px 0'] {
        margin: 0 !important;
      }
      #MessageViewBody,
      #MessageWebViewDiv {
        width: 100% !important;
      }
      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
      }
      a[x-apple-data-detectors],
      .unstyle-auto-detected-links a,
      .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* Custom styles */
      .main-container {
        background-color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      .logo {
        margin-bottom: 32px;
        text-align: center;
      }
      .header {
        color: #111827;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 24px;
        text-align: center;
      }
      .content {
        color: #374151;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 32px;
      }
      .info-box {
        background-color: #f3f4f6;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 32px;
      }
      .info-item {
        margin-bottom: 12px;
      }
      .button {
        background-color: #dc2626;
        border-radius: 6px;
        color: #ffffff;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        padding: 12px 24px;
        text-align: center;
        text-decoration: none;
      }
      .footer {
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 12px;
        margin-top: 48px;
        padding-top: 24px;
        text-align: center;
      }
      @media screen and (max-width: 600px) {
        .main-container {
          padding: 20px 16px;
        }
      }
    </style>
  </head>
  <body
    style="
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      margin: 0;
      width: 100%;
      background-color: #f3f4f6;
      padding: 0;
    "
  >
    <!--[if mso]>
    <table role="presentation" width="100%">
    <tr>
    <td align="center">
    <![endif]-->
    <div
      role="article"
      aria-roledescription="email"
      aria-label="Password Changed"
      lang="en"
      class="main-container"
    >
      <!-- Logo -->
      <div class="logo">
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczMpGnJWrwihWm_UlZLZK7GJceYT0qrTg2y2l2s34hi29vIy9as-X-ZxbYYBa_LaDB98NMNHg7u-pBBwsX4qtjxJMEoKzHFMtTHk5NuEojcHk0n5vNkY74ySjO-QCILknogsCNpFEU-5A6Cx2csP5Ug=w512-h512-s-no-gm?authuser=0"
          alt="Company Logo"
          width="40"
          height="40"
          style="border: 0; display: block; margin: 0 auto"
        />
      </div>

      <!-- Header -->
      <h1 class="header">Your Password Has Been Changed</h1>

      <!-- Main Content -->
      <div class="content">
        <p>Hi {{name}},</p>
        <p>
          The password for your account was recently changed. If you made this
          change, you can safely ignore this email.
        </p>
      </div>

      <!-- Security Information -->
      <div class="info-box">
        <div class="info-item"><strong>Time:</strong> {{time}}</div>
        <div class="info-item"><strong>Location:</strong> {{location}}</div>
        <div class="info-item"><strong>IP Address:</strong> {{ip}}</div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 32px">
        <a href="{{securitySettingsUrl}}" class="button" style="color: #ffffff">
          Review Security Settings
        </a>
      </div>

      <!-- Security Notice -->
      <div
        class="content"
        style="
          background-color: #fee2e2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 32px;
        "
      >
        <p style="margin: 0">
          <strong>Didn't make this change?</strong> If you didn't change your
          password, please secure your account immediately by:
        </p>
        <ol style="margin: 16px 0 0 0; padding-left: 20px">
          <li>Resetting your password</li>
          <li>Contacting our support team</li>
        </ol>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>For support, contact us at techycommblog@gmail.com</p>
        <p>TechyComm</p>
        <p>
          <a href="{preferencesUrl}" style="color: #6b7280"
            >Email Preferences</a
          >
          • <a href="{privacyUrl}" style="color: #6b7280">Privacy Policy</a> •
          <a href="{unsubscribeUrl}" style="color: #6b7280">Unsubscribe</a>
        </p>
      </div>
    </div>
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </body>
</html>
`;

export default passwordChangedTemplate;

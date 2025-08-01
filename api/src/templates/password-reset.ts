const passwordResetTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Reset Your Password</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      /* Reset styles */
      body,
      #bodyTable {
        margin: 0;
        padding: 0;
        width: 100% !important;
        height: 100% !important;
        background-color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0;
        mso-table-rspace: 0;
      }
      td {
        padding: 0;
        vertical-align: top;
      }
      img {
        border: 0;
        -ms-interpolation-mode: bicubic;
        display: block;
      }
      /* Base styles */
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f8fafc;
        padding: 40px 0;
      }
      .main {
        background-color: #ffffff;
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .content {
        padding: 40px;
      }
      .button {
        background-color: #030712;
        border-radius: 6px;
        color: #ffffff;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        padding: 16px 32px;
        text-decoration: none;
        text-align: center;
        margin: 24px 0;
      }
      .footer {
        padding: 24px 40px;
        background-color: #f8fafc;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      .footer p {
        margin: 0;
        font-size: 12px;
        color: #64748b;
        line-height: 1.5;
      }
      .security-warning {
        background-color: #fee2e2;
        border-left: 4px solid #ef4444;
        padding: 12px;
        margin-bottom: 24px;
        border-radius: 4px;
      }
      .location-info {
        background-color: #f0f9ff;
        padding: 12px;
        margin-bottom: 24px;
        border-radius: 4px;
        border-left: 4px solid #38bdf8;
      }
      /* Mobile styles */
      @media screen and (max-width: 600px) {
        .content,
        .footer {
          padding: 24px;
        }
        .button {
          display: block;
          text-align: center;
          color: #ffffff !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <table
              role="presentation"
              class="main"
              cellpadding="0"
              cellspacing="0"
              width="600"
            >
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 40px 40px 20px">
                  <img
                    src="https://lh3.googleusercontent.com/pw/AP1GczMpGnJWrwihWm_UlZLZK7GJceYT0qrTg2y2l2s34hi29vIy9as-X-ZxbYYBa_LaDB98NMNHg7u-pBBwsX4qtjxJMEoKzHFMtTHk5NuEojcHk0n5vNkY74ySjO-QCILknogsCNpFEU-5A6Cx2csP5Ug=w512-h512-s-no-gm?authuser=0"
                    alt="Company Logo"
                    width="40"
                    style="display: block; margin-bottom: 16px"
                  />
                  <h1
                    style="
                      margin: 0;
                      color: #1e293b;
                      font-size: 24px;
                      font-weight: 600;
                    "
                  >
                    Reset Your Password
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td class="content">
                  <p style="margin-top: 0; color: #334155">Hello {{name}},</p>

                  {{#if_proxy}}
                  <div class="security-warning">
                    <p style="margin: 0; color: #b91c1c; font-weight: 500;">
                      ⚠️ Security Alert
                    </p>
                    <p style="margin-top: 8px; color: #b91c1c;">
                      We've detected that this password reset request came from a VPN, proxy, or hosting provider. 
                      If you didn't request this password reset, please secure your account immediately.
                    </p>
                  </div>
                  {{/if_proxy}}

                  <div class="location-info">
                    <p style="margin: 0; color: #0369a1; font-weight: 500;">
                      Request Information
                    </p>
                    <p style="margin-top: 8px; color: #0369a1;">
                      Location: {{location}}<br>
                      IP Address: {{ip}}<br>
                      Time: {{time}}
                    </p>
                  </div>

                  <p style="color: #334155">
                    {{requestText}}
                  </p>

                  <!-- Reset Button -->
                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <tr>
                      <td align="center">
                        <a href="{{resetLink}}" class="button" style="color: #ffffff">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #334155">
                    If the button doesn't work, copy and paste this link into
                    your browser:
                    <br />
                    <a
                      href="{{resetLink}}"
                      style="color: #2563eb; word-break: break-all"
                    >
                      {{resetLink}}
                    </a>
                  </p>

                  <p style="color: #334155">
                    For security reasons, this password reset link will expire
                    in 30 minutes.
                  </p>

                  <p style="color: #334155">
                    If you didn't request a password reset, please ignore this
                    email or contact our support team at techycommblog@gmail.com if you have concerns.
                  </p>

                  <p style="color: #334155; margin-bottom: 0">
                    Best regards,<br />
                    The Security Team
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p>This email was sent to {{email}}.</p>
                  <p style="margin-top: 12px">TechyComm</p>
                  <p style="margin-top: 8px; font-size: 12px;">For support: techycommblog@gmail.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

export default passwordResetTemplate;

const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Verify Your Email Address</title>
  <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
  <![endif]-->
</head>
<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
  "
>
  <table
    role="presentation"
    style="
      width: 100%;
      border: none;
      border-spacing: 0;
      background-color: #f4f4f5;
      padding: 40px 0;
    "
  >
    <tr>
      <td align="center" style="padding: 0">
        <!-- Email Container -->
        <table
          role="presentation"
          style="
            width: 100%;
            max-width: 600px;
            border: none;
            border-spacing: 0;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          "
        >
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center">
              <img
                src="https://lh3.googleusercontent.com/pw/AP1GczMpGnJWrwihWm_UlZLZK7GJceYT0qrTg2y2l2s34hi29vIy9as-X-ZxbYYBa_LaDB98NMNHg7u-pBBwsX4qtjxJMEoKzHFMtTHk5NuEojcHk0n5vNkY74ySjO-QCILknogsCNpFEU-5A6Cx2csP5Ug=w512-h512-s-no-gm?authuser=0"
                alt="TechyComm Logo"
                style="width: 40px; height: 40px; margin-bottom: 20px; display: block; margin: 0 auto 20px auto;"
                width="40"
                height="40"
              />
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 700;
                  color: #111827;
                "
              >
                Verify Your Email Address
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px">
            <p
                style="
                  margin: 0 0 24px 0;
                  font-size: 16px;
                  line-height: 24px;
                  color: #374151;
                "
              >
                Hello {{firstName}},
              </p>
              <p
                style="
                  margin: 0 0 24px 0;
                  font-size: 16px;
                  line-height: 24px;
                  color: #374151;
                "
              >
                Thanks for signing up to TechyComm! We're excited to have you on board. To
                start using your account, please verify your email address by
                clicking the button below.
              </p>

              <!-- Button -->
              <table
                role="presentation"
                style="width: 100%; border: none; border-spacing: 0"
              >
                <tr>
                  <td align="center" style="padding: 0">
                    <a
                      href="{{verification_url}}"
                      style="
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #030712;
                        color: #ffffff;
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 16px;
                        border-radius: 6px;
                        transition: background-color 0.2s;
                      "
                      target="_blank"
                    >
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p
                style="
                  margin: 24px 0 0 0;
                  font-size: 14px;
                  line-height: 20px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                If the button doesn't work, copy and paste this link into your
                browser:<br />
                <a
                  href="{{verification_url}}"
                  style="
                    color: #2563eb;
                    text-decoration: underline;
                    word-break: break-all;
                  "
                  target="_blank"
                >
                  {{verification_url}}
                </a>
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 20px 40px">
              <p
                style="
                  margin: 0;
                  padding: 16px;
                  background-color: #f3f4f6;
                  border-radius: 6px;
                  font-size: 14px;
                  line-height: 20px;
                  color: #4b5563;
                "
              >
                If you didn't create an account, you can safely ignore this
                email. For support, contact us at techycommblog@gmail.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 20px 40px 40px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              "
            >
              <p
                style="
                  margin: 0 0 8px 0;
                  font-size: 14px;
                  line-height: 20px;
                  color: #6b7280;
                "
              >
                © {{year}} TechyComm. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!--[if mso]>
    <style type="text/css">
      body,
      table,
      td {
        font-family: Arial, Helvetica, sans-serif !important;
      }
    </style>
  <![endif]-->
</body>
</html>
`;

export default verificationEmailTemplate;

const emailVerified = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
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
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
    "
  >
    <!-- Wrapper -->
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f4f5"
    >
      <tr>
        <td align="center" style="padding: 40px 0">
          <!-- Container -->
          <table
            role="presentation"
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              max-width: 600px;
              width: 100%;
              margin: 0 auto;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #ffffff;
                  padding: 32px 48px;
                  text-align: center;
                  border-bottom: 1px solid #e5e7eb;
                "
              >
                <img
                  src="{{logo_src}}"
                  alt="TechyComm Logo"
                  style="width: 100px; height: 100px"
                  width="40"
                  height="40"
                />
              </td>
            </tr>

            <!-- Success Icon -->
            <tr>
                <td style="padding: 48px 48px 32px; text-align: center">
                <div
                  style="
                    background-color: #009933;
                    border-radius: 50%;
                    width: 64px;
                    height: 64px;
                    margin: 0 auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <img
                    src="{{success_check_src}}"
                    alt="Success Check"
                    style="width: 32px; height: 32px;"
                    width="32"
                    height="32"
                  />
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 0 48px 48px">
                <h1
                  style="
                    margin: 0 0 24px;
                    color: #111827;
                    font-size: 24px;
                    font-weight: 700;
                    text-align: center;
                  "
                >
                  Email Confirmed!
                </h1>
                <p
                  style="
                    margin: 0 0 24px;
                    color: #4b5563;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;
                  "
                >
                  Thank you for confirming your email address. We're excited to
                  have you on board!
                </p>
                <p
                  style="
                    margin: 0 0 32px;
                    color: #4b5563;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;
                  "
                >
                  Your account is now fully activated and you can start using
                  all features.
                </p>

                <!-- CTA Button -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{app_url}}"
                        style="
                          display: inline-block;
                          background-color: #030712;
                          color: #ffffff;
                          font-size: 16px;
                          font-weight: 600;
                          text-decoration: none;
                          padding: 12px 32px;
                          border-radius: 6px;
                        "
                      >
                        Get Started
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Next Steps -->
            <tr>
              <td style="padding: 0 48px 48px">
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 24px;
                  "
                >
                  <tr>
                    <td>
                      <h2
                        style="
                          margin: 0 0 16px;
                          color: #111827;
                          font-size: 18px;
                          font-weight: 600;
                        "
                      >
                        Next Steps
                      </h2>
                      <ul
                        style="
                          margin: 0;
                          padding: 0 0 0 20px;
                          color: #4b5563;
                          font-size: 16px;
                          line-height: 24px;
                        "
                      >
                        <li style="margin-bottom: 8px">
                          Complete your profile
                        </li>
                        <li style="margin-bottom: 8px">Start making posts</li>
                        <li style="margin-bottom: 0">Share your content</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #f8fafc;
                  padding: 32px 48px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                "
              >
                <!-- Social Links -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin-bottom: 24px"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          margin: 0 8px;
                          text-decoration: none;
                        "
                      >
                        <img
                          src="{{github_src}}"
                          alt="GitHub"
                          width="26"
                          height="20"
                        />
                      </a>
                    </td>
                  </tr>
                </table>
                <p
                  style="
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 20px;
                  "
                >
                  © 2025 TechyComm. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default emailVerified;

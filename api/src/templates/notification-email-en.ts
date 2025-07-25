const notificationEmailTemplateEn = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Notification</title>
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
                  width="100"
                  height="100"
                />
              </td>
            </tr>

            <!-- Notification Icon -->
            <tr>
              <td style="padding: 48px 48px 32px; text-align: center">
                <div
                  style="
                    background-color: #3b82f6;
                    border-radius: 50%;
                    width: 64px;
                    height: 64px;
                    margin: 0 auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span
                    style="
                      color: white;
                      font-size: 24px;
                      font-weight: bold;
                    "
                  >
                    🔔
                  </span>
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
                  Hi {{recipientName}},
                </h1>
                
                <!-- Notification Card -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background-color: #f8fafc;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    margin-bottom: 24px;
                  "
                >
                  <tr>
                    <td style="padding: 24px">
                      <p
                        style="
                          margin: 0 0 16px;
                          color: #111827;
                          font-size: 16px;
                          font-weight: 600;
                          line-height: 24px;
                        "
                      >
                        {{message}}
                      </p>
                      <p
                        style="
                          margin: 0;
                          color: #6b7280;
                          font-size: 14px;
                          line-height: 20px;
                        "
                      >
                        From: <strong>{{senderName}}</strong> (@{{senderUsername}})
                      </p>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 0 0 32px;
                    color: #4b5563;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;
                  "
                >
                  You can view this notification and manage your preferences by visiting your dashboard.
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
                        href="{{appUrl}}/notifications"
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
                        View Notifications
                      </a>
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
                <p
                  style="
                    margin: 0 0 16px;
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 20px;
                  "
                >
                  You're receiving this email because you have email notifications enabled for this type of activity.
                </p>
                <p
                  style="
                    margin: 0 0 24px;
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 20px;
                  "
                >
                  <a
                    href="{{appUrl}}/settings/notifications"
                    style="color: #3b82f6; text-decoration: none"
                  >
                    Manage notification preferences
                  </a>
                </p>
                
                <!-- Social Links -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin-bottom: 16px"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{githubUrl}}"
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
                  © {{year}} TechyComm. All rights reserved.
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

export default notificationEmailTemplateEn;

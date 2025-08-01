const notificationEmailTemplateEs = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nueva Notificación</title>
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
                  src="https://lh3.googleusercontent.com/pw/AP1GczP42usITm10yc2j45bzIWFZnuLDmIrVLOr_aGpSqMnQqZiXxGEdAKbOv103csKm-18I8edfCNHjwzv4lXiCDllEns4BD6fJxG-08v1D2NOqGsqZ8L1W3gFqSTE95lxzKeL3RJqK6jlgvYDITEbrjsM=w605-h605-s-no-gm?authuser=0"
                  alt="Logo de TechyComm"
                  style="width: 100px; height: 100px; display: block; margin: 0 auto;border-radius: 50%; overflow:hidden;"
                  width="100"
                  height="100"
                />
              </td>
            </tr>

            <!-- Notification Icon -->
            <tr>
              <td style="padding: 48px 48px 32px; text-align: center">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td
                      style="
                        background-color: #3b82f6;
                        border-radius: 50%;
                        width: 64px;
                        height: 64px;
                        text-align: center;
                        vertical-align: middle;
                        line-height: 64px;
                        font-size: 24px;
                        color: white;
                      "
                    >
                      🔔
                    </td>
                  </tr>
                </table>
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
                  Hola {{recipientName}},
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
                        De: <strong>{{senderName}}</strong> (@{{senderUsername}})
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
                  Puedes ver esta notificación y gestionar tus preferencias visitando tu panel de control.
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
                        Ver Notificaciones
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
                  Recibes este correo porque tienes las notificaciones por email habilitadas para este tipo de actividad.
                  Para soporte, contáctanos en techycommblog@gmail.com
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
                    Gestionar preferencias de notificaciones
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
                        href="https://github.com/davidfcopozo/techy-comm-blog"
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
                  © {{year}} TechyComm. Todos los derechos reservados.
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

export default notificationEmailTemplateEs;

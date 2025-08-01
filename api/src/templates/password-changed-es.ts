const passwordChangedTemplateEs = `
<!DOCTYPE html>
<html
  lang="es"
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
    <title>Contraseña Cambiada</title>
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
      /* Mobile Styles */
      @media only screen and (max-width: 600px) {
        .email-container {
          max-width: 100% !important;
          margin: auto !important;
        }
        .fluid {
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .stack-column,
        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }
        .stack-column-center {
          text-align: center !important;
        }
        .center-on-narrow {
          text-align: center !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
        }
        table.center-on-narrow {
          display: inline-block !important;
        }
        .email-container p {
          font-size: 17px !important;
        }
      }
    </style>
  </head>
  <body
    width="100%"
    style="
      margin: 0;
      padding: 0 !important;
      mso-line-height-rule: exactly;
      background-color: #f1f3f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    "
  >
    <center style="width: 100%; background-color: #f1f3f4">
      <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f3f4;">
    <tr>
    <td>
    <![endif]-->

      <!-- Visually Hidden Preheader Text -->
      <div
        style="
          display: none;
          font-size: 1px;
          line-height: 1px;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          font-family: sans-serif;
        "
      >
        Tu contraseña de TechyComm ha sido cambiada exitosamente. Si no fuiste tú, contacta a soporte inmediatamente.
      </div>

      <div style="max-width: 600px; margin: 0 auto" class="email-container">
        <!--[if mso]>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
            <tr>
            <td>
            <![endif]-->

        <!-- Email Body -->
        <table
          align="center"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="margin: auto"
        >
          <!-- Logo Header -->
          <tr>
            <td
              style="
                background-color: #ffffff;
                padding: 40px 20px 20px;
                text-align: center;
              "
            >
              <img
                src="https://lh3.googleusercontent.com/pw/AP1GczMpGnJWrwihWm_UlZLZK7GJceYT0qrTg2y2l2s34hi29vIy9as-X-ZxbYYBa_LaDB98NMNHg7u-pBBwsX4qtjxJMEoKzHFMtTHk5NuEojcHk0n5vNkY74ySjO-QCILknogsCNpFEU-5A6Cx2csP5Ug=w512-h512-s-no-gm?authuser=0"
                width="40"
                height="40"
                alt="TechyComm"
                border="0"
                style="
                  height: auto;
                  background: #ffffff;
                  font-family: sans-serif;
                  font-size: 15px;
                  line-height: 15px;
                  color: #555555;
                  border-radius: 8px;
                "
              />
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td
              style="
                background-color: #ffffff;
                padding: 20px;
                text-align: center;
              "
            >
              <div
                style="
                  background-color: #10b981;
                  border-radius: 50%;
                  width: 80px;
                  height: 80px;
                  margin: 0 auto;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #ffffff; padding: 20px 40px 40px">
              <h1
                style="
                  margin: 0 0 20px;
                  font-family: sans-serif;
                  font-size: 32px;
                  line-height: 40px;
                  color: #111827;
                  font-weight: 700;
                  text-align: center;
                "
              >
                Contraseña Cambiada
              </h1>

              <p
                style="
                  margin: 0 0 16px;
                  font-family: sans-serif;
                  font-size: 16px;
                  line-height: 26px;
                  color: #374151;
                "
              >
                Hola {{name}}
              </p>

              <p
                style="
                  margin: 0 0 30px;
                  font-family: sans-serif;
                  font-size: 16px;
                  line-height: 26px;
                  color: #374151;
                "
              >
                Tu contraseña de TechyComm ha sido cambiada exitosamente. Si fuiste tú quien realizó este cambio, puedes ignorar este correo electrónico.
              </p>

              <!-- Security Details Card -->
              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                width="100%"
                style="
                  background-color: #f8fafc;
                  border-radius: 8px;
                  margin: 30px 0;
                "
              >
                <tr>
                  <td style="padding: 24px">
                    <h2
                      style="
                        margin: 0 0 16px;
                        font-family: sans-serif;
                        font-size: 18px;
                        line-height: 24px;
                        color: #111827;
                        font-weight: 600;
                      "
                    >
                      Detalles del Cambio
                    </h2>
                    <p
                      style="
                        margin: 0 0 8px;
                        font-family: sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        color: #4b5563;
                      "
                    >
                      <strong>Hora:</strong> {{time}}
                    </p>
                    <p
                      style="
                        margin: 0 0 8px;
                        font-family: sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        color: #4b5563;
                      "
                    >
                      <strong>Dirección IP:</strong> {{ip}}
                    </p>
                    <p
                      style="
                        margin: 0 0 8px;
                        font-family: sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        color: #4b5563;
                      "
                    >
                      <strong>Ubicación estimada:</strong> {{location}}
                    </p>
                    <p
                      style="
                        margin: 0;
                        font-family: sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        color: #4b5563;
                      "
                    >
                      <strong>Cuenta:</strong> {{email}}
                    </p>
                  </td>
                </tr>
              </table>

              {{#if_proxy}}
              <!-- Security Warning -->
              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                width="100%"
                style="
                  background-color: #fef2f2;
                  border-radius: 8px;
                  border-left: 4px solid #ef4444;
                  margin: 30px 0;
                "
              >
                <tr>
                  <td style="padding: 20px">
                    <h3
                      style="
                        margin: 0 0 12px;
                        font-family: sans-serif;
                        font-size: 16px;
                        line-height: 20px;
                        color: #dc2626;
                        font-weight: 600;
                      "
                    >
                      ⚠️ Advertencia de Seguridad
                    </h3>
                    <p
                      style="
                        margin: 0;
                        font-family: sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        color: #7f1d1d;
                      "
                    >
                      Detectamos que este cambio se realizó desde una VPN o proxy. Si no fuiste tú, contacta a nuestro equipo de soporte inmediatamente.
                    </p>
                  </td>
                </tr>
              </table>
              {{/if_proxy}}

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 30px 0;
                "
              />

              <div
                style="
                  background-color: #fef3c7;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 30px 0;
                  border-left: 4px solid #f59e0b;
                "
              >
                <h3
                  style="
                    margin: 0 0 12px;
                    font-family: sans-serif;
                    font-size: 16px;
                    line-height: 20px;
                    color: #92400e;
                    font-weight: 600;
                  "
                >
                  ¿No fuiste tú?
                </h3>
                <p
                  style="
                    margin: 0 0 15px;
                    font-family: sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    color: #78350f;
                  "
                >
                  Si no cambiaste tu contraseña, tu cuenta podría estar comprometida. Contacta a nuestro equipo de soporte inmediatamente.
                </p>
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        background-color: #dc2626;
                        border-radius: 6px;
                      "
                    >
                      <a
                        href="{{securitySettingsUrl}}"
                        style="
                          background-color: #dc2626;
                          border: 15px solid #dc2626;
                          font-family: sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          text-decoration: none;
                          color: #ffffff;
                          display: block;
                          font-weight: 600;
                          border-radius: 6px;
                        "
                      >
                        Revisar Configuración de Seguridad
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <p
                style="
                  margin: 0;
                  font-family: sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                Para tu seguridad, todas las sesiones activas han sido cerradas. Necesitarás iniciar sesión nuevamente con tu nueva contraseña.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                background-color: #f8fafc;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              "
            >
              <p
                style="
                  margin: 0 0 16px;
                  font-family: sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #6b7280;
                "
              >
                ¿Necesitas ayuda? Contáctanos en
                <a
                  href="mailto:techycommblog@gmail.com"
                  style="color: #3b82f6; text-decoration: none"
                >
                  techycommblog@gmail.com
                </a>
              </p>

              <p
                style="
                  margin: 0;
                  font-family: sans-serif;
                  font-size: 12px;
                  line-height: 16px;
                  color: #9ca3af;
                "
              >
                © {{year}} TechyComm. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>

        <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
      </div>

      <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->
    </center>
  </body>
</html>
`;

export default passwordChangedTemplateEs;

const passwordResetTemplateEs = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Restablecer tu Contraseña</title>
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
      }
      /* Base styles */
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f8fafc;
        padding-bottom: 40px;
      }
      .webkit {
        max-width: 600px;
        margin: 0 auto;
      }
      .outer {
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        border-collapse: collapse;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <div class="webkit">
        <table class="outer" align="center">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center">
              <table width="100%" style="border-spacing: 0">
                <tr>
                  <td style="text-align: center">
                    <img
                      src="https://lh3.googleusercontent.com/pw/AP1GczMpGnJWrwihWm_UlZLZK7GJceYT0qrTg2y2l2s34hi29vIy9as-X-ZxbYYBa_LaDB98NMNHg7u-pBBwsX4qtjxJMEoKzHFMtTHk5NuEojcHk0n5vNkY74ySjO-QCILknogsCNpFEU-5A6Cx2csP5Ug=w512-h512-s-no-gm?authuser=0"
                      alt="TechyComm"
                      width="40"
                      height="40"
                      style="
                        display: block;
                        margin: 0 auto;
                        border-radius: 8px;
                      "
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Icon -->
          <tr>
            <td style="padding: 0 40px; text-align: center">
              <div
                style="
                  width: 64px;
                  height: 64px;
                  background-color: #fef3c7;
                  border-radius: 50%;
                  margin: 0 auto 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px">
              <h1
                style="
                  margin: 0 0 24px;
                  font-size: 32px;
                  font-weight: 700;
                  color: #111827;
                  text-align: center;
                  line-height: 1.2;
                "
              >
                Solicitud de Restablecimiento de Contraseña
              </h1>

              <p
                style="
                  margin: 0 0 16px;
                  font-size: 16px;
                  color: #374151;
                  text-align: left;
                "
              >
                Hola {{name}}
              </p>

              <p
                style="
                  margin: 0 0 24px;
                  font-size: 16px;
                  color: #374151;
                  text-align: left;
                "
              >
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, por favor usa el botón de abajo para restablecer tu contraseña.
              </p>

              <!-- Reset Button -->
              <table
                width="100%"
                style="border-spacing: 0; margin: 32px 0"
              >
                <tr>
                  <td align="center">
                    <a
                      href="{{resetLink}}"
                      style="
                        display: inline-block;
                        background-color: #dc2626;
                        color: #ffffff;
                        font-size: 16px;
                        font-weight: 600;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        text-align: center;
                      "
                    >
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <p
                style="
                  margin: 0 0 24px;
                  font-size: 14px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
              </p>

              <p
                style="
                  margin: 0 0 32px;
                  font-size: 14px;
                  color: #3b82f6;
                  text-align: center;
                  word-break: break-all;
                  background-color: #f8fafc;
                  padding: 12px;
                  border-radius: 6px;
                  border: 1px solid #e5e7eb;
                "
              >
                {{resetLink}}
              </p>

              <!-- Security Information -->
              <div
                style="
                  background-color: #f8fafc;
                  border-radius: 8px;
                  padding: 24px;
                  margin: 32px 0;
                  border-left: 4px solid #3b82f6;
                "
              >
                <h3
                  style="
                    margin: 0 0 12px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                  "
                >
                  Información de Seguridad
                </h3>
                <p
                  style="
                    margin: 0 0 8px;
                    font-size: 14px;
                    color: #4b5563;
                  "
                >
                  <strong>Hora de solicitud:</strong> {{time}}
                </p>
                <p
                  style="
                    margin: 0 0 8px;
                    font-size: 14px;
                    color: #4b5563;
                  "
                >
                  <strong>Dirección IP:</strong> {{ip}}
                </p>
                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    color: #4b5563;
                  "
                >
                  <strong>Ubicación estimada:</strong> {{location}}
                </p>
              </div>

              {{#if_proxy}}
              <div
                style="
                  background-color: #fef2f2;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 24px 0;
                  border-left: 4px solid #ef4444;
                "
              >
                <h4
                  style="
                    margin: 0 0 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #dc2626;
                  "
                >
                  ⚠️ Advertencia de Seguridad
                </h4>
                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    color: #7f1d1d;
                  "
                >
                  Detectamos que esta solicitud proviene de una VPN o proxy. Si no fuiste tú quien hizo esta solicitud, por favor contacta a nuestro equipo de soporte inmediatamente.
                </p>
              </div>
              {{/if_proxy}}

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 32px 0;
                "
              />

              <p
                style="
                  margin: 0 0 16px;
                  font-size: 14px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
              </p>

              <p
                style="
                  margin: 0;
                  font-size: 14px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo electrónico de manera segura. Tu contraseña permanecerá sin cambios.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                background-color: #f8fafc;
                padding: 32px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              "
            >
              <p
                style="
                  margin: 0 0 16px;
                  font-size: 14px;
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
                  font-size: 12px;
                  color: #9ca3af;
                "
              >
                © {{year}} TechyComm. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
</html>
`;

export default passwordResetTemplateEs;

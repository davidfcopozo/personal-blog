const verificationEmailTemplateEs = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>Verifica tu Dirección de Correo Electrónico</title>
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
            overflow: hidden;
          "
        >
          <!-- Header -->
          <tr>
            <td
              style="
                background-color: #ffffff;
                padding: 32px 40px;
                text-align: center;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              <img
                src="{{logo_src}}"
                alt="TechyComm Logo"
                style="
                  display: block;
                  width: 80px;
                  height: 80px;
                  margin: 0 auto;
                "
                width="80"
                height="80"
              />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px">
              <h1
                style="
                  margin: 0 0 24px 0;
                  color: #111827;
                  font-size: 28px;
                  font-weight: 700;
                  line-height: 1.2;
                  text-align: center;
                "
              >
                ¡Verifica tu dirección de correo electrónico!
              </h1>

              <p
                style="
                  margin: 0 0 24px 0;
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                  text-align: left;
                "
              >
                Hola {{firstName}},
              </p>

              <p
                style="
                  margin: 0 0 32px 0;
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                  text-align: left;
                "
              >
                ¡Gracias por registrarte en TechyComm! Para activar tu cuenta y comenzar a usar todas nuestras funciones, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo.
              </p>

              <!-- CTA Button -->
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
                        background-color: #030712;
                        color: #ffffff;
                        font-size: 16px;
                        font-weight: 600;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        text-align: center;
                      "
                    >
                      Verificar Correo Electrónico
                    </a>
                  </td>
                </tr>
              </table>

              <p
                style="
                  margin: 32px 0 0 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                  text-align: center;
                "
              >
                Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
              </p>

              <p
                style="
                  margin: 8px 0 0 0;
                  color: #3b82f6;
                  font-size: 14px;
                  line-height: 1.6;
                  text-align: center;
                  word-break: break-all;
                "
              >
                {{verification_url}}
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 32px 0;
                "
              />

              <p
                style="
                  margin: 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                  text-align: center;
                "
              >
                Este enlace de verificación expirará en 24 horas por razones de seguridad.
              </p>

              <p
                style="
                  margin: 16px 0 0 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                  text-align: center;
                "
              >
                Si no creaste una cuenta con nosotros, puedes ignorar este correo electrónico de manera segura.
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
                  margin: 0 0 16px 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                ¿Necesitas ayuda? Contáctanos en
                <a
                  href="mailto:support@techycomm.com"
                  style="color: #3b82f6; text-decoration: none"
                >
                  support@techycomm.com
                </a>
              </p>

              <p
                style="
                  margin: 0;
                  color: #6b7280;
                  font-size: 12px;
                  line-height: 1.6;
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

export default verificationEmailTemplateEs;

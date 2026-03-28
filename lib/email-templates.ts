/**
 * NodeFlow Institutional Email Templates
 * Uses inline CSS for maximum compatibility with Resend and top email clients.
 */

export const WelcomeEmail = (username: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SmartBugMedia activation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1A2E; border-radius: 32px; border: 1px solid rgba(61, 214, 200, 0.2); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0 20px 0;">
              <h1 style="color: #3DD6C8; font-size: 32px; font-weight: 900; margin: 0; font-style: italic; letter-spacing: -1px;">
                SmartBugMedia<span style="color: #E34304;">.</span>
              </h1>
              <p style="color: rgba(61, 214, 200, 0.6); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; margin-top: 8px;">
                Institutional Distribution Protocol
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 0 50px 40px 50px; text-align: center;">
              <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome, agent ${username}</h2>
              <p style="color: #94A3B8; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                Your node has been successfully provisioned within the SmartBugMedia ecosystem. You are now authorized to participate in premium task distribution and optimization sequences.
              </p>
              
              <!-- Action Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 16px; background-color: #3DD6C8;">
                    <a href="https://nodeflow-xi.vercel.app/home" target="_blank" style="font-size: 14px; font-weight: 900; color: #0F172A; text-decoration: none; padding: 18px 40px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                      Initialize Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(0,0,0,0.2); padding: 30px 50px; text-align: center;">
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                If you did not request this activation, please ignore this email.<br>
                &copy; 2025 SmartBugMedia Global. All rights reserved.
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

export const PasswordResetEmail = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SmartBugMedia Protocol Recovery</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1A2E; border-radius: 32px; border: 1px solid rgba(227, 67, 4, 0.2); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0 20px 0;">
              <h1 style="color: #3DD6C8; font-size: 32px; font-weight: 900; margin: 0; font-style: italic; letter-spacing: -1px;">
                SmartBugMedia<span style="color: #E34304;">.</span>
              </h1>
              <p style="color: #E34304; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; margin-top: 8px;">
                Security Override Protocol
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 0 50px 40px 50px; text-align: center;">
              <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">Identity Re-Verification</h2>
              <p style="color: #94A3B8; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                We have received a request to bypass your node's existing security credentials. Click the button below to initialize the password reset sequence. If you did not request this, please secure your account immediately.
              </p>
              
              <!-- Action Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 16px; background-color: #E34304;">
                    <a href="${resetLink}" target="_blank" style="font-size: 14px; font-weight: 900; color: #FFFFFF; text-decoration: none; padding: 18px 40px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 30px;">
                This link will expire in 2 hours for security compliance.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(0,0,0,0.2); padding: 30px 50px; text-align: center;">
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                SmartBugMedia Security Division<br>
                Unauthorized access is strictly prohibited.
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

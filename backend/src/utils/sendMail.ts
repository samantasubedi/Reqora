import { transporter } from "../lib/sendMail";

type sendMailType = {
  senderEmail: string;
  receiverEmail: string;
  companyName: string;
  message: string;
  inviteUrl: string;
};
export const sendMail = ({
  senderEmail,
  receiverEmail,
  companyName,
  message,
  inviteUrl,
}: sendMailType) => {
  transporter.sendMail({
    from: senderEmail,
    to: receiverEmail,
    subject: `Invitation to Join ${companyName} on Reqora`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You're Invited to ${companyName}</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4ff; font-family:'Georgia', serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(37,99,235,0.10);">

          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%); padding: 44px 40px 36px; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:#bfdbfe; font-family:'Arial', sans-serif; font-weight:600;">You have been invited to join</p>
              <h1 style="margin:0; font-size:30px; font-weight:700; color:#ffffff; font-family:'Georgia', serif; letter-spacing:-0.5px;">
                ${companyName}
              </h1>
              <p style="margin:10px 0 0; font-size:13px; color:#93c5fd; font-family:'Arial', sans-serif;">via Reqora</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 0;">

              <p style="margin:0 0 24px; font-size:16px; color:#374151; line-height:1.7; font-family:'Arial', sans-serif;">
                Hi there,
              </p>

              <p style="margin:0 0 24px; font-size:16px; color:#374151; line-height:1.7; font-family:'Arial', sans-serif;">
                You've been personally invited to join <strong style="color:#1e40af;">${companyName}</strong> on <strong>Reqora</strong>. Click the button below to accept and get started.
              </p>

              ${
                message
                  ? `
              <!-- Admin Message Block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="
                    background: #eff6ff;
                    border-left: 4px solid #2563eb;
                    border-radius: 0 10px 10px 0;
                    padding: 18px 22px;
                  ">
                    <p style="margin:0 0 6px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#2563eb; font-family:'Arial', sans-serif; font-weight:700;">Message from the team</p>
                    <p style="margin:0; font-size:15px; color:#1e3a8a; line-height:1.7; font-family:'Georgia', serif; font-style:italic;">
                      "${message}"
                    </p>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}" style="
                      display: inline-block;
                      padding: 15px 40px;
                      background: linear-gradient(135deg, #1e40af, #2563eb);
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: 700;
                      font-size: 16px;
                      font-family: 'Arial', sans-serif;
                      letter-spacing: 0.5px;
                      box-shadow: 0 4px 14px rgba(37,99,235,0.35);
                    ">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p style="font-size:13px; color:#6b7280; text-align:center; font-family:'Arial', sans-serif; margin:0 0 32px;">
                Button not working? 
                <a href="${inviteUrl}" style="color:#2563eb; text-decoration:underline; word-break:break-all;">${inviteUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px; border-top: 1px solid #e5e7eb;">
              <p style="margin:0; font-size:14px; color:#6b7280; font-family:'Arial', sans-serif; line-height:1.8;">
                Best regards,<br/>
                <strong style="color:#1e3a8a;">${companyName}</strong><br/>
                <span style="font-size:12px; color:#9ca3af;">Powered by Reqora</span>
              </p>
            </td>
          </tr>

          <!-- Bottom Bar -->
          <tr>
            <td style="background:#1e3a8a; padding:14px 40px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#93c5fd; font-family:'Arial', sans-serif; letter-spacing:1px;">
                This invitation was sent via Reqora · If you didn't expect this, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
  });
};

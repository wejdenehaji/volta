import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmailOTP(to: string, code: string) {
  await transporter.sendMail({
    from: `"Volta" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your verification code',
    text: `Your verification code is: ${code}. Valid for 10 minutes. Do not share this code.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:60px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:40px 48px 36px;">

              <!-- Title -->
              <h2 style="margin:0 0 10px;color:#ffffff;font-size:22px;font-weight:600;">
                Verify your identity
              </h2>
              <p style="margin:0 0 32px;color:#6b7c6b;font-size:14px;line-height:1.6;">
                Enter this code to complete verification. It expires in <span style="color:#aaa;">10 minutes</span>.
              </p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#111;border-radius:10px;padding:28px;text-align:center;">
                    <span style="color:#4caf50;font-size:44px;font-weight:700;letter-spacing:14px;font-family:'Courier New',monospace;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="margin:0;color:#3d4d3d;font-size:12px;line-height:1.6;">
                Never share this code. If you didn't request it, ignore this email.
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
}
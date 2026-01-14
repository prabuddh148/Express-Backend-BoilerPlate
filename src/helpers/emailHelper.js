import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
import { EMAIL_CONFIG } from "../config/emailConfig.js";
// const env = process.env.NODE_ENV || "development";
// const config = EMAIL_CONFIG[env];

const mailFrom = EMAIL_CONFIG.mailFrom;
const sendgridApiKey = EMAIL_CONFIG.sendgridApiKey;

const EmailHelper = {

    sendOtpMail: async (email, otp) => {
        try {
            sgMail.setApiKey(sendgridApiKey);
            const body = `
          <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glocalview OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f0f9ff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f9ff">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px; border-radius:10px; border-top:6px solid #0260FF;">

            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <h1 style="margin:0; color:#0260FF;">Welcome</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="font-size:16px; color:#334155; padding-bottom:20px;">
                <p>Hello,</p>
                <p>Thank you for signing up ! Use the OTP code below to complete your verification process:</p>
              </td>
            </tr>

            <!-- OTP Code -->
            <tr>
              <td align="center" style="padding:30px 0;">
                <span style="display:inline-block; font-size:36px; letter-spacing:6px; color:#0c4a6e; background-color:#e0f2fe; padding:16px 30px; border-radius:8px;">${otp}</span>
              </td>
            </tr>

            <!-- Info -->
            <tr>
              <td style="font-size:16px; color:#334155; padding-bottom:20px;">
                <p>This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="font-size:13px; color:#64748b; padding-top:40px;">
                <p>Need help? Contact our <a href="mailto:support@glocalview.com" style="color:#0260FF; text-decoration:none;">support team</a>.</p>
                <p>&copy; ${new Date().getFullYear()} Glocalview. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
        `;

            const message = {
                from: mailFrom,
                to: email,
                subject: "Signup OTP",
                html: body,
                attachments: body.attachments,
            };

            const mail = await sgMail.send(message);

            return mail;
        } catch (error) {
            // console.error("Error sending email:", error.response.body);
            return error.message;
        }
    },


};

export default EmailHelper;

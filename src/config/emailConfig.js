import dotenv from "dotenv";
dotenv.config();

export const EMAIL_CONFIG = {
  mailFrom: process.env.MAIL_FROM,
  sendgridApiKey: process.env.SENDGRID_API_KEY
};

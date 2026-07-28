import nodemailer from 'nodemailer';

export const getMailer = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', // Defaults to Gmail, adjust if using Outlook or another provider
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const getFromEmail = () => {
  return `"Yuvenza '26" <${process.env.SMTP_USER}>`;
};

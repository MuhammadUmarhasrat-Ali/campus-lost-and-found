import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const isConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

  if (!isConfigured) {
    console.log('--------------------------------------------------');
    console.log('[Dev Email System - Simulated Dispatch]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('--------------------------------------------------');
    return {
      success: true,
      simulated: true,
      message: 'SMTP not configured. Email logged to console for testing/development.',
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Campus Lost & Found" <noreply@campuslostfound.edu>',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};


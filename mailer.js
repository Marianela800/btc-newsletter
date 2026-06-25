const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (16 chars)
    },
  });
}

async function sendNewsletter(htmlContent, date) {
  const transporter = createTransporter();

  const dateStr = date || new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const mailOptions = {
    from: `"₿ Bitcoin Daily" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    subject: `₿ Bitcoin Daily — ${dateStr}`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email enviado: ${info.messageId}`);
  return info;
}

module.exports = { sendNewsletter };

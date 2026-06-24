const sgMail = require("@sendgrid/mail");

const emailConfigured = Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_SENDER);

if (emailConfigured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async ({ to, subject, text }) => {
  if (!emailConfigured || !to) {
    return;
  }

  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_SENDER,
      subject,
      text,
    });
  } catch (error) {
    console.error("Errore invio email:", error.message);
  }
};

module.exports = sendEmail;


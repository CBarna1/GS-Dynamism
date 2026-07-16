// backend/services/emailService.js
// Email sending is currently disabled. Configure EMAIL_USER, EMAIL_PASSWORD,
// and update the transporter settings when ready to enable.
const crypto = require('crypto');

// Generate activation token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send welcome email with activation link
const sendWelcomeEmail = async (menteeEmail, menteeName, activationToken) => {
  console.log(`[Email disabled] Would send welcome email to ${menteeEmail} (${menteeName})`);
  console.log(`[Email disabled] Activation link: ${process.env.FRONTEND_URL}/mentee/set-password/${activationToken}`);
  return { success: true };
};
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
// Send rejection email
const sendRejectionEmail = async (menteeEmail, menteeName) => {
  console.log(`[Email disabled] Would send rejection email to ${menteeEmail} (${menteeName})`);
  return { success: true };
};

// Generic send email
const sendEmail = async (to, subject, htmlBody) => {
  console.log(`[Email disabled] Would send email to ${to} — Subject: ${subject}`);
  return { success: true };
};

module.exports = {
  sendWelcomeEmail,
  sendRejectionEmail,
  sendEmail,
  generateVerificationToken
};
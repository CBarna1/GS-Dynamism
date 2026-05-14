// backend/services/emailService.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create email transporter (Namecheap mail server)
const transporter = nodemailer.createTransport({
  host: 'mail.guidingstarszm.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter at startup to get immediate errors
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Email transporter verification failed:', err.message);
    console.error('   Check EMAIL_USER and EMAIL_PASSWORD in .env file');
  } else {
    console.log('✅ Email transporter is ready');
  }
});

// Generate activation token
const generateVerificationToken = () => { // Rename to match controller
  return crypto.randomBytes(32).toString('hex');
};

// Send welcome email with activation link
const sendWelcomeEmail = async (menteeEmail, menteeName, activationToken) => {
  // Validate email address
  if (!menteeEmail || menteeEmail.trim() === '') {
    return { 
      success: false, 
      error: 'No email address provided' 
    };
  }

  // For mentee approval: link should be to password-setting page
  const activationLink = `${process.env.FRONTEND_URL}/mentee/set-password/${activationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: menteeEmail,
    subject: 'Welcome to Guiding Stars - Set Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #FF9148, #E8722E);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #FF9148, #E8722E);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #7f8c8d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://guidingstarszm.com/img/HORIZONTAL.png" alt="Guiding Stars" class="logo">
            <h1 style="margin: 0;">Welcome to Guiding Stars! 🌟</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${menteeName}!</h2>
            <p>We are excited to inform you that your application to the Guiding Stars Mentorship Program has been <strong>approved</strong>!</p>
            
            <p>To complete your account setup, please set a password by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${activationLink}" class="button">🔐 Set My Password</a>
            </div>
            
            <p><strong>This activation link will expire in 24 hours.</strong></p>
            
            <p>Once you set your password, you will be able to:</p>
            <ul>
              <li>✓ Access your mentee dashboard</li>
              <li>✓ View your mentor profile</li>
              <li>✓ Track your progress</li>
              <li>✓ Access program resources</li>
              <li>✓ Communicate with your mentor</li>
            </ul>
            
            <p>If you have any questions, feel free to reach out to us at <strong>admissions@guidingstarszm.com</strong></p>
            
            <p>Best regards,<br>
            <strong>The Guiding Stars Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2026 Guiding Stars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', menteeEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send rejection email
const sendRejectionEmail = async (menteeEmail, menteeName) => {
  // Validate email address
  if (!menteeEmail || menteeEmail.trim() === '') {
    return { 
      success: false, 
      error: 'No email address provided' 
    };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: menteeEmail,
    subject: 'Guiding Stars Application Update',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #7f8c8d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Guiding Stars Application Update</h1>
          </div>
          <div class="content">
            <h2>Dear ${menteeName},</h2>
            <p>Thank you for your interest in the Guiding Stars Mentorship Program.</p>
            
            <p>After careful consideration, we regret to inform you that we are unable to accept your application at this time. We received many qualified applications and had to make difficult decisions.</p>
            
            <p>We encourage you to apply again in the future. In the meantime, we wish you all the best in your endeavors.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            <strong>The Guiding Stars Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2026 Guiding Stars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejection email sent to:', menteeEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generic sendEmail function for any email (mentor applications, etc.)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlBody - Email body in HTML format
 */
const sendEmail = async (to, subject, htmlBody) => {
  try {
    if (!to || !subject || !htmlBody) {
      return {
        success: false,
        error: 'Missing required parameters: to, subject, htmlBody'
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlBody,
      replyTo: 'guidingstars2024@gmail.com'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// IMPORTANT: Export all functions
module.exports = {
  sendWelcomeEmail,
  sendRejectionEmail,
  sendEmail,
  generateVerificationToken
};
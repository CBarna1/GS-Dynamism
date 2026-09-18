// backend/routes/mentorApplications.js
const express = require('express');
const crypto = require('crypto');
const { MentorApplication, Content } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { verifyCaptcha } = require('../utils/captcha');

const router = express.Router();

/**
 * POST /api/mentor-applications
 * Submit a mentor application (PUBLIC - no auth required)
 */
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      professional_title,
      company,
      expertise_areas,
      professional_background,
      bio,
      availability,
      preferences,
      captcha_token,
      captcha_answer,
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !professional_title ||
      !expertise_areas ||
      !professional_background ||
      !bio ||
      !availability
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled',
      });
    }

    if (!verifyCaptcha(captcha_token, captcha_answer)) {
      return res.status(400).json({ success: false, message: 'Incorrect or expired captcha answer. Please try again.' });
    }

    // Reject if the admin has set a future application-open date
    const openDateField = await Content.findOne({ where: { key: 'mentor_apply_open_date' } });
    if (openDateField && openDateField.value) {
      const openDate = new Date(openDateField.value);
      if (!isNaN(openDate.getTime()) && new Date() < openDate) {
        return res.status(403).json({ success: false, message: 'Mentor applications are not open yet.' });
      }
    }

    // Check if email already has a pending or approved application
    const existingApp = await MentorApplication.findOne({
      where: {
        email,
        status: ['pending', 'approved'],
      },
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'An application from this email already exists',
      });
    }

    // Generate approval token
    const approval_token = crypto.randomBytes(32).toString('hex');
    const approval_token_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create application
    const application = await MentorApplication.create({
      first_name,
      last_name,
      email,
      phone: phone || null,
      professional_title,
      company: company || null,
      expertise_areas,
      professional_background,
      bio,
      availability,
      preferences: preferences || null,
      status: 'pending',
      approval_token,
      approval_token_expires,
    });

    // TODO: Send email with approval link
    // const approvalUrl = `${process.env.FRONTEND_URL}/mentor/approve/${approval_token}`;
    // await sendEmail(email, 'Mentor Application Received', `...`);

    console.log(`[MentorApp] New application from ${first_name} ${last_name} (${email})`);

    res.status(201).json({
      success: true,
      message:
        'Thank you for your application! We will review it and contact you soon.',
      application_id: application.id,
    });
  } catch (error) {
    console.error('[MentorApp] Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/mentor-applications
 * Get all applications (ADMIN ONLY)
 */
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const applications = await MentorApplication.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('[MentorApp] Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
});

/**
 * GET /api/mentor-applications/:id
 * Get a single application (ADMIN ONLY)
 */
router.get('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const application = await MentorApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('[MentorApp] Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
    });
  }
});

/**
 * PUT /api/mentor-applications/:id/approve
 * Approve an application and create mentor account (ADMIN ONLY)
 */
router.put('/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { User, Mentor } = require('../models');
    const application = await MentorApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application already ${application.status}`,
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email: application.email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email already exists',
      });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(12).toString('hex');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create User account
    const user = await User.create({
      first_name: application.first_name,
      last_name: application.last_name,
      email: application.email,
      password_hash: hashedPassword,
      role: 'mentor',
    });

    console.log('[MentorApp] User created:', user.id);

    // Create Mentor profile
    await Mentor.create({
      user_id: user.id,
      phone: application.phone,
      bio: application.bio,
      expertise_areas: application.expertise_areas,
      professional_background: application.professional_background,
      availability: application.availability,
      preferences: application.preferences,
      status: 'active',
    });

    console.log('[MentorApp] Mentor profile created for user:', user.id);

    // Update application status
    await application.update({
      status: 'approved',
      approval_token: null,
      approval_token_expires: null,
    });

    // Send approval email
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const loginUrl = `${frontendUrl}/login`;
      
      await sendEmail(
        application.email,
        'Your Mentor Application Has Been Approved! 🎉',
        `
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
      background-color: #FF9148;
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .details-box {
      background-color: #f0f0f0;
      border-left: 4px solid #FF9148;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .details-box p {
      margin: 8px 0;
      font-family: monospace;
    }
    .details-box strong {
      color: #FF9148;
    }
    .steps {
      margin: 20px 0;
    }
    .steps ol {
      padding-left: 20px;
    }
    .steps li {
      margin: 10px 0;
      line-height: 1.8;
    }
    .important {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .important strong {
      color: #856404;
    }
    .cta-button {
      display: inline-block;
      background-color: #FF9148;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #7f8c8d;
      font-size: 12px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Application Approved!</h1>
    </div>
    
    <div class="content">
      <p>Dear <strong>${application.first_name}</strong>,</p>
      
      <p>Congratulations! Your mentor application has been <strong style="color: #FF9148;">approved</strong> by Guiding Stars. We're excited to have you join our mentor community!</p>
      
      <div class="details-box">
        <p><strong>Your Mentor Account Details:</strong></p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #FF9148;">${loginUrl}</a></p>
      </div>
      
      <div class="steps">
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Log in to your mentor portal using the credentials above</li>
          <li>Update your password to something secure</li>
          <li>Complete your mentor profile with additional details</li>
          <li>Start accepting mentee matches and make an impact!</li>
        </ol>
      </div>
      
      <div class="important">
        <p><strong>⚠️ Security Notice:</strong> For your account security, please change your password immediately upon first login. Never share your temporary password with anyone.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" class="cta-button">Log In to Your Account</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
      <p>
        <strong>Email:</strong> <a href="mailto:guidingstars2024@gmail.com">guidingstars2024@gmail.com</a><br>
        <strong>Organization:</strong> Guiding Stars Mentorship Program
      </p>
      
      <p>Welcome to the Guiding Stars community! We look forward to your contributions as a mentor.</p>
      
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
      );
    } catch (emailError) {
      console.error('[MentorApp] Email send error:', emailError);
      // Don't fail the entire request if email fails
    }

    console.log(`[MentorApp] Approved: ${application.first_name} ${application.last_name}`);

    res.status(200).json({
      success: true,
      message: 'Application approved. Mentor account created and approval email sent.',
      user,
      tempPassword, // In production, only send this via secure email
    });
  } catch (error) {
    console.error('[MentorApp] Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * PUT /api/mentor-applications/:id/reject
 * Reject an application (ADMIN ONLY)
 */
router.put('/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const application = await MentorApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application already ${application.status}`,
      });
    }

    await application.update({
      status: 'rejected',
      rejection_reason: reason || null,
      approval_token: null,
      approval_token_expires: null,
    });

    // Send rejection email
    try {
      await sendEmail(
        application.email,
        'Mentor Application Status Update',
        `
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
      background-color: #666565;
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .info-box {
      background-color: #f0f0f0;
      border-left: 4px solid #FF9148;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .encouragement {
      background-color: #f0f8ff;
      border: 1px solid #87ceeb;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #7f8c8d;
      font-size: 12px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Application Status Update</h1>
    </div>
    
    <div class="content">
      <p>Dear <strong>${application.first_name}</strong>,</p>
      
      <p>Thank you for your interest in becoming a mentor with <strong>Guiding Stars</strong>. We truly appreciate the time and effort you invested in your application.</p>
      
      <p>After careful review of your submission, we have decided not to move forward with your application at this time.</p>
      
      ${reason ? `
      <div class="info-box">
        <p><strong>Feedback:</strong></p>
        <p>${reason}</p>
      </div>
      ` : ''}
      
      <div class="encouragement">
        <p><strong>Don't Be Discouraged!</strong></p>
        <p>We encourage you to reapply in the future as we're always looking for passionate mentors to join our community. Your unique skills and perspective have value, and we'd love to see you apply again.</p>
      </div>
      
      <p>If you have any questions about your application or would like constructive feedback to strengthen your next submission, please don't hesitate to reach out to us.</p>
      
      <p>
        <strong>Contact Us:</strong><br>
        Email: <a href="mailto:guidingstars2024@gmail.com">guidingstars2024@gmail.com</a>
      </p>
      
      <p>We wish you all the best in your professional journey!</p>
      
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
      );
    } catch (emailError) {
      console.error('[MentorApp] Rejection email error:', emailError);
      // Don't fail the entire request if email fails
    }

    console.log(`[MentorApp] Rejected: ${application.first_name} ${application.last_name}`);

    res.status(200).json({
      success: true,
      message: 'Application rejected and notification email sent.',
    });
  } catch (error) {
    console.error('[MentorApp] Rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject application',
    });
  }
});

/**
 * DELETE /api/mentor-applications/:id
 * Delete an application (ADMIN ONLY)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const application = await MentorApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    await application.destroy();

    res.status(200).json({
      success: true,
      message: 'Application deleted',
    });
  } catch (error) {
    console.error('[MentorApp] Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
    });
  }
});

module.exports = router;

const { Mentee, Mentor, User } = require('../models/index'); 
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { sendWelcomeEmail, sendRejectionEmail } = require('../services/emailService');

// Helper for token generation
const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

/**
 * GET ALL MENTEES (Admin)
 */
exports.getAllMentees = async (req, res) => {
  try {
    const mentees = await Mentee.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: mentees });
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * GET SINGLE MENTEE
 */
exports.getMenteeById = async (req, res) => {
  try {
    const mentee = await Mentee.findByPk(req.params.id);
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
    res.json({ success: true, data: mentee });
  } catch (error) {
    console.error('Error fetching mentee:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * CREATE MENTEE (Application Submission)
 */
exports.createMentee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, background, goals, preferences } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ success: false, message: 'First name, last name, and email are required.' });
    }

    const existingMentee = await Mentee.findOne({ where: { email } });
    if (existingMentee) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const mentee = await Mentee.create({
      first_name,
      last_name,
      email,
      phone: phone || null,
      background: background || '',
      goals: goals || '',
      preferences: preferences || '',
      password_hash: null,  // No password yet - will be set after admin approval
      application_status: 'pending',
      email_verified: false,
      verification_token: null,
      verification_token_expires: null
    });

    res.status(201).json({ success: true, message: 'Application submitted! You will receive an email once approved.', data: mentee });
  } catch (error) {
    console.error('Create Mentee Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE MENTEE (Approval & Rejection Logic)
 */
exports.updateMentee = async (req, res) => {
  try {
    const { id } = req.params;
    const { application_status } = req.body;

    const mentee = await Mentee.findByPk(id);
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });

    const oldStatus = mentee.application_status;
    const newStatus = application_status;

    if (newStatus === 'active' && oldStatus !== 'active') {
      // Admin approved - generate password-setting token
      // Account stays in 'pending' until password is set (via activateAccount)
      const verificationToken = generateVerificationToken();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await mentee.update({
        application_status: 'pending',  // Stay pending until password is set
        verification_token: verificationToken,
        verification_token_expires: tokenExpiry,
        email_verified: false
      });

      // Send approval email with password-setting link
      try {
        await sendWelcomeEmail(mentee.email, mentee.first_name, verificationToken);
      } catch (emailErr) {
        console.error('Approval email failed:', emailErr.message);
      }
    } 
    else if (newStatus === 'rejected' && oldStatus !== 'rejected') {
      await mentee.update(req.body);
      try {
        await sendRejectionEmail(mentee.email, mentee.first_name);
      } catch (emailErr) {
        console.error('Rejection email failed:', emailErr.message);
      }
    } 
    else {
      await mentee.update(req.body);
    }

    const updatedMentee = await Mentee.findByPk(id);
    res.json({ success: true, data: updatedMentee });

  } catch (error) {
    console.error('Update Mentee Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ACTIVATE ACCOUNT (Set Password)
 */
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const mentee = await Mentee.findOne({
      where: {
        verification_token: token.trim(),
        verification_token_expires: { [Op.gt]: new Date() }
      }
    });

    if (!mentee) {
      return res.status(400).json({ success: false, message: 'Invalid or expired activation link.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await mentee.update({
      password_hash: hashedPassword,
      email_verified: true,
      application_status: 'active',
      verification_token: null,
      verification_token_expires: null
    });

    res.json({ success: true, message: 'Account activated successfully!' });
  } catch (error) {
    console.error('Activation Error:', error);
    res.status(500).json({ success: false, message: 'Server error during activation.' });
  }
};

/**
 * DELETE MENTEE
 */
exports.deleteMentee = async (req, res) => {
  try {
    const mentee = await Mentee.findByPk(req.params.id);
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
    await mentee.destroy();
    res.json({ success: true, message: 'Mentee deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Aliasing verifyMentee to activateAccount for backward compatibility if needed
exports.verifyMentee = exports.activateAccount;
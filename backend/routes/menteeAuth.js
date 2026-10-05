const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Mentee } = require('../models/index'); // ✅ Import from index for consistency

const router = express.Router();

/**
 * @route   POST /api/mentee-auth/login
 * @desc    Authenticate mentee & get token
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const mentee = await Mentee.findOne({ where: { email } });

    // Check the password before revealing anything about the account's status
    const isPasswordValid = Boolean(mentee?.password_hash) && await bcrypt.compare(password, mentee.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!mentee.email_verified || mentee.application_status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is not active yet. Please use the link in your approval email to set your password.',
      });
    }

    const token = jwt.sign({ id: mentee.id, role: 'mentee' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { id: mentee.id, email: mentee.email } });

  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/mentee-auth/me
 * @desc    Get current mentee info from token
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'mentee') {
      return res.status(403).json({ success: false, message: 'Access denied: Not a mentee' });
    }

    // Get mentee info, excluding sensitive security fields
    const mentee = await Mentee.findByPk(decoded.id, {
      attributes: { 
        exclude: ['password_hash', 'verification_token', 'verification_token_expires'] 
      },
    });

    if (!mentee) {
      return res.status(404).json({ success: false, message: 'Mentee not found' });
    }

    res.json({
      success: true,
      data: mentee,
    });
  } catch (error) {
    console.error('Get mentee info error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
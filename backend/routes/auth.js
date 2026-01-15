// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates user with email and password
 * Creates JWT session token (FR-1.1, FR-1.2, FR-1.3, FR-1.6, FR-1.7)
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password (hashed with bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token (expires in 24 hours as per NFR-2.2)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // For role-based access control
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and basic user info (do NOT return password_hash)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/auth/register-test
 * TEMPORARY DEVELOPMENT ENDPOINT ONLY
 * Creates a test admin user if it doesn't exist
 * Remove this before production!
 */
router.post('/register-test', async (req, res) => {
  try {
    const testEmail = 'admin@guidingstars.com';
    const testPassword = 'password123'; // Change this in real use!

    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const [user, created] = await User.findOrCreate({
      where: { email: testEmail },
      defaults: {
        email: testEmail,
        password_hash: hashedPassword,
        role: 'admin',                // As per SRS: admin role
        first_name: 'Admin',
        last_name: 'TestUser',
      },
    });

    if (created) {
      return res.status(201).json({
        success: true,
        message: 'Test admin user created successfully',
        email: testEmail,
        password: testPassword, // Only shown once - for testing
        note: 'REMOVE THIS ENDPOINT BEFORE DEPLOYMENT',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Test admin user already exists',
        email: testEmail,
      });
    }
  } catch (error) {
    console.error('Test register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Placeholder for future endpoints (as per SRS FR-1.4, FR-1.5)
router.post('/logout', (req, res) => {
  // JWT is stateless → client just deletes token
  // Server can optionally blacklist if using refresh tokens later
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

router.post('/reset-password', (req, res) => {
  // TODO: Implement password reset flow (email token, etc.)
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

module.exports = router;
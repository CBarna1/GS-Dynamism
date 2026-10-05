const express = require('express');
const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee');
const Match = require('../models/Match');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const ProgressEntry = require('../models/ProgressEntry');

const router = express.Router();

/**
 * Middleware to verify mentee token
 */
const menteAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'mentee') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    req.menteeId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * GET /dashboard
 * Fetch profile, mentor match, and progress stats
 */
router.get('/dashboard', menteAuth, async (req, res) => {
  try {
    const menteeId = req.menteeId;

    // 1. Get mentee info - Use the updated field names from your Mentee model
    const mentee = await Mentee.findByPk(menteeId, {
      attributes: { exclude: ['password_hash', 'verification_token', 'activation_token'] },
    });

    if (!mentee) {
      return res.status(404).json({ success: false, message: 'Mentee profile not found' });
    }

    // 2. Get mentor match safely
    // We use a separate try/catch here so if the association fails, the dashboard still loads
    let match = null;
    try {
      match = await Match.findOne({
        where: { mentee_id: menteeId, status: 'active' },
        include: [
          {
            model: Mentor,
            as: 'Mentor',
            include: [{
              model: User,
              as: 'User',
              attributes: ['first_name', 'last_name', 'email']
            }],
          },
        ],
      });
    } catch (err) {
      console.error('Match Association Warning:', err.message);
    }

    // 3. Get progress entries (Limit to 5 for dashboard)
    const progressEntries = await ProgressEntry.findAll({
      where: { mentee_id: menteeId },
      order: [['created_at', 'DESC']],
      limit: 5,
    }) || [];

    // 4. Calculate stats safely (default to 0)
    const totalProgress = await ProgressEntry.count({ where: { mentee_id: menteeId } }) || 0;
    const milestonesCompleted = await ProgressEntry.count({ 
      where: { mentee_id: menteeId, status: 'milestone_completed' } 
    }) || 0;

    // 5. Build Response
    res.json({
      success: true,
      data: {
        mentee,
        mentor: match?.Mentor || null,
        matchInfo: match || null,
        recentProgress: progressEntries,
        stats: {
          totalProgress,
          milestonesCompleted,
        },
      },
    });
  } catch (error) {
    console.error('--- DASHBOARD CRASH LOG ---');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard: ' + error.message,
    });
  }
});

/**
 * GET /progress
 */
router.get('/progress', menteAuth, async (req, res) => {
  try {
    const progressEntries = await ProgressEntry.findAll({
      where: { mentee_id: req.menteeId },
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: progressEntries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load progress' });
  }
});

/**
 * PUT /profile
 */
router.put('/profile', menteAuth, async (req, res) => {
  try {
    const mentee = await Mentee.findByPk(req.menteeId);
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });

    await mentee.update(req.body);
    res.json({ success: true, message: 'Profile updated', data: mentee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

module.exports = router;
// routes/dashboard.js (new file)
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Match = require('../models/Match');

const router = express.Router();

router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalMentors = await Mentor.count();
    const activeMentees = await Mentee.count({ where: { application_status: 'active' } });
    const activeMatches = await Match.count({ where: { status: 'active' } });

    res.json({
      success: true,
      data: {
        totalMentors,
        activeMentees,
        activeMatches,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
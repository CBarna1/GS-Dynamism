// backend/routes/mentors.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Mentor = require('../models/Mentor');
const User = require('../models/User');

const router = express.Router();

// GET /api/mentors - List all mentors (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const mentors = await Mentor.findAll({
      include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }],
    });
    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/mentors - Create new mentor (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json({ success: true, data: mentor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Add PUT /:id and DELETE /:id similarly...

module.exports = router;
// backend/routes/progress.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ProgressEntry = require('../models/ProgressEntry');

const router = express.Router();

// Add progress entry (mentor or admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const entry = await ProgressEntry.create({
      ...req.body,
      mentor_id: req.user.id, // auto-set from token
    });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get progress for a mentee (add admin/mentor check later)
router.get('/mentee/:menteeId', authMiddleware, async (req, res) => {
  try {
    const entries = await ProgressEntry.findAll({
      where: { mentee_id: req.params.menteeId },
    });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
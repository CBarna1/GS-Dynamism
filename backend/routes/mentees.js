// backend/routes/mentees.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Mentee = require('../models/Mentee');

const router = express.Router();

// Public: Submit application (no auth)
router.post('/', async (req, res) => {
  try {
    const mentee = await Mentee.create({
      ...req.body,
      application_status: 'pending', // force pending
    });
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: mentee,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Get all mentees/applications
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const mentees = await Mentee.findAll();
    res.json({ success: true, data: mentees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update status / notes / assign etc.
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const mentee = await Mentee.findByPk(req.params.id);
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
    await mentee.update(req.body);
    res.json({ success: true, data: mentee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
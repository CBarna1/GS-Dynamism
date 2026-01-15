// backend/routes/matches.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Match = require('../models/Match');

const router = express.Router();

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const matches = await Match.findAll();
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({ success: true, data: match });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT and DELETE similar...

module.exports = router;
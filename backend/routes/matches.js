const express = require('express');
const { Op } = require('sequelize');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { Match, Mentor, Mentee, User } = require('../models/index'); // ✅ Use index to ensure associations are loaded
const { sendMatchNotificationEmails } = require('../services/emailService');

const router = express.Router();

// Mentees can be paired once approved; after setting their password they become 'active'
const MATCHABLE_MENTEE_STATUSES = ['approved', 'active'];

/**
 * @route   GET /api/matches
 * @desc    Get all matches with nested Mentor, User, and Mentee data
 * @access  Admin Only
 */
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        {
          model: Mentor,
          as: 'Mentor',
          include: [{
            model: User,
            as: 'User', // ✅ Crucial: Must match the alias in Mentor.js
            attributes: ['first_name', 'last_name', 'email']
          }]
        },
        {
          model: Mentee,
          as: 'Mentee', // ✅ Crucial: Must match the alias in Match.js
          attributes: ['first_name', 'last_name', 'email', 'goals', 'preferences']
        },
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: matches });
  } catch (err) {
    console.error('Fetch Matches Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   POST /api/matches
 * @desc    Create a new match between a Mentor and Mentee, and email both of them
 * @access  Admin Only
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { mentor_id, mentee_id, match_date = new Date(), notes = '' } = req.body;

    // 1. Validate mentor and mentee existence
    const mentor = await Mentor.findByPk(mentor_id, {
      include: [{ model: User, as: 'User', attributes: ['first_name', 'last_name', 'email'] }],
    });
    const mentee = await Mentee.findByPk(mentee_id);

    if (!mentor || mentor.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Mentor not found or inactive' });
    }

    if (!mentee || !MATCHABLE_MENTEE_STATUSES.includes(mentee.application_status)) {
      return res.status(400).json({ success: false, message: 'Mentee not found or not eligible for matching' });
    }

    // 2. Prevent duplicate active matches (business logic is 1-to-1)
    const existingMentorMatch = await Match.findOne({ where: { mentor_id, status: 'active' } });
    if (existingMentorMatch) {
      return res.status(400).json({ success: false, message: 'Mentor already has an active match' });
    }

    const existingMenteeMatch = await Match.findOne({ where: { mentee_id, status: 'active' } });
    if (existingMenteeMatch) {
      return res.status(400).json({ success: false, message: 'Mentee already has an active match' });
    }

    // 3. Create the Match
    const match = await Match.create({
      mentor_id,
      mentee_id,
      match_date,
      notes,
      status: 'active',
    });

    // 4. Notify both sides by email (a failed email must not undo the match)
    let emailResults = null;
    try {
      emailResults = await sendMatchNotificationEmails({
        mentor: {
          first_name: mentor.User?.first_name || '',
          last_name: mentor.User?.last_name || '',
          email: mentor.User?.email,
          expertise_areas: mentor.expertise_areas,
        },
        mentee,
      });
    } catch (emailErr) {
      console.error('Match notification email failed:', emailErr.message);
    }

    const emailsSent = Boolean(emailResults?.mentor?.success && emailResults?.mentee?.success);

    res.status(201).json({
      success: true,
      data: match,
      emailsSent,
      message: emailsSent
        ? 'Match created. Mentor and mentee have been notified by email.'
        : 'Match created, but one or more notification emails could not be sent.',
    });
  } catch (err) {
    console.error('Create Match Error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @route   GET /api/matches/unmatched
 * @desc    Get data for the matching dashboard (Available Mentors + Unmatched Mentees)
 * @access  Admin Only
 */
router.get('/unmatched', authMiddleware, adminOnly, async (req, res) => {
  try {
    const activeMatches = await Match.findAll({
      where: { status: 'active' },
      attributes: ['mentor_id', 'mentee_id'],
      raw: true,
    });
    const busyMentorIds = activeMatches.map((m) => m.mentor_id);
    const busyMenteeIds = activeMatches.map((m) => m.mentee_id);

    // Active mentors without an active match
    const mentorWhere = { status: 'active' };
    if (busyMentorIds.length) mentorWhere.id = { [Op.notIn]: busyMentorIds };

    const availableMentors = await Mentor.findAll({
      where: mentorWhere,
      include: [{
        model: User,
        as: 'User', // ✅ Added alias for consistency
        attributes: ['first_name', 'last_name', 'email'],
      }],
    });

    // Approved/active mentees without an active match
    const menteeWhere = { application_status: MATCHABLE_MENTEE_STATUSES };
    if (busyMenteeIds.length) menteeWhere.id = { [Op.notIn]: busyMenteeIds };

    const unmatchedMentees = await Mentee.findAll({
      where: menteeWhere,
      attributes: ['id', 'first_name', 'last_name', 'email', 'goals', 'preferences']
    });

    res.json({
      success: true,
      data: { availableMentors, unmatchedMentees }
    });
  } catch (err) {
    console.error('Unmatched Fetch Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   PUT /api/matches/:id
 * @desc    Update a match's status or notes
 * @access  Admin Only
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const { status, notes } = req.body;
    const updates = {};

    if (status !== undefined) {
      if (!['active', 'completed', 'terminated'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid match status' });
      }

      // Re-activating must not create a second active match for either person
      if (status === 'active' && match.status !== 'active') {
        const conflict = await Match.findOne({
          where: {
            id: { [Op.ne]: match.id },
            status: 'active',
            [Op.or]: [{ mentor_id: match.mentor_id }, { mentee_id: match.mentee_id }],
          },
        });
        if (conflict) {
          return res.status(400).json({ success: false, message: 'Mentor or mentee already has another active match' });
        }
      }
      updates.status = status;
    }

    if (notes !== undefined) updates.notes = notes;

    await match.update(updates);
    res.json({ success: true, data: match });
  } catch (err) {
    console.error('Update Match Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/matches/:id
 * @desc    Delete a match (its message history is kept in the database)
 * @access  Admin Only
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    await match.destroy();
    res.json({ success: true, message: 'Match deleted' });
  } catch (err) {
    console.error('Delete Match Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

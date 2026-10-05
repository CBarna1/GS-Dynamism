const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { Message, Mentee, Mentor, Match, User } = require('../models/index');
const { Op } = require('sequelize');

/*
 * Identity notes:
 * - Mentee JWTs carry the Mentee id; mentor JWTs carry the User id, so the
 *   mentor's Mentor id is looked up from user_id.
 * - Mentee ids and User ids come from different tables and can collide, so a
 *   message is always identified by (match_id, sender_role) — never by
 *   sender_id/recipient_id alone.
 */

const matchIncludes = [
  {
    model: Mentee,
    as: 'Mentee',
    attributes: ['id', 'first_name', 'last_name', 'email'],
  },
  {
    model: Mentor,
    as: 'Mentor',
    attributes: ['id', 'user_id'],
    include: [{ model: User, as: 'User', attributes: ['first_name', 'last_name', 'email'] }],
  },
];

/**
 * Resolve who is making the request.
 * Returns { role, id, matchWhere } or null if the account has no profile.
 */
async function getParticipant(req) {
  const { role, id } = req.user;

  if (role === 'mentee') {
    return { role, id, matchWhere: { mentee_id: id } };
  }

  if (role === 'mentor') {
    const mentor = await Mentor.findOne({ where: { user_id: id }, attributes: ['id'] });
    if (!mentor) return null;
    return { role, id: mentor.id, matchWhere: { mentor_id: mentor.id } };
  }

  if (role === 'admin') {
    return { role, id, matchWhere: {} };
  }

  return null;
}

function personName(match, role) {
  if (role === 'mentee') {
    return match.Mentee ? `${match.Mentee.first_name} ${match.Mentee.last_name}` : 'Mentee';
  }
  if (role === 'mentor') {
    return match.Mentor?.User ? `${match.Mentor.User.first_name} ${match.Mentor.User.last_name}` : 'Mentor';
  }
  return 'Guiding Stars Admin';
}

function otherPersonFor(match, myRole) {
  const otherRole = myRole === 'mentee' ? 'mentor' : 'mentee';
  const email = otherRole === 'mentee' ? match.Mentee?.email : match.Mentor?.User?.email;
  const id = otherRole === 'mentee' ? match.mentee_id : match.mentor_id;
  return { id, name: personName(match, otherRole), email: email || '', role: otherRole };
}

/**
 * Load a match the participant is allowed to see (admins can see any match).
 */
async function loadMatchFor(participant, matchId) {
  return Match.findOne({
    where: { id: matchId, ...participant.matchWhere },
    include: matchIncludes,
  });
}

/**
 * POST /api/messages - Send a message within a match
 * Body: { match_id, content }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { match_id, content } = req.body;

    if (!match_id || !content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: 'match_id and content are required' });
    }

    const participant = await getParticipant(req);
    if (!participant || participant.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Only the paired mentor and mentee can send messages' });
    }

    const match = await loadMatchFor(participant, match_id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (match.status !== 'active') {
      return res.status(400).json({ success: false, message: `This pairing is ${match.status}; new messages cannot be sent` });
    }

    const message = await Message.create({
      sender_id: participant.id,
      sender_role: participant.role,
      recipient_id: participant.role === 'mentee' ? match.mentor_id : match.mentee_id,
      match_id: match.id,
      content: String(content).trim(),
      read_at: null,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/conversations/all - One conversation per pairing of the logged-in user
 * (listed even before the first message has been sent)
 */
router.get('/conversations/all', authMiddleware, async (req, res) => {
  try {
    const participant = await getParticipant(req);
    if (!participant || participant.role === 'admin') {
      return res.json({ success: true, data: [] });
    }

    const matches = await Match.findAll({
      where: participant.matchWhere,
      include: matchIncludes,
    });

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await Message.findOne({
          where: { match_id: match.id },
          order: [['created_at', 'DESC']],
        });

        const unreadCount = await Message.count({
          where: {
            match_id: match.id,
            sender_role: { [Op.ne]: participant.role },
            read_at: null,
          },
        });

        return {
          matchId: match.id,
          matchStatus: match.status,
          otherPerson: otherPersonFor(match, participant.role),
          lastMessage: lastMessage ? {
            content: lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
            createdAt: lastMessage.created_at,
            senderRole: lastMessage.sender_role,
          } : null,
          unreadCount,
        };
      })
    );

    // Active pairings first, then most recent activity
    conversations.sort((a, b) => {
      if ((a.matchStatus === 'active') !== (b.matchStatus === 'active')) {
        return a.matchStatus === 'active' ? -1 : 1;
      }
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    res.json({ success: true, myRole: participant.role, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/unread/count - Total unread messages across the user's pairings
 */
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const participant = await getParticipant(req);
    if (!participant || participant.role === 'admin') {
      return res.json({ success: true, count: 0 });
    }

    const matches = await Match.findAll({ where: participant.matchWhere, attributes: ['id'], raw: true });
    const matchIds = matches.map((m) => m.id);

    const count = matchIds.length === 0 ? 0 : await Message.count({
      where: {
        match_id: matchIds,
        sender_role: { [Op.ne]: participant.role },
        read_at: null,
      },
    });

    res.json({ success: true, count });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/:matchId - Chat history for a pairing
 * Marks the other person's messages as read (not when an admin is viewing).
 */
router.get('/:matchId', authMiddleware, async (req, res) => {
  try {
    const participant = await getParticipant(req);
    if (!participant) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const match = await loadMatchFor(participant, req.params.matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.findAll({
      where: { match_id: match.id },
      order: [['created_at', 'ASC']],
    });

    if (participant.role !== 'admin') {
      await Message.update(
        { read_at: new Date() },
        {
          where: {
            match_id: match.id,
            sender_role: { [Op.ne]: participant.role },
            read_at: null,
          },
        }
      );
    }

    const data = messages.map((msg) => ({
      ...msg.toJSON(),
      senderName: personName(match, msg.sender_role),
    }));

    res.json({ success: true, myRole: participant.role, data });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/messages/:id/read - Mark a single message as read
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const participant = await getParticipant(req);
    if (!participant || participant.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const match = message.match_id ? await loadMatchFor(participant, message.match_id) : null;
    if (!match || message.sender_role === participant.role) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await message.update({ read_at: new Date() });
    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

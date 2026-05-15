const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { Message, Mentee, Mentor, Match, User } = require('../models/index');
const { Op } = require('sequelize');

/**
 * POST /api/messages - Send a message
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipient_id, content, match_id } = req.body;
    const sender_id = req.user.id;
    const sender_role = req.user.role; // admin, mentor, or mentee

    if (!recipient_id || !content) {
      return res.status(400).json({ success: false, message: 'recipient_id and content are required' });
    }

    const message = await Message.create({
      sender_id,
      sender_role,
      recipient_id,
      match_id: match_id || null,
      content,
      read_at: null,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/:matchId - Get chat history for a match
 */
router.get('/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch all messages for this match
    const messages = await Message.findAll({
      where: { match_id: matchId },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: Mentee,
          as: 'SenderMentee',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          required: false,
        },
        {
          model: Mentor,
          as: 'SenderMentor',
          attributes: ['id'],
          required: false,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['first_name', 'last_name', 'email'],
            },
          ],
        },
      ],
    });

    // Mark all messages from other user as read
    await Message.update(
      { read_at: new Date() },
      {
        where: {
          match_id: matchId,
          recipient_id: userId,
          read_at: null,
        },
      }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/conversations/all - Get all conversations for logged-in user
 */
router.get('/conversations/all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get all unique conversations (distinct match_ids)
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { recipient_id: userId },
        ],
      },
      attributes: ['match_id'],
      raw: true,
      group: ['match_id'],
    });

    const matchIds = conversations.map(c => c.match_id).filter(id => id !== null);

    if (matchIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Get conversation details with last message and unread count
    const conversationDetails = await Promise.all(
      matchIds.map(async (matchId) => {
        // Get the match info
        const match = await Match.findByPk(matchId, {
          include: [
            {
              model: Mentee,
              as: 'Mentee',
              attributes: ['id', 'first_name', 'last_name', 'email'],
            },
            {
              model: Mentor,
              as: 'Mentor',
              attributes: ['id'],
              include: [
                {
                  model: User,
                  as: 'User',
                  attributes: ['first_name', 'last_name', 'email'],
                },
              ],
            },
          ],
        });

        // Get last message
        const lastMessage = await Message.findOne({
          where: { match_id: matchId },
          order: [['created_at', 'DESC']],
        });

        // Count unread messages
        const unreadCount = await Message.count({
          where: {
            match_id: matchId,
            recipient_id: userId,
            read_at: null,
          },
        });

        // Determine who is the "other person"
        let otherPerson = null;
        if (userRole === 'mentee') {
          otherPerson = {
            id: match.Mentor.id,
            name: `${match.Mentor.User.first_name} ${match.Mentor.User.last_name}`,
            email: match.Mentor.User.email,
            role: 'mentor',
          };
        } else if (userRole === 'mentor') {
          otherPerson = {
            id: match.Mentee.id,
            name: `${match.Mentee.first_name} ${match.Mentee.last_name}`,
            email: match.Mentee.email,
            role: 'mentee',
          };
        }

        return {
          matchId,
          otherPerson,
          lastMessage: lastMessage ? {
            content: lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
            createdAt: lastMessage.created_at,
            senderRole: lastMessage.sender_role,
          } : null,
          unreadCount,
        };
      })
    );

    res.json({ success: true, data: conversationDetails });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/unread/count - Get total unread message count
 */
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Message.count({
      where: {
        recipient_id: userId,
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
 * PUT /api/messages/:id/read - Mark message as read
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.recipient_id !== userId) {
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

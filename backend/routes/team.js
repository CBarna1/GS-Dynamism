// backend/routes/team.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { TeamMember } = require('../models/index');
const { makeUpload } = require('../utils/upload');

const router = express.Router();
const upload = makeUpload('team');

/**
 * POST /api/team/upload - Upload a member photo (admin only)
 */
router.post('/upload', authMiddleware, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.status(201).json({ success: true, imageUrl: `/uploads/${req.file.filename}` });
});

/**
 * GET /api/team/admin/all - List ALL members, active + inactive (admin only)
 */
router.get('/admin/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const members = await TeamMember.findAll({ order: [['display_order', 'ASC'], ['id', 'ASC']] });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/team - List active members (PUBLIC)
 */
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['id', 'ASC']],
    });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/team - Create a member (admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, role, photo, description, display_order, is_active } = req.body;
    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and role are required' });
    }
    const member = await TeamMember.create({
      name, role,
      photo: photo || null,
      description: description || null,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/team/:id - Update a member (admin only)
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const { name, role, photo, description, display_order, is_active } = req.body;
    await member.update({
      name: name !== undefined ? name : member.name,
      role: role !== undefined ? role : member.role,
      photo: photo !== undefined ? photo : member.photo,
      description: description !== undefined ? description : member.description,
      display_order: display_order !== undefined ? display_order : member.display_order,
      is_active: is_active !== undefined ? is_active : member.is_active,
    });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/team/:id - Delete a member (admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await member.destroy();
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

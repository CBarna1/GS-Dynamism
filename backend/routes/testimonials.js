// backend/routes/testimonials.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { Testimonial } = require('../models/index');
const { makeUpload } = require('../utils/upload');

const router = express.Router();
const upload = makeUpload('testimonial');

/**
 * POST /api/testimonials/upload - Upload a testimonial photo (admin only)
 */
router.post('/upload', authMiddleware, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.status(201).json({ success: true, imageUrl: `/uploads/${req.file.filename}` });
});

/**
 * GET /api/testimonials/admin/all - List ALL testimonials, active + inactive (admin only)
 */
router.get('/admin/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const items = await Testimonial.findAll({ order: [['display_order', 'ASC'], ['id', 'ASC']] });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/testimonials - List active testimonials (PUBLIC)
 */
router.get('/', async (req, res) => {
  try {
    const items = await Testimonial.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['id', 'ASC']],
    });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/testimonials - Create a testimonial (admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { cohort_label, name, role, content, image, display_order, is_active } = req.body;
    if (!cohort_label || !name || !content) {
      return res.status(400).json({ success: false, message: 'Cohort label, name, and content are required' });
    }
    const item = await Testimonial.create({
      cohort_label, name,
      role: role || 'Mentee',
      content,
      image: image || null,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/testimonials/:id - Update a testimonial (admin only)
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const item = await Testimonial.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    const { cohort_label, name, role, content, image, display_order, is_active } = req.body;
    await item.update({
      cohort_label: cohort_label !== undefined ? cohort_label : item.cohort_label,
      name: name !== undefined ? name : item.name,
      role: role !== undefined ? role : item.role,
      content: content !== undefined ? content : item.content,
      image: image !== undefined ? image : item.image,
      display_order: display_order !== undefined ? display_order : item.display_order,
      is_active: is_active !== undefined ? is_active : item.is_active,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/testimonials/:id - Delete a testimonial (admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const item = await Testimonial.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    await item.destroy();
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

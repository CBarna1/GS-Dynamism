// backend/routes/graduation.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { GraduationCohort, GraduationPhoto } = require('../models/index');
const { makeUpload } = require('../utils/upload');

const router = express.Router();
const upload = makeUpload('graduation');

/**
 * GET /api/graduation - List active cohorts with their photos (PUBLIC)
 */
router.get('/', async (req, res) => {
  try {
    const cohorts = await GraduationCohort.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['id', 'ASC']],
      include: [{ model: GraduationPhoto, as: 'photos', attributes: ['id', 'image_url', 'display_order'] }],
    });
    const data = cohorts.map((c) => {
      const plain = c.toJSON();
      plain.photos = (plain.photos || []).sort((a, b) => a.display_order - b.display_order);
      let awards = [];
      try { awards = plain.awards ? JSON.parse(plain.awards) : []; } catch { awards = []; }
      plain.awards = awards;
      return plain;
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/graduation/admin/all - List ALL cohorts, active + inactive (admin only)
 * MUST be before /:id
 */
router.get('/admin/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cohorts = await GraduationCohort.findAll({
      order: [['display_order', 'ASC'], ['id', 'ASC']],
      include: [{ model: GraduationPhoto, as: 'photos', attributes: ['id', 'image_url', 'display_order'] }],
    });
    const data = cohorts.map((c) => {
      const plain = c.toJSON();
      plain.photos = (plain.photos || []).sort((a, b) => a.display_order - b.display_order);
      let awards = [];
      try { awards = plain.awards ? JSON.parse(plain.awards) : []; } catch { awards = []; }
      plain.awards = awards;
      return plain;
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/graduation - Create a cohort (admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, cohort_date, press_statement, future_text, awards, display_order, is_active } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const cohort = await GraduationCohort.create({
      title,
      cohort_date: cohort_date || null,
      press_statement: press_statement || null,
      future_text: future_text || null,
      awards: awards ? JSON.stringify(awards) : null,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    });
    res.status(201).json({ success: true, data: cohort });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/graduation/:id - Update a cohort (admin only)
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cohort = await GraduationCohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ success: false, message: 'Cohort not found' });

    const { title, cohort_date, press_statement, future_text, awards, display_order, is_active } = req.body;
    await cohort.update({
      title: title !== undefined ? title : cohort.title,
      cohort_date: cohort_date !== undefined ? cohort_date : cohort.cohort_date,
      press_statement: press_statement !== undefined ? press_statement : cohort.press_statement,
      future_text: future_text !== undefined ? future_text : cohort.future_text,
      awards: awards !== undefined ? JSON.stringify(awards) : cohort.awards,
      display_order: display_order !== undefined ? display_order : cohort.display_order,
      is_active: is_active !== undefined ? is_active : cohort.is_active,
    });
    res.json({ success: true, data: cohort });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/graduation/:id - Delete a cohort and its photos (admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cohort = await GraduationCohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ success: false, message: 'Cohort not found' });
    await cohort.destroy();
    res.json({ success: true, message: 'Cohort deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/graduation/:id/photos - Bulk-upload photos into a cohort (admin only)
 */
router.post('/:id/photos', authMiddleware, adminOnly, upload.array('files', 100), async (req, res) => {
  try {
    const cohort = await GraduationCohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ success: false, message: 'Cohort not found' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const maxOrder = await GraduationPhoto.max('display_order', { where: { cohort_id: cohort.id } });
    let nextOrder = (maxOrder || 0) + 1;

    const created = await Promise.all(
      req.files.map((file) =>
        GraduationPhoto.create({
          cohort_id: cohort.id,
          image_url: `/uploads/${file.filename}`,
          display_order: nextOrder++,
        })
      )
    );

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/graduation/photos/:photoId - Remove a single photo (admin only)
 */
router.delete('/photos/:photoId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const photo = await GraduationPhoto.findByPk(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
    await photo.destroy();
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/graduation/photos/:photoId/order - Move a photo up/down (admin only)
 * body: { direction: 'up' | 'down' }
 */
router.put('/photos/:photoId/order', authMiddleware, adminOnly, async (req, res) => {
  try {
    const photo = await GraduationPhoto.findByPk(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });

    const { direction } = req.body;
    const siblings = await GraduationPhoto.findAll({
      where: { cohort_id: photo.cohort_id },
      order: [['display_order', 'ASC'], ['id', 'ASC']],
    });
    const idx = siblings.findIndex((p) => p.id === photo.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) {
      return res.json({ success: true, data: siblings });
    }

    const a = siblings[idx];
    const b = siblings[swapIdx];
    const tmp = a.display_order;
    await a.update({ display_order: b.display_order });
    await b.update({ display_order: tmp });

    res.json({ success: true, data: siblings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

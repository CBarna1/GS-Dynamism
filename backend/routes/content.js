// backend/routes/content.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { Content } = require('../models/index');
const { makeUpload, saveOptimizedFile } = require('../utils/upload');

const router = express.Router();
const upload = makeUpload('content');

/**
 * GET /api/content - Get all content items (public - for frontend to fetch)
 */
router.get('/', async (req, res) => {
  try {
    console.log('[Content GET] Fetching all content items...');
    const contents = await Content.findAll();
    console.log('[Content GET] Found', contents.length, 'items');
    
    // Format as key-value for easy frontend access
    const contentMap = {};
    contents.forEach(item => {
      contentMap[item.key] = item.value;
    });

    console.log('[Content GET] Returning success with', contents.length, 'items');
    res.json({ success: true, data: contentMap, items: contents });
  } catch (err) {
    console.error('[Content GET] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/content/section/:section - Get all content in a section (admin)
 * MUST be before /:key route to avoid matching
 */
router.get('/section/:section', authMiddleware, adminOnly, async (req, res) => {
  try {
    const contents = await Content.findAll({ 
      where: { section: req.params.section },
      order: [['created_at', 'ASC']]
    });
    res.json({ success: true, data: contents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/content/upload - Upload image and create content (admin only)
 * MUST be before /:id route to avoid matching
 */
router.post('/upload', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { key, title, section, page, description } = req.body;

    if (!key || !title) {
      return res.status(400).json({ success: false, message: 'Key and title are required' });
    }

    const filename = await saveOptimizedFile(req.file, 'content');
    const imageUrl = `/uploads/${filename}`;

    const content = await Content.create({
      key,
      title,
      content_type: 'image',
      value: imageUrl,
      section,
      page,
      description
    });

    res.status(201).json({
      success: true,
      data: content,
      imageUrl: imageUrl
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/content/:key - Get specific content by key
 */
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ where: { key: req.params.key } });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/content - Create new content item (admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { key, title, content_type, value, section, page, description } = req.body;

    if (!key || !title) {
      return res.status(400).json({ success: false, message: 'Key and title are required' });
    }

    const content = await Content.create({
      key,
      title,
      content_type: content_type || 'textarea',
      value,
      section,
      page,
      description
    });

    res.status(201).json({ success: true, data: content });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/content/:id - Update content (admin only)
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const { title, value, description, page } = req.body;
    await content.update({
      title: title !== undefined ? title : content.title,
      value: value !== undefined ? value : content.value,
      description: description !== undefined ? description : content.description,
      page: page !== undefined ? page : content.page
    });

    res.json({ success: true, data: content });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/content/:id - Delete content (admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    await content.destroy();
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

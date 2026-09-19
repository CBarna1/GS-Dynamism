// backend/routes/blog.js
const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { BlogPost } = require('../models/index');
const { makeUpload, saveOptimizedFile } = require('../utils/upload');

const router = express.Router();
const upload = makeUpload('blog');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * POST /api/blog/upload - Upload a cover image (admin only)
 * MUST be before /:slug to avoid being swallowed by it
 */
router.post('/upload', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    const filename = await saveOptimizedFile(req.file, 'blog');
    res.status(201).json({ success: true, imageUrl: `/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process image' });
  }
});

/**
 * GET /api/blog/admin/all - List ALL posts, draft + published (admin only)
 * MUST be before /:slug
 */
router.get('/admin/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const posts = await BlogPost.findAll({ order: [['updated_at', 'DESC']] });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/blog/admin/:id - Get a single post by id, any status (admin only)
 * MUST be before /:slug
 */
router.get('/admin/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/blog - List published posts (PUBLIC)
 */
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      order: [['published_at', 'DESC']],
      attributes: ['id', 'title', 'slug', 'excerpt', 'cover_image', 'author', 'published_at'],
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/blog/:slug - Get a single published post (PUBLIC)
 */
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug, status: 'published' } });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/blog - Create a post (admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, slug, excerpt, content, cover_image, author, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const finalSlug = slug?.trim() ? slugify(slug) : slugify(title);
    const finalStatus = status === 'published' ? 'published' : 'draft';

    const post = await BlogPost.create({
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content,
      cover_image: cover_image || null,
      author: author || 'Guiding Stars Team',
      status: finalStatus,
      published_at: finalStatus === 'published' ? new Date() : null,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'A post with that slug already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/blog/:id - Update a post (admin only)
 */
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const { title, slug, excerpt, content, cover_image, author, status } = req.body;

    const wasPublished = post.status === 'published';
    const nextStatus = status === 'published' ? 'published' : status === 'draft' ? 'draft' : post.status;

    await post.update({
      title: title !== undefined ? title : post.title,
      slug: slug?.trim() ? slugify(slug) : post.slug,
      excerpt: excerpt !== undefined ? excerpt : post.excerpt,
      content: content !== undefined ? content : post.content,
      cover_image: cover_image !== undefined ? cover_image : post.cover_image,
      author: author !== undefined ? author : post.author,
      status: nextStatus,
      published_at: !wasPublished && nextStatus === 'published' ? new Date() : post.published_at,
    });

    res.json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'A post with that slug already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/blog/:id - Delete a post (admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await post.destroy();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

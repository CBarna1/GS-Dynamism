// backend/utils/upload.js
// Shared multer config + automatic compression for admin image uploads
// (content, blog, team, testimonials, graduation).
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;
const COMPRESS_THRESHOLD = 300 * 1024; // don't bother re-encoding already-small files

// Uploads are held in memory just long enough to compress, then written to
// disk under their final name — no raw multi-MB original ever hits disk.
function makeUpload(prefix) {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      cb(allowedMimes.includes(file.mimetype) ? null : new Error('Only image files are allowed'), true);
    },
    limits: { fileSize: 20 * 1024 * 1024 }, // raw upload may be large; we compress it down below
  });
}

/**
 * Resizes/compresses a multer memory-storage file (if it's a jpeg/png over
 * the size threshold) and writes it to uploadsDir under a unique name.
 * GIF/WebP pass through untouched (animated GIFs shouldn't be re-encoded).
 * Returns the generated filename (not the full path/URL).
 */
async function saveOptimizedFile(file, prefix) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const isJpeg = file.mimetype === 'image/jpeg';
  const isPng = file.mimetype === 'image/png';

  let outBuffer = file.buffer;
  let ext = path.extname(file.originalname) || (isJpeg ? '.jpg' : isPng ? '.png' : '');

  if ((isJpeg || isPng) && file.buffer.length > COMPRESS_THRESHOLD) {
    try {
      const pipeline = sharp(file.buffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
      outBuffer = isPng
        ? await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer()
        : await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
      ext = isPng ? '.png' : '.jpg';
    } catch (err) {
      console.error('[upload] Image optimization failed, saving original:', err.message);
      outBuffer = file.buffer;
    }
  }

  const filename = `${prefix}-${uniqueSuffix}${ext}`;
  fs.writeFileSync(path.join(uploadsDir, filename), outBuffer);
  return filename;
}

module.exports = { makeUpload, uploadsDir, saveOptimizedFile };

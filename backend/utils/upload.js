// backend/utils/upload.js
// Shared multer config for admin image uploads (blog, team, testimonials, graduation).
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function makeUpload(prefix) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      cb(allowedMimes.includes(file.mimetype) ? null : new Error('Only image files are allowed'), true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

module.exports = { makeUpload, uploadsDir };

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Import initializeDatabase from config
const { initializeDatabase } = require('./config/db'); 

// 2. Import the models index (this handles connection AND associations)
const { sequelize } = require('./models/index'); 

// 3. Import SEO routes
const setupSEORoutes = require('./routes/seo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SEO Routes (robots.txt, sitemap.xml, etc.) - MUST be FIRST before anything else
setupSEORoutes(app);

// Serve static files ONLY for specific file types, not as catch-all
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  // Don't serve HTML files from static (let SPA handle routing)
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') && !filePath.includes('index.html')) {
      res.status(404).end();
    }
  }
}));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/mentees', require('./routes/mentees'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/mentee-auth', require('./routes/menteeAuth'));
app.use('/api/mentee-portal', require('./routes/menteePortal'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/mentor-applications', require('./routes/mentorApplications'));
app.use('/api/mentor-portal', require('./routes/mentorPortal'));
app.use('/api/messages', require('./routes/messages'));

// SPA Fallback using middleware (works with Express 5)
// Exclude special routes that should return specific content
app.use((req, res) => {
  // Don't serve SPA for special routes
  if (req.path === '/robots.txt' || req.path === '/sitemap.xml' || req.path === '/.well-known/security.txt') {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Startup function
async function startServer() {
  try {
    // A. Create database if it doesn't exist
    await initializeDatabase();
    console.log('✓ Database initialization complete');

    // B. Test connection and initialize associations
    // (Simply requiring the index file above handles the association logic)
    await sequelize.authenticate();
    console.log('✓ MySQL connected successfully and associations initialized');

    // C. Sync database
    // Change alter to true once if you recently changed column names, then back to false
    await sequelize.sync({ alter: false }); 
    console.log('✓ Database tables synced');

    // D. Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();
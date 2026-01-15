// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, initializeDatabase } = require('./config/db'); require('./models/User');
require('./models/Mentor');
require('./models/Mentee');
require('./models/Match');
require('./models/ProgressEntry');  // <-- import instance + init function

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],  // allow Vite ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/mentees', require('./routes/mentees'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/dashboard', require('./routes/dashboard'));

async function startServer() {
    try {
        await initializeDatabase();
      
        await sequelize.authenticate();
        console.log('MySQL connected successfully');
      
        // Auto-create/update tables from models (DEV ONLY - remove or use migrations later)
        await sequelize.sync({ alter: true });  // alter: true = update schema without dropping data
        console.log('Database tables synced');
      
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT}`);
        });
      } catch (err) {
        console.error('Startup failed:', err.message);
        process.exit(1);
      }
}

startServer();
// backend/models/Mentor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: DataTypes.STRING(20),
  bio: DataTypes.TEXT,
  expertise_areas: DataTypes.TEXT,
  professional_background: DataTypes.TEXT,
  availability: DataTypes.STRING(100),
  preferences: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'mentors',
  timestamps: true,
  underscored: true,
});

// Associations (after all models are defined)
Mentor.belongsTo(require('./User'), { foreignKey: 'user_id' });

module.exports = Mentor;
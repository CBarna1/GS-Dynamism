// backend/models/Mentee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Mentee = sequelize.define('Mentee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  background: { type: DataTypes.TEXT },
  goals: { type: DataTypes.TEXT },
  preferences: { type: DataTypes.TEXT },
  application_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'completed'),
    defaultValue: 'pending',
  },
  enrollment_date: { type: DataTypes.DATEONLY },
}, {
  tableName: 'mentees',
  timestamps: true,
  underscored: true,
});

module.exports = Mentee;
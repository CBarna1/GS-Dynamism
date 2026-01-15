// backend/models/ProgressEntry.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const ProgressEntry = sequelize.define('ProgressEntry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mentee_id: { type: DataTypes.INTEGER, allowNull: false },
  mentor_id: { type: DataTypes.INTEGER, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('on_track', 'needs_attention', 'milestone_completed'),
    defaultValue: 'on_track',
  },
  notes: { type: DataTypes.TEXT },
}, {
  tableName: 'progress_entries',
  timestamps: true,
  underscored: true,
});

module.exports = ProgressEntry;
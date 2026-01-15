// backend/models/Match.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Match = sequelize.define('Match', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mentor_id: { type: DataTypes.INTEGER, allowNull: false },
  mentee_id: { type: DataTypes.INTEGER, allowNull: false },
  match_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'terminated'),
    defaultValue: 'active',
  },
  notes: { type: DataTypes.TEXT },
}, {
  tableName: 'matches',
  timestamps: true,
  underscored: true,
});

module.exports = Match;
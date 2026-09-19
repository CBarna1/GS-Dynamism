const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cohort_label: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Free-text group label, e.g. "Cohort Two Testimonials" — used to group entries into tabs',
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Mentee',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The quote itself',
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'testimonials',
  timestamps: true,
  underscored: true,
});

module.exports = Testimonial;

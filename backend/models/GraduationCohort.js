const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GraduationCohort = sequelize.define('GraduationCohort', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'e.g. "First Cohort Graduation"',
  },
  cohort_date: {
    type: DataTypes.STRING(150),
    allowNull: true,
    comment: 'Free-text date/range, e.g. "June 14, 2024" or "Feb - May 2025"',
  },
  press_statement: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'Paragraphs separated by blank lines; supports the same ![alt](url) inline image markers as blog posts',
  },
  future_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Closing/forward-looking statement shown at the end',
  },
  awards: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'JSON array of {label, name, institution}',
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
  tableName: 'graduation_cohorts',
  timestamps: true,
  underscored: true,
});

GraduationCohort.associate = (models) => {
  GraduationCohort.hasMany(models.GraduationPhoto, {
    foreignKey: 'cohort_id',
    as: 'photos',
    onDelete: 'CASCADE',
  });
};

module.exports = GraduationCohort;

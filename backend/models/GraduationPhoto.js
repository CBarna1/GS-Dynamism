const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GraduationPhoto = sequelize.define('GraduationPhoto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cohort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'graduation_photos',
  timestamps: true,
  underscored: true,
});

GraduationPhoto.associate = (models) => {
  GraduationPhoto.belongsTo(models.GraduationCohort, {
    foreignKey: 'cohort_id',
    as: 'cohort',
  });
};

module.exports = GraduationPhoto;

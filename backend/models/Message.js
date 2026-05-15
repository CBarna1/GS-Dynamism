const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_role: {
    type: DataTypes.ENUM('mentee', 'mentor', 'admin'),
    allowNull: false,
  },
  recipient_id: { type: DataTypes.INTEGER, allowNull: false },
  match_id: { type: DataTypes.INTEGER, allowNull: true }, // Link to Match table
  content: { type: DataTypes.LONGTEXT, allowNull: false },
  read_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
});

// Associations
Message.associate = (models) => {
  // Message belongs to a Mentee (sender or recipient)
  Message.belongsTo(models.Mentee, {
    foreignKey: 'sender_id',
    as: 'SenderMentee',
    constraints: false,
  });
  Message.belongsTo(models.Mentee, {
    foreignKey: 'recipient_id',
    as: 'RecipientMentee',
    constraints: false,
  });

  // Message belongs to a Mentor (sender or recipient)
  Message.belongsTo(models.Mentor, {
    foreignKey: 'sender_id',
    as: 'SenderMentor',
    constraints: false,
  });
  Message.belongsTo(models.Mentor, {
    foreignKey: 'recipient_id',
    as: 'RecipientMentor',
    constraints: false,
  });

  // Message belongs to a Match
  Message.belongsTo(models.Match, {
    foreignKey: 'match_id',
    as: 'Match',
  });
};

module.exports = Message;

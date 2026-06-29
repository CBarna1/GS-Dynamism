// backend/models/index.js
const { sequelize } = require('../config/db');
const User = require('./User');
const Mentor = require('./Mentor');
const Mentee = require('./Mentee');
const Match = require('./Match');
const ProgressEntry = require('./ProgressEntry');
const Content = require('./Content');
const Contact = require('./Contact');
const MentorApplication = require('./MentorApplication');
const Message = require('./Message');

const models = {
  User,
  Mentor,
  Mentee,
  Match,
  ProgressEntry,
  Content,
  Contact,
  MentorApplication,
  Message
};

// This loop is the magic part—it "plugs in" the associations
// backend/models/index.js snippet
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models); // This triggers the code above!
  }
});

module.exports = {
  sequelize,
  ...models
};
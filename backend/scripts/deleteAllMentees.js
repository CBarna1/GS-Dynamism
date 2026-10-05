// backend/scripts/deleteAllMentees.js
// Run with: node scripts/deleteAllMentees.js --confirm
//
// Permanently deletes every mentee and everything that only exists because
// of them:
//   - messages, progress_entries and matches (every match has a mentee)
//   - mentees (entirely)
//
// Does NOT touch: mentors, mentor login accounts, mentor_applications,
// admin accounts, content, blog posts, team, testimonials or graduation data.
// Mentors who were paired simply become available for matching again.
//
// Before deleting, a JSON backup of the affected rows is written to
// backend/backups/ (git-ignored, not web-served). Password hashes and
// verification tokens are left out of the backup on purpose.
//
// Requires the --confirm flag so it can't be run by accident.

const fs = require('fs');
const path = require('path');
const { sequelize, Mentee, Match, ProgressEntry, Message } = require('../models/index');

async function deleteAllMentees() {
  const counts = async (transaction) => ({
    mentees: await Mentee.count({ transaction }),
    matches: await Match.count({ transaction }),
    progressEntries: await ProgressEntry.count({ transaction }),
    messages: await Message.count({ transaction }),
  });

  if (!process.argv.includes('--confirm')) {
    console.log('Currently in the database:', await counts());
    console.log('\nThis will permanently delete ALL of the above (mentees, matches,');
    console.log('progress entries and messages). Mentors and admins are untouched.');
    console.log('\nRe-run with --confirm to proceed:');
    console.log('  node scripts/deleteAllMentees.js --confirm');
    await sequelize.close();
    process.exit(0);
    return;
  }

  // 1. Backup first — abort if it can't be written
  const backupDir = path.join(__dirname, '..', 'backups');
  const backupFile = path.join(backupDir, `mentees-before-delete-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  const backup = {
    createdAt: new Date().toISOString(),
    mentees: await Mentee.findAll({
      attributes: { exclude: ['password_hash', 'verification_token', 'verification_token_expires'] },
      raw: true,
    }),
    matches: await Match.findAll({ raw: true }),
    progressEntries: await ProgressEntry.findAll({ raw: true }),
    messages: await Message.findAll({ raw: true }),
  };
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), { mode: 0o600 });
  console.log('Backup written to:', backupFile);

  // 2. Delete everything in one transaction
  const t = await sequelize.transaction();
  try {
    console.log('Before:', await counts(t));

    // Plain DELETE (not TRUNCATE) so the transaction can still roll back
    await Message.destroy({ where: {}, transaction: t });
    await ProgressEntry.destroy({ where: {}, transaction: t });
    await Match.destroy({ where: {}, transaction: t });
    await Mentee.destroy({ where: {}, transaction: t });

    await t.commit();
    console.log('After:', await counts());
    console.log('\n✅ All mentees deleted. Mentors and admins were not touched.');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('❌ Delete failed, rolled back everything:', error.message);
    process.exit(1);
  }
}

deleteAllMentees();

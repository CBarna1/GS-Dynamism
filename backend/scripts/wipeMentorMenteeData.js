// backend/scripts/wipeMentorMenteeData.js
// Run with: node backend/scripts/wipeMentorMenteeData.js --confirm
//
// Clears all mentee/mentor program data for a fresh start:
//   - messages, progress_entries, matches (fully, since they only ever
//     reference mentees/mentors)
//   - mentees (entirely)
//   - mentors (entirely) + their linked login accounts in `users`
//     (role = 'mentor' only — admin accounts are never touched)
//
// Does NOT touch: mentor_applications (pending/approved/rejected
// applications), content, blog posts, team, testimonials, graduation data,
// or any admin account.
//
// Requires the --confirm flag so it can't be run by accident. Always take
// a fresh mysqldump backup before running this — it is NOT reversible.

const { sequelize, Mentee, Mentor, Match, ProgressEntry, Message, User } = require('../models/index');

async function wipeMentorMenteeData() {
  if (!process.argv.includes('--confirm')) {
    console.log('This will permanently delete ALL mentees, mentors, matches, progress entries,');
    console.log('and messages, plus mentor login accounts. Admin accounts are untouched.');
    console.log('\nRe-run with --confirm to proceed:');
    console.log('  node scripts/wipeMentorMenteeData.js --confirm');
    process.exit(0);
  }

  const t = await sequelize.transaction();
  try {
    const before = {
      mentees: await Mentee.count({ transaction: t }),
      mentors: await Mentor.count({ transaction: t }),
      matches: await Match.count({ transaction: t }),
      progressEntries: await ProgressEntry.count({ transaction: t }),
      messages: await Message.count({ transaction: t }),
      mentorUsers: await User.count({ where: { role: 'mentor' }, transaction: t }),
    };
    console.log('Before:', before);

    // Plain DELETE (not TRUNCATE) — MySQL/InnoDB TRUNCATE causes an implicit
    // commit and can't be rolled back, which would defeat this transaction.
    await Message.destroy({ where: {}, transaction: t });
    await ProgressEntry.destroy({ where: {}, transaction: t });
    await Match.destroy({ where: {}, transaction: t });
    await Mentee.destroy({ where: {}, transaction: t });
    await Mentor.destroy({ where: {}, transaction: t });
    await User.destroy({ where: { role: 'mentor' }, transaction: t });

    await t.commit();

    const after = {
      mentees: await Mentee.count(),
      mentors: await Mentor.count(),
      matches: await Match.count(),
      progressEntries: await ProgressEntry.count(),
      messages: await Message.count(),
      mentorUsers: await User.count({ where: { role: 'mentor' } }),
      adminUsersStillPresent: await User.count({ where: { role: 'admin' } }),
    };
    console.log('After:', after);
    console.log('\n✅ Wipe complete. Admin accounts were not touched.');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('❌ Wipe failed, rolled back everything:', error.message);
    process.exit(1);
  }
}

wipeMentorMenteeData();

// backend/scripts/seedMentorApplyOpenDate.js
// Run with: node backend/scripts/seedMentorApplyOpenDate.js
// Creates the "mentor_apply_open_date" content field admins use to schedule
// when mentor applications open. Independent from apply_open_date (mentee),
// since mentor recruitment can run on its own schedule.
// Safe to run multiple times (skips if it exists).
// NOTE: requires the 'date' content_type — run migrateDateSupport.js first
// if this is a fresh database that hasn't had it applied yet.

const { Content } = require('../models/index');

async function seedMentorApplyOpenDate() {
  try {
    const existing = await Content.findOne({ where: { key: 'mentor_apply_open_date' } });

    if (existing) {
      console.log('⏭️  mentor_apply_open_date already exists — skipping.');
      process.exit(0);
    }

    await Content.create({
      key: 'mentor_apply_open_date',
      title: 'Mentor Applications Open Date',
      content_type: 'date',
      value: '', // empty = mentor applications are open right now, no countdown
      section: 'apply',
      page: 'mentor-apply',
      description: 'Set a future date/time to show a countdown on the Become a Mentor page and block submissions until then. Leave blank to keep applications open.',
    });

    console.log('✅ Created mentor_apply_open_date content field.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedMentorApplyOpenDate();

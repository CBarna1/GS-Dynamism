// backend/scripts/seedTeamMembers.js
// Run with: node backend/scripts/seedTeamMembers.js
// One-time migration of the hardcoded team roster (previously baked into
// frontend/src/pages/Team.tsx) into the new team_members table, so the
// admin CRUD screen starts populated instead of empty.
// Prefers any existing CMS description override (team_xxx_desc) over the
// hardcoded default, to preserve edits already made via Content Management.
// Safe to run multiple times — skips entirely if any team members already exist.

const { TeamMember, Content } = require('../models/index');

const DEFAULTS = [
  {
    contentKey: 'team_twaambo_desc',
    name: 'Ms. Twaambo Chisamba Kayombo',
    role: 'CEO & Founder',
    photo: '/img/TEAM/Twaambo Chisamba Kayombo.png',
    description: 'Through this role, she provides strategic leadership and sets the overall vision and direction of the organization, ensuring alignment of all programs, operations, and partnerships with its mission and goals. She oversees organizational growth, governance, and stakeholder engagement while driving innovation and long-term impact across all initiatives.',
  },
  {
    contentKey: 'team_tabitha_desc',
    name: 'Ms. Tabitha Muzumara',
    role: 'Sales & Marketing Coordinator',
    photo: '/img/TEAM/Tabitha Muzumara.png',
    description: 'Through this position, she promotes the organization, attracts mentors and mentees, and develops marketing strategies to increase engagement.',
  },
  {
    contentKey: 'team_edward_desc',
    name: 'Mr. Edward Kafusa',
    role: 'Events & Program Coordinator',
    photo: '/img/TEAM/Edward Kafusa.png',
    description: 'Through this role, he plans and coordinates mentorship programs and events, fostering meaningful interactions between mentors and mentees & other stakeholders. He also serves as Co-Administrator for the organization, supporting overall coordination and operations.',
  },
  {
    contentKey: 'team_nangoma_desc',
    name: 'Ms. Nangoma Mwanamoonte',
    role: 'Finance & Administration Coordinator',
    photo: '/img/TEAM/Nangoma Mwanamoonte.png',
    description: 'Through this role, she oversees financial and administrative functions, ensuring effective resource management, organizational compliance, and smooth day-to-day operations that support the organization\'s activities.',
  },
  {
    contentKey: 'team_chilufya_desc',
    name: 'Mr. Chilufya Lwanga Luchembe',
    role: 'Mentorship Program Coordinator',
    photo: '/img/TEAM/Lwanga C Luchembe.png',
    description: 'Through this role, he oversees the planning and implementation of mentorship programs, facilitating meaningful engagement between mentors and mentees while ensuring the overall success and impact of the program.',
  },
  {
    contentKey: 'team_lisa_desc',
    name: 'Ms. Lisa Taonga Chansa',
    role: 'Digital & Communications Coordinator',
    photo: '/img/TEAM/Lisa T Chansa.png',
    description: 'Through this role, she manages the organization\'s digital presence, brand, and public relations, creating engaging content, enhancing visibility, and driving audience engagement across platforms.',
  },
];

async function seedTeamMembers() {
  try {
    const existingCount = await TeamMember.count();
    if (existingCount > 0) {
      console.log(`⏭️  team_members already has ${existingCount} row(s) — skipping.`);
      process.exit(0);
    }

    for (let i = 0; i < DEFAULTS.length; i++) {
      const member = DEFAULTS[i];
      const override = await Content.findOne({ where: { key: member.contentKey } });
      await TeamMember.create({
        name: member.name,
        role: member.role,
        photo: member.photo,
        description: (override && override.value) || member.description,
        display_order: i,
        is_active: true,
      });
    }

    console.log(`✅ Seeded ${DEFAULTS.length} team members.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedTeamMembers();

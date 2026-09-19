// backend/scripts/seedRemainingContentFields.js
// Run with: node backend/scripts/seedRemainingContentFields.js
// Adds the CMS fields for every remaining hardcoded image/text block across
// Home, About, Contact, Apply, and Mentor Apply, so admins can edit them
// from Content Management. Safe to re-run — uses findOrCreate, so existing
// values (including anything an admin has already edited) are left alone.

const { Content } = require('../models/index');

const fields = [
  // ── Home: images ──────────────────────────────────────────────────
  { key: 'home_welcome_image_1', title: 'Welcome Section – Image 1', content_type: 'image', value: '/img/IMG_2701.JPG.jpeg', section: 'about', page: 'home', description: 'Desktop welcome section, left image' },
  { key: 'home_welcome_image_2', title: 'Welcome Section – Image 2', content_type: 'image', value: '/img/image 2.png', section: 'about', page: 'home', description: 'Desktop welcome section, right image' },
  { key: 'home_welcome_image_mobile', title: 'Welcome Section – Mobile Image', content_type: 'image', value: '/img/_MG_6217-1.jpg', section: 'about', page: 'home', description: 'Shown instead of the two desktop images on mobile' },
  { key: 'home_mentor_image', title: 'Become a Mentor – Image', content_type: 'image', value: '/img/guiding stars team.jpg', section: 'features', page: 'home', description: 'Image beside the "Become a Mentor" call-to-action' },

  // ── Home: services ────────────────────────────────────────────────
  { key: 'home_services_eyebrow', title: 'Services Section – Eyebrow Label', content_type: 'text', value: 'Our Services', section: 'features', page: 'home', description: 'Small label above "Explore Our Services"' },
  { key: 'home_service_1_tag', title: 'Service 1 – Tag', content_type: 'text', value: '1:1 Mentorship', section: 'features', page: 'home', description: '' },
  { key: 'home_service_1_title', title: 'Service 1 – Title', content_type: 'text', value: 'Personalized Guidance', section: 'features', page: 'home', description: '' },
  { key: 'home_service_1_desc', title: 'Service 1 – Description', content_type: 'textarea', value: 'Access tailored advice from experienced industry professionals dedicated to your career and professional growth.', section: 'features', page: 'home', description: '' },
  { key: 'home_service_2_tag', title: 'Service 2 – Tag', content_type: 'text', value: 'Community', section: 'features', page: 'home', description: '' },
  { key: 'home_service_2_title', title: 'Service 2 – Title', content_type: 'text', value: 'Networking Opportunities', section: 'features', page: 'home', description: '' },
  { key: 'home_service_2_desc', title: 'Service 2 – Description', content_type: 'textarea', value: 'Forge connections with industry leaders, potential employers, and like-minded peers.', section: 'features', page: 'home', description: '' },
  { key: 'home_service_3_tag', title: 'Service 3 – Tag', content_type: 'text', value: 'Knowledge', section: 'features', page: 'home', description: '' },
  { key: 'home_service_3_title', title: 'Service 3 – Title', content_type: 'text', value: 'Industry Insights', section: 'features', page: 'home', description: '' },
  { key: 'home_service_3_desc', title: 'Service 3 – Description', content_type: 'textarea', value: 'Dive deep into current industry trends and emerging strategies.', section: 'features', page: 'home', description: '' },
  { key: 'home_service_4_tag', title: 'Service 4 – Tag', content_type: 'text', value: 'Leadership', section: 'features', page: 'home', description: '' },
  { key: 'home_service_4_title', title: 'Service 4 – Title', content_type: 'text', value: 'Career Advancement', section: 'features', page: 'home', description: '' },
  { key: 'home_service_4_desc', title: 'Service 4 – Description', content_type: 'textarea', value: 'Receive mentorship focused on honing confident leadership skills.', section: 'features', page: 'home', description: '' },
  { key: 'home_service_5_tag', title: 'Service 5 – Tag', content_type: 'text', value: 'Self-Development', section: 'features', page: 'home', description: '' },
  { key: 'home_service_5_title', title: 'Service 5 – Title', content_type: 'text', value: 'Personal Growth', section: 'features', page: 'home', description: '' },
  { key: 'home_service_5_desc', title: 'Service 5 – Description', content_type: 'textarea', value: 'Embark on a journey of self-discovery, learning from the life experiences of esteemed role models.', section: 'features', page: 'home', description: '' },

  // ── Home: mentor benefits ─────────────────────────────────────────
  { key: 'home_mentor_benefit_1', title: 'Mentor Benefit 1', content_type: 'text', value: 'Shape emerging talent', section: 'features', page: 'home', description: '' },
  { key: 'home_mentor_benefit_2', title: 'Mentor Benefit 2', content_type: 'text', value: 'Expand your network', section: 'features', page: 'home', description: '' },
  { key: 'home_mentor_benefit_3', title: 'Mentor Benefit 3', content_type: 'text', value: 'Give back to your community', section: 'features', page: 'home', description: '' },

  // ── About: images ─────────────────────────────────────────────────
  { key: 'about_hero_image', title: 'About – Hero Banner Image', content_type: 'image', value: '/img/Top-Bunner-1.jpg', section: 'hero', page: 'about', description: '' },
  { key: 'about_org_image', title: 'About – Organisation Overview Image', content_type: 'image', value: 'img/IMG_0778.JPG', section: 'about', page: 'about', description: '' },

  // ── About: eyebrows & descriptions ────────────────────────────────
  { key: 'about_org_eyebrow', title: 'Organisation Overview – Eyebrow Label', content_type: 'text', value: 'About', section: 'about', page: 'about', description: '' },
  { key: 'about_pillars_eyebrow', title: 'Human Side of Leadership – Eyebrow Label', content_type: 'text', value: 'What Sets Us Apart', section: 'about', page: 'about', description: '' },
  { key: 'about_pillars_description', title: 'Human Side of Leadership – Description', content_type: 'textarea', value: 'Beyond technical and academic proficiency, Guiding Stars places strong emphasis on the human aspects of leadership. We believe great leaders are defined not just by what they know, but by who they are.', section: 'about', page: 'about', description: '' },
  { key: 'about_principles_eyebrow', title: 'Guiding Principles – Eyebrow Label', content_type: 'text', value: 'Our Principles', section: 'about', page: 'about', description: '' },
  { key: 'about_principles_description', title: 'Guiding Principles – Description', content_type: 'textarea', value: 'Guided by these core principles, Guiding Stars continues to illuminate pathways to success, shaping individuals who lead with wisdom, confidence, and impact.', section: 'about', page: 'about', description: '' },

  // ── About: leadership pillars (5) ─────────────────────────────────
  { key: 'about_pillar_1_title', title: 'Pillar 1 – Title', content_type: 'text', value: 'Integrity', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_1_desc', title: 'Pillar 1 – Description', content_type: 'textarea', value: 'Doing what is right, even when no one is watching.', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_2_title', title: 'Pillar 2 – Title', content_type: 'text', value: 'Attitude', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_2_desc', title: 'Pillar 2 – Description', content_type: 'textarea', value: 'Approaching every challenge with a growth mindset.', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_3_title', title: 'Pillar 3 – Title', content_type: 'text', value: 'Loyalty', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_3_desc', title: 'Pillar 3 – Description', content_type: 'textarea', value: 'Committed to the success of every individual we serve.', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_4_title', title: 'Pillar 4 – Title', content_type: 'text', value: 'Behaviour', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_4_desc', title: 'Pillar 4 – Description', content_type: 'textarea', value: 'Modelling the professional conduct expected of leaders.', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_5_title', title: 'Pillar 5 – Title', content_type: 'text', value: 'Diplomacy', section: 'about', page: 'about', description: '' },
  { key: 'about_pillar_5_desc', title: 'Pillar 5 – Description', content_type: 'textarea', value: 'Navigating relationships with grace and emotional intelligence.', section: 'about', page: 'about', description: '' },

  // ── About: guiding principle values (6) ───────────────────────────
  { key: 'about_value_1_title', title: 'Value 1 – Title', content_type: 'text', value: 'Authenticity', section: 'about', page: 'about', description: '' },
  { key: 'about_value_1_desc', title: 'Value 1 – Description', content_type: 'textarea', value: 'Staying true to our mission, vision, and the people we serve.', section: 'about', page: 'about', description: '' },
  { key: 'about_value_2_title', title: 'Value 2 – Title', content_type: 'text', value: 'Excellence', section: 'about', page: 'about', description: '' },
  { key: 'about_value_2_desc', title: 'Value 2 – Description', content_type: 'textarea', value: 'Striving for the highest standards in everything we do.', section: 'about', page: 'about', description: '' },
  { key: 'about_value_3_title', title: 'Value 3 – Title', content_type: 'text', value: 'Innovation', section: 'about', page: 'about', description: '' },
  { key: 'about_value_3_desc', title: 'Value 3 – Description', content_type: 'textarea', value: 'Embracing creativity and new ideas to deliver lasting impact.', section: 'about', page: 'about', description: '' },
  { key: 'about_value_4_title', title: 'Value 4 – Title', content_type: 'text', value: 'Transparency', section: 'about', page: 'about', description: '' },
  { key: 'about_value_4_desc', title: 'Value 4 – Description', content_type: 'textarea', value: 'Building trust through openness, honesty, and accountability.', section: 'about', page: 'about', description: '' },
  { key: 'about_value_5_title', title: 'Value 5 – Title', content_type: 'text', value: 'Sustainability', section: 'about', page: 'about', description: '' },
  { key: 'about_value_5_desc', title: 'Value 5 – Description', content_type: 'textarea', value: 'Creating enduring solutions for individuals, communities, and society.', section: 'about', page: 'about', description: '' },
  { key: 'about_value_6_title', title: 'Value 6 – Title', content_type: 'text', value: 'Customer Focus', section: 'about', page: 'about', description: '' },
  { key: 'about_value_6_desc', title: 'Value 6 – Description', content_type: 'textarea', value: 'Prioritizing the growth, needs, and aspirations of our mentees and partners.', section: 'about', page: 'about', description: '' },

  // ── Contact: image ────────────────────────────────────────────────
  { key: 'contact_hero_image', title: 'Contact – Hero Banner Image', content_type: 'image', value: '/img/Top-Bunner-1.jpg', section: 'hero', page: 'contact', description: '' },

  // ── Apply: image ──────────────────────────────────────────────────
  { key: 'apply_bg_image', title: 'Mentee Apply – Background Image', content_type: 'image', value: '/img/corporate image 3.jpeg', section: 'hero', page: 'apply', description: '' },

  // ── Mentor Apply: image ───────────────────────────────────────────
  { key: 'mentor_apply_hero_image', title: 'Mentor Apply – Hero Banner Image', content_type: 'image', value: '/img/Top-Bunner-1.jpg', section: 'hero', page: 'mentor-apply', description: '' },
];

async function seedRemainingContentFields() {
  try {
    console.log(`🌱 Seeding ${fields.length} remaining content fields...`);
    let created = 0;
    let skipped = 0;

    for (const field of fields) {
      const [, isNew] = await Content.findOrCreate({
        where: { key: field.key },
        defaults: field,
      });
      if (isNew) {
        created++;
        console.log(`✅ Created: ${field.key}`);
      } else {
        skipped++;
      }
    }

    console.log(`\n📊 Done. Created: ${created}, already existed: ${skipped}.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedRemainingContentFields();

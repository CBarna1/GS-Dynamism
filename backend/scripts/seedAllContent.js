// backend/scripts/seedAllContent.js
// Seeds all CMS-editable content for all pages. Safe to re-run — skips existing keys.
// Usage: node backend/scripts/seedAllContent.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize, Content } = require('../models/index');

const allContent = [
  // ── HOME PAGE ─────────────────────────────────────────────────────────────
  { key: 'hero_subtitle',         title: 'Hero Subtitle (orange)',    content_type: 'text',     value: 'Ignite Success',                                                                            section: 'hero',    page: 'home', description: 'Small orange text above the hero headline' },
  { key: 'hero_title',            title: 'Hero Title',                content_type: 'text',     value: 'Empowering Future Leaders Through Mentorship',                                              section: 'hero',    page: 'home', description: 'Main headline on the home page hero banner' },
  { key: 'about_description_1',   title: 'Home – About Paragraph 1',  content_type: 'textarea', value: 'Guiding Stars stands as a beacon of excellence in corporate and business education. A non-profit, Zambia-based organization committed to nurturing the next generation of leaders.',         section: 'about',   page: 'home', description: 'First paragraph in the Welcome/About section on the home page' },
  { key: 'about_description_2',   title: 'Home – About Paragraph 2',  content_type: 'textarea', value: 'We are dedicated to shaping the future of both aspiring business and non-business professionals, empowering them to rise with purpose and impact.',                                         section: 'about',   page: 'home', description: 'Second paragraph in the Welcome/About section on the home page' },
  { key: 'home_cta_title',        title: 'Home – CTA Heading',        content_type: 'text',     value: 'Ready to Start Your Journey?',                                                             section: 'hero',    page: 'home', description: 'Heading in the orange call-to-action banner section' },
  { key: 'home_cta_description',  title: 'Home – CTA Description',    content_type: 'textarea', value: 'Join the next cohort of ambitious professionals and transform your career with personalized mentorship.',                                                                                   section: 'hero',    page: 'home', description: 'Paragraph text in the orange CTA banner section' },
  { key: 'home_mentor_title',     title: 'Home – Become a Mentor Heading', content_type: 'text', value: 'Become a Mentor',                                                                         section: 'about',   page: 'home', description: 'Heading in the "Become a Mentor" card' },
  { key: 'home_mentor_description', title: 'Home – Become a Mentor Paragraph', content_type: 'textarea', value: 'Share your expertise and make a real impact on the next generation of professionals. Whether you\'re a seasoned executive, rising manager, or specialist in your field, we\'re looking for passionate mentors.', section: 'about', page: 'home', description: 'Description paragraph in the Become a Mentor card' },
  { key: 'testimonial_1_name',    title: 'Home – Testimonial 1 Name', content_type: 'text',     value: 'Constance Haajila',                                                                        section: 'testimonials', page: 'home', description: 'Name of the first testimonial person' },
  { key: 'testimonial_1_quote',   title: 'Home – Testimonial 1 Quote', content_type: 'textarea', value: 'The mentorship has exceeded my expectation, it has taught me to focus and always show up, I am now ready for opportunities.',                                                             section: 'testimonials', page: 'home', description: 'Quote from the first testimonial' },
  { key: 'testimonial_2_name',    title: 'Home – Testimonial 2 Name', content_type: 'text',     value: 'Manuel Mwaala',                                                                            section: 'testimonials', page: 'home', description: 'Name of the second testimonial person' },
  { key: 'testimonial_2_quote',   title: 'Home – Testimonial 2 Quote', content_type: 'textarea', value: 'My journey has been about self-discovery resulting into heightened productivity and confidence in my leadership abilities.',                                                               section: 'testimonials', page: 'home', description: 'Quote from the second testimonial' },

  // ── ABOUT PAGE ────────────────────────────────────────────────────────────
  { key: 'about_hero_title',      title: 'About – Hero Title',        content_type: 'text',     value: 'About Us',                                                                                 section: 'about',   page: 'about', description: 'Title displayed over the About page hero image' },
  { key: 'about_org_para_1',      title: 'About – Overview Paragraph 1', content_type: 'textarea', value: 'Guiding Stars is a non-profit organization founded in 2024 in Zambia, dedicated to advancing excellence in corporate and business education. It serves as a catalyst for nurturing the next generation of leaders by bridging the gap between academic learning and practical experience.',  section: 'about', page: 'about', description: 'First paragraph in the Organisation Overview section' },
  { key: 'about_org_para_2',      title: 'About – Overview Paragraph 2', content_type: 'textarea', value: 'The organization equips students, graduates, and emerging professionals with the competence, confidence, and character required to excel in today\'s global business landscape.',         section: 'about', page: 'about', description: 'Second paragraph in the Organisation Overview section' },
  { key: 'about_org_para_3',      title: 'About – Overview Paragraph 3', content_type: 'textarea', value: 'Through structured mentorship, leadership training, and community engagement initiatives, it empowers young people to lead with purpose and distinction.',                               section: 'about', page: 'about', description: 'Third paragraph in the Organisation Overview section' },
  { key: 'about_mission',         title: 'About – Mission Statement',  content_type: 'textarea', value: 'To foster a dynamic, purpose-driven learning environment where aspiring youth gain the knowledge, skills, and confidence to bridge the gap between academia and real-world practice.',     section: 'about', page: 'about', description: 'Our Mission text on the About page' },
  { key: 'about_vision',          title: 'About – Vision Statement',   content_type: 'textarea', value: 'To Elevate, Educate, Empower, and Transform Futures, together building a generation of leaders equipped to thrive in the global arena.',                                                  section: 'about', page: 'about', description: 'Our Vision text on the About page' },
  { key: 'about_faq_1_q',         title: 'About – FAQ 1 Question',     content_type: 'text',     value: 'What is the duration of the program?',                                                    section: 'about', page: 'about', description: 'First FAQ question on the About page' },
  { key: 'about_faq_1_a',         title: 'About – FAQ 1 Answer',       content_type: 'textarea', value: 'The Guiding Stars mentorship program is designed to run for a duration of 3 months, allowing mentees sufficient time to benefit from the guidance and resources provided. The program includes regular mentorship sessions, trainings and networking events.', section: 'about', page: 'about', description: 'First FAQ answer' },
  { key: 'about_faq_2_q',         title: 'About – FAQ 2 Question',     content_type: 'text',     value: 'Who is eligible for the program?',                                                        section: 'about', page: 'about', description: 'Second FAQ question on the About page' },
  { key: 'about_faq_2_a',         title: 'About – FAQ 2 Answer',       content_type: 'textarea', value: 'Guiding Stars is open to dedicated students, graduands and emerging professionals ready to shape their future in the world of business.',                                                 section: 'about', page: 'about', description: 'Second FAQ answer' },

  // ── CONTACT PAGE ──────────────────────────────────────────────────────────
  { key: 'contact_hero_title',    title: 'Contact – Hero Title',       content_type: 'text',     value: 'Contact Us',                                                                               section: 'footer', page: 'contact', description: 'Title over the Contact page hero image' },
  { key: 'contact_para_1',        title: 'Contact – Paragraph 1',      content_type: 'textarea', value: 'Our journey has been marked by a commitment to excellence, a passion for innovation, and a deep belief in the power of collaboration.',                                                    section: 'footer', page: 'contact', description: 'First paragraph on the Contact page' },
  { key: 'contact_para_2',        title: 'Contact – Paragraph 2',      content_type: 'textarea', value: 'With a team that spans the globe, we bring together diverse talents and perspectives to tackle some of the most challenging problems in our industry.',                                    section: 'footer', page: 'contact', description: 'Second paragraph on the Contact page' },
  { key: 'contact_para_3',        title: 'Contact – Paragraph 3',      content_type: 'textarea', value: 'Please reach out to us for any enquiry, collaboration or any partnership and our team will be more than pleased to hear from you.',                                                       section: 'footer', page: 'contact', description: 'Third paragraph on the Contact page' },
  { key: 'contact_phone',         title: 'Contact – Phone Number',     content_type: 'text',     value: '+260 973 223 910',                                                                        section: 'footer', page: 'contact', description: 'Phone number displayed on the Contact page' },
  { key: 'contact_email',         title: 'Contact – Email Address',    content_type: 'text',     value: 'info@guidingstarszm.com',                                                                  section: 'footer', page: 'contact', description: 'Email address displayed on the Contact page' },

  // ── TEAM PAGE ─────────────────────────────────────────────────────────────
  { key: 'team_hero_title',       title: 'Team – Hero Title',          content_type: 'text',     value: 'MEET OUR TEAM',                                                                            section: 'team',   page: 'team', description: 'Title over the Team page hero image' },
  { key: 'team_section_subtitle', title: 'Team – Section Subtitle',    content_type: 'textarea', value: 'Meet the passionate individuals driving Guiding Stars\' mission forward.',                 section: 'team',   page: 'team', description: 'Subtitle shown below the team section heading' },
  { key: 'team_twaambo_desc',     title: 'Team – Twaambo Description', content_type: 'textarea', value: 'Through this role, she provides strategic leadership and sets the overall vision and direction of the organization, ensuring alignment of all programs, operations, and partnerships with its mission and goals. She oversees organizational growth, governance, and stakeholder engagement while driving innovation and long-term impact across all initiatives.', section: 'team', page: 'team', description: 'Description for Twaambo Chisamba Kayombo (CEO)' },
  { key: 'team_tabitha_desc',     title: 'Team – Tabitha Description', content_type: 'textarea', value: 'Through this position, she promotes the organization, attracts mentors and mentees, and develops marketing strategies to increase engagement.',                                            section: 'team', page: 'team', description: 'Description for Tabitha Muzumara' },
  { key: 'team_edward_desc',      title: 'Team – Edward Description',  content_type: 'textarea', value: 'Through this role, he plans and coordinates mentorship programs and events, fostering meaningful interactions between mentors and mentees & other stakeholders. He also serves as Co-Administrator for the organization, supporting overall coordination and operations.', section: 'team', page: 'team', description: 'Description for Edward Kafusa' },
  { key: 'team_nangoma_desc',     title: 'Team – Nangoma Description', content_type: 'textarea', value: 'Through this role, she oversees financial and administrative functions, ensuring effective resource management, organizational compliance, and smooth day-to-day operations that support the organization\'s activities.', section: 'team', page: 'team', description: 'Description for Nangoma Mwanamoonte' },
  { key: 'team_chilufya_desc',    title: 'Team – Chilufya Description', content_type: 'textarea', value: 'Through this role, he oversees the planning and implementation of mentorship programs, facilitating meaningful engagement between mentors and mentees while ensuring the overall success and impact of the program.', section: 'team', page: 'team', description: 'Description for Chilufya Lwanga Luchembe' },
  { key: 'team_lisa_desc',        title: 'Team – Lisa Description',    content_type: 'textarea', value: 'Through this role, she manages the organization\'s digital presence, brand, and public relations, creating engaging content, enhancing visibility, and driving audience engagement across platforms.', section: 'team', page: 'team', description: 'Description for Lisa Taonga Chansa' },

  // ── FOOTER (ALL PAGES) ────────────────────────────────────────────────────
  { key: 'footer_about',          title: 'Footer – About Text',        content_type: 'textarea', value: 'Guiding Stars is a non-profit mentorship organization committed to nurturing the next generation of leaders through quality mentorship and professional development.', section: 'footer', page: 'global', description: 'Short description shown in the footer on all pages' },
  { key: 'footer_address',        title: 'Footer – Address',           content_type: 'text',     value: 'Lusaka, Zambia',                                                                          section: 'footer', page: 'global', description: 'Physical address shown in the footer' },
  { key: 'footer_phone',          title: 'Footer – Phone',             content_type: 'text',     value: '+260 973 223 910',                                                                        section: 'footer', page: 'global', description: 'Phone number in the footer' },
  { key: 'footer_email',          title: 'Footer – Email',             content_type: 'text',     value: 'info@guidingstarszm.com',                                                                  section: 'footer', page: 'global', description: 'Email address in the footer' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    let created = 0;
    let skipped = 0;

    for (const item of allContent) {
      const [, wasCreated] = await Content.findOrCreate({
        where: { key: item.key },
        defaults: item,
      });
      wasCreated ? created++ : skipped++;
    }

    console.log(`\n✓ Done. ${created} fields created, ${skipped} already existed (skipped).`);
    console.log(`  Total fields in this script: ${allContent.length}`);
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();

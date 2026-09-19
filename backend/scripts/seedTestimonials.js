// backend/scripts/seedTestimonials.js
// Run with: node backend/scripts/seedTestimonials.js
// One-time migration of the hardcoded testimonials (previously baked into
// frontend/src/pages/Testimonials.tsx) into the new testimonials table.
// Safe to run multiple times — skips entirely if any testimonials already exist.

const { Testimonial } = require('../models/index');

const COHORTS = [
  {
    label: 'Cohort Two Testimonials',
    items: [
      { name: 'Testimonial 1', content: 'The mentorship I received through Guiding Stars has been invaluable. My mentor provided guidance that accelerated my professional growth significantly.', image: '/img/Testimonials/cohort 2/WhatsApp Image 2026-04-30 at 11.48.46.jpeg' },
      { name: 'Testimonial 2', content: 'Being part of Guiding Stars has transformed my perspective on leadership and career development. I feel more confident and prepared for the future.', image: '/img/Testimonials/cohort 2/WhatsApp Image 2026-04-30 at 11.48.48.jpeg' },
      { name: 'Testimonial 3', content: 'The support and guidance I received from my mentor has been instrumental in my personal and professional growth. I am grateful for this opportunity.', image: '/img/Testimonials/cohort 2/WhatsApp Image 2026-04-30 at 11.48.50 (1).jpeg' },
      { name: 'Testimonial 4', content: 'This program has given me the tools and confidence I need to succeed. The mentorship experience has been transformational and inspiring.', image: '/img/Testimonials/cohort 2/WhatsApp Image 2026-04-30 at 11.48.50.jpeg' },
    ],
  },
  {
    label: 'Cohort Three Testimonials',
    items: [
      { name: 'Testimonial 1', content: 'Through Guiding Stars, I have discovered my potential and gained the confidence to pursue my dreams. The mentorship has been life-changing.', image: '/img/Testimonials/cohort 3/WhatsApp Image 2026-04-30 at 11.48.22.jpeg' },
      { name: 'Testimonial 2', content: 'The guidance and support I received has truly transformed my perspective and career trajectory.', image: '/img/Testimonials/cohort 3/WhatsApp Image 2026-05-12 at 12.38.25.jpeg' },
      { name: 'Testimonial 3', content: 'Being part of this cohort has connected me with amazing individuals and opened doors I never expected.', image: '/img/Testimonials/cohort 3/WhatsApp Image 2026-05-12 at 12.38.26 (1).jpeg' },
      { name: 'Testimonial 4', content: 'The mentorship program has empowered me to take charge of my future and lead with purpose.', image: '/img/Testimonials/cohort 3/WhatsApp Image 2026-05-12 at 12.38.26.jpeg' },
    ],
  },
  {
    label: 'Cohort Four Testimonials',
    items: [
      { name: 'Testimonial 1', content: 'Guiding Stars has provided me with exceptional mentorship and networking opportunities that have shaped my career path positively.', image: '/img/Testimonials/cohort 4/WhatsApp Image 2026-04-30 at 11.48.08.jpeg' },
      { name: 'Testimonial 2', content: 'The program exceeded my expectations. The guidance, support, and community have been invaluable in my journey.', image: '/img/Testimonials/cohort 4/WhatsApp Image 2026-04-30 at 11.48.13.jpeg' },
      { name: 'Testimonial 3', content: 'I am grateful for the mentorship and the opportunity to grow both personally and professionally through Guiding Stars.', image: '/img/Testimonials/cohort 4/WhatsApp Image 2026-04-30 at 11.48.14 (1).jpeg' },
      { name: 'Testimonial 4', content: 'This mentorship program has been a game-changer for me. I feel empowered and ready to make a difference in my field.', image: '/img/Testimonials/cohort 4/WhatsApp Image 2026-04-30 at 11.48.14.jpeg' },
    ],
  },
];

async function seedTestimonials() {
  try {
    const existingCount = await Testimonial.count();
    if (existingCount > 0) {
      console.log(`⏭️  testimonials already has ${existingCount} row(s) — skipping.`);
      process.exit(0);
    }

    let order = 0;
    for (const cohort of COHORTS) {
      for (const item of cohort.items) {
        await Testimonial.create({
          cohort_label: cohort.label,
          name: item.name,
          role: 'Mentee',
          content: item.content,
          image: item.image,
          display_order: order++,
          is_active: true,
        });
      }
    }

    console.log(`✅ Seeded ${order} testimonials across ${COHORTS.length} cohorts.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedTestimonials();

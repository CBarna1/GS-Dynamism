// backend/scripts/seedGraduationCohorts.js
// Run with: node backend/scripts/seedGraduationCohorts.js
// One-time migration of the hardcoded graduation cohorts (previously baked
// into frontend/src/pages/Graduation.tsx) into graduation_cohorts +
// graduation_photos, so the admin CRUD screen starts fully populated.
//
// The old page laid out each cohort's opening paragraphs / CEO quote /
// awards / closing paragraphs as separate blocks, each paired with a
// specific photo by array index. That rigid, hand-tuned layout can't stay
// admin-editable, so this migration flattens paragraphs + quote + awards
// intro + closing into one flowing press_statement (same paragraph/image
// convention as blog posts), keeps "awards" as its own structured list,
// and moves every photo into a plain gallery for that cohort.
//
// Safe to run multiple times — skips entirely if any cohorts already exist.

const { GraduationCohort, GraduationPhoto } = require('../models/index');

const COHORTS = [
  {
    title: 'First Cohort Graduation',
    cohort_date: 'June 14, 2024',
    paragraphs: [
      "On June 14, 2024, the Guiding Stars Mentorship Program celebrated the graduation of its inaugural cohort, three months after its launch on March 13, 2024. The hybrid event featured both physical and online audiences, showcasing the resilience and determination of the 21 marketing students from Copperbelt University and the University of Lusaka who completed the program.",
      "Mr. Brian J. Silungwe MZIM, Council Secretary of the Zambia Institute of Marketing-ZIM, served as the Guest of Honor, emphasizing the importance of lifelong learning and self-belief in his speech.",
      "Ms. Twaambo Chisamba Kayombo, the founder and CEO, outlined the program's future goals of expansion, innovation, and impact; stating that mentorship should be accessible to all, regardless of background or geography, so that upcoming marketers and business students can reach their full potential, nurturing a global network of inspired and capable individuals.",
      "The event concluded with the presentation of certificates and special packages to the graduates of Cohort One.",
    ],
    awards: [],
    future_text: "Cohort Two is anticipated to be larger and more impactful, continuing the program's commitment to advancing nonstop learning, personal growth, and professional development.",
    images: [
      "/img/GS1/4B7A6824.jpg", "/img/GS1/4B7A6829.jpg", "/img/GS1/4B7A6834.jpg",
      "/img/GS1/4B7A6835.jpg", "/img/GS1/4B7A6836.jpg", "/img/GS1/4B7A6837.jpg",
      "/img/GS1/4B7A6838.jpg", "/img/GS1/4B7A6839.jpg", "/img/GS1/4B7A6846.jpg",
      "/img/GS1/4B7A6848.jpg", "/img/GS1/4B7A6849.jpg", "/img/GS1/4B7A6853.jpg",
      "/img/GS1/4B7A6858.jpg", "/img/GS1/4B7A6860.jpg", "/img/GS1/4B7A6861.jpg",
      "/img/GS1/4B7A6863.jpg", "/img/GS1/4B7A6865.jpg", "/img/GS1/4B7A6866.jpg",
      "/img/GS1/4B7A6867.jpg", "/img/GS1/4B7A6868.jpg", "/img/GS1/4B7A6869.jpg",
      "/img/GS1/4B7A6870.jpg", "/img/GS1/4B7A6871.jpg", "/img/GS1/4B7A6872.jpg",
      "/img/GS1/4B7A6873.jpg", "/img/GS1/4B7A6874.jpg", "/img/GS1/4B7A6875.jpg",
      "/img/GS1/4B7A6876.jpg", "/img/GS1/4B7A6877.jpg", "/img/GS1/4B7A6878.jpg",
      "/img/GS1/4B7A6879.jpg", "/img/GS1/4B7A6880.jpg", "/img/GS1/4B7A6881.jpg",
      "/img/GS1/4B7A6882.jpg", "/img/GS1/4B7A6883.jpg", "/img/GS1/4B7A6884.jpg",
      "/img/GS1/4B7A6885.jpg", "/img/GS1/4B7A6886.jpg", "/img/GS1/4B7A6887.jpg",
      "/img/GS1/4B7A6888.jpg", "/img/GS1/4B7A6890.jpg", "/img/GS1/4B7A6892.jpg",
      "/img/GS1/4B7A6894.jpg", "/img/GS1/4B7A6896.jpg", "/img/GS1/4B7A6897.jpg",
      "/img/GS1/4B7A6898.jpg", "/img/GS1/4B7A6899.jpg", "/img/GS1/4B7A6900.jpg",
      "/img/GS1/4B7A6901.jpg", "/img/GS1/4B7A6902.jpg", "/img/GS1/4B7A6903.jpg",
      "/img/GS1/4B7A6906.jpg", "/img/GS1/4B7A6907.jpg", "/img/GS1/4B7A6908.jpg",
      "/img/GS1/4B7A6909.jpg", "/img/GS1/4B7A6911.jpg", "/img/GS1/4B7A6913.jpg",
      "/img/GS1/4B7A6916.jpg", "/img/GS1/4B7A6919.jpg", "/img/GS1/4B7A6924.jpg",
      "/img/GS1/4B7A6926.jpg", "/img/GS1/4B7A6928.jpg", "/img/GS1/4B7A6930.jpg",
      "/img/GS1/4B7A6931.jpg", "/img/GS1/4B7A6939.jpg", "/img/GS1/4B7A6940.jpg",
      "/img/GS1/4B7A6941.jpg", "/img/GS1/4B7A6943.jpg", "/img/GS1/4B7A6944.jpg",
      "/img/GS1/4B7A6945.jpg", "/img/GS1/4B7A6946.jpg", "/img/GS1/4B7A6947.jpg",
      "/img/GS1/4B7A6948.jpg", "/img/GS1/4B7A6949.jpg", "/img/GS1/4B7A6950.jpg",
    ],
  },
  {
    title: 'Cohort Two Celebrations & Impact',
    cohort_date: 'February - May 2025',
    paragraphs: [
      "Cohort Two's journey culminated in a series of celebrations and impactful events throughout 2025. On 7th February 2025, Guiding Stars held its Meet & Greet for Cohort Two mentees, creating a space for networking and engagement with the team and alumni. The event marked a strong start to the cohort's mentorship journey, setting the tone for growth and continued engagement.",
      "On 28th February 2025, the Guiding Stars Mentorship Program marked the successful graduation of Cohort Two, celebrating mentees who began their journey in December 2024. Following the graduation, on March 8th, Guiding Stars held a post-graduation luncheon in Lusaka to celebrate recent graduates and strengthen alumni connections. Represented by Edward Mwanza Kafusa, the academy presented certificates and encouraged graduates to remain active as ambassadors and mentors.",
      "In May 2025, Guiding Stars expanded its impact beyond the traditional mentorship sphere. On May 18th, Guiding Stars conducted a youth mentorship session at St. Francis Xavier Parish focused on opportunity creation and fearless growth. The session emphasized purpose, taking initiative, and embracing mentorship, alongside interactive activities and networking.",
      "These events reinforced Guiding Stars' commitment to empowering young people, continued support, lifelong relationships, and impact beyond the mentorship program.",
    ],
    awards: [],
    future_text: "The success of Cohort Two demonstrates our unwavering commitment to transforming lives through mentorship, fostering a lasting community of leaders and changemakers who continue to support and inspire one another.",
    images: [
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.46 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.46 (2).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.46.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.47 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.47.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.48 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.03.48.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.07.09 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.07.09 (2).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.07.09.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.08.15 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.08.15.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.08.16 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.08.16.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.44.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.45 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.45.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.46 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.46 (2).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.46.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.47 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.47.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.10.48.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.00 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.00 (2).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.00.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.01 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.01.jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.02 (1).jpeg",
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.02.jpeg",
    ],
  },
  {
    title: 'Cohort Three Celebrations & Milestones',
    cohort_date: 'May - July 2025',
    paragraphs: [
      "Cohort Three's journey reached new heights with a series of impactful events in 2025. On 23rd May 2025, Guiding Stars Mentorship Academy hosted its first Copperbelt mentees meet and greet at Pamo Hotel, bringing participants together to connect and celebrate their journey. The event featured Brian Silungwe and a surprise appearance by CEO Twaambo Chisamba Kayombo, reinforcing the program's impact and shared vision.",
      "On 7th July 2025, Guiding Stars Mentorship Program held a virtual graduation for its third and largest cohort of 59 mentees. Over three months, participants engaged in mentorship, leadership challenges, and practical learning experiences.",
      "CEO Twaambo Chisamba Kayombo encouraged graduates to lead with purpose, while Guest of Honour Eng. Wesley Kaluba highlighted the importance of mentorship in bridging education and industry. The ceremony recognized outstanding mentees and marked another milestone in Guiding Stars' mission to develop future leaders.",
      "Following the graduation, on 14th July 2025, Lusaka graduates kicked off the week with energy, positivity, and a strong sense of purpose. This moment highlighted the power of consistency and encouraged a week driven by passion, growth, and the Guiding Stars spirit.",
    ],
    awards: [],
    future_text: "Cohort Three's success demonstrates the exponential growth of Guiding Stars and our commitment to scaling impact across multiple regions. With 59 graduates, we continue to build a thriving community of leaders equipped to drive meaningful change.",
    images: [
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.36 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.36.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.37 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.37.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.38 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.38.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.39 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.39.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.40 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.17.40.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.28.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.29 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.29.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.30 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.30 (2).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.30.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.27.31.jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.30.33 (1).jpeg",
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.30.33.jpeg",
    ],
  },
  {
    title: 'Cohort Four Milestones & Growth',
    cohort_date: 'August - December 2025',
    paragraphs: [
      "Cohort Four's journey began with unprecedented momentum on 11th August 2025, when Guiding Stars successfully hosted an orientation for over 800 new applicants, marking a significant milestone in its growth. The session introduced participants to the program's mission, values, and culture, with CEO Twaambo Chisamba Kayombo emphasizing purpose-driven leadership.",
      "Alumni shared impactful testimonials on growth and mentorship, reinforcing the power of community. On 26th December 2025, Guiding Stars held its fourth graduation ceremony, marking the completion of a transformative three-month journey for 60 mentees.",
      "The event featured insights from Nigerian Guest of Honour Olawande Olowoyeye and Zimbabwean speaker Thabiso Madanhi, alongside remarks from CEO Twaambo Chisamba Kayombo.",
      "The CEO encouraged graduates to embrace continued growth and responsibility, highlighting the importance of carrying the Guiding Stars spirit forward as ambassadors and mentors. The ceremony reflected Guiding Stars' commitment to developing confident, purpose-driven leaders ready to make an impact in their communities and industries.",
    ],
    awards: [],
    future_text: "Cohort Four's success marks a turning point in Guiding Stars' expansion, with over 800 applicants demonstrating the growing hunger for transformational mentorship. We remain committed to nurturing the next generation of leaders who will drive positive change across Africa and beyond.",
    images: [
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.37.jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.38 (1).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.38.jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39 (1).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39 (2).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39.jpeg",
    ],
  },
  {
    title: 'Cohort Five Graduation Ceremony',
    cohort_date: '15th May, 2026',
    paragraphs: [
      "Guiding Stars proudly announces the successful graduation of its fifth cohort following a well-attended Virtual Graduation Ceremony held on 15th May 2026, marking the completion of yet another transformative mentorship journey under the Guiding Stars Mentorship Programme.",
      "This milestone reflects the organisation's unwavering commitment to raising a generation of purpose-driven, professionally grounded, and impact-oriented young leaders.",
      "Out of 67 enrolled mentees, an impressive 66 successfully graduated, a strong testament to the resilience, discipline, consistency, and intentional commitment demonstrated throughout the programme.",
      "The ceremony was honoured by the presence of Honourable Ngosa Chisupa as Guest of Honour, whose insightful remarks challenged graduands to embrace leadership with responsibility, integrity, and vision.",
      "The programme also featured a compelling address by mentor speaker Madam Immaculate Mwengwe, who highlighted the enduring value of mentorship, character formation, and continuous self-development in shaping meaningful careers and lives.",
      "In her remarks, Guiding Stars Founder and Chief Executive Officer reflected on the organisation's growing continental footprint and sustained impact in youth development.",
      "“Guiding Stars was established not merely as a mentorship platform, but as a movement committed to shaping futures, unlocking potential, and preparing young people for excellence beyond the classroom. Seeing our impact extend beyond Zambia, with mentees from Namibia and the Democratic Republic of Congo, is a clear affirmation that purpose-driven leadership knows no borders.”",
      "As part of the graduation ceremony, outstanding mentees were recognised for exemplary performance and exceptional contribution throughout the programme:",
      "Beyond the virtual ceremony, the celebrations continued with a Certificate Presentation Dinner in Kitwe on 15th May 2026, providing an opportunity for in-person recognition and fellowship.",
      "The graduation activities officially concluded with a Certificate Presentation Luncheon held at Asmara Hotel on 17th May 2026, graciously officiated by Madam Immaculate Mwengwe.",
      "The successful completion of Cohort 5 further reinforces Guiding Stars’ mission of nurturing brilliance, igniting success, and equipping young people with the mindset, values, and practical competencies required to thrive in leadership, academia, entrepreneurship, and the corporate world.",
    ],
    awards: [
      { label: 'Most Engaged Mentee', name: 'Thandiwe Phiri', institution: 'Copperbelt University' },
      { label: 'Best Team Player', name: 'Joseph Chilupula', institution: 'University of Zambia' },
      { label: 'Most Improved Mentee', name: 'Mukuka Bwalya', institution: 'Copperbelt University' },
    ],
    future_text: "To the graduating Class of Cohort 5, this is not the end of a programme, but the beginning of a greater responsibility to lead, serve, and create meaningful impact wherever life takes you. Congratulations to the Guiding Stars Cohort 5 Graduating Class.",
    images: [
      "/img/GS5/IMG_4667.JPG", "/img/GS5/IMG_4668.JPG", "/img/GS5/IMG_4669.JPG",
      "/img/GS5/IMG_4670.JPG", "/img/GS5/IMG_4671.JPG", "/img/GS5/IMG_4672.JPG",
      "/img/GS5/IMG_4673.JPG", "/img/GS5/IMG_4674.JPG", "/img/GS5/IMG_4675.JPG",
      "/img/GS5/IMG_4676.JPG", "/img/GS5/IMG_4677.JPG", "/img/GS5/IMG_4678.JPG",
      "/img/GS5/IMG_4679.JPG", "/img/GS5/IMG_4680.JPG", "/img/GS5/IMG_4681.JPG",
      "/img/GS5/IMG_4682.JPG",
    ],
  },
];

async function seedGraduationCohorts() {
  try {
    const existingCount = await GraduationCohort.count();
    if (existingCount > 0) {
      console.log(`⏭️  graduation_cohorts already has ${existingCount} row(s) — skipping.`);
      process.exit(0);
    }

    for (let i = 0; i < COHORTS.length; i++) {
      const c = COHORTS[i];
      const cohort = await GraduationCohort.create({
        title: c.title,
        cohort_date: c.cohort_date,
        press_statement: c.paragraphs.join('\n\n'),
        future_text: c.future_text,
        awards: JSON.stringify(c.awards),
        display_order: i,
        is_active: true,
      });

      for (let p = 0; p < c.images.length; p++) {
        await GraduationPhoto.create({
          cohort_id: cohort.id,
          image_url: c.images[p],
          display_order: p,
        });
      }

      console.log(`  ✓ ${c.title} (${c.images.length} photos)`);
    }

    console.log(`✅ Seeded ${COHORTS.length} graduation cohorts.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedGraduationCohorts();

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Hero carousel images
const heroImages = [
  '/img/Top-Bunner-1.jpg',
  '/img/corporate image.jpeg',
  '/img/guiding stars team.jpg',
  '/img/guiding stars event.jpg',
];


// Graduation data
const graduations = {
  cohort1: {
    title: "First Cohort Graduation",
    date: "June 14, 2024",
    pressStatement: {
      paragraphs: [
        "On June 14, 2024, the Guiding Stars Mentorship Program celebrated the graduation of its inaugural cohort, three months after its launch on March 13, 2024. The hybrid event featured both physical and online audiences, showcasing the resilience and determination of the 21 marketing students from Copperbelt University and the University of Lusaka who completed the program.",
        "Mr. Brian J. Silungwe MZIM, Council Secretary of the Zambia Institute of Marketing-ZIM, served as the Guest of Honor, emphasizing the importance of lifelong learning and self-belief in his speech.",
        "Ms. Twaambo Chisamba Kayombo, the founder and CEO, outlined the program's future goals of expansion, innovation, and impact; stating that mentorship should be accessible to all, regardless of background or geography, so that upcoming marketers and business students can reach their full potential, nurturing a global network of inspired and capable individuals.",
        "The event concluded with the presentation of certificates and special packages to the graduates of Cohort One.",
      ],
      closing: [
        "Cohort Two is anticipated to be larger and more impactful, continuing the program's commitment to advancing nonstop learning, personal growth, and professional development.",
      ],
    },
    future: "Cohort Two is anticipated to be larger and more impactful, continuing the program's commitment to advancing nonstop learning, personal growth, and professional development.",
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
    ]
  },
  cohort2: {
    title: "Cohort Two Celebrations & Impact",
    date: "February - May 2025",
    pressStatement: {
      paragraphs: [
        "Cohort Two's journey culminated in a series of celebrations and impactful events throughout 2025. On 7th February 2025, Guiding Stars held its Meet & Greet for Cohort Two mentees, creating a space for networking and engagement with the team and alumni. The event marked a strong start to the cohort's mentorship journey, setting the tone for growth and continued engagement.",
        "On 28th February 2025, the Guiding Stars Mentorship Program marked the successful graduation of Cohort Two, celebrating mentees who began their journey in December 2024. Following the graduation, on March 8th, Guiding Stars held a post-graduation luncheon in Lusaka to celebrate recent graduates and strengthen alumni connections. Represented by Edward Mwanza Kafusa, the academy presented certificates and encouraged graduates to remain active as ambassadors and mentors.",
        "In May 2025, Guiding Stars expanded its impact beyond the traditional mentorship sphere. On May 18th, Guiding Stars conducted a youth mentorship session at St. Francis Xavier Parish focused on opportunity creation and fearless growth. The session emphasized purpose, taking initiative, and embracing mentorship, alongside interactive activities and networking.",
        "These events reinforced Guiding Stars' commitment to empowering young people, continued support, lifelong relationships, and impact beyond the mentorship program.",
      ],
      closing: [
        "The success of Cohort Two demonstrates our unwavering commitment to transforming lives through mentorship, fostering a lasting community of leaders and changemakers who continue to support and inspire one another.",
      ],
    },
    future: "The success of Cohort Two demonstrates our unwavering commitment to transforming lives through mentorship, fostering a lasting community of leaders and changemakers who continue to support and inspire one another.",
    testimonials: [],
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
      "/img/GS2/WhatsApp Image 2026-04-13 at 20.14.02.jpeg"
    ]
  },
  cohort3: {
    title: "Cohort Three Celebrations & Milestones",
    date: "May - July 2025",
    pressStatement: {
      paragraphs: [
        "Cohort Three's journey reached new heights with a series of impactful events in 2025. On 23rd May 2025, Guiding Stars Mentorship Academy hosted its first Copperbelt mentees meet and greet at Pamo Hotel, bringing participants together to connect and celebrate their journey. The event featured Brian Silungwe and a surprise appearance by CEO Twaambo Chisamba Kayombo, reinforcing the program's impact and shared vision.",
        "On 7th July 2025, Guiding Stars Mentorship Program held a virtual graduation for its third and largest cohort of 59 mentees. Over three months, participants engaged in mentorship, leadership challenges, and practical learning experiences.",
        "CEO Twaambo Chisamba Kayombo encouraged graduates to lead with purpose, while Guest of Honour Eng. Wesley Kaluba highlighted the importance of mentorship in bridging education and industry. The ceremony recognized outstanding mentees and marked another milestone in Guiding Stars' mission to develop future leaders.",
        "Following the graduation, on 14th July 2025, Lusaka graduates kicked off the week with energy, positivity, and a strong sense of purpose. This moment highlighted the power of consistency and encouraged a week driven by passion, growth, and the Guiding Stars spirit.",
      ],
      closing: [
        "Cohort Three's success demonstrates the exponential growth of Guiding Stars and our commitment to scaling impact across multiple regions. With 59 graduates, we continue to build a thriving community of leaders equipped to drive meaningful change.",
      ],
    },
    future: "Cohort Three's success demonstrates the exponential growth of Guiding Stars and our commitment to scaling impact across multiple regions. With 59 graduates, we continue to build a thriving community of leaders equipped to drive meaningful change.",
    testimonials: [],
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
      "/img/GS3/WhatsApp Image 2026-04-13 at 20.30.33.jpeg"
    ]
  },
  cohort4: {
    title: "Cohort Four Milestones & Growth",
    date: "August - December 2025",
    pressStatement: {
      paragraphs: [
        "Cohort Four's journey began with unprecedented momentum on 11th August 2025, when Guiding Stars successfully hosted an orientation for over 800 new applicants, marking a significant milestone in its growth. The session introduced participants to the program's mission, values, and culture, with CEO Twaambo Chisamba Kayombo emphasizing purpose-driven leadership.",
        "Alumni shared impactful testimonials on growth and mentorship, reinforcing the power of community. On 26th December 2025, Guiding Stars held its fourth graduation ceremony, marking the completion of a transformative three-month journey for 60 mentees.",
        "The event featured insights from Nigerian Guest of Honour Olawande Olowoyeye and Zimbabwean speaker Thabiso Madanhi, alongside remarks from CEO Twaambo Chisamba Kayombo.",
        "The CEO encouraged graduates to embrace continued growth and responsibility, highlighting the importance of carrying the Guiding Stars spirit forward as ambassadors and mentors. The ceremony reflected Guiding Stars' commitment to developing confident, purpose-driven leaders ready to make an impact in their communities and industries.",
      ],
      closing: [
        "Cohort Four's success marks a turning point in Guiding Stars' expansion, with over 800 applicants demonstrating the growing hunger for transformational mentorship. We remain committed to nurturing the next generation of leaders who will drive positive change across Africa and beyond.",
      ],
    },
    future: "Cohort Four's success marks a turning point in Guiding Stars' expansion, with over 800 applicants demonstrating the growing hunger for transformational mentorship. We remain committed to nurturing the next generation of leaders who will drive positive change across Africa and beyond.",
    testimonials: [],
    images: [
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.37.jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.38 (1).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.38.jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39 (1).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39 (2).jpeg",
      "/img/GS4/WhatsApp Image 2026-04-13 at 20.35.39.jpeg"
    ]
  },
  cohort5: {
    title: "Cohort Five Graduation Ceremony",
    date: "15th May, 2026",
    pressStatement: {
      paragraphs: [
        "Guiding Stars proudly announces the successful graduation of its fifth cohort following a well-attended Virtual Graduation Ceremony held on 15th May 2026, marking the completion of yet another transformative mentorship journey under the Guiding Stars Mentorship Programme.",
        "This milestone reflects the organisation's unwavering commitment to raising a generation of purpose-driven, professionally grounded, and impact-oriented young leaders.",
        "Out of 67 enrolled mentees, an impressive 66 successfully graduated, a strong testament to the resilience, discipline, consistency, and intentional commitment demonstrated throughout the programme.",
        "The ceremony was honoured by the presence of Honourable Ngosa Chisupa as Guest of Honour, whose insightful remarks challenged graduands to embrace leadership with responsibility, integrity, and vision.",
        "The programme also featured a compelling address by mentor speaker Madam Immaculate Mwengwe, who highlighted the enduring value of mentorship, character formation, and continuous self-development in shaping meaningful careers and lives.",
        "In her remarks, Guiding Stars Founder and Chief Executive Officer reflected on the organisation's growing continental footprint and sustained impact in youth development.",
      ],
      quote: "Guiding Stars was established not merely as a mentorship platform, but as a movement committed to shaping futures, unlocking potential, and preparing young people for excellence beyond the classroom. Seeing our impact extend beyond Zambia, with mentees from Namibia and the Democratic Republic of Congo, is a clear affirmation that purpose-driven leadership knows no borders.",
      awardsIntro: "As part of the graduation ceremony, outstanding mentees were recognised for exemplary performance and exceptional contribution throughout the programme:",
      awardsTitle: "Excellence Awards \u2013 Cohort 5",
      awards: [
        { label: "Most Engaged Mentee", name: "Thandiwe Phiri", institution: "Copperbelt University" },
        { label: "Best Team Player", name: "Joseph Chilupula", institution: "University of Zambia" },
        { label: "Most Improved Mentee", name: "Mukuka Bwalya", institution: "Copperbelt University" },
      ],
      closing: [
        "Beyond the virtual ceremony, the celebrations continued with a Certificate Presentation Dinner in Kitwe on 15th May 2026, providing an opportunity for in-person recognition and fellowship.",
        "The graduation activities officially concluded with a Certificate Presentation Luncheon held at Asmara Hotel on 17th May 2026, graciously officiated by Madam Immaculate Mwengwe.",
        "The successful completion of Cohort 5 further reinforces Guiding Stars\u2019 mission of nurturing brilliance, igniting success, and equipping young people with the mindset, values, and practical competencies required to thrive in leadership, academia, entrepreneurship, and the corporate world.",
      ],
    },
    future: "To the graduating Class of Cohort 5, this is not the end of a programme, but the beginning of a greater responsibility to lead, serve, and create meaningful impact wherever life takes you. Congratulations to the Guiding Stars Cohort 5 Graduating Class.",
    testimonials: [],
    images: [
      "/img/GS5/IMG_4667.JPG",
      "/img/GS5/IMG_4668.JPG",
      "/img/GS5/IMG_4669.JPG",
      "/img/GS5/IMG_4670.JPG",
      "/img/GS5/IMG_4671.JPG",
      "/img/GS5/IMG_4672.JPG",
      "/img/GS5/IMG_4673.JPG",
      "/img/GS5/IMG_4674.JPG",
      "/img/GS5/IMG_4675.JPG",
      "/img/GS5/IMG_4676.JPG",
      "/img/GS5/IMG_4677.JPG",
      "/img/GS5/IMG_4678.JPG",
      "/img/GS5/IMG_4679.JPG",
      "/img/GS5/IMG_4680.JPG",
      "/img/GS5/IMG_4681.JPG",
      "/img/GS5/IMG_4682.JPG"
    ]
  }
};

// Rest of your code stays the same//
const Graduation = () => {
  const [selectedCohort, setSelectedCohort] = useState('cohort1');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const data = graduations[selectedCohort as keyof typeof graduations];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };
  
  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Carousel */}
      <section className="relative">
        {/* Carousel Images */}
        <div className="relative overflow-hidden">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hero Banner ${index + 1}`}
              className={`w-full h-[60vh] md:h-[80vh] object-cover brightness-75 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              loading="lazy"
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 transition rounded-full p-3 text-gray-900"
          aria-label="Previous image"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 transition rounded-full p-3 text-gray-900"
          aria-label="Next image"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
              EVENTS & CELEBRATIONS
            </h1>
            <p className="text-base md:text-xl text-gray-100">Celebrating milestones and transforming lives together</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Graduation Selector */}
          <div className="mb-8 flex justify-center px-2 md:px-0">
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="w-full md:w-auto px-4 md:px-6 py-3 border-2 border-orange-500 rounded-lg text-base md:text-lg font-semibold bg-white text-gray-800 hover:bg-orange-50 transition"
            >
              <option value="cohort1">First Cohort (June 14, 2024)</option>
              <option value="cohort2">Cohort Two (Feb - May 2025)</option>
              <option value="cohort3">Cohort Three (May - July 2025)</option>
              <option value="cohort4">Cohort Four (Aug - Dec 2025)</option>
              <option value="cohort5">Cohort Five (May 2026)</option>
            </select>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6">
            {data.title}
          </h2>

          <div className="text-gray-600 text-center mb-8 text-sm md:text-base">
            <span className="mr-4"><i className="fas fa-calendar-alt mr-1"></i> {data.date}</span>
            {/* Add comments or other meta if needed */}
          </div>

          <div className="space-y-12 md:space-y-16">

            {/* Press statement layout for structured cohorts (e.g. cohort5) */}
            {(data as any).pressStatement && (() => {
              const ps = (data as any).pressStatement;
              const hasQuote = !!ps.quote;
              const hasAwards = !!(ps.awardsIntro || ps.awards?.length);
              const closingImgIdx = 2 + (hasQuote ? 1 : 0) + (hasAwards ? 1 : 0);
              const galleryStart = closingImgIdx + 1;
              return (
                <>
                  {/* Block 1: opening paragraphs + image */}
                  <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                    <div className="w-full lg:w-1/2 space-y-4">
                      {ps.paragraphs.slice(0, 3).map((para: string, i: number) => (
                        <p key={i} className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">{para}</p>
                      ))}
                    </div>
                    <div className="w-full lg:w-1/2">
                      {data.images?.[0] && <img src={data.images[0]} alt="Event Image 1" className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80" />}
                    </div>
                  </div>

                  {/* Block 2: remaining paragraphs + image (reversed) */}
                  <div className="flex flex-col lg:flex-row-reverse gap-6 md:gap-8 items-start">
                    <div className="w-full lg:w-1/2 space-y-4">
                      {ps.paragraphs.slice(3).map((para: string, i: number) => (
                        <p key={i} className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">{para}</p>
                      ))}
                    </div>
                    <div className="w-full lg:w-1/2">
                      {data.images?.[1] && <img src={data.images[1]} alt="Event Image 2" className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80" />}
                    </div>
                  </div>

                  {/* Block 3: CEO quote + image (only if quote present) */}
                  {hasQuote && (
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                      <div className="w-full lg:w-1/2">
                        <blockquote className="border-l-4 pl-6 py-3 bg-orange-50 rounded-r-lg h-full" style={{ borderColor: '#FF9148' }}>
                          <p className="text-gray-700 leading-relaxed text-sm md:text-base italic text-justify">
                            &ldquo;{ps.quote}&rdquo;
                          </p>
                        </blockquote>
                      </div>
                      <div className="w-full lg:w-1/2">
                        {data.images?.[2] && <img src={data.images[2]} alt="Event Image 3" className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80" />}
                      </div>
                    </div>
                  )}

                  {/* Block 4: awards + image (only if awards present, reversed) */}
                  {hasAwards && (
                    <div className="flex flex-col lg:flex-row-reverse gap-6 md:gap-8 items-start">
                      <div className="w-full lg:w-1/2 space-y-4">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">{ps.awardsIntro}</p>
                        <div className="bg-gray-50 rounded-lg p-5 md:p-6">
                          <h4 className="font-bold text-gray-800 mb-4 text-base md:text-lg">{ps.awardsTitle}</h4>
                          <ul className="space-y-2">
                            {ps.awards?.map((award: { label: string; name: string; institution: string }, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                                <span className="mt-1 font-bold" style={{ color: '#FF9148' }}>•</span>
                                <span><span className="font-semibold">{award.label}:</span> {award.name} &ndash; {award.institution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2">
                        {data.images?.[hasQuote ? 3 : 2] && <img src={data.images[hasQuote ? 3 : 2]} alt="Event Image 4" className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80" />}
                      </div>
                    </div>
                  )}

                  {/* Block 5: closing paragraphs + image */}
                  <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                    <div className="w-full lg:w-1/2 space-y-4">
                      {ps.closing.map((para: string, i: number) => (
                        <p key={i} className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">{para}</p>
                      ))}
                    </div>
                    <div className="w-full lg:w-1/2">
                      {data.images?.[closingImgIdx] && <img src={data.images[closingImgIdx]} alt="Closing Image" className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80" />}
                    </div>
                  </div>

                  {/* Remaining images gallery */}
                  {data.images && data.images.length > galleryStart && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">More Event Highlights</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {data.images.slice(galleryStart).map((image, index) => (
                          <img key={index} src={image} alt={`Event Image ${index + galleryStart + 1}`}
                            className="w-full rounded-lg shadow-lg object-cover h-40 md:h-64 hover:scale-105 transition-transform duration-300" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Standard layout for cohorts 1–4 */}
            {!(data as any).pressStatement && (
              <>
            {/* Content 1 with Image */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {(data as any).content}
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                {data.images && data.images[0] && (
                  <img
                    src={data.images[0]}
                    alt="Event Image 1"
                    className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80"
                  />
                )}
              </div>
            </div>

            {/* Content 2 with Image (alternating side) */}
            <div className="flex flex-col lg:flex-row-reverse gap-6 md:gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {(data as any).content2}
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                {data.images && data.images[1] && (
                  <img
                    src={data.images[1]}
                    alt="Event Image 2"
                    className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80"
                  />
                )}
              </div>
            </div>

            {/* Content 3 with Image (alternating side) */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {(data as any).content3}
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                {data.images && data.images[2] && (
                  <img
                    src={data.images[2]}
                    alt="Event Image 3"
                    className="w-full rounded-lg shadow-lg object-cover h-64 md:h-80"
                  />
                )}
              </div>
            </div>

            {/* Remaining Images Gallery */}
            {data.images && data.images.length > 3 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">More Event Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {data.images.slice(3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Event Image ${index + 4}`}
                      className="w-full rounded-lg shadow-lg object-cover h-40 md:h-64 hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
            )}

              </>
            )}

            {/* Future Section */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 md:p-8 rounded-lg border-l-4" style={{ borderColor: '#FF9148' }}>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base italic font-semibold">
                {data.future}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mt-4">
                Join us as we continue to rise, aiming higher and brighter, in the pursuit of excellence and growth.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Graduation;
// src/pages/Team.tsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SEOHelmet } from '../hooks/useSEO';

// Hero carousel images
const heroImages = [
  '/img/Top-Bunner-1.jpg',
  '/img/corporate image.jpeg',
  '/img/guiding stars team.jpg',
  '/img/guiding stars event.jpg',
];

// Team member images (use root-relative public paths)
const twaambo = "/img/TEAM/Twaambo Chisamba Kayombo.png";
const lisa = "/img/TEAM/Lisa T Chansa.png";
const nangoma = "/img/TEAM/Nangoma Mwanamoonte.png";
const tabitha = "/img/TEAM/Tabitha Muzumara.png";
const edward = "/img/TEAM/Edward Kafusa.png";
const lwanga = "/img/TEAM/Lwanga C Luchembe.png";

const teamMembers = [
  {
    name: 'Ms. Twaambo Chisamba Kayombo',
    role: 'CEO & Founder',
    image: twaambo,
    description: 'Through this role, she provides strategic leadership and sets the overall vision and direction of the organization, ensuring alignment of all programs, operations, and partnerships with its mission and goals. She oversees organizational growth, governance, and stakeholder engagement while driving innovation and long-term impact across all initiatives.'
  },
  {
    name: 'Ms. Tabitha Muzumara',
    role: 'Sales & Marketing Coordinator',
    image: tabitha,
    description: 'Through this position, she promotes the organization, attracts mentors and mentees, and develops marketing strategies to increase engagement.'
  },
  {
    name: 'Mr. Edward Kafusa',
    role: 'Events & Program Coordinator',
    image: edward,
    description: 'Through this role, he plans and coordinates mentorship programs and events, fostering meaningful interactions between mentors and mentees & other stakeholders. He also serves as Co-Administrator for the organization, supporting overall coordination and operations.'
  },
  {
    name: 'Ms. Nangoma Mwanamoonte',
    role: 'Finance & Administration Coordinator',
    image: nangoma,
    description: 'Through this role, she oversees financial and administrative functions, ensuring effective resource management, organizational compliance, and smooth day-to-day operations that support the organization\'s activities.'
  },
  {
    name: 'Mr. Chilufya Lwanga Luchembe',
    role: 'Mentorship Program Coordinator',
    image: lwanga,
    description: 'Through this role, he oversees the planning and implementation of mentorship programs, facilitating meaningful engagement between mentors and mentees while ensuring the overall success and impact of the program.'
  },
  {
    name: 'Ms. Lisa Taonga Chansa',
    role: 'Digital & Communications Coordinator',
    image: lisa,
    description: 'Through this role, she manages the organization\'s digital presence, brand, and public relations, creating engaging content, enhancing visibility, and driving audience engagement across platforms.'
  },
];

const Team = () => {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const toggleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="team" />
      
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
              MEET OUR TEAM
            </h1>
            <p className="text-base md:text-xl text-gray-100">Dedicated professionals committed to transforming lives through mentorship</p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="h-96 cursor-pointer perspective"
                onClick={() => toggleFlip(index)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500 transform"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front of card - Image & Name */}
                  <div
                    className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-orange-50 to-gray-50">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-40 h-48 object-cover rounded-lg mx-auto mb-4 border-4 shadow-md"
                        style={{ borderColor: '#FF9148' }}
                      />
                      <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                      <p className="font-semibold mt-2" style={{ color: '#FF9148' }}>
                        {member.role}
                      </p>
                      <p className="text-xs text-gray-500 mt-3">Click to learn more</p>
                    </div>
                  </div>

                  {/* Back of card - Description */}
                  <div
                    className="absolute w-full h-full bg-gradient-to-br rounded-xl shadow-lg overflow-hidden p-6 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)',
                    }}
                  >
                    <div className="text-white text-center">
                      <h4 className="text-lg font-bold mb-3">{member.role}</h4>
                      <p className="text-sm leading-relaxed opacity-95">{member.description}</p>
                      <p className="text-xs mt-4 opacity-75">Click to go back</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Team;
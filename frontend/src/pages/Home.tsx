import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { SEOHelmet } from '../hooks/useSEO';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoad,
  faUsers,
  faBriefcase,
  faTrophy,
  faUser,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

// Hero carousel images
const heroImages = [
  '/img/Top-Bunner-1.jpg',
  '/img/corporate image.jpeg',
  '/img/guiding stars team.jpg',
  '/img/guiding stars event.jpg',
];

const Home = () => {
  const [content, setContent] = useState<Record<string, any>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = 'Guiding Stars - Bridging Academia and Practice';
    
    // Fetch CMS content
    api.get('/content')
      .then(res => {
        const contentMap = res.data?.data || {};
        setContent(contentMap);
      })
      .catch(err => console.error('Failed to load content:', err));
  }, []);

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
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="home" />
      
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
            <h6
              className="text-base md:text-2xl font-semibold uppercase mb-3 tracking-wide"
              style={{ color: '#FF9148' }}
            >
              {content.hero_subtitle || 'Ignite Success'}
            </h6>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
              {content.hero_title || 'Empowering Future Leaders Through Mentorship'}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/apply"
                className="inline-block text-white px-7 py-3.5 md:px-9 md:py-4.5 rounded-lg font-semibold shadow-lg transition hover:brightness-110 text-base md:text-lg bg-gradient-to-br from-[#FF9148] to-[#E8722E]"
              >
                APPLY NOW
              </Link>

              <a
                href="#contact"
                className="inline-block bg-white text-gray-900 px-7 py-3.5 md:px-9 md:py-4.5 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition shadow-lg text-base md:text-lg"
              >
                ENQUIRE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome / About Section */}
      <section id="about" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-14">
            Welcome to{' '}
            <span className="uppercase" style={{ color: '#FF9148' }}>
              Guiding Stars
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Desktop images */}
            <div className="hidden md:grid grid-cols-2 gap-6">
              <img
                src="/img/IMG_2701.JPG.jpeg"
                alt="Guiding Stars students"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
                loading="lazy"
              />
              <img
                src="/img/image 2.png"
                alt="Guiding Stars team"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
                loading="lazy"
              />
            </div>

            {/* Mobile single image */}
            <div className="md:hidden mb-6">
              <img
                src="/img/_MG_6217-1.jpg"
                alt="Guiding Stars"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                {content.about_description_1 || 'Guiding Stars stands as a beacon of excellence in corporate and business education. A non-profit, Zambia-based organization committed to nurturing the next generation of leaders.'}
              </p>
              <p>
                {content.about_description_2 || 'We are dedicated to shaping the future of both aspiring business and non-business professionals, empowering them to rise with purpose and impact.'}
              </p>

              <div className="pt-4 text-center md:text-left">
                <Link
                  to="/about"
                  className="inline-block text-white px-8 py-4 rounded-lg font-semibold transition hover:brightness-110 text-base md:text-lg bg-gradient-to-br from-[#FF9148] to-[#E8722E]"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h6
              className="uppercase text-lg md:text-xl font-semibold tracking-wide"
              style={{ color: '#FF9148' }}
            >
              Our Services
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3">
              Explore Our{' '}
              <span className="uppercase" style={{ color: '#FF9148' }}>
                Services
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: faRoad, title: 'Personalized Guidance', desc: 'Access tailored advice from experienced industry professionals dedicated to your career and professional growth.' },
              { icon: faUsers, title: 'Networking Opportunities', desc: 'Forge connections with industry leaders, potential employers, and like-minded peers.' },
              { icon: faBriefcase, title: 'Industry Insights', desc: 'Dive deep into current industry trends and emerging strategies.' },
              { icon: faTrophy, title: 'Career Advancement', desc: 'Receive mentorship focused on honing confident leadership skills.' },
              { icon: faUser, title: 'Personal Growth', desc: 'Embark on a journey of self-discovery, learning from the life experiences of esteemed role models.' },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-5" style={{ color: '#FF9148' }}>
                  <FontAwesomeIcon icon={service.icon} />
                </div>
                <h5 className="text-xl font-bold mb-4 text-gray-800">{service.title}</h5>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Mentor Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left: Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Become a{' '}
                  <span style={{ color: '#FF9148' }}>Mentor</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your expertise and make a real impact on the next generation of professionals. 
                  Whether you're a seasoned executive, rising manager, or specialist in your field, 
                  we're looking for passionate mentors.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: '#FF9148' }}>✓</span>
                    <span className="text-gray-700">Shape emerging talent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: '#FF9148' }}>✓</span>
                    <span className="text-gray-700">Expand your network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: '#FF9148' }}>✓</span>
                    <span className="text-gray-700">Give back to your community</span>
                  </div>
                </div>
                <Link
                  to="/mentor-apply"
                  className="inline-block text-white px-8 py-3 rounded-lg font-semibold hover:brightness-110 transition bg-gradient-to-br from-[#FF9148] to-[#E8722E] w-fit"
                >
                  APPLY AS A MENTOR
                </Link>
              </div>

              {/* Right: Image */}
              <div className="hidden md:block">
                <img
                  src="/img/guiding stars team.jpg"
                  alt="Mentor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 md:py-20 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)' }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Join the next cohort of ambitious professionals and transform your career with personalized mentorship.
          </p>
          <Link
            to="/apply"
            className="inline-block bg-white px-10 py-4 md:px-12 md:py-5 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-100 transition shadow-xl"
            style={{ color: '#E8722E' }}
          >
            APPLY FOR MENTORSHIP
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h6
              className="uppercase text-lg md:text-xl font-semibold tracking-wide"
              style={{ color: '#FF9148' }}
            >
              CONTACT
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3">
              GET IN{' '}
              <span className="uppercase" style={{ color: '#FF9148' }}>
                TOUCH
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl">
            <HomeContactForm />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
            What Our{' '}
            <span className="uppercase" style={{ color: '#FF9148' }}>
              Students Say
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                img: '/img/Constance Haajila.jpg',
                name: 'Constance Haajila',
                quote:
                  'The mentorship has exceeded my expectation, it has taught me to focus and always show up, I am now ready for opportunities.',
              },
              {
                img: '/img/Manuel Mwanza.jpg',
                name: 'Manuel Mwaala',
                quote:
                  'My journey has been about self-discovery resulting into heightened productivity and confidence in my leadership abilities.',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white text-gray-800 p-8 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-lg mr-4 flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h6 className="font-bold text-base md:text-lg text-gray-900">{t.name}</h6>
                    <p className="text-gray-500 text-sm">Student</p>
                  </div>
                </div>
                <div className="flex mb-4 text-yellow-400">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="italic text-gray-700 leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/**
 * Home Contact Form Component
 * Handles form submission to backend /api/contact endpoint
 */
function HomeContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const result = await api.post('/contact', {
        ...formData,
        source_page: 'home',
      });

      if (result.data.success) {
        setResponse({
          type: 'success',
          message: result.data.message || 'Thank you! Your message has been received.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setResponse({
          type: 'error',
          message: result.data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error: any) {
      setResponse({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {response && (
        <div
          className={`p-4 rounded-lg mb-6 text-center font-semibold ${
            response.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {response.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <input
            type="text"
            name="name"
            placeholder="YOUR NAME..."
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition text-base disabled:bg-gray-100"
          />
          <input
            type="email"
            name="email"
            placeholder="YOUR EMAIL..."
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition text-base disabled:bg-gray-100"
          />
          <input
            type="text"
            name="subject"
            placeholder="SUBJECT..."
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition text-base disabled:bg-gray-100"
          />
        </div>
        <textarea
          name="message"
          placeholder="YOUR MESSAGE..."
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition mb-6 text-base disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-4 rounded-lg font-semibold text-lg transition hover:brightness-110 bg-gradient-to-br from-[#FF9148] to-[#E8722E] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'SENDING...' : 'SEND MESSAGE NOW'}
        </button>
      </form>
    </>
  );
}

export default Home;
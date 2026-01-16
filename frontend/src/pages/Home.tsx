
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Re-initialize any third-party scripts if needed (e.g., WOW.js, Owl Carousel)
    // For now, we skip heavy jQuery dependencies
    document.title = 'Guiding Stars - Bridging Academia and Practice';
  }, []);

  return (
    <div className="bg-white">
      {/* Spinner - optional loading overlay (can remove if not needed) */}
      {/* <div id="spinner" className="..."> ... </div> */}

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-12" />
          </Link>

          {/* Mobile menu button */}
          <button className="lg:hidden text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-8 items-center">
            <Link to="/" className="font-semibold hover:text-theme transition">Home</Link>
            <Link to="/about" className="font-semibold hover:text-theme transition">About</Link>
            <Link to="/team" className="font-semibold hover:text-theme transition">Team</Link>
            <Link to="/contact" className="font-semibold hover:text-theme transition">Contact Us</Link>

            {/* Events Dropdown */}
            <div className="relative group">
              <button className="font-semibold hover:text-theme transition flex items-center">
                Events <span className="ml-1">▼</span>
              </button>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 shadow-lg rounded mt-2 w-48">
                <Link to="/graduation1" className="block px-4 py-2 hover:bg-gray-100">First Cohort Graduation</Link>
              </div>
            </div>

            <a
              href="#contact"
              className="bg-theme text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition"
            >
              ENQUIRE NOW <i className="fa fa-arrow-right ml-2"></i>
            </a>
          </nav>
        </div>
      </header>

      {/* Carousel / Hero Section */}
      <section className="relative mt-20">
        <div className="relative">
          <img
            src="img/Top-Bunner-1.jpg"
            alt="Hero Banner"
            className="w-full h-[80vh] object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
            <div className="max-w-4xl">
              <h6 className="text-xl md:text-2xl font-semibold uppercase mb-4 animate-fade-in-down">
                Ignite Success
              </h6>
              <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-down">
                Bridging the Gap Between Academia and Practice
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-theme text-white px-8 py-4 rounded font-semibold hover:bg-opacity-90 transition animate-fade-in-left"
                >
                  ENROLL
                </Link>
                <a
                  href="#contact"
                  className="bg-white text-theme px-8 py-4 rounded font-semibold hover:bg-gray-100 transition animate-fade-in-right"
                >
                  ENQUIRE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome / About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Welcome to <span className="text-theme uppercase">Guiding Stars</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Images */}
            <div className="grid grid-cols-2 gap-6">
              <img src="img/_MG_6217-1.jpg" alt="About 1" className="rounded-lg shadow-lg" />
              <img src="img/image 2.png" alt="About 2" className="rounded-lg shadow-lg" />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Guiding Stars stands as a beacon of excellence in corporate and business education. A non-profit, Zambia-based organization committed to nurturing the next generation of leaders.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are dedicated to shaping the future of both aspiring business and non-business professionals, empowering them to rise with purpose and impact.
              </p>
              <div className="text-center md:text-left">
                <Link
                  to="/about"
                  className="inline-block bg-theme text-white px-8 py-4 rounded font-semibold hover:bg-opacity-90 transition"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h6 className="text-theme uppercase text-lg font-semibold">Our Services</h6>
            <h2 className="text-4xl font-bold mt-2">
              Explore Our <span className="text-theme uppercase">Services</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-road', title: 'Personalized Guidance', desc: 'Access tailored advice from experienced industry professionals dedicated to your career and professional growth.' },
              { icon: 'fa-users', title: 'Networking Opportunities', desc: 'Forge connections with industry leaders, potential employers, and like-minded peers.' },
              { icon: 'fa-briefcase', title: 'Industry Insights', desc: 'Dive deep into current industry trends and emerging strategies.' },
              { icon: 'fa-trophy', title: 'Career Advancement', desc: 'Receive mentorship focused on honing confident leadership skills.' },
              { icon: 'fa-user', title: 'Personal Growth', desc: 'Embark on a journey of self-discovery, learning from the life experiences of esteemed role models.' },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="text-theme text-5xl mb-6">
                  <i className={`fa ${service.icon}`}></i>
                </div>
                <h5 className="text-xl font-bold mb-4">{service.title}</h5>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h6 className="text-theme uppercase text-lg font-semibold">CONTACT</h6>
            <h2 className="text-4xl font-bold mt-2">
              GET IN <span className="text-theme uppercase">TOUCH</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg">
            <form action="https://formspree.io/f/mqakpbga" method="POST">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="YOUR NAME..."
                  required
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="YOUR EMAIL..."
                  required
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="SUBJECT..."
                  required
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                />
              </div>

              <textarea
                name="message"
                placeholder="YOUR MESSAGE..."
                required
                rows={6}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme mb-6"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-theme text-white py-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                SEND MESSAGE NOW
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              What Our <span className="text-theme uppercase">Students Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'img/Constance Haajila.jpg',
                name: 'Constance Haajila',
                role: 'Student',
                quote: '"The mentorship has exceeded my expectation, it has taught me to focus and always show up, I am now ready for opportunities."',
              },
              {
                img: 'img/Chongo Lombe.jpg',
                name: 'Chongo Lombe',
                role: 'Student',
                quote: '"I cant quantify the personal growth and inspiration gained from the program. It has equipped me with the skills for the corporate world."',
              },
              {
                img: 'img/Manuel Mwanza.jpg',
                name: 'Manuel Mwanza',
                role: 'Student',
                quote: '"My journey has been about self-discovery resulting into heightened productivity and confidence in my leadership abilities."',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white text-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <img src={testimonial.img} alt={testimonial.name} className="w-20 h-24 object-cover rounded-lg mr-4" />
                  <div>
                    <h6 className="font-bold">{testimonial.name}</h6>
                    <small className="text-gray-600">{testimonial.role}</small>
                  </div>
                </div>
                <p className="italic text-gray-700">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div>
              <img src="/img/HORIZONTAL (2).png" alt="Guiding Stars" className="h-16 mb-6" />
              <p className="text-gray-300">Nurture Brilliance, Ignite Success.</p>
            </div>

            {/* Contact */}
            <div>
              <h6 className="text-theme uppercase font-bold mb-6">Contact</h6>
              <p className="mb-4"><i className="fa fa-map-marker-alt mr-3"></i>Plot 25866 Kabangwe, off Great North Road, Lusaka.</p>
              <p className="mb-4"><i className="fa fa-phone-alt mr-3"></i>+260 973 223 910</p>
              <p><i className="fa fa-envelope mr-3"></i>info@guidingstars.com</p>
            </div>

            {/* Company Links */}
            <div>
              <h6 className="text-theme uppercase font-bold mb-6">Company</h6>
              <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-theme">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-theme">Contact Us</Link></li>
                <li><a href="#" className="hover:text-theme">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-theme">Terms & Condition</a></li>
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h6 className="text-theme uppercase font-bold mb-6">Services</h6>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-theme">Personalized Guidance</a></li>
                <li><a href="#" className="hover:text-theme">Networking Opportunities</a></li>
                <li><a href="#" className="hover:text-theme">Industry Insights</a></li>
                <li><a href="#" className="hover:text-theme">Career Advancement</a></li>
                <li><a href="#" className="hover:text-theme">Personal Growth</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} Guiding Stars. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
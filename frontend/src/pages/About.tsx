
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header / Navbar - same as Home */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-12" />
          </Link>

          <nav className="hidden lg:flex space-x-8 items-center">
            <Link to="/" className="font-semibold hover:text-theme transition">Home</Link>
            <Link to="/about" className="font-semibold text-theme">About</Link>
            <Link to="/team" className="font-semibold hover:text-theme transition">Team</Link>
            <Link to="/contact" className="font-semibold hover:text-theme transition">Contact Us</Link>

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

      {/* Hero Section */}
      <section className="relative mt-20">
        <img
          src="img/Top-Bunner-1.jpg"
          alt="About Banner"
          className="w-full h-[70vh] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
          </div>
        </div>
      </section>

      {/* Organisation Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h6 className="text-theme uppercase text-lg font-semibold">About</h6>
            <h2 className="text-4xl font-bold mt-2">
              ORGANISATION <span className="text-theme uppercase">OVERVIEW</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Guiding Stars Mentorship Academy is a rising startup, established in 2024 with a mission to bridge the gap between marketing academia and practice. We create an inclusive and diverse community where aspiring marketing students, graduates, and professionals can build knowledge, gain confidence and develop the skills necessary to lead in the global marketing industry.
              </p>
              <p>
                Our focus on continuous learning and talent development forms the core of our comprehensive mentorship program. As we grow, we remain committed to delivering impactful marketing solutions and nurturing lasting relationships with our clients and partners.
              </p>
              <p>
                Our goal is to empower our team to reach their full potential and contribute to a brighter, more sustainable future in the marketing world, embodying the spirit of starlight guidance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <img src="img/about-1.png" alt="About Image 1" className="rounded-lg shadow-lg" />
              {/* Add more images if needed */}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-navy text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p>
                To Foster a Dynamic Learning Environment Where Aspiring Marketing Students and Graduates will Build Knowledge to Bridge the Gap Between Academia and Practice, Cultivate Confidence, Character and Skills to Lead in the Marketing Space Globally.
              </p>
            </div>

            <div className="bg-navy text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p>
                To Elevate, Educate, Empower and Transform Marketers Futures Together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              FREQUENTLY <span className="text-theme uppercase">ASKED QUESTIONS</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {/* Accordion Item 1 */}
              <details className="bg-white rounded-lg shadow-md">
                <summary className="p-6 text-lg font-semibold cursor-pointer flex justify-between items-center">
                  What is the duration of the program?
                  <span className="text-theme">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  The Guiding Stars mentorship program is designed to run for a duration of 3 months, allowing mentees sufficient time to benefit from the guidance and resources provided. The program includes regular mentorship sessions, trainings and networking events.
                </div>
              </details>

              {/* Accordion Item 2 */}
              <details className="bg-white rounded-lg shadow-md">
                <summary className="p-6 text-lg font-semibold cursor-pointer flex justify-between items-center">
                  Who is eligible for the program?
                  <span className="text-theme">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  Guiding Stars is open to dedicated students, graduands and emerging professionals ready to shape their future in the world of business.
                </div>
              </details>

              {/* Add more FAQ items as needed */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - same as Home */}
      <footer className="bg-dark text-white py-16">
        {/* Reuse the footer from Home.tsx */}
        {/* ... copy footer code from Home if you want ... */}
      </footer>
    </div>
  );
};

export default About;
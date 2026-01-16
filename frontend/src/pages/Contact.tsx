
import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header / Navbar - consistent with Home & About */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-12" />
          </Link>

          <nav className="hidden lg:flex space-x-8 items-center">
            <Link to="/" className="font-semibold hover:text-theme transition">Home</Link>
            <Link to="/about" className="font-semibold hover:text-theme transition">About</Link>
            <Link to="/team" className="font-semibold hover:text-theme transition">Team</Link>
            <Link to="/contact" className="font-semibold text-theme">Contact Us</Link>

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
          alt="Contact Banner"
          className="w-full h-[70vh] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Info */}
            <div className="space-y-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our journey has been marked by a commitment to excellence, a passion for innovation, and a deep belief in the power of collaboration. With a team that spans the globe, we bring together diverse talents and perspectives to tackle some of the most challenging problems in our industry. Please reach out to us for any enquiry, collaboration or any partnership and our team will be more than pleased to hear from you.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-start">
                    <i className="fa fa-phone-alt text-theme text-3xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Phone Number</h4>
                      <p className="text-gray-700">
                        <a href="tel:+260973223910" className="hover:text-theme">+260 973 223 910</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <i className="fa fa-envelope text-theme text-3xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Email</h4>
                      <p className="text-gray-700">
                        <a href="mailto:guidingstars2024@gmail.com" className="hover:text-theme">
                          guidingstars2024@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form action="https://formspree.io/f/mqakpbga" method="POST">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your Name*"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    />
                  </div>

                  <div>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number*"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      name="email"
                      type="email"
                      placeholder="Your Email Address*"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      name="subject"
                      type="text"
                      placeholder="Subject*"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Message*"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-theme text-white py-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - same as Home */}
      <footer className="bg-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <img src="/img/HORIZONTAL (2).png" alt="Guiding Stars" className="h-16 mb-6" />
              <p className="text-gray-300">Nurture Brilliance, Ignite Success.</p>
            </div>

            <div>
              <h6 className="text-theme uppercase font-bold mb-6">Contact</h6>
              <p className="mb-4"><i className="fa fa-map-marker-alt mr-3"></i>Plot 25866 Kabangwe, off Great North Road, Lusaka.</p>
              <p className="mb-4"><i className="fa fa-phone-alt mr-3"></i>+260 973 223 910</p>
              <p><i className="fa fa-envelope mr-3"></i>info@guidingstars.com</p>
            </div>

            <div>
              <h6 className="text-theme uppercase font-bold mb-6">Company</h6>
              <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-theme">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-theme">Contact Us</Link></li>
                <li><a href="#" className="hover:text-theme">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-theme">Terms & Condition</a></li>
              </ul>
            </div>

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

export default Contact;
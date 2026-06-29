import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { SEOHelmet } from '../hooks/useSEO';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="contact" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <img
          src="/img/Top-Bunner-1.jpg"
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
                <div className="flex items-start">
                  <i className="fa fa-phone-alt text-3xl mr-4 mt-1" style={{ color: '#FF9148' }}></i>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-gray-800">Phone Number</h4>
                    <a
                      href="tel:+260973223910"
                      className="text-gray-600 transition"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9148')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      +260 973 223 910
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="fa fa-envelope text-3xl mr-4 mt-1" style={{ color: '#FF9148' }}></i>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-gray-800">Email</h4>
                    <a
                      href="mailto:info@guidingstarszm.com"
                      className="text-gray-600 transition"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9148')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      info@guidingstarszm.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/**
 * Contact Form Component
 * Handles form submission to backend /api/contact endpoint
 */
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const inputClass = "w-full p-4 border border-gray-300 rounded-lg outline-none transition text-gray-800 placeholder-gray-400";

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#FF9148';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 145, 72, 0.15)';
  };

  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

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
        source_page: 'contact',
      });

      if (result.data.success) {
        setResponse({
          type: 'success',
          message: result.data.message || 'Thank you! Your message has been received.',
        });
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Your Name*"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className={`${inputClass} disabled:bg-gray-100`}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number*"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              className={`${inputClass} disabled:bg-gray-100`}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div className="sm:col-span-2">
            <input
              name="email"
              type="email"
              placeholder="Your Email Address*"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className={`${inputClass} disabled:bg-gray-100`}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div className="sm:col-span-2">
            <input
              name="subject"
              type="text"
              placeholder="Subject*"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={loading}
              className={`${inputClass} disabled:bg-gray-100`}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div className="sm:col-span-2">
            <textarea
              name="message"
              rows={6}
              placeholder="Message*"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
              className={`${inputClass} resize-none disabled:bg-gray-100`}
              onFocus={inputFocus}
              onBlur={inputBlur}
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
        >
          {loading ? 'SENDING...' : 'SEND MESSAGE'}
        </button>
      </form>
    </>
  );
}

export default Contact;
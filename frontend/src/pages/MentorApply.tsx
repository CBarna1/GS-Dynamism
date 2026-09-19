import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import ApplicationCountdown from '../components/ApplicationCountdown';
import MathCaptcha, { type MathCaptchaHandle } from '../components/MathCaptcha';
import api from '../services/api';

const MentorApply = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    professional_title: '',
    company: '',
    expertise_areas: '',
    professional_background: '',
    bio: '',
    availability: '',
    preferences: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [checkingWindow, setCheckingWindow] = useState(true);
  const [openDate, setOpenDate] = useState<Date | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<MathCaptchaHandle>(null);

  useEffect(() => {
    api.get('/content')
      .then(res => {
        const data = res.data?.data || {};
        setContent(data);
        const value = data.mentor_apply_open_date;
        if (value) {
          const date = new Date(value);
          if (!isNaN(date.getTime()) && date.getTime() > Date.now()) {
            setOpenDate(date);
          }
        }
      })
      .catch(err => console.error('Failed to load content:', err))
      .finally(() => setCheckingWindow(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const result = await api.post('/mentor-applications', {
        ...formData,
        captcha_token: captchaToken,
        captcha_answer: captchaAnswer,
      });

      if (result.data.success) {
        setResponse({
          type: 'success',
          message:
            result.data.message ||
            'Thank you for your application! We will review it and contact you soon.',
        });
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          professional_title: '',
          company: '',
          expertise_areas: '',
          professional_background: '',
          bio: '',
          availability: '',
          preferences: '',
        });
      } else {
        setResponse({
          type: 'error',
          message: result.data.message || 'Failed to submit application. Please try again.',
        });
        captchaRef.current?.refresh();
      }
    } catch (error: any) {
      setResponse({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit application. Please try again.',
      });
      captchaRef.current?.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (checkingWindow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FF9148] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <img
          src={content.mentor_apply_hero_image || '/img/Top-Bunner-1.jpg'}
          alt="Mentor Banner"
          className="w-full h-[70vh] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Become a Mentor</h1>
            <p className="text-xl md:text-2xl">Share your expertise and guide the next generation</p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Why Become a <span style={{ color: '#FF9148' }}>Mentor?</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl font-bold mb-3" style={{ color: '#FF9148' }}>
                    💡
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Share Your Knowledge</h3>
                  <p className="text-gray-600">
                    Help emerging professionals by sharing your experience and insights
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl font-bold mb-3" style={{ color: '#FF9148' }}>
                    🤝
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Build Connections</h3>
                  <p className="text-gray-600">
                    Network with talented individuals and expand your professional circle
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl font-bold mb-3" style={{ color: '#FF9148' }}>
                    📈
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Make an Impact</h3>
                  <p className="text-gray-600">
                    Contribute to the growth and success of the next generation of leaders
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            {openDate ? (
              <ApplicationCountdown targetDate={openDate} onComplete={() => setOpenDate(null)} />
            ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Application Form</h2>

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
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="John"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Doe"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="john@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="+260 973 223 910"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Professional Fields */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      name="professional_title"
                      value={formData.professional_title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., Senior Software Engineer, Manager"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Your Company"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Areas of Expertise *
                  </label>
                  <input
                    type="text"
                    name="expertise_areas"
                    value={formData.expertise_areas}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., Software Development, Leadership, Product Management"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                </div>

                {/* Professional Background */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Background *
                  </label>
                  <textarea
                    name="professional_background"
                    value={formData.professional_background}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={4}
                    placeholder="Tell us about your professional experience, qualifications, and accomplishments..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition resize-none disabled:bg-gray-100"
                  />
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Personal Bio & Motivation *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={4}
                    placeholder="Tell us about yourself and why you want to become a mentor..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition resize-none disabled:bg-gray-100"
                  />
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability *
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., 5 hours per week, weekends only"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                  />
                </div>

                {/* Preferences */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mentee Preferences
                  </label>
                  <textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Any specific industry, field, or type of mentee you prefer to work with (optional)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition resize-none disabled:bg-gray-100"
                  />
                </div>

                {/* Captcha */}
                <div className="mb-8">
                  <MathCaptcha
                    ref={captchaRef}
                    answer={captchaAnswer}
                    onAnswerChange={setCaptchaAnswer}
                    onTokenChange={setCaptchaToken}
                    inputClassName="w-full max-w-[7rem] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9148] focus:border-[#FF9148] outline-none transition disabled:bg-gray-100"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white py-3 rounded-lg font-semibold text-lg transition bg-gradient-to-br from-[#FF9148] to-[#E8722E] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  * Required fields. We will review your application and contact you within 5-7 business days.
                </p>
              </form>
            </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MentorApply;

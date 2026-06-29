import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { SEOHelmet } from '../hooks/useSEO';

const ApplyPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    background: '',
    goals: '',
    preferences: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Sending data:', formData);

    try {
      const response = await api.post('/mentees', formData);

      console.log('Response:', response.data);

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.message ||
                       err.response?.data?.error ||
                       'Something went wrong. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Focus/blur handlers for orange border on inputs
  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#FF9148';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 145, 72, 0.15)';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition text-gray-800 placeholder-gray-400";

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-20">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="text-center">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(255, 145, 72, 0.15)' }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: '#FF9148' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#E8722E' }}>
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you, <span className="font-semibold text-gray-800">{formData.first_name}</span>! We'll review
                your application and email you at{' '}
                <span className="font-semibold text-gray-800">{formData.email}</span>.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full text-white py-3 rounded-lg font-semibold transition"
                style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="apply" />
      
      <Navbar />
      <div
        className="min-h-screen py-12 px-4"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/img/corporate\ image\ 3.jpeg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10">

          {/* Form Header */}
          <div
            className="p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)' }}
          >
            <h1 className="text-4xl font-bold mb-2">Mentee Application</h1>
            <p className="opacity-90">Join our mentorship program</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  className={inputClass}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  className={inputClass}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={inputClass}
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={inputClass}
                placeholder="+260 97 000 0000"
              />
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educational / Professional Background <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="background"
                rows={4}
                value={formData.background}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={`${inputClass} resize-none`}
                placeholder="Tell us about your education and experience..."
              />
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentorship Goals <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="goals"
                rows={4}
                value={formData.goals}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={`${inputClass} resize-none`}
                placeholder="What do you hope to achieve?"
              />
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentor Preferences <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="preferences"
                rows={3}
                value={formData.preferences}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={`${inputClass} resize-none`}
                placeholder="Any specific industry or skill set?"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                loading
                  ? { background: '#d1d5db' }
                  : { background: 'linear-gradient(135deg, #FF9148, #E8722E)' }
              }
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyPage;
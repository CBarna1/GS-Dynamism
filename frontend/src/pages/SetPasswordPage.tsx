import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const SetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verify token exists
    if (!token) {
      setError('Invalid activation link - no token provided');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/mentees/verify/${token}`, {
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/mentee/login');
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to set password. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#FF9148';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 145, 72, 0.15)';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition text-gray-800 placeholder-gray-400";

  if (success) {
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
                Password Set!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been activated successfully. Redirecting to login...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen py-12 px-4 flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/img/corporate\ image\ 3.jpeg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Form Header */}
          <div
            className="p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)' }}
          >
            <h1 className="text-3xl font-bold mb-2">Set Your Password</h1>
            <p className="opacity-90">Complete your account activation</p>
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={inputClass}
                placeholder="•••••••••••"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                onFocus={inputFocus}
                onBlur={inputBlur}
                className={inputClass}
                placeholder="•••••••••••"
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              style={{
                background: loading
                  ? '#ccc'
                  : 'linear-gradient(135deg, #FF9148, #E8722E)'
              }}
            >
              {loading ? 'Setting Password...' : 'Set Password & Activate Account'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <a href="/mentee/login" className="font-semibold" style={{ color: '#FF9148' }}>
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SetPasswordPage;

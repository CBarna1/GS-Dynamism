// src/pages/MentorLogin.tsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function MentorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Clear admin/mentee tokens when accessing mentor login page
  useEffect(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('mentee_token');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      // Store token in both AuthContext and localStorage for persistence
      if (authContext) {
        authContext.login(token, 'mentor');
      }
      localStorage.setItem('mentor_token', token);
      
      // Redirect to mentor portal
      navigate('/mentor/portal');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/img/corporate image 3.jpeg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-24 mx-auto mb-4" />
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Guiding Stars</h1>
          <p className="text-white/80">Mentor Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mentor Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                style={{ outline: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#FF9148')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                style={{ outline: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#FF9148')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Not a mentor yet?{' '}
              <Link to="/mentor-apply" className="text-orange-500 hover:text-orange-600 font-medium">
                Apply now
              </Link>
            </p>
            <p className="text-gray-600 text-sm mt-4">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Need help? Contact us at guidingstars2024@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default MentorLogin;

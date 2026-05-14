// src/pages/MenteeLogin.tsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function MenteeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Clear admin/mentor tokens when accessing mentee login page
  useEffect(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('mentor_token');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/mentee-auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('mentee_user', JSON.stringify(user));

      if (authContext) {
        authContext.login(token, 'mentee');
      }

      navigate('/mentee/dashboard');
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

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-24 mx-auto mb-4" />
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Guiding Stars</h1>
          <p className="text-white/80">Mentee Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition text-gray-800"
                style={{ outline: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#FF9148')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition text-gray-800"
                style={{ outline: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#FF9148')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded"
                  style={{ accentColor: '#FF9148' }}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <a
                href="#"
                className="text-sm hover:underline font-medium"
                style={{ color: '#FF9148' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              
              <a
                href="#"
                className="font-medium hover:underline"
                style={{ color: '#FF9148' }}
              >
                Contact your administrator
              </a>
            </p>
            <Link
              to="/login"
              className="block text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Are you an administrator? Click here
            </Link>
          </div>
          </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/75">
            © 2026 Guiding Stars. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}

export default MenteeLogin;
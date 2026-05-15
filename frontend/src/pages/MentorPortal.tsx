// src/pages/MentorPortal.tsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface Mentor {
  id: number;
  user_id: number;
  phone: string;
  bio: string;
  expertise_areas: string;
  professional_background: string;
  availability: string;
  preferences: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Mentee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  goals: string;
  background: string;
}

interface Match {
  id: number;
  mentor_id: number;
  mentee_id: number;
  match_date: string;
  status: string;
  mentee?: Mentee;
}

interface ProgressEntry {
  id: number;
  mentee_id: number;
  mentor_id: number;
  entry_date: string;
  description: string;
  status: string;
  notes: string;
  Mentee?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface DashboardData {
  mentor: Mentor;
  user: User;
  matches: Match[];
  recentProgress: ProgressEntry[];
  stats: {
    totalMentees: number;
    activePairings: number;
    progressUpdates: number;
  };
}

function MentorPortal() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setSelectedMatch] = useState<Match | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = authContext?.token || localStorage.getItem('mentor_token');
      
      if (!token) {
        navigate('/mentor/login');
        return;
      }

      const response = await axios.get('/api/mentor-portal/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('mentor_token');
        authContext?.logout();
        navigate('/mentor/login');
      } else {
        setError(err.response?.data?.message || 'Failed to load portal data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mentor_token');
    if (authContext) {
      authContext.logout();
    }
    navigate('/');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading your mentor portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {data.user.first_name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Your Mentor Portal</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/mentor/messages')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messages
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Mentees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data.stats.totalMentees}
                </p>
              </div>
              <div className="text-4xl text-orange-500 opacity-20">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Pairings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data.stats.activePairings}
                </p>
              </div>
              <div className="text-4xl text-green-500 opacity-20">🔗</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Progress Updates</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data.stats.progressUpdates}
                </p>
              </div>
              <div className="text-4xl text-blue-500 opacity-20">📊</div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 font-medium">{data.user.email}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900 font-medium">{data.mentor.phone || 'Not provided'}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <p className="text-gray-900 font-medium">{data.mentor.availability}</p>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <p className="text-gray-900 font-medium">Professional Mentor</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(data.mentor.status)}`}>
                  {data.mentor.status.charAt(0).toUpperCase() + data.mentor.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <p className="text-gray-700 leading-relaxed">{data.mentor.bio}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
              <p className="text-gray-700 leading-relaxed">{data.mentor.expertise_areas}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Background</label>
              <p className="text-gray-700 leading-relaxed">{data.mentor.professional_background}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate('/mentor/edit-profile')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/mentor/change-password')}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Mentee Pairings Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Mentees</h2>
          
          {data.matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No mentee pairings yet</p>
              <p className="text-gray-400 mt-2">Your matched mentees will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {data.matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-orange-300 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {match.mentee?.first_name} {match.mentee?.last_name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{match.mentee?.email}</p>
                      {match.mentee?.phone && (
                        <p className="text-gray-600 text-sm">{match.mentee.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(match.status)}`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      <p className="text-gray-500 text-xs mt-2">
                        Paired {formatDate(match.match_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Progress Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Progress Updates</h2>
          
          {data.recentProgress.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No progress updates yet</p>
              <p className="text-gray-400 mt-2">Progress entries from your mentees will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentProgress.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{entry.description}</p>
                      <p className="text-gray-600 text-sm mt-1">{entry.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(entry.status)}`}>
                        {entry.status.replace('_', ' ').charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                      <p className="text-gray-500 text-xs mt-2">
                        {formatDate(entry.entry_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorPortal;

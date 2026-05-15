// src/pages/MenteeDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Mentee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  goals: string;
  background: string;
}

interface Mentor {
  id: number;
  User: {
    first_name: string;
    last_name: string;
    email: string;
  };
  phone: string;
  bio: string;
  expertise_areas: string;
  availability: string;
}

interface ProgressEntry {
  id: number;
  entry_date: string;
  description: string;
  status: string;
  notes: string;
}

interface DashboardData {
  mentee: Mentee;
  mentor: Mentor | null;
  recentProgress: ProgressEntry[];
  stats: {
    totalProgress: number;
    milestonesCompleted: number;
  };
}

function MenteeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('mentee_token');
      
      if (!token) {
        navigate('/mentee/login');
        return;
      }

      const response = await axios.get('/api/mentee-portal/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('mentee_token');
        localStorage.removeItem('mentee_user');
        navigate('/mentee/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mentee_token');
    localStorage.removeItem('mentee_user');
    navigate('/mentee/login');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-primary-100 text-primary-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'milestone_completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'needs_attention':
        return 'Needs Attention';
      case 'milestone_completed':
        return 'Milestone Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">{error || 'Failed to load data'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 shadow-md border-b-2 border-orange-500" style={{ backgroundColor: '#666565' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-10" />
              <div className="hidden md:block">
                <p className="text-sm text-gray-300">Mentee Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-200 font-medium hidden sm:inline">
                {data.mentee.first_name} {data.mentee.last_name}
              </span>
              <button
                onClick={() => navigate('/mentee/messages')}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Messages</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-orange-500 rounded-lg transition font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, {data.mentee.first_name}!
          </h2>
          <p className="text-gray-600 mt-2">Here's your mentorship progress overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Total Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progress Entries</p>
                <p className="text-3xl font-bold text-gray-800">{data.stats.totalProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Milestones</p>
                <p className="text-3xl font-bold text-primary-600">{data.stats.milestonesCompleted}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mentor Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mentor Assigned</p>
                <p className="text-3xl font-bold text-purple-600">{data.mentor ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mentor Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Mentor
            </h3>
            {data.mentor ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {data.mentor.User.first_name} {data.mentor.User.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{data.mentor.User.email}</p>
                </div>
                {data.mentor.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{data.mentor.phone}</p>
                  </div>
                )}
                {data.mentor.expertise_areas && (
                  <div>
                    <p className="text-sm text-gray-600">Expertise</p>
                    <p className="font-medium text-gray-900">{data.mentor.expertise_areas}</p>
                  </div>
                )}
                {data.mentor.bio && (
                  <div>
                    <p className="text-sm text-gray-600">About</p>
                    <p className="text-gray-700 text-sm">{data.mentor.bio}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-500">No mentor assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">Your administrator will assign a mentor soon</p>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Profile
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{data.mentee.email}</p>
              </div>
              {data.mentee.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{data.mentee.phone}</p>
                </div>
              )}
              {data.mentee.goals && (
                <div>
                  <p className="text-sm text-gray-600">Goals</p>
                  <p className="text-gray-700 text-sm">{data.mentee.goals}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Recent Progress
          </h3>
          {data.recentProgress.length > 0 ? (
            <div className="space-y-4">
              {data.recentProgress.map((entry) => (
                <div key={entry.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.entry_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(entry.status)}`}>
                      {getStatusLabel(entry.status)}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2">{entry.description}</p>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 italic">Note: {entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No progress entries yet</p>
              <p className="text-sm text-gray-400 mt-1">Your mentor will add progress updates</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MenteeDashboard;
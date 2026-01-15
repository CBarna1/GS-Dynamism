// src/pages/Dashboard.tsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // ← add this later if you create Sidebar

interface Stats {
  totalMentors: number;
  activeMentees: number;
  activeMatches: number;
}

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)!;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
        try {
          console.log('Fetching stats... Token exists?', !!localStorage.getItem('token'));
          
          const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          console.log('Stats response:', res.data);
          setStats(res.data.data);
        } catch (err: any) {
          const errorMsg = err.response
            ? `${err.response.status} - ${err.response.data?.message || err.message}`
            : err.message;
          
          setError(`Failed to load stats: ${errorMsg}`);
          console.error('Stats fetch failed:', err);
        } finally {
          setLoading(false);
        }
      };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar – add later or comment out for now */}
      {/* <Sidebar /> */}

      <div className="flex-1">
        {/* Navbar */}
        <nav className="bg-indigo-700 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Guiding Stars Admin</h1>
            <div className="flex items-center gap-4">
              <span>{user?.first_name || user?.email} ({user?.role})</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome, {user?.first_name || 'Admin'}!
          </h2>

          {loading && <p className="text-center text-gray-600 animate-pulse">Loading dashboard...</p>}
          {error && <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-700">Total Mentors</h3>
                <p className="text-5xl font-bold text-indigo-600 mt-2">{stats.totalMentors}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-700">Active Mentees</h3>
                <p className="text-5xl font-bold text-green-600 mt-2">{stats.activeMentees}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-700">Active Matches</h3>
                <p className="text-5xl font-bold text-purple-600 mt-2">{stats.activeMatches}</p>
              </div>
            </div>
          )}

          {/* Quick links or recent activity section can go here later */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
// src/pages/Mentors.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Mentor {
  id: number;
  phone: string;
  bio: string;
  expertise_areas: string;
  status: 'active' | 'inactive';
  User: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/mentors');
        setMentors(res.data.data);
      } catch (err: any) {
        setError('Failed to load mentors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <nav className="bg-indigo-700 text-white p-4 shadow-md fixed top-0 left-64 right-0 z-10">
          {/* Navbar code from Dashboard */}
        </nav>

        <main className="mt-16 max-w-7xl mx-auto p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Mentors Management</h2>

          {loading && <p>Loading mentors...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {mentors.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expertise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentors.map((mentor) => (
                    <tr key={mentor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mentor.User.first_name} {mentor.User.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{mentor.User.email}</td>
                      <td className="px-6 py-4">{mentor.expertise_areas || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            mentor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {mentor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Deactivate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No mentors found yet.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Mentors;
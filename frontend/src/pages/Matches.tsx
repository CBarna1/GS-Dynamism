import { useState, useEffect } from 'react';
import api from '../services/api';

interface Mentor {
  id: number;
  first_name?: string;
  last_name?: string;
  expertise_areas?: string;
  status?: string;
  user_id?: number;
  User?: { first_name: string; last_name: string; email: string };
}

interface Mentee {
  id: number;
  first_name?: string;
  last_name?: string;
  goals?: string;
  application_status?: string;
}

interface Match {
  id: number;
  mentor_id: number;
  mentee_id: number;
  match_date: string;
  status: string;
  notes: string;
  mentor_name?: string;
  mentee_name?: string;
}

const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = '#FF9148';
  e.target.style.boxShadow = '0 0 0 3px rgba(255,145,72,0.15)';
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = '#d1d5db';
  e.target.style.boxShadow = 'none';
};
const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition text-gray-800";

function Matches() {

  const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing');
  const [matches, setMatches] = useState<Match[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedMentee, setSelectedMentee] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [matchNotes, setMatchNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, mentorsRes, menteesRes] = await Promise.all([
        api.get('/matches'),
        api.get('/mentors'),
        api.get('/mentees'),
      ]);

      const enrichedMatches = (matchesRes.data.data || matchesRes.data).map((match: Match) => {
        const mentor = (mentorsRes.data.data || mentorsRes.data).find((m: Mentor) => m.id === match.mentor_id);
        const mentee = (menteesRes.data.data || menteesRes.data).find((m: Mentee) => m.id === match.mentee_id);
        return {
          ...match,
          mentor_name: mentor
            ? `${mentor.first_name || mentor.User?.first_name} ${mentor.last_name || mentor.User?.last_name}`
            : 'Unknown',
          mentee_name: mentee
            ? `${mentee.first_name} ${mentee.last_name}`
            : 'Unknown',
        };
      });

      // Only offer people who are not already in an active pairing
      const activeMatches = enrichedMatches.filter((m: Match) => m.status === 'active');
      const pairedMentorIds = new Set(activeMatches.map((m: Match) => m.mentor_id));
      const pairedMenteeIds = new Set(activeMatches.map((m: Match) => m.mentee_id));

      setMatches(enrichedMatches);
      setMentors((mentorsRes.data.data || mentorsRes.data).filter((m: Mentor) =>
        (m.status || '').toLowerCase() === 'active' && !pairedMentorIds.has(m.id)));
      // Approved mentees become 'active' once they set their password; both can be matched
      setMentees((menteesRes.data.data || menteesRes.data).filter((m: Mentee) =>
        ['approved', 'active'].includes((m.application_status || '').toLowerCase()) && !pairedMenteeIds.has(m.id)));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !selectedMentee) {
      setError('Please select both a mentor and a mentee');
      return;
    }
    try {
      const res = await api.post('/matches', {
        mentor_id: parseInt(selectedMentor),
        mentee_id: parseInt(selectedMentee),
        match_date: matchDate,
        notes: matchNotes,
        status: 'active',
      });
      setSuccess(res.data?.message || 'Match created successfully!');
      setSelectedMentor('');
      setSelectedMentee('');
      setMatchNotes('');
      setActiveTab('existing');
      fetchData();
      setTimeout(() => setSuccess(''), 6000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create match');
    }
  };

  const handleUpdateMatchStatus = async (matchId: number, newStatus: string) => {
    try {
      await api.put(`/matches/${matchId}`, { status: newStatus });
      setSuccess('Match status updated!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update match');
    }
  };

  const handleDeleteMatch = async (matchId: number) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    try {
      await api.delete(`/matches/${matchId}`);
      setSuccess('Match deleted!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete match');
    }
  };

  const matchStatusStyle = (status: string) => {
    if (status === 'active') return { background: 'rgba(255,145,72,0.15)', color: '#E8722E' };
    if (status === 'completed') return { background: '#dcfce7', color: '#166534' };
    return { background: '#f3f4f6', color: '#374151' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#FF9148' }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/img/corporate image 3.jpeg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mentor-Mentee Matches</h1>
          <p className="text-gray-300 mt-2">Manage mentor-mentee pairings and track matching history</p>
        </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 text-xl">×</button>
        </div>
      )}
      {success && (
        <div className="mb-6 border px-4 py-3 rounded-lg flex items-center justify-between"
          style={{ background: 'rgba(255,145,72,0.1)', borderColor: 'rgba(255,145,72,0.3)', color: '#E8722E' }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-xl" style={{ color: '#E8722E' }}>×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          {(['existing', 'create'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-4 font-medium text-sm capitalize transition-colors"
              style={
                activeTab === tab
                  ? { borderBottom: '2px solid #FF9148', color: '#FF9148' }
                  : { color: '#6b7280' }
              }
            >
              {tab === 'existing' ? `Existing Matches (${matches.length})` : 'Create New Match'}
            </button>
          ))}
        </div>

        {/* Existing Matches */}
        {activeTab === 'existing' && (
          <div className="p-6">
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating a new mentor-mentee match</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-white px-6 py-2 rounded-lg transition"
                  style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                >
                  Create First Match
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Mentor', 'Mentee', 'Match Date', 'Status', 'Notes', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map(match => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{match.mentor_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{match.mentee_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(match.match_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={match.status}
                            onChange={e => handleUpdateMatchStatus(match.id, e.target.value)}
                            className="px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer"
                            style={matchStatusStyle(match.status)}
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="terminated">Terminated</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {match.notes || 'No notes'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteMatch(match.id)}
                            className="text-red-500 hover:text-red-700 font-medium transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create New Match */}
        {activeTab === 'create' && (
          <div className="p-6">
            <form onSubmit={handleCreateMatch} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Mentor *</label>
                  <select
                    value={selectedMentor}
                    onChange={e => setSelectedMentor(e.target.value)}
                    required
                    className={inputClass}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  >
                    <option value="">Choose a mentor...</option>
                    {mentors.map(mentor => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.first_name || mentor.User?.first_name} {mentor.last_name || mentor.User?.last_name}
                        {mentor.expertise_areas && ` — ${mentor.expertise_areas.split(',')[0]}`}
                      </option>
                    ))}
                  </select>
                  {mentors.length === 0 && <p className="mt-2 text-sm text-red-500">No active mentors available</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Mentee *</label>
                  <select
                    value={selectedMentee}
                    onChange={e => setSelectedMentee(e.target.value)}
                    required
                    className={inputClass}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  >
                    <option value="">Choose a mentee...</option>
                    {mentees.map(mentee => (
                      <option key={mentee.id} value={mentee.id}>
                        {mentee.first_name} {mentee.last_name}
                      </option>
                    ))}
                  </select>
                  {mentees.length === 0 && <p className="mt-2 text-sm text-red-500">No approved mentees available</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Date *</label>
                <input
                  type="date"
                  value={matchDate}
                  onChange={e => setMatchDate(e.target.value)}
                  required
                  className={inputClass}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Notes</label>
                <textarea
                  value={matchNotes}
                  onChange={e => setMatchNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any relevant notes about this match..."
                  className={`${inputClass} resize-none`}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Match Preview */}
              {selectedMentor && selectedMentee && (
                <div
                  className="p-4 rounded-lg border"
                  style={{ background: 'rgba(255,145,72,0.08)', borderColor: 'rgba(255,145,72,0.3)' }}
                >
                  <h3 className="font-medium mb-2" style={{ color: '#E8722E' }}>Match Preview</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Mentor:</span> {mentors.find(m => m.id === parseInt(selectedMentor))?.first_name} {mentors.find(m => m.id === parseInt(selectedMentor))?.last_name}</p>
                    <p><span className="font-medium">Mentee:</span> {mentees.find(m => m.id === parseInt(selectedMentee))?.first_name} {mentees.find(m => m.id === parseInt(selectedMentee))?.last_name}</p>
                    <p><span className="font-medium">Date:</span> {new Date(matchDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={mentors.length === 0 || mentees.length === 0}
                  className="text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                >
                  Create Match
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedMentor(''); setSelectedMentee(''); setMatchNotes(''); }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { label: 'Active Matches', value: matches.filter(m => m.status === 'active').length, color: '#FF9148' },
          { label: 'Completed Matches', value: matches.filter(m => m.status === 'completed').length, color: '#16a34a' },
          { label: 'Total Matches', value: matches.length, color: '#374151' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: `${color}18` }}>
                <svg className="w-6 h-6" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Matches;
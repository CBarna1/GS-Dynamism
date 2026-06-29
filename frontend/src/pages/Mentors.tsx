import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../services/api';
import { SEOHelmet } from '../hooks/useSEO';

interface Mentor {
  id: number;
  user_id: number;
  phone: string;
  bio: string;
  expertise_areas: string;
  availability: string;
  status: 'active' | 'inactive';
  first_name?: string;
  last_name?: string;
  email?: string;
  User?: { first_name: string; last_name: string; email: string };
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

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    phone: '',
    bio: '',
    expertise_areas: '',
    availability: '',
    status: 'active' as 'active' | 'inactive',
    first_name: '',
    last_name: '',
    email: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => { fetchMentors(); }, []);

  const fetchMentors = async () => {
    try {
      const res = await api.get('/mentors');
      setMentors(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mentor: Mentor | null = null) => {
    if (mentor) {
      setIsEditMode(true);
      setSelectedMentor(mentor);
      setFormData({
        user_id: mentor.user_id?.toString() || '',
        phone: mentor.phone || '',
        bio: mentor.bio || '',
        expertise_areas: mentor.expertise_areas || '',
        availability: mentor.availability || '',
        status: mentor.status,
        first_name: mentor.first_name || mentor.User?.first_name || '',
        last_name: mentor.last_name || mentor.User?.last_name || '',
        email: mentor.email || mentor.User?.email || '',
      });
    } else {
      setIsEditMode(false);
      setSelectedMentor(null);
      setFormData({ user_id: '1', phone: '', bio: '', expertise_areas: '', availability: '', status: 'active', first_name: '', last_name: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (isEditMode && selectedMentor) {
        await api.put(`/mentors/${selectedMentor.id}`, formData);
        setSuccess('Mentor updated successfully!');
      } else {
        await api.post('/mentors', formData);
        setSuccess('Mentor created successfully!');
      }
      setIsModalOpen(false);
      fetchMentors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save mentor');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeactivate = async (mentor: Mentor) => {
    const name = `${mentor.first_name || mentor.User?.first_name} ${mentor.last_name || mentor.User?.last_name}`;
    if (!window.confirm(`Deactivate ${name}?`)) return;
    try {
      await api.put(`/mentors/${mentor.id}`, { status: 'inactive' });
      setSuccess('Mentor deactivated');
      fetchMentors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deactivate mentor');
    }
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
    }}
    >
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="mentors" />
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mentors Management</h1>
          <p className="text-gray-300 mt-2">Manage mentor profiles and availability</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          { label: 'Total Mentors', value: mentors.length, color: '#FF9148' },
          { label: 'Active Mentors', value: mentors.filter(m => m.status === 'active').length, color: '#FF9148' },
          { label: 'Inactive Mentors', value: mentors.filter(m => m.status === 'inactive').length, color: '#6b7280' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl md:text-3xl font-bold" style={{ color }}>{value}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: `${color}18` }}>
                <svg className="w-6 h-6 md:w-8 md:h-8" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Mentor
        </button>
      </div>

      {/* List */}
      {mentors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first mentor</p>
          <button
            onClick={() => openModal()}
            className="text-white px-6 py-2 rounded-lg transition"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            Add First Mentor
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Expertise', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mentors.map(mentor => (
                  <tr key={mentor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {mentor.first_name || mentor.User?.first_name} {mentor.last_name || mentor.User?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {mentor.email || mentor.User?.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {mentor.expertise_areas || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={
                          mentor.status === 'active'
                            ? { background: 'rgba(255,145,72,0.15)', color: '#E8722E' }
                            : { background: '#f3f4f6', color: '#6b7280' }
                        }
                      >
                        {mentor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium flex gap-4">
                      <button
                        onClick={() => openModal(mentor)}
                        className="font-semibold transition"
                        style={{ color: '#FF9148' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8722E')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#FF9148')}
                      >
                        Edit
                      </button>
                      {mentor.status === 'active' && (
                        <button
                          onClick={() => handleDeactivate(mentor)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {mentors.map(mentor => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {mentor.first_name || mentor.User?.first_name} {mentor.last_name || mentor.User?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{mentor.email || mentor.User?.email}</p>
                  </div>
                  <span
                    className="px-2 py-1 text-xs font-semibold rounded-full ml-2"
                    style={
                      mentor.status === 'active'
                        ? { background: 'rgba(255,145,72,0.15)', color: '#E8722E' }
                        : { background: '#f3f4f6', color: '#6b7280' }
                    }
                  >
                    {mentor.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{mentor.expertise_areas || 'No expertise listed'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(mentor)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition"
                    style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                  >
                    Edit
                  </button>
                  {mentor.status === 'active' && (
                    <button
                      onClick={() => handleDeactivate(mentor)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                  {/* Modal Header */}
                  <div
                    className="rounded-xl p-4 mb-6 text-white"
                    style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                  >
                    <Dialog.Title as="h3" className="text-lg font-bold">
                      {isEditMode ? 'Edit Mentor' : 'Add New Mentor'}
                    </Dialog.Title>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User ID *</label>
                      <input type="number" name="user_id" value={formData.user_id} onChange={handleInputChange}
                        className={inputClass} onFocus={inputFocus} onBlur={inputBlur} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: 'first_name', label: 'First name', placeholder: 'First name' },
                        { name: 'last_name', label: 'Last name', placeholder: 'Last name' },
                        { name: 'email', label: 'Email', placeholder: 'email@example.com' },
                      ].map(field => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <input
                            type={field.name === 'email' ? 'email' : 'text'}
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleInputChange}
                            className={inputClass}
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                        className={inputClass} onFocus={inputFocus} onBlur={inputBlur} placeholder="+260 XXX XXX XXX" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3}
                        className={`${inputClass} resize-none`} onFocus={inputFocus} onBlur={inputBlur}
                        placeholder="Brief description about the mentor..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Areas</label>
                      <input type="text" name="expertise_areas" value={formData.expertise_areas} onChange={handleInputChange}
                        className={inputClass} onFocus={inputFocus} onBlur={inputBlur}
                        placeholder="e.g. Web Development, Leadership, Business" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <input type="text" name="availability" value={formData.availability} onChange={handleInputChange}
                        className={inputClass} onFocus={inputFocus} onBlur={inputBlur}
                        placeholder="e.g. Weekday evenings, Weekends" />
                    </div>

                    {isEditMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}
                          className={inputClass} onFocus={inputFocus} onBlur={inputBlur}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitLoading}
                        className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                        {submitLoading ? 'Saving...' : isEditMode ? 'Update Mentor' : 'Save Mentor'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </div>
    </div>
  );
};

export default Mentors;
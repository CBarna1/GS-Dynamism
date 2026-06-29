import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { SEOHelmet } from '../hooks/useSEO';

interface Mentee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  background: string;
  goals: string;
  preferences: string;
  application_status: string;
  enrollment_date: string | null;
  notes?: string;
  mentor_id?: number | null;
}

interface MentorOption {
  id: number;
  User: { first_name: string; last_name: string; email: string };
}

const STATUS_FILTERS = ['all', 'pending', 'approved', 'active', 'rejected'];

const Mentees = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<MentorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [formData, setFormData] = useState({
    application_status: '',
    notes: '',
    mentor_id: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get('status') || 'all'
  );

  const context = useContext(AuthContext);
  const token = context?.token;
  const isAuthLoading = context?.isLoading;

  useEffect(() => {
    if (!isAuthLoading && token) fetchData();
  }, [token, isAuthLoading]);

  useEffect(() => {
    const param = searchParams.get('status');
    if (param) setActiveFilter(param);
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [menteesRes, mentorsRes] = await Promise.all([
        api.get('/mentees', config),
        api.get('/mentors', config),
      ]);
      setMentees(menteesRes.data.data || []);
      setMentors(mentorsRes.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load data: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredMentees =
    activeFilter === 'all'
      ? mentees
      : mentees.filter(m => m.application_status === activeFilter);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ status: filter });
    }
  };

  const openModal = (mentee: Mentee) => {
    setSelectedMentee(mentee);
    setFormData({
      application_status: mentee.application_status,
      notes: mentee.notes || '',
      mentor_id: mentee.mentor_id?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee || !token) return;
    setSubmitLoading(true);
    setError('');
    try {
      await api.put(`/mentees/${selectedMentee.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Mentee updated successfully!');
      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':   return { background: 'rgba(255,145,72,0.15)', color: '#E8722E' };
      case 'pending':  return { background: '#fef9c3', color: '#854d0e' };
      case 'approved': return { background: '#dcfce7', color: '#166534' };
      case 'rejected': return { background: '#fee2e2', color: '#991b1b' };
      default:         return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const inputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = '#FF9148';
    e.target.style.boxShadow = '0 0 0 3px rgba(255,145,72,0.15)';
  };
  const inputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  if (isAuthLoading || (loading && mentees.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: '#FF9148' }}
        />
      </div>
    );
  }

  return (
    // overflow-x-hidden on the root prevents ANY child from causing page-wide scroll
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/img/corporate image 3.jpeg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="mentees" />
      <Sidebar />

      {/*
        On mobile: full width (sidebar is fixed/overlaid, not in flow)
        On desktop (lg+): small offset from sidebar for spacing
        overflow-x-hidden here too so nothing inside leaks out
      */}
      <div className="lg:ml-4 w-full overflow-x-hidden">
        <main className="p-4 md:p-6 overflow-x-hidden w-full flex justify-center">
          <div className="w-full max-w-7xl">

            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Mentees & Applications
              </h2>
              <p className="text-gray-300 mt-2">
                Manage mentee applications and assignments
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900 text-xl ml-4 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            )}
            {success && (
              <div
                className="mb-6 border px-4 py-3 rounded-lg flex items-center justify-between"
                style={{
                  background: 'rgba(255,145,72,0.1)',
                  borderColor: 'rgba(255,145,72,0.3)',
                  color: '#E8722E',
                }}
              >
                <span className="text-sm">{success}</span>
                <button
                  onClick={() => setSuccess('')}
                  className="text-xl ml-4 flex-shrink-0"
                  style={{ color: '#E8722E' }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 md:mb-8">
            {[
              { label: 'Total', value: mentees.length, color: '#1f2937' },
              {
                label: 'Pending',
                value: mentees.filter(m => m.application_status === 'pending').length,
                color: '#ca8a04',
              },
              {
                label: 'Active',
                value: mentees.filter(m => m.application_status === 'active').length,
                color: '#FF9148',
              },
              {
                label: 'Approved',
                value: mentees.filter(m => m.application_status === 'approved').length,
                color: '#16a34a',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white p-4 rounded-lg shadow-md min-w-0">
                <p className="text-sm text-gray-500 truncate">{label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap border-b border-gray-200">
                {STATUS_FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className="px-4 py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap"
                    style={
                      activeFilter === filter
                        ? { borderBottom: '2px solid #FF9148', color: '#FF9148' }
                        : { color: '#6b7280' }
                    }
                  >
                    {filter === 'all'
                      ? `All (${mentees.length})`
                      : `${filter} (${
                          mentees.filter(m => m.application_status === filter).length
                        })`}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentees List */}
            {filteredMentees.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeFilter === 'all' ? '' : activeFilter} mentees found
                </h3>
                {activeFilter !== 'all' && (
                  <button
                    className="underline"
                    style={{ color: '#FF9148' }}
                    onClick={() => handleFilterChange('all')}
                  >
                    View all mentees
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Goals</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMentees.map(mentee => (
                        <tr key={mentee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate">
                            {mentee.first_name} {mentee.last_name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 truncate">
                            {mentee.email}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap"
                              style={statusBadgeStyle(mentee.application_status)}
                            >
                              {mentee.application_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 truncate">
                            {mentee.goals?.substring(0, 60) || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <button
                              onClick={() => openModal(mentee)}
                              className="font-semibold transition whitespace-nowrap"
                              style={{ color: '#FF9148' }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.color = '#E8722E')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.color = '#FF9148')
                              }
                            >
                              View / Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredMentees.map(mentee => (
                  <div key={mentee.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {mentee.first_name} {mentee.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {mentee.email}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 flex-shrink-0"
                        style={statusBadgeStyle(mentee.application_status)}
                      >
                        {mentee.application_status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Goals</p>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {mentee.goals || 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => openModal(mentee)}
                      className="w-full py-2 rounded-lg text-sm font-semibold text-white transition"
                      style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                    >
                      View / Update
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Modal */}
          <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => setIsModalOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-30" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                      {/* Modal Header */}
                      <div
                        className="rounded-xl p-4 mb-6 text-white"
                        style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                      >
                        <Dialog.Title as="h3" className="text-lg font-bold">
                          Update Mentee Application
                        </Dialog.Title>
                        {selectedMentee && (
                          <p className="text-sm opacity-90 mt-1">
                            {selectedMentee.first_name} {selectedMentee.last_name}
                          </p>
                        )}
                      </div>

                      {selectedMentee && (
                        <form onSubmit={handleSubmit} className="space-y-4">

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Email</p>
                              <p className="text-gray-800 break-all">{selectedMentee.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Phone</p>
                              <p className="text-gray-800">{selectedMentee.phone || 'N/A'}</p>
                            </div>
                          </div>

                          {selectedMentee.background && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Background</p>
                              <p className="text-sm text-gray-800">{selectedMentee.background}</p>
                            </div>
                          )}

                          {selectedMentee.goals && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Goals</p>
                              <p className="text-sm text-gray-800">{selectedMentee.goals}</p>
                            </div>
                          )}

                          {selectedMentee.preferences && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Preferences</p>
                              <p className="text-sm text-gray-800">{selectedMentee.preferences}</p>
                            </div>
                          )}

                          <div className="border-t border-gray-100 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="application_status"
                              value={formData.application_status}
                              onChange={handleInputChange}
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Assign Mentor
                            </label>
                            <select
                              name="mentor_id"
                              value={formData.mentor_id}
                              onChange={handleInputChange}
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition"
                            >
                              <option value="">No mentor assigned</option>
                              {mentors.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.User.first_name} {m.User.last_name} ({m.User.email})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Admin Notes
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition resize-none"
                              placeholder="Internal notes, reasons for status change..."
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={submitLoading}
                              className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
                            >
                              {submitLoading ? 'Saving...' : 'Update Mentee'}
                            </button>
                          </div>

                        </form>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Mentees;
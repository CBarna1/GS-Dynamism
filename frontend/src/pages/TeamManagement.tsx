// src/pages/TeamManagement.tsx
import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../services/api';

interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  name: '',
  role: '',
  photo: '',
  description: '',
};

function TeamManagement() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team/admin/all');
      setMembers(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member: TeamMemberItem | null = null) => {
    if (member) {
      setIsEditMode(true);
      setSelectedMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        photo: member.photo || '',
        description: member.description || '',
      });
    } else {
      setIsEditMode(false);
      setSelectedMember(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedMember(null);
    setFormData(emptyForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/team/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, photo: res.data.imageUrl }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (isEditMode && selectedMember) {
        await api.put(`/team/${selectedMember.id}`, formData);
        setSuccess('Team member updated successfully!');
      } else {
        await api.post('/team', { ...formData, display_order: members.length });
        setSuccess('Team member added successfully!');
      }
      resetForm();
      fetchMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save team member');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleActive = async (member: TeamMemberItem) => {
    try {
      await api.put(`/team/${member.id}`, { is_active: !member.is_active });
      fetchMembers();
    } catch {
      setError('Failed to update team member');
    }
  };

  const handleMove = async (member: TeamMemberItem, direction: 'up' | 'down') => {
    const sorted = [...members].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((m) => m.id === member.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    try {
      await Promise.all([
        api.put(`/team/${member.id}`, { display_order: other.display_order }),
        api.put(`/team/${other.id}`, { display_order: member.display_order }),
      ]);
      fetchMembers();
    } catch {
      setError('Failed to reorder team members');
    }
  };

  const handleDelete = async (member: TeamMemberItem) => {
    if (!window.confirm(`Remove "${member.name}" from the team page?`)) return;
    try {
      await api.delete(`/team/${member.id}`);
      setSuccess('Team member removed');
      fetchMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to remove team member');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition text-gray-800 focus:border-[#FF9148] focus:ring-2 focus:ring-[#FF9148]/20";

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  const sortedMembers = [...members].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-500 mt-1">Manage who appears on the public Team page.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="text-white px-6 py-3 rounded-lg font-medium transition shadow-md whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            + Add Member
          </button>
        </div>

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

        {sortedMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-4">Add your first team member.</p>
            <button
              onClick={() => openModal()}
              className="text-white px-6 py-2 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              + Add Member
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedMembers.map((member, idx) => (
              <div key={member.id} className="bg-white rounded-lg p-5 shadow-md flex flex-col sm:flex-row gap-4 sm:items-center">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl bg-gray-100">👤</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                    {!member.is_active && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#FF9148' }}>{member.role}</p>
                  {member.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{member.description}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0 items-center">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleMove(member, 'up')}
                      disabled={idx === 0}
                      className="px-2 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      aria-label="Move up"
                    >▲</button>
                    <button
                      onClick={() => handleMove(member, 'down')}
                      disabled={idx === sortedMembers.length - 1}
                      className="px-2 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      aria-label="Move down"
                    >▼</button>
                  </div>
                  <button
                    onClick={() => handleToggleActive(member)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition border"
                    style={member.is_active ? { borderColor: '#d1d5db', color: '#6b7280' } : { borderColor: '#FF9148', color: '#FF9148' }}
                  >
                    {member.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => openModal(member)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={resetForm}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                  <div className="rounded-xl p-4 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                    <Dialog.Title as="h3" className="text-lg font-bold">
                      {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
                    </Dialog.Title>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Ms. Jane Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Program Coordinator"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className={`${inputClass} resize-none`}
                        placeholder="Shown on the back of their card"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={inputClass}
                        disabled={uploadingImage}
                      />
                      {uploadingImage && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                      {formData.photo && (
                        <div className="mt-3 flex items-start gap-3">
                          <img src={formData.photo} alt="Preview" className="max-h-40 rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={resetForm}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitLoading || uploadingImage}
                        className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                        {submitLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Member'}
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
  );
}

export default TeamManagement;

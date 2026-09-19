// src/pages/TestimonialManagement.tsx
import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../services/api';

interface TestimonialItem {
  id: number;
  cohort_label: string;
  name: string;
  role: string;
  content: string;
  image: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  cohort_label: '',
  name: '',
  role: 'Mentee',
  content: '',
  image: '',
};

function TestimonialManagement() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials/admin/all');
      setItems(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: TestimonialItem | null = null) => {
    if (item) {
      setIsEditMode(true);
      setSelectedItem(item);
      setFormData({
        cohort_label: item.cohort_label,
        name: item.name,
        role: item.role,
        content: item.content,
        image: item.image || '',
      });
    } else {
      setIsEditMode(false);
      setSelectedItem(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    setFormData(emptyForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/testimonials/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
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
      if (isEditMode && selectedItem) {
        await api.put(`/testimonials/${selectedItem.id}`, formData);
        setSuccess('Testimonial updated successfully!');
      } else {
        await api.post('/testimonials', { ...formData, display_order: items.length });
        setSuccess('Testimonial added successfully!');
      }
      resetForm();
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleActive = async (item: TestimonialItem) => {
    try {
      await api.put(`/testimonials/${item.id}`, { is_active: !item.is_active });
      fetchItems();
    } catch {
      setError('Failed to update testimonial');
    }
  };

  const handleDelete = async (item: TestimonialItem) => {
    if (!window.confirm(`Delete this testimonial from ${item.name}?`)) return;
    try {
      await api.delete(`/testimonials/${item.id}`);
      setSuccess('Testimonial deleted');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete testimonial');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition text-gray-800 focus:border-[#FF9148] focus:ring-2 focus:ring-[#FF9148]/20";

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  // Group by cohort_label for display, preserving first-seen order
  const groups: { label: string; items: TestimonialItem[] }[] = [];
  for (const item of items) {
    let group = groups.find((g) => g.label === item.cohort_label);
    if (!group) {
      group = { label: item.cohort_label, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-500 mt-1">Group entries with the same "Cohort Label" to create tabs on the public page.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="text-white px-6 py-3 rounded-lg font-medium transition shadow-md whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            + Add Testimonial
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

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-500 mb-4">Add your first testimonial.</p>
            <button
              onClick={() => openModal()}
              className="text-white px-6 py-2 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              + Add Testimonial
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-lg font-bold text-gray-700 mb-3">{group.label}</h2>
                <div className="grid gap-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-5 shadow-md flex flex-col sm:flex-row gap-4 sm:items-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl bg-gray-100">💬</div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-800">{item.name}</h3>
                          <span className="text-xs text-gray-400">· {item.role}</span>
                          {!item.is_active && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Hidden</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">"{item.content}"</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className="px-3 py-2 rounded-lg text-sm font-semibold transition border"
                          style={item.is_active ? { borderColor: '#d1d5db', color: '#6b7280' } : { borderColor: '#FF9148', color: '#FF9148' }}
                        >
                          {item.is_active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => openModal(item)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
                      {isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}
                    </Dialog.Title>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cohort Label *</label>
                      <input
                        type="text"
                        value={formData.cohort_label}
                        onChange={(e) => setFormData({ ...formData, cohort_label: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Cohort Two Testimonials"
                        list="cohort-labels"
                        required
                      />
                      <datalist id="cohort-labels">
                        {groups.map((g) => <option key={g.label} value={g.label} />)}
                      </datalist>
                      <p className="text-xs text-gray-400 mt-1">Matches an existing label to group into that tab, or type a new one.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                        className={`${inputClass} resize-none`}
                        required
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
                      {formData.image && (
                        <div className="mt-3 flex items-start gap-3">
                          <img src={formData.image} alt="Preview" className="max-h-40 rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
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
                        {submitLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Testimonial'}
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

export default TestimonialManagement;

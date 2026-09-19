// src/pages/GraduationManagement.tsx
import { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../services/api';

interface Award {
  label: string;
  name: string;
  institution: string;
}

interface Photo {
  id: number;
  image_url: string;
  display_order: number;
}

interface CohortItem {
  id: number;
  title: string;
  cohort_date: string | null;
  press_statement: string | null;
  future_text: string | null;
  awards: Award[];
  display_order: number;
  is_active: boolean;
  photos: Photo[];
}

const emptyForm = {
  title: '',
  cohort_date: '',
  press_statement: '',
  future_text: '',
  awards: [] as Award[],
};

function GraduationManagement() {
  const [cohorts, setCohorts] = useState<CohortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<CohortItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const [photosModalCohort, setPhotosModalCohort] = useState<CohortItem | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => { fetchCohorts(); }, []);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/graduation/admin/all');
      setCohorts(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load graduation cohorts');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cohort: CohortItem | null = null) => {
    if (cohort) {
      setIsEditMode(true);
      setSelectedCohort(cohort);
      setFormData({
        title: cohort.title,
        cohort_date: cohort.cohort_date || '',
        press_statement: cohort.press_statement || '',
        future_text: cohort.future_text || '',
        awards: cohort.awards || [],
      });
    } else {
      setIsEditMode(false);
      setSelectedCohort(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCohort(null);
    setFormData(emptyForm);
  };

  const handleInsertContentImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingContentImage(true);
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/blog/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const marker = `\n\n![Image](${res.data.imageUrl})\n\n`;
      const textarea = contentTextareaRef.current;
      const cursor = textarea?.selectionStart ?? formData.press_statement.length;

      setFormData((prev) => ({
        ...prev,
        press_statement: prev.press_statement.slice(0, cursor) + marker + prev.press_statement.slice(cursor),
      }));

      requestAnimationFrame(() => {
        if (!textarea) return;
        const pos = cursor + marker.length;
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingContentImage(false);
      e.target.value = '';
    }
  };

  const addAwardRow = () => {
    setFormData((prev) => ({ ...prev, awards: [...prev.awards, { label: '', name: '', institution: '' }] }));
  };
  const updateAwardRow = (idx: number, field: keyof Award, value: string) => {
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards.map((a, i) => (i === idx ? { ...a, [field]: value } : a)),
    }));
  };
  const removeAwardRow = (idx: number) => {
    setFormData((prev) => ({ ...prev, awards: prev.awards.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (isEditMode && selectedCohort) {
        await api.put(`/graduation/${selectedCohort.id}`, formData);
        setSuccess('Cohort updated successfully!');
      } else {
        await api.post('/graduation', { ...formData, display_order: cohorts.length });
        setSuccess('Cohort created successfully!');
      }
      resetForm();
      fetchCohorts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cohort');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleActive = async (cohort: CohortItem) => {
    try {
      await api.put(`/graduation/${cohort.id}`, { is_active: !cohort.is_active });
      fetchCohorts();
    } catch {
      setError('Failed to update cohort');
    }
  };

  const handleMove = async (cohort: CohortItem, direction: 'up' | 'down') => {
    const sorted = [...cohorts].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === cohort.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    try {
      await Promise.all([
        api.put(`/graduation/${cohort.id}`, { display_order: other.display_order }),
        api.put(`/graduation/${other.id}`, { display_order: cohort.display_order }),
      ]);
      fetchCohorts();
    } catch {
      setError('Failed to reorder cohorts');
    }
  };

  const handleDelete = async (cohort: CohortItem) => {
    if (!window.confirm(`Delete "${cohort.title}" and all ${cohort.photos.length} of its photos? This cannot be undone.`)) return;
    try {
      await api.delete(`/graduation/${cohort.id}`);
      setSuccess('Cohort deleted');
      fetchCohorts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete cohort');
    }
  };

  // ── Photo management ────────────────────────────────────────────────
  const handleBulkUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !photosModalCohort) return;
    try {
      setUploadingPhotos(true);
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));
      await api.post(`/graduation/${photosModalCohort.id}/photos`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await api.get('/graduation/admin/all');
      const updatedList = res.data.data || [];
      setCohorts(updatedList);
      setPhotosModalCohort(updatedList.find((c: CohortItem) => c.id === photosModalCohort.id) || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!photosModalCohort) return;
    try {
      await api.delete(`/graduation/photos/${photoId}`);
      const res = await api.get('/graduation/admin/all');
      const updatedList = res.data.data || [];
      setCohorts(updatedList);
      setPhotosModalCohort(updatedList.find((c: CohortItem) => c.id === photosModalCohort.id) || null);
    } catch {
      setError('Failed to delete photo');
    }
  };

  const handleMovePhoto = async (photoId: number, direction: 'up' | 'down') => {
    if (!photosModalCohort) return;
    try {
      await api.put(`/graduation/photos/${photoId}/order`, { direction });
      const res = await api.get('/graduation/admin/all');
      const updatedList = res.data.data || [];
      setCohorts(updatedList);
      setPhotosModalCohort(updatedList.find((c: CohortItem) => c.id === photosModalCohort.id) || null);
    } catch {
      setError('Failed to reorder photo');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition text-gray-800 focus:border-[#FF9148] focus:ring-2 focus:ring-[#FF9148]/20";

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  const sortedCohorts = [...cohorts].sort((a, b) => a.display_order - b.display_order);
  const sortedPhotos = photosModalCohort ? [...photosModalCohort.photos].sort((a, b) => a.display_order - b.display_order) : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Graduation &amp; Events</h1>
            <p className="text-gray-500 mt-1">Manage cohorts and their photo galleries shown on the public Events page.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="text-white px-6 py-3 rounded-lg font-medium transition shadow-md whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            + Add Cohort
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

        {sortedCohorts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts yet</h3>
            <p className="text-gray-500 mb-4">Add your first graduation cohort.</p>
            <button
              onClick={() => openModal()}
              className="text-white px-6 py-2 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              + Add Cohort
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedCohorts.map((cohort, idx) => (
              <div key={cohort.id} className="bg-white rounded-lg p-5 shadow-md flex flex-col sm:flex-row gap-4 sm:items-center">
                {cohort.photos[0] ? (
                  <img src={cohort.photos[0].image_url} alt={cohort.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl bg-gray-100">🎓</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800">{cohort.title}</h3>
                    {!cohort.is_active && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{cohort.cohort_date}</p>
                  <p className="text-xs text-gray-400 mt-1">{cohort.photos.length} photo{cohort.photos.length === 1 ? '' : 's'}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0 items-center flex-wrap justify-end">
                  <div className="flex flex-col">
                    <button onClick={() => handleMove(cohort, 'up')} disabled={idx === 0} className="px-2 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move up">▲</button>
                    <button onClick={() => handleMove(cohort, 'down')} disabled={idx === sortedCohorts.length - 1} className="px-2 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move down">▼</button>
                  </div>
                  <button
                    onClick={() => setPhotosModalCohort(cohort)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition border"
                    style={{ borderColor: '#FF9148', color: '#FF9148' }}
                  >
                    Photos ({cohort.photos.length})
                  </button>
                  <button
                    onClick={() => handleToggleActive(cohort)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition border"
                    style={cohort.is_active ? { borderColor: '#d1d5db', color: '#6b7280' } : { borderColor: '#FF9148', color: '#FF9148' }}
                  >
                    {cohort.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => openModal(cohort)} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition">Edit</button>
                  <button onClick={() => handleDelete(cohort)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Cohort Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={resetForm}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                  <div className="rounded-xl p-4 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                    <Dialog.Title as="h3" className="text-lg font-bold">
                      {isEditMode ? 'Edit Cohort' : 'Add Cohort'}
                    </Dialog.Title>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Cohort Six Graduation Ceremony"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="text"
                        value={formData.cohort_date}
                        onChange={(e) => setFormData({ ...formData, cohort_date: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. June 2026 or a specific date"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Press Statement</label>
                        <button
                          type="button"
                          onClick={() => contentImageInputRef.current?.click()}
                          disabled={uploadingContentImage}
                          className="text-xs font-semibold px-2 py-1 rounded border transition disabled:opacity-50"
                          style={{ borderColor: '#FF9148', color: '#FF9148' }}
                        >
                          {uploadingContentImage ? 'Uploading…' : '+ Insert Image'}
                        </button>
                        <input
                          ref={contentImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleInsertContentImage}
                          className="hidden"
                        />
                      </div>
                      <textarea
                        ref={contentTextareaRef}
                        value={formData.press_statement}
                        onChange={(e) => setFormData({ ...formData, press_statement: e.target.value })}
                        rows={8}
                        className={`${inputClass} resize-y`}
                        placeholder="Write the cohort's story here. Separate paragraphs with a blank line."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Looking Ahead / Closing Statement</label>
                      <textarea
                        value={formData.future_text}
                        onChange={(e) => setFormData({ ...formData, future_text: e.target.value })}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Shown in a highlighted box at the end of the page"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Awards</label>
                        <button
                          type="button"
                          onClick={addAwardRow}
                          className="text-xs font-semibold px-2 py-1 rounded border transition"
                          style={{ borderColor: '#FF9148', color: '#FF9148' }}
                        >
                          + Add Award
                        </button>
                      </div>
                      {formData.awards.length === 0 ? (
                        <p className="text-xs text-gray-400">No awards for this cohort.</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.awards.map((award, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                              <input
                                type="text"
                                value={award.label}
                                onChange={(e) => updateAwardRow(idx, 'label', e.target.value)}
                                placeholder="Award label"
                                className={inputClass}
                              />
                              <input
                                type="text"
                                value={award.name}
                                onChange={(e) => updateAwardRow(idx, 'name', e.target.value)}
                                placeholder="Recipient name"
                                className={inputClass}
                              />
                              <input
                                type="text"
                                value={award.institution}
                                onChange={(e) => updateAwardRow(idx, 'institution', e.target.value)}
                                placeholder="Institution"
                                className={inputClass}
                              />
                              <button
                                type="button"
                                onClick={() => removeAwardRow(idx)}
                                className="text-red-500 hover:text-red-700 text-sm font-semibold px-2"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={resetForm}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitLoading}
                        className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                        {submitLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Cohort'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Photos Modal */}
      <Transition appear show={!!photosModalCohort} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setPhotosModalCohort(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-bold text-gray-800">
                      Photos — {photosModalCohort?.title}
                    </Dialog.Title>
                    <button onClick={() => setPhotosModalCohort(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                  </div>

                  <label className="block mb-4">
                    <span className="text-sm font-medium text-gray-700 mb-1 block">Add photos (select multiple)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBulkUploadPhotos}
                      disabled={uploadingPhotos}
                      className={inputClass}
                    />
                    {uploadingPhotos && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                  </label>

                  <div className="max-h-[50vh] overflow-y-auto">
                    {sortedPhotos.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">No photos yet — add some above.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sortedPhotos.map((photo, idx) => (
                          <div key={photo.id} className="relative group border rounded-lg overflow-hidden">
                            <img src={photo.image_url} alt="" className="w-full h-28 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(photo.id, 'up')}
                                  disabled={idx === 0}
                                  className="bg-white/90 rounded px-2 py-0.5 text-xs disabled:opacity-40"
                                >◀</button>
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(photo.id, 'down')}
                                  disabled={idx === sortedPhotos.length - 1}
                                  className="bg-white/90 rounded px-2 py-0.5 text-xs disabled:opacity-40"
                                >▶</button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="bg-red-500 text-white rounded px-2 py-0.5 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default GraduationManagement;

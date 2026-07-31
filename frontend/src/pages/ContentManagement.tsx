// src/pages/ContentManagement.tsx
import { useState, useEffect } from 'react';
import api from '../services/api';

interface ContentItem {
  id: number;
  key: string;
  title: string;
  content_type: 'text' | 'textarea' | 'image' | 'video' | 'json';
  value: string;
  section: string;
  description: string;
  page?: string;
  created_at: string;
  updated_at: string;
}

function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content_type: 'textarea' as ContentItem['content_type'],
    value: '',
    section: 'hero',
    page: 'home',
    description: ''
  });

  const sections = ['hero', 'about', 'features', 'team', 'testimonials', 'faq', 'footer'];
  const pages = [
    { key: 'home',    label: 'Home' },
    { key: 'about',   label: 'About' },
    { key: 'team',    label: 'Team' },
    { key: 'contact', label: 'Contact' },
    { key: 'global',  label: 'Global / Footer' },
  ];

  useEffect(() => {
    // Load all content once on mount. UI filters locally by page/section.
    fetchContents();
  }, []);

  // Keep the form's page in sync with the selected page when not editing
  useEffect(() => {
    if (!editingId) {
      setFormData((f) => ({ ...f, page: selectedPage }));
    }
  }, [selectedPage, editingId]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content');
      setContents(response.data.items || []);
      setError('');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('key', formData.key);
      formDataObj.append('title', formData.title);
      formDataObj.append('section', formData.section);
      formDataObj.append('page', formData.page);
      formDataObj.append('description', formData.description);

      const response = await api.post('/content/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ ...formData, value: response.data.imageUrl });
      setSuccess('Image uploaded successfully!');
      resetForm();
      fetchContents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      key: item.key,
      title: item.title,
      content_type: item.content_type,
      value: item.value,
      section: item.section,
      page: item.page || 'home',
      description: item.description
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/content/${editingId}`, {
          title: formData.title,
          value: formData.value,
          description: formData.description,
          page: formData.page
        });
        setSuccess('Content updated successfully!');
      } else {
        await api.post('/content', formData);
        setSuccess('Content created successfully!');
      }
      
      resetForm();
      fetchContents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save content');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this content item?')) return;

    try {
      await api.delete(`/content/${id}`);
      setSuccess('Content deleted successfully!');
      fetchContents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to delete content');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      key: '',
      title: '',
      content_type: 'textarea',
      value: '',
      section: 'hero',
      page: selectedPage || 'home',
      description: ''
    });
  };

  const filteredContents = contents.filter((item) => item.page === selectedPage);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{
      backgroundImage: 'url("/img/corporate\ image\ 3.jpeg")',
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-300">Update website content without touching code</p>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-4 bg-red-500 text-white rounded">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-500 text-white rounded">{success}</div>}

        {/* Page Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          {pages.map(p => (
            <button
              key={p.key}
              onClick={() => { setSelectedPage(p.key); resetForm(); }}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow ${
                selectedPage === p.key
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={selectedPage === p.key ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add New Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key (unique identifier)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., hero_title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Admin display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="image">Image</option>
                  <option value="video">Video (Vimeo/YouTube URL)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                <select
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {pages.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              {formData.content_type === 'image' ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border rounded"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                  {formData.value && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Preview:</p>
                      <img src={formData.value} alt="Preview" className="max-h-48 rounded" />
                    </div>
                  )}
                </div>
              ) : formData.content_type === 'video' ? (
                <div>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="https://vimeo.com/123456789 or https://youtube.com/embed/..."
                  />
                  <p className="text-xs text-gray-500 mt-2">Paste Vimeo or YouTube embed URL</p>
                  {formData.value && formData.value.includes('vimeo') && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Preview:</p>
                      <iframe
                        src={formData.value}
                        width="100%"
                        height="200"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="rounded"
                      />
                    </div>
                  )}
                  {formData.value && formData.value.includes('youtube') && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Preview:</p>
                      <iframe
                        width="100%"
                        height="200"
                        src={formData.value}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                      />
                    </div>
                  )}
                </div>
              ) : formData.content_type === 'textarea' ? (
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border rounded h-32"
                />
              ) : (
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (for admin)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Help text for admin users"
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                disabled={uploadingImage}
              >
                Create
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content Items */}
        <div className="grid gap-4">
          {filteredContents.length === 0 ? (
            <div className="bg-white p-6 rounded text-center text-gray-500">
              No content fields for this page yet. Run the seed script on the server or add one manually.
            </div>
          ) : (
            filteredContents.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">Key: {item.key}</p>
                    <p className="text-xs text-gray-500">Page: {item.page || 'N/A'}</p>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Show editing form or value */}
                {editingId === item.id ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Edit Content</label>
                    {item.content_type === 'textarea' ? (
                      <textarea
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 border rounded h-40"
                      />
                    ) : item.content_type === 'video' ? (
                      <div>
                        <input
                          type="text"
                          value={formData.value}
                          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="https://vimeo.com/123456789"
                        />
                        <p className="text-xs text-gray-500 mt-2">Paste Vimeo or YouTube embed URL</p>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    )}
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Page</label>
                    <select
                      value={formData.page}
                      onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {pages.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                    </select>
                    {item.content_type === 'image' && formData.value && (
                      <img src={formData.value} alt="Preview" className="mt-3 max-h-48 rounded" />
                    )}
                    {item.content_type === 'video' && formData.value && (
                      <div className="mt-3">
                        {formData.value.includes('vimeo') && (
                          <iframe
                            src={formData.value}
                            width="100%"
                            height="200"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            className="rounded"
                          />
                        )}
                        {formData.value.includes('youtube') && (
                          <iframe
                            width="100%"
                            height="200"
                            src={formData.value}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                          />
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-3 rounded">
                    {item.content_type === 'image' ? (
                      <img src={item.value} alt={item.title} className="max-h-48 rounded" />
                    ) : item.content_type === 'video' ? (
                      <div>
                        {item.value.includes('vimeo') && (
                          <iframe
                            src={item.value}
                            width="100%"
                            height="250"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            className="rounded"
                          />
                        )}
                        {item.value.includes('youtube') && (
                          <iframe
                            width="100%"
                            height="250"
                            src={item.value}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                          />
                        )}
                        {!item.value.includes('vimeo') && !item.value.includes('youtube') && (
                          <p className="text-gray-600 text-sm">URL: {item.value}</p>
                        )}
                      </div>
                    ) : item.content_type === 'json' ? (
                      <pre className="text-xs overflow-auto">{item.value}</pre>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{item.value}</p>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  Updated: {new Date(item.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;

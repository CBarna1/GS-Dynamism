// src/pages/BlogManagement.tsx
import { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../services/api';

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string;
}

const slugify = (text: string) =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: 'Guiding Stars Team',
  status: 'draft' as 'draft' | 'published',
};

function BlogManagement() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blog/admin/all');
      setPosts(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (post: BlogPostItem | null = null) => {
    if (post) {
      setIsEditMode(true);
      setSelectedPost(post);
      setSlugTouched(true);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image: post.cover_image || '',
        author: post.author || 'Guiding Stars Team',
        status: post.status,
      });
    } else {
      setIsEditMode(false);
      setSelectedPost(null);
      setSlugTouched(false);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedPost(null);
    setSlugTouched(false);
    setFormData(emptyForm);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/blog/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, cover_image: res.data.imageUrl }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, cover_image: '' }));
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
      const cursor = textarea?.selectionStart ?? formData.content.length;

      setFormData((prev) => ({
        ...prev,
        content: prev.content.slice(0, cursor) + marker + prev.content.slice(cursor),
      }));

      // Restore focus + move the cursor to just after the inserted marker
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (isEditMode && selectedPost) {
        await api.put(`/blog/${selectedPost.id}`, formData);
        setSuccess('Post updated successfully!');
      } else {
        await api.post('/blog', formData);
        setSuccess('Post created successfully!');
      }
      resetForm();
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostItem) => {
    try {
      const nextStatus = post.status === 'published' ? 'draft' : 'published';
      await api.put(`/blog/${post.id}`, { status: nextStatus });
      setSuccess(nextStatus === 'published' ? 'Post published!' : 'Post moved back to draft.');
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update post status');
    }
  };

  const handleDelete = async (post: BlogPostItem) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/blog/${post.id}`);
      setSuccess('Post deleted');
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete post');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition text-gray-800 focus:border-[#FF9148] focus:ring-2 focus:ring-[#FF9148]/20";

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog &amp; Newsletter</h1>
            <p className="text-gray-500 mt-1">Write posts here — published ones appear on the public Blog page.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="text-white px-6 py-3 rounded-lg font-medium transition shadow-md whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            + New Post
          </button>
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

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Create your first blog post or newsletter entry.</p>
            <button
              onClick={() => openModal()}
              className="text-white px-6 py-2 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              + New Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg p-5 shadow-md flex flex-col sm:flex-row gap-4 sm:items-center">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-full sm:w-32 h-32 sm:h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl bg-gray-100">📰</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{post.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        post.status === 'published' ? '' : 'bg-gray-100 text-gray-600'
                      }`}
                      style={post.status === 'published' ? { background: 'rgba(255,145,72,0.15)', color: '#E8722E' } : {}}
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">/blog/{post.slug}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {post.status === 'published' && post.published_at
                      ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                      : `Last updated ${new Date(post.updated_at).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition border"
                    style={
                      post.status === 'published'
                        ? { borderColor: '#d1d5db', color: '#6b7280' }
                        : { borderColor: '#FF9148', color: '#FF9148' }
                    }
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => openModal(post)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
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

      {/* Create/Edit Modal */}
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
                      {isEditMode ? 'Edit Post' : 'New Post'}
                    </Dialog.Title>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Cohort Five Graduates 66 New Leaders"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 whitespace-nowrap">/blog/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => { setSlugTouched(true); setFormData({ ...formData, slug: e.target.value }); }}
                          className={inputClass}
                          placeholder="auto-generated-from-title"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Short summary shown on the blog listing page"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Content *</label>
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
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={10}
                        className={`${inputClass} resize-y`}
                        placeholder="Write the full post here..."
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Use "+ Insert Image" to drop a picture into the post at your cursor position.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={inputClass}
                        disabled={uploadingImage}
                      />
                      {uploadingImage && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                      {formData.cover_image && (
                        <div className="mt-3 flex items-start gap-3">
                          <img src={formData.cover_image} alt="Cover preview" className="max-h-40 rounded-lg" />
                          <button
                            type="button"
                            onClick={handleRemoveCoverImage}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className={inputClass}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={resetForm}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitLoading || uploadingImage}
                        className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}>
                        {submitLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Post'}
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

export default BlogManagement;

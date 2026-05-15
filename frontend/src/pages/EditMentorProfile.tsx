import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Mentor {
  phone: string;
  bio: string;
  expertise_areas: string;
  professional_background: string;
  availability: string;
  preferences: string | null;
}

export default function EditMentorProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Mentor>({
    phone: '',
    bio: '',
    expertise_areas: '',
    professional_background: '',
    availability: '',
    preferences: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('mentor_token');
      if (!token) {
        navigate('/mentor/login');
        return;
      }

      const response = await axios.get('/api/mentor-portal/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        phone: response.data.data.mentor.phone || '',
        bio: response.data.data.mentor.bio || '',
        expertise_areas: response.data.data.mentor.expertise_areas || '',
        professional_background: response.data.data.mentor.professional_background || '',
        availability: response.data.data.mentor.availability || '',
        preferences: response.data.data.mentor.preferences || '',
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        navigate('/mentor/login');
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('mentor_token');
      if (!token) {
        navigate('/mentor/login');
        return;
      }

      const response = await axios.put('/api/mentor-portal/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/mentor/portal');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/mentor/portal')}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portal
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your mentor profile information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Availability */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Weekends 2-5 PM, Weekday evenings"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Expertise Areas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
            <textarea
              name="expertise_areas"
              value={formData.expertise_areas}
              onChange={handleChange}
              placeholder="e.g., Career development, Leadership, Technical skills..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Professional Background */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Background</label>
            <textarea
              name="professional_background"
              value={formData.professional_background}
              onChange={handleChange}
              placeholder="Share your professional experience and achievements..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
            <textarea
              name="preferences"
              value={formData.preferences || ''}
              onChange={handleChange}
              placeholder="Any preferences for mentee matching or communication..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mentor/portal')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

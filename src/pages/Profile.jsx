import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProfile, updateProfile } from '../api/profile';
import { uploadImage } from '../services/uploadService';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile data state
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    profileImageUrl: ''
  });

  // Local/UI states
  const [initials, setInitials] = useState('?');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const data = await getProfile();
      setRole(data.role || '');
      setEmail(data.email || '');
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        profileImageUrl: data.profileImageUrl || ''
      });
      updateInitials(data.name || '');
    } catch (err) {
      let msg = 'Failed to load user profile.';
      if (err.response) {
        msg = err.response.data?.message || msg;
      }
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const updateInitials = (fullName) => {
    if (!fullName) {
      setInitials('?');
      return;
    }
    const parts = fullName.trim().split(/\s+/);
    const text = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    setInitials(text || '?');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name') {
        updateInitials(value);
      }
      return updated;
    });
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validations
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setStatus({ type: 'error', message: 'Only JPG, PNG and WEBP images are allowed' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size cannot exceed 5MB' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await uploadImage(file);
      if (res && res.url) {
        setForm(prev => ({ ...prev, profileImageUrl: res.url }));
        setStatus({ type: 'success', message: 'Profile picture uploaded successfully' });
      } else {
        throw new Error('Upload did not return a valid URL');
      }
    } catch (err) {
      let msg = 'Failed to upload photo to Cloudinary.';
      if (err.response) {
        msg = err.response.data?.message || msg;
      }
      setStatus({ type: 'error', message: msg });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name || form.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    if (form.phone && form.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
      if (!phoneRegex.test(form.phone)) {
        errors.phone = 'Invalid phone format (7-20 digits and symbols allowed)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const updatedProfile = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        profileImageUrl: form.profileImageUrl
      });

      // Update cached user metadata in localStorage
      const cachedUserStr = localStorage.getItem('user');
      if (cachedUserStr) {
        const cachedUser = JSON.parse(cachedUserStr);
        cachedUser.name = updatedProfile.name;
        cachedUser.profileImageUrl = updatedProfile.profileImageUrl;
        localStorage.setItem('user', JSON.stringify(cachedUser));
      }

      // Synchronize headers/navbars immediately
      window.dispatchEvent(new Event('profile-updated'));
      setStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      let msg = 'Failed to update profile details.';
      if (err.response) {
        msg = err.response.data?.message || msg;
      }
      setStatus({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const dashboardPath = role === 'WORKER' ? '/worker-dashboard' : '/dashboard';

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-content">
        <div className="profile-card">
          <header className="profile-header">
            <h1 className="profile-title">Profile Settings</h1>
            <p className="profile-subtitle">Update and manage your personal account settings</p>
          </header>

          {status.message && (
            <div className={`profile-alert ${status.type}`}>
              {status.type === 'success' ? '✓' : '⚠️'} {status.message}
            </div>
          )}

          <div className="profile-picture-section">
            <div 
              className="profile-avatar-wrapper"
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
              title="Click to change photo"
            >
              {form.profileImageUrl ? (
                <img src={form.profileImageUrl} alt="Avatar" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-fallback">{initials}</div>
              )}
              {uploading && (
                <div className="profile-avatar-loading">
                  <div className="profile-avatar-spinner" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
              style={{ display: 'none' }}
            />
            
            <button 
              type="button" 
              className="btn-change-photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {form.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                className="form-input"
                value={form.name}
                onChange={handleInputChange}
                required
                disabled={saving || uploading}
              />
              {validationErrors.name && (
                <span className="profile-form-error">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                className="form-input"
                value={email}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                name="phone"
                type="text"
                className="form-input"
                value={form.phone}
                onChange={handleInputChange}
                disabled={saving || uploading}
              />
              {validationErrors.phone && (
                <span className="profile-form-error">{validationErrors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-address">Address</label>
              <input
                id="profile-address"
                name="address"
                type="text"
                className="form-input"
                value={form.address}
                onChange={handleInputChange}
                disabled={saving || uploading}
              />
            </div>

            <div className="profile-actions">
              <button 
                type="button" 
                className="btn-profile-back" 
                onClick={() => navigate(dashboardPath)}
              >
                Back to Dashboard
              </button>
              
              <button 
                type="submit" 
                className="btn-profile-save"
                disabled={saving || uploading}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

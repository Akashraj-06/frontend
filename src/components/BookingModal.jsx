import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createServiceRequest } from '../api/booking';
import { getProfile } from '../api/profile';
import '../styles/BookingModal.css';
import ImageUploader from './ImageUploader';

export default function BookingModal({ isOpen, onClose, worker, location }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    description: '',
    address: '',
  });
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Cache-first: read address from localStorage to avoid an API round-trip.
    // The cache is written by Login.jsx on sign-in and by Profile.jsx on save,
    // so it is always up-to-date for users who have logged in after this patch.
    try {
      const cachedUserStr = localStorage.getItem('user');
      if (cachedUserStr) {
        const cachedUser = JSON.parse(cachedUserStr);
        if (cachedUser.address) {
          setForm(prev => ({ ...prev, address: cachedUser.address }));
          return; // cache hit — no API call needed
        }
      }
    } catch {
      // Corrupt localStorage value — fall through to API
    }

    // API fallback: covers users whose localStorage predates the address cache.
    const fetchProfileAddress = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile.address) {
          setForm(prev => ({ ...prev, address: profile.address }));
        }
      } catch (err) {
        console.warn('Failed to load profile address default value:', err);
      }
    };
    fetchProfileAddress();
  }, [isOpen]);

  if (!isOpen || !worker) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Log the uploaded image URL from component state
    console.log('photoUrl:', photoUrl);

    try {
      const payload = {
        workerId: Number(worker.workerId),
        description: form.description,
        address: form.address,
        latitude: Number(location.lat),
        longitude: Number(location.lng),
        photoUrl: photoUrl || null
      };

      await createServiceRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/bookings');
      }, 1500);
    } catch (err) {
      let msg = 'Failed to create booking.';
      if (err.response) {
        msg = err.response.data?.message || err.response.data || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Book Service</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>

        <div className="modal-body">
          {success && (
            <div className="modal-success">
              Booking created successfully! Redirecting...
            </div>
          )}
          {error && (
            <div className="modal-error">
              {error}
            </div>
          )}

          <div className="modal-worker-info">
            <p><strong>Worker:</strong> {worker.name}</p>
            <p><strong>Category:</strong> {worker.categoryName}</p>
            <p><strong>Distance:</strong> {worker.distance} km</p>
          </div>

          <form id="booking-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label className="modal-label" htmlFor="booking-description">Description</label>
              <textarea
                id="booking-description"
                className="modal-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue..."
                disabled={loading || success}
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label" htmlFor="booking-address">Service Address</label>
              <input
                id="booking-address"
                className="modal-input"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Flat no, Street name, Area"
                disabled={loading || success}
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Upload Image</label>
              <ImageUploader onUploadSuccess={setPhotoUrl} />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="modal-btn modal-btn-cancel" 
            onClick={onClose}
            disabled={loading || success}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="booking-form"
            className="modal-btn modal-btn-submit"
            disabled={loading || success}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyBookings } from '../api/booking';
import { submitRating } from '../api/rating';
import '../styles/Bookings.css';
import ImageLightbox from '../components/ImageLightbox';

function BookingImage({ src }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="booking-image-container">
      <span className="booking-image-label">Request Image</span>
      <div 
        className="booking-image-card" 
        onClick={() => setIsLightboxOpen(true)}
        title="Click to view full image"
      >
        {loading && !error && (
          <div className="booking-image-fallback loading">
            <span className="booking-image-fallback__spinner" />
            <span>Loading image...</span>
          </div>
        )}
        {error && (
          <div className="booking-image-fallback error">
            <span>⚠️ Failed to load image</span>
          </div>
        )}
        <img
          src={src}
          alt="Service Request"
          className="booking-image"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          style={{ display: (loading || error) ? 'none' : 'block' }}
        />
      </div>

      <ImageLightbox
        src={src}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
}

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      let msg = 'Failed to load bookings.';
      if (err.response) {
        msg = err.response.data?.message
          || (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
      } else if (err.request) {
        msg = 'Unable to connect to the server.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const openRatingModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedRating(0);
    setHoverRating(0);
    setModalError('');
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBooking(null);
    setSelectedRating(0);
    setHoverRating(0);
    setModalError('');
  };

  const handleSubmitRating = async () => {
    if (selectedRating < 1 || selectedRating > 5) {
      setModalError('Please select a rating between 1 and 5 stars.');
      return;
    }
    setSubmitting(true);
    setModalError('');
    try {
      await submitRating(selectedBooking.id, selectedRating);
      // Instant UI update — no page reload
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, alreadyRated: true, userRating: selectedRating }
            : b
        )
      );
      closeRatingModal();
    } catch (err) {
      let msg = 'Unable to submit rating. Please try again.';
      if (err.response) {
        msg = err.response.data?.message
          || (typeof err.response.data === 'string' ? err.response.data : null)
          || msg;
      }
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarDisplay = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star-display ${i <= count ? 'filled' : 'empty'}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="bookings-content">
        <header className="bookings-header">
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">View and track your service requests</p>
        </header>

        {loading && (
          <div className="bookings-loading">
            <div className="bookings-spinner" />
            <p>Loading your bookings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bookings-error">
            <h2 className="bookings-error-title">Oops!</h2>
            <p className="bookings-error-msg">{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings-empty">
            <span className="bookings-empty-icon" aria-hidden="true">📋</span>
            <h2 className="bookings-empty-title">No Bookings Yet</h2>
            <p className="bookings-empty-msg">
              You haven't made any service requests yet. Find nearby workers to get started.
            </p>
            <Link to="/nearby-workers" className="btn-primary">Find Workers</Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.categoryName || 'Service Request'}</h3>
                    <span className="booking-date">Requested on {formatDate(booking.createdAt)}</span>
                  </div>
                  <div className={`booking-status ${booking.status?.toLowerCase() || 'pending'}`}>
                    {booking.status || 'PENDING'}
                  </div>
                </div>

                <div className="booking-details">
                  {booking.description && (
                    <div className="booking-detail-group">
                      <span className="booking-detail-label">Description</span>
                      <span className="booking-detail-value">{booking.description}</span>
                    </div>
                  )}
                  {booking.address && (
                    <div className="booking-detail-group">
                      <span className="booking-detail-label">Address</span>
                      <span className="booking-detail-value">{booking.address}</span>
                    </div>
                  )}
                  {booking.workerName && (
                    <div className="booking-detail-group">
                      <span className="booking-detail-label">Worker</span>
                      <span className="booking-detail-value">{booking.workerName}</span>
                    </div>
                  )}
                  <div className="booking-detail-group">
                    <span className="booking-detail-label">Request ID</span>
                    <span className="booking-detail-value">#{booking.id}</span>
                  </div>
                </div>

                {booking.photoUrl && <BookingImage src={booking.photoUrl} />}

                {/* Rating section */}
                {booking.status === 'COMPLETED' && !booking.alreadyRated && (
                  <div className="booking-rating-action">
                    <button className="btn-rate-worker" onClick={() => openRatingModal(booking)}>
                      ⭐ Rate Worker
                    </button>
                  </div>
                )}
                {booking.status === 'COMPLETED' && booking.alreadyRated && (
                  <div className="booking-rating-result">
                    <div className="rating-stars-display">
                      {renderStarDisplay(booking.userRating || 0)}
                    </div>
                    <span className="rating-result-text">You rated this worker</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedBooking && (
        <div className="rating-modal-overlay" onClick={closeRatingModal}>
          <div className="rating-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rating-modal-header">
              <h2 className="rating-modal-title">Rate Your Worker</h2>
              <p className="rating-modal-subtitle">
                How was your experience with <strong>{selectedBooking.workerName || 'the worker'}</strong>?
              </p>
            </div>

            <div className="rating-stars-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`rating-star-btn ${star <= (hoverRating || selectedRating) ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>

            {selectedRating > 0 && (
              <p className="rating-label-text">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][selectedRating]} — {selectedRating}/5
              </p>
            )}

            {modalError && (
              <div className="rating-modal-error">{modalError}</div>
            )}

            <div className="rating-modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={closeRatingModal}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-modal-submit"
                onClick={handleSubmitRating}
                disabled={submitting || selectedRating === 0}
              >
                {submitting ? 'Submitting…' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

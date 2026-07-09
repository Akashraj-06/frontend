import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';
import { getNearbyWorkers } from '../api/worker';
import '../styles/NearbyWorkers.css';

const categoryDisplayName = {
  'Electrical': 'Electricians',
  'Plumbing': 'Plumbers',
  'Painting': 'Painters',
  'Carpentry': 'Carpenters',
  'Appliance Repair': 'Appliance Repair Workers',
  'Home Maintenance': 'Home Maintenance Workers'
};

export default function NearbyWorkers() {
  const navigate = useNavigate();
  const location = useLocation();

  // Location inputs (Default to Chennai fallback coords)
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [radius, setRadius] = useState('10.0');

  // Component states
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [geolocationStatus, setGeolocationStatus] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || location.state?.category || '';
    setCategoryFilter(cat);
  }, [location]);

  const fetchWorkers = async (searchLat, searchLng, searchRadius) => {
    setLoading(true);
    setError('');
    try {
      const latitude = parseFloat(searchLat);
      const longitude = parseFloat(searchLng);
      const radiusVal = parseFloat(searchRadius) || 10.0;

      if (isNaN(latitude) || isNaN(longitude)) {
        setError('Please enter valid numeric values for Latitude and Longitude.');
        setLoading(false);
        return;
      }

      const data = await getNearbyWorkers(latitude, longitude, radiusVal);
      setWorkers(data);
    } catch (err) {
      let msg = 'Unable to connect to server.';
      if (err.response) {
        const responseData = err.response.data;
        msg = typeof responseData === 'string' ? responseData : responseData.message || responseData.error || msg;
        if (msg.toLowerCase().includes('internal server error')) {
          msg = 'Unable to connect to server.';
        }
      } else if (err.request) {
        msg = 'Unable to connect to server.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Get user's device location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationStatus('Geolocation is not supported by your browser.');
      fetchWorkers(lat, lng, radius);
      return;
    }

    setGeolocationStatus('Locating…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLat = position.coords.latitude.toFixed(6);
        const detectedLng = position.coords.longitude.toFixed(6);
        setLat(detectedLat);
        setLng(detectedLng);
        setGeolocationStatus('Location detected.');
        fetchWorkers(detectedLat, detectedLng, radius);
      },
      (err) => {
        let errorMsg = 'Please enable location permission.';
        if (err.code === 1) {
          errorMsg = 'Please enable location permission.';
        } else if (err.code === 2) {
          errorMsg = 'Location position unavailable. Using default coordinates.';
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out. Using default coordinates.';
        }
        setGeolocationStatus(errorMsg);
        fetchWorkers(lat, lng, radius);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    detectLocation();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWorkers(lat, lng, radius);
  };

  const handleClearFilter = () => {
    setCategoryFilter('');
    navigate('/nearby-workers', { replace: true, state: {} });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredWorkers = categoryFilter
    ? workers.filter(w => w.categoryName?.toLowerCase() === categoryFilter.toLowerCase())
    : workers;

  const getFilterText = (cat) => {
    return categoryDisplayName[cat] || `${cat} Workers`;
  };

  return (
    <div className="workers-page">
      <Navbar />

      <div className="workers-content">
        {/* Page Header */}
        <header className="workers-header">
          <h1 className="workers-title">Find Nearby Service Workers</h1>
          <p className="workers-subtitle">Instantly connect with verified service professionals in your area</p>
        </header>

        {/* Control Panel / Search Form */}
        <div className="workers-controls">
          <span className="workers-controls-title">Location Search Settings</span>
          <form className="workers-form" onSubmit={handleSubmit}>
            {/* Latitude input */}
            <div className="workers-input-group">
              <label className="workers-label" htmlFor="workers-lat">Latitude</label>
              <input
                id="workers-lat"
                className="workers-input"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 13.0827"
                disabled={loading}
              />
            </div>

            {/* Longitude input */}
            <div className="workers-input-group">
              <label className="workers-label" htmlFor="workers-lng">Longitude</label>
              <input
                id="workers-lng"
                className="workers-input"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="e.g. 80.2707"
                disabled={loading}
              />
            </div>

            {/* Radius input */}
            <div className="workers-input-group">
              <label className="workers-label" htmlFor="workers-radius">Search Radius (km)</label>
              <input
                id="workers-radius"
                className="workers-input"
                type="number"
                step="0.1"
                min="0.1"
                max="100.0"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="e.g. 10"
                disabled={loading}
              />
            </div>

            {/* Action buttons */}
            <div className="workers-btn-group">
              <button className="workers-btn workers-btn--primary" type="submit" disabled={loading}>
                Find Workers
              </button>
              <button
                className="workers-btn workers-btn--secondary"
                type="button"
                onClick={detectLocation}
                disabled={loading}
              >
                Use My Location
              </button>
            </div>
          </form>

          {geolocationStatus && (
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: geolocationStatus.includes('permission') ? '#b91c1c' : 'var(--color-text-secondary)', 
              marginTop: 'var(--spacing-3)',
              fontWeight: geolocationStatus.includes('permission') ? '600' : 'normal'
            }}>
              ℹ️ {geolocationStatus}
            </p>
          )}
        </div>

        {categoryFilter && !loading && (
          <div className="workers-filter-banner">
            <span className="workers-filter-text">Showing: {getFilterText(categoryFilter)}</span>
            <button className="workers-filter-clear-btn" onClick={handleClearFilter}>
              Clear Filter &times;
            </button>
          </div>
        )}

        {/* Worker Cards Grid */}
        <div className="workers-grid">
          {loading && (
            <>
              {[1, 2, 3, 4].map((n) => (
                <div className="worker-card skeleton" key={n}>
                  <div className="worker-header">
                    <div className="worker-avatar skeleton-shimmer" />
                    <div className="worker-meta">
                      <div className="skeleton-line skeleton-title skeleton-shimmer" />
                      <div className="skeleton-line skeleton-sub skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="worker-details">
                    <div className="skeleton-line skeleton-detail skeleton-shimmer" />
                    <div className="skeleton-line skeleton-detail skeleton-shimmer" />
                    <div className="skeleton-line skeleton-detail skeleton-shimmer" />
                  </div>
                  <div className="skeleton-button skeleton-shimmer" />
                </div>
              ))}
            </>
          )}

          {!loading && error && (
            <div className="workers-error">
              <h2 className="workers-error-title">Unable to Search</h2>
              <p className="workers-error-msg">{error}</p>
            </div>
          )}

          {!loading && !error && workers.length === 0 && (
            <div className="workers-empty">
              <span className="workers-empty-icon" aria-hidden="true">🕵️‍♂️</span>
              <h2 className="workers-empty-title">No nearby workers found.</h2>
              <p className="workers-empty-msg">
                We couldn&apos;t find any available service workers within the {radius} km radius of your location. Try expanding your search radius.
              </p>
            </div>
          )}

          {!loading && !error && workers.length > 0 && filteredWorkers.length === 0 && (
            <div className="workers-empty">
              <span className="workers-empty-icon" aria-hidden="true">🕵️‍♂️</span>
              <h2 className="workers-empty-title">No nearby workers found.</h2>
              <p className="workers-empty-msg">
                We couldn&apos;t find any available service workers for category &quot;{categoryFilter}&quot; within the {radius} km radius.
              </p>
              <button className="workers-btn workers-btn--primary" onClick={handleClearFilter} style={{ marginTop: '16px' }}>
                Clear Filter
              </button>
            </div>
          )}

          {!loading && !error && filteredWorkers.length > 0 && filteredWorkers.map((worker) => (
            <div className="worker-card" key={worker.workerId}>
              {/* Header */}
              <div className="worker-header">
                {worker.profileImageUrl ? (
                  <img
                    className="worker-avatar worker-avatar--photo"
                    src={worker.profileImageUrl}
                    alt={`${worker.name} profile`}
                  />
                ) : (
                  <div className="worker-avatar">{getInitials(worker.name)}</div>
                )}
                <div className="worker-meta">
                  <h3>{worker.name}</h3>
                  <span className="worker-category">{worker.categoryName}</span>
                </div>
              </div>

              {/* Details table */}
              <div className="worker-details">
                <div className="worker-detail-item">
                  <span className="worker-detail-label">Rating</span>
                  <span className="worker-detail-value">
                    <span className="worker-rating-star">★</span> {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                  </span>
                </div>
                <div className="worker-detail-item">
                  <span className="worker-detail-label">Jobs Done</span>
                  <span className="worker-detail-value">{worker.totalJobs}</span>
                </div>
                <div className="worker-detail-item">
                  <span className="worker-detail-label">Distance</span>
                  <span className="worker-detail-value">{worker.distance} km</span>
                </div>
              </div>

              {/* Action */}
              <button
                className="worker-book-btn"
                onClick={() => {
                  setSelectedWorker(worker);
                  setIsModalOpen(true);
                }}
                id={`book-worker-${worker.workerId}`}
              >
                Book Service
              </button>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorker(null);
        }}
        worker={selectedWorker}
        location={{ lat, lng }}
      />
    </div>
  );
}

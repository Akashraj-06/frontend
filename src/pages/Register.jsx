import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register } from '../api/auth';
import '../styles/Login.css';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialRole = () => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    return roleParam === 'worker' ? 'WORKER' : 'CUSTOMER';
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: getInitialRole(),
    categoryId: '',
    latitude: '',
    longitude: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const isWorker = form.role === 'WORKER';

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';

    if (isWorker) {
      if (!form.categoryId) newErrors.categoryId = 'Category ID is required';
      if (!form.latitude) newErrors.latitude = 'Latitude is required';
      if (!form.longitude) newErrors.longitude = 'Longitude is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
    if (success) setSuccess('');
  };

  const selectRole = (role) => {
    setForm((prev) => ({ ...prev, role }));
    // Clear worker-specific errors when switching to CUSTOMER
    if (role === 'CUSTOMER') {
      setErrors((prev) => {
        const { categoryId, latitude, longitude, ...rest } = prev;
        return rest;
      });
    }
    if (apiError) setApiError('');
    if (success) setSuccess('');
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
        // Clear any existing lat/lng validation errors
        setErrors((prev) => {
          const { latitude, longitude, ...rest } = prev;
          return rest;
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError('Unable to retrieve your location. Please allow location access or enter coordinates manually.');
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiError('Please fill all required fields.');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      };

      if (isWorker) {
        payload.categoryId = Number(form.categoryId);
        payload.latitude = Number(form.latitude);
        payload.longitude = Number(form.longitude);
      }

      await register(payload);

      setSuccess('Account created successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        const message =
          typeof data === 'string'
            ? data
            : data.message || data.error || 'Registration failed';
        setApiError(message);
      } else if (err.request) {
        setApiError('Unable to reach the server. Please check your connection and try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        {/* Header */}
        <div className="login-header">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="login-logo-text">Fixly</span>
          </Link>
          <h1 className="login-title">Create your account</h1>
          <p className="login-subtitle">Join Fixly as a customer or service worker</p>
        </div>

        {/* Success */}
        {success && (
          <div className="register-success" role="status">
            <svg className="register-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="register-success-text">{success}</span>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="login-error" role="alert">
            <svg className="login-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="login-error-text">{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="login-field">
            <label className="login-label" htmlFor="register-name">Name</label>
            <div className="login-input-wrapper">
              <input
                id="register-name"
                className={`login-input${errors.name ? ' login-input--error' : ''}`}
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
            </div>
            {errors.name && <span className="login-field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="register-email">Email</label>
            <div className="login-input-wrapper">
              <input
                id="register-email"
                className={`login-input${errors.email ? ' login-input--error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>
            {errors.email && <span className="login-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="register-password">Password</label>
            <div className="login-input-wrapper">
              <input
                id="register-password"
                className={`login-input${errors.password ? ' login-input--error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="login-field-error">{errors.password}</span>}
          </div>

          {/* Phone */}
          <div className="login-field">
            <label className="login-label" htmlFor="register-phone">Phone</label>
            <div className="login-input-wrapper">
              <input
                id="register-phone"
                className={`login-input${errors.phone ? ' login-input--error' : ''}`}
                type="tel"
                name="phone"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                disabled={loading}
              />
            </div>
            {errors.phone && <span className="login-field-error">{errors.phone}</span>}
          </div>

          {/* Role selector */}
          <div className="login-field">
            <label className="login-label">Role</label>
            <div className="register-role-selector">
              <button
                type="button"
                className={`register-role-btn${form.role === 'CUSTOMER' ? ' register-role-btn--active' : ''}`}
                onClick={() => selectRole('CUSTOMER')}
                disabled={loading}
                id="register-role-customer"
              >
                Customer
              </button>
              <button
                type="button"
                className={`register-role-btn${form.role === 'WORKER' ? ' register-role-btn--active' : ''}`}
                onClick={() => selectRole('WORKER')}
                disabled={loading}
                id="register-role-worker"
              >
                Worker
              </button>
            </div>
          </div>

          {/* Worker-specific fields */}
          {isWorker && (
            <div className="register-worker-fields">
              <span className="register-worker-fields-title">Worker Details</span>

              {/* Category ID */}
              <div className="login-field">
                <label className="login-label" htmlFor="register-category">Category ID</label>
                <div className="login-input-wrapper">
                  <input
                    id="register-category"
                    className={`login-input${errors.categoryId ? ' login-input--error' : ''}`}
                    type="number"
                    name="categoryId"
                    placeholder="e.g. 1"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.categoryId && <span className="login-field-error">{errors.categoryId}</span>}
              </div>

              {/* Use My Location */}
              <button
                type="button"
                className="register-geo-btn"
                onClick={handleUseMyLocation}
                disabled={geoLoading || loading}
              >
                {geoLoading ? (
                  <>
                    <span className="login-spinner register-geo-spinner" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <svg className="register-geo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Use My Location
                  </>
                )}
              </button>
              {geoError && <span className="register-geo-error">{geoError}</span>}

              {/* Latitude & Longitude */}
              <div className="register-worker-row">
                <div className="login-field">
                  <label className="login-label" htmlFor="register-latitude">Latitude</label>
                  <div className="login-input-wrapper">
                    <input
                      id="register-latitude"
                      className={`login-input${errors.latitude ? ' login-input--error' : ''}`}
                      type="number"
                      step="any"
                      name="latitude"
                      placeholder="e.g. 13.0827"
                      value={form.latitude}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.latitude && <span className="login-field-error">{errors.latitude}</span>}
                </div>
                <div className="login-field">
                  <label className="login-label" htmlFor="register-longitude">Longitude</label>
                  <div className="login-input-wrapper">
                    <input
                      id="register-longitude"
                      className={`login-input${errors.longitude ? ' login-input--error' : ''}`}
                      type="number"
                      step="any"
                      name="longitude"
                      placeholder="e.g. 80.2707"
                      value={form.longitude}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.longitude && <span className="login-field-error">{errors.longitude}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading && <span className="login-spinner" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

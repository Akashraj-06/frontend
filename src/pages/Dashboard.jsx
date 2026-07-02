import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'WORKER') {
        navigate('/worker-dashboard');
        return;
      }
      setUser(parsedUser);
    } catch {
      // Corrupted data — force re-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null; // brief flash guard while checking auth

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          {/* Greeting */}
          <div className="dashboard-greeting">
            <div className="dashboard-avatar">{initials}</div>
            <div className="dashboard-greeting-text">
              <h1>Welcome, {user.name}</h1>
              <p>Here&apos;s your account overview</p>
            </div>
          </div>

          {/* Details */}
          <div className="dashboard-details">
            {/* Email */}
            <div className="dashboard-detail">
              <div className="dashboard-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="dashboard-detail-info">
                <span className="dashboard-detail-label">Email</span>
                <span className="dashboard-detail-value">{user.email}</span>
              </div>
            </div>

            {/* Role */}
            <div className="dashboard-detail">
              <div className="dashboard-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="dashboard-detail-info">
                <span className="dashboard-detail-label">Role</span>
                <span className="dashboard-detail-value">
                  <span className="dashboard-role-badge">{user.role}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="dashboard-actions">
            <button
              className="dashboard-btn-primary"
              onClick={() => navigate('/bookings')}
              id="dashboard-bookings-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              My Bookings
            </button>

            {/* Logout */}
            <button
              className="dashboard-logout"
              onClick={handleLogout}
              id="dashboard-logout-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

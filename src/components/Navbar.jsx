import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const services = [
  { icon: '⚡', label: 'Electrical', sub: 'Wiring, fuses, installations' },
  { icon: '🔧', label: 'Plumbing', sub: 'Leaks, pipes, drainage' },
  { icon: '🎨', label: 'Painting', sub: 'Interior & exterior' },
  { icon: '🪵', label: 'Carpentry', sub: 'Furniture, doors, fixtures' },
  { icon: '🏠', label: 'Appliance Repair', sub: 'AC, fridge, washing machine' },
  { icon: '🔨', label: 'Home Maintenance', sub: 'General fixes & upkeep' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [userRole, setUserRole] = useState(null);

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserRole(JSON.parse(storedUser).role);
        } catch {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    checkAuth();

    // Listen for storage events (cross-tab sync)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMobile = () => setMobileOpen(prev => !prev);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleNavClick = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      scrollTo(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Fixly home">
            <div className="navbar__logo-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="navbar__logo-text">Fixly</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links" role="list">
            <li>
              <div className="navbar__link navbar__link--dropdown" role="button" aria-haspopup="true" aria-expanded="false" tabIndex={0}>
                Services
                <svg className="navbar__link-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <div className="navbar__dropdown" role="menu">
                  {services.map(s => (
                    <div key={s.label} className="navbar__dropdown-item" role="menuitem" tabIndex={0}>
                      <div className="navbar__dropdown-icon" style={{ background: '#f5f5f5', fontSize: '18px' }}>{s.icon}</div>
                      <div>
                        <div className="navbar__dropdown-label">{s.label}</div>
                        <div className="navbar__dropdown-sub">{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <Link to="/register?role=worker" className="navbar__link" id="nav-become-worker">Become a Worker</Link>
            </li>
            <li>
              <button className="navbar__link" onClick={() => handleNavClick('howitworks')} id="nav-how-it-works">How It Works</button>
            </li>
            <li>
              <button className="navbar__link" onClick={() => handleNavClick('about')} id="nav-about">About Us</button>
            </li>
            <li>
              <button className="navbar__link" onClick={() => handleNavClick('contact')} id="nav-contact">Contact</button>
            </li>
          </ul>

          {/* Actions — conditional on auth */}
          <div className="navbar__actions">
            {isLoggedIn ? (
              <>
                <Link 
                  to={userRole === 'WORKER' ? "/worker-dashboard" : "/dashboard"} 
                  className="navbar__btn-login" 
                  id="nav-dashboard"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="navbar__btn-cta" id="nav-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__btn-login" id="nav-login">Log in</Link>
                <Link to="/register" className="navbar__btn-cta" id="nav-get-started">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger${mobileOpen ? ' active' : ''}`}
            onClick={toggleMobile}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            id="nav-hamburger"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="navbar__mobile-link">Services</div>
        <Link to="/register?role=worker" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>Become a Worker</Link>
        <button className="navbar__mobile-link" onClick={() => handleNavClick('howitworks')}>How It Works</button>
        <button className="navbar__mobile-link" onClick={() => handleNavClick('about')}>About Us</button>
        <button className="navbar__mobile-link" onClick={() => handleNavClick('contact')}>Contact</button>
        <div style={{ borderTop: '1px solid var(--color-mid-gray)', margin: '8px 0' }} />
        {isLoggedIn ? (
          <>
            <Link 
              to={userRole === 'WORKER' ? "/worker-dashboard" : "/dashboard"} 
              className="navbar__mobile-link" 
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <button className="navbar__mobile-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link to="/register" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </>
        )}
      </div>
    </>
  );
}

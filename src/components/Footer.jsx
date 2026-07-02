import { useState } from 'react';
import '../styles/Footer.css';

const companyLinks = ['About Us', 'Careers', 'Press', 'Blog'];
const supportLinks = ['Help Center', 'Safety', 'Terms & Conditions', 'Privacy Policy'];
const serviceLinks = ['Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Appliance Repair', 'Home Maintenance'];

const socialLinks = [
  { id: 'social-facebook', label: 'Facebook', icon: 'f' },
  { id: 'social-instagram', label: 'Instagram', icon: '◎' },
  { id: 'social-twitter', label: 'Twitter / X', icon: '✕' },
  { id: 'social-linkedin', label: 'LinkedIn', icon: 'in' },
];

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer className="footer" id="contact" role="contentinfo" aria-label="Fixly footer">
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo" aria-label="Fixly logo">
              <div className="footer__logo-icon">
                <LogoIcon />
              </div>
              <span className="footer__logo-text">Fixly</span>
            </div>
            <p className="footer__tagline">
              A smarter way to connect people with trusted local service professionals instantly.
            </p>
            <nav className="footer__social" aria-label="Social media links">
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href="#"
                  className="footer__social-btn"
                  id={link.id}
                  aria-label={link.label}
                  title={link.label}
                >
                  <span aria-hidden="true" style={{ fontWeight: 700, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '-0.05em' }}>
                    {link.icon}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h3 className="footer__col-title">Company</h3>
            <nav className="footer__links" aria-label="Company links">
              {companyLinks.map(label => (
                <a key={label} href="#" className="footer__link" id={`footer-company-${label.toLowerCase().replace(/\s/g, '-')}`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="footer__col">
            <h3 className="footer__col-title">Support</h3>
            <nav className="footer__links" aria-label="Support links">
              {supportLinks.map(label => (
                <a key={label} href="#" className="footer__link" id={`footer-support-${label.toLowerCase().replace(/[\s&]/g, '-')}`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h3 className="footer__col-title">Services</h3>
            <nav className="footer__links" aria-label="Service links">
              {serviceLinks.map(label => (
                <a key={label} href="#services" className="footer__link" id={`footer-service-${label.toLowerCase().replace(/\s/g, '-')}`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="footer__col">
            <h3 className="footer__col-title">Newsletter</h3>
            <p className="footer__newsletter-desc">
              Subscribe to get updates and exclusive offers.
            </p>
            <form
              className="footer__newsletter-form"
              onSubmit={handleNewsletterSubmit}
              aria-label="Newsletter subscription form"
              noValidate
            >
              <input
                type="email"
                className="footer__newsletter-input"
                placeholder={submitted ? '✓ Subscribed!' : 'Enter your email'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
                id="footer-email-input"
                disabled={submitted}
              />
              <button
                type="submit"
                className="footer__newsletter-btn"
                aria-label="Subscribe to newsletter"
                id="footer-newsletter-submit"
                disabled={submitted}
              >
                {submitted ? '✓' : '→'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2024 Fixly. All rights reserved.
          </p>
          <p className="footer__made">
            Made with <em className="footer__heart" aria-label="love">❤️</em> for a better experience
          </p>
        </div>
      </div>
    </footer>
  );
}

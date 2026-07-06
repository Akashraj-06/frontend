import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Force autoplay on mount
    video.play().catch(() => {
      // Autoplay was prevented — wait for user interaction
      const playOnInteraction = () => {
        video.play().catch(() => {});
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction, { once: true });
      document.addEventListener('touchstart', playOnInteraction, { once: true });
    });
  }, []);

  return (
    <section className="hero" id="hero" aria-label="Hero section">
      <div className="hero__inner container">
        {/* LEFT — Text Content */}
        <div className="hero__content">
          {/* Trust Badge */}
          <div className="hero__badge" role="status" aria-label="Trust badge">
            <span className="hero__badge-icon" aria-hidden="true">⚡</span>
            <span className="hero__badge-text">Trusted local workers near you</span>
          </div>

          {/* Headline */}
          <h1 className="hero__headline">
            Nearby Electricians<br />
            &amp; Plumbers in<br />
            Minutes
          </h1>

          {/* Description */}
          <p className="hero__description">
            Upload your issue, add photos, and instantly connect with verified nearby workers ready to solve your problem.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta-group">
            <Link to="/nearby-workers" className="hero__btn-primary" id="hero-request-service" aria-label="Request a service">
              Request Service
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/register?role=worker" className="hero__btn-secondary" id="hero-become-worker" aria-label="Become a worker">
              Become a Worker
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero__trust" role="list" aria-label="Trust indicators">
            <div className="hero__trust-item" role="listitem">
              <div className="hero__trust-icon" aria-hidden="true">🛡️</div>
              <div className="hero__trust-info">
                <span className="hero__trust-label">Verified</span>
                <span className="hero__trust-sub">Background checked</span>
              </div>
            </div>
            <div className="hero__trust-item" role="listitem">
              <div className="hero__trust-icon" aria-hidden="true">⏱️</div>
              <div className="hero__trust-info">
                <span className="hero__trust-label">Fast Response</span>
                <span className="hero__trust-sub">Usually in 2–5 mins</span>
              </div>
            </div>
            <div className="hero__trust-item" role="listitem">
              <div className="hero__trust-icon" aria-hidden="true">🔒</div>
              <div className="hero__trust-info">
                <span className="hero__trust-label">Secure</span>
                <span className="hero__trust-sub">Pay after service</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Video Panel */}
        <div className="hero__visual" aria-hidden="true">
          {/* Floating Location Pins */}
          <div className="hero__pin hero__pin--1">
            <div className="hero__pin-inner">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
          <div className="hero__pin hero__pin--2">
            <div className="hero__pin-inner">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>

          {/* Video Wrapper */}
          <div className="hero__video-wrapper">
            <video
              ref={videoRef}
              className="hero__video"
              src="/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Fixly hero animation showing service workers in action"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              {/* Fallback */}
              <img src="/fallback-hero.jpg" alt="Fixly service workers in a modern city" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

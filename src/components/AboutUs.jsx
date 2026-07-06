import '../styles/AboutUs.css';

export default function AboutUs() {
  return (
    <section className="about-us" id="about" aria-label="About Fixly">
      <div className="container">
        <div className="about-us__inner">
          <div className="about-us__content">
            <p className="section-tag">ABOUT US</p>
            <h2 className="about-us__title">Your Trusted Partner for Home Repairs</h2>
            <p className="about-us__desc">
              Fixly is a leading on-demand services platform designed to bridge the gap between skilled, verified local service professionals and homeowners in need of urgent fixes.
            </p>
            <div className="about-us__features">
              <div className="about-us__feature">
                <span className="about-us__feature-icon">🛡️</span>
                <div>
                  <h4>100% Verified Workers</h4>
                  <p>Every professional undergoes rigorous background checks and credential verification.</p>
                </div>
              </div>
              <div className="about-us__feature">
                <span className="about-us__feature-icon">⚡</span>
                <div>
                  <h4>On-Demand Booking</h4>
                  <p>Connect with a technician in minutes and get live booking status tracking.</p>
                </div>
              </div>
              <div className="about-us__feature">
                <span className="about-us__feature-icon">💎</span>
                <div>
                  <h4>Guaranteed Quality</h4>
                  <p>High-quality repairs with transparent pricing and payment after completion.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-us__visual">
            <div className="about-us__card">
              <h3>Our Mission</h3>
              <p>To empower local service providers with earning opportunities while providing homeowners with the most reliable, seamless, and transparent home maintenance experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

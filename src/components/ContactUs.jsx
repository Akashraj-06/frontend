import { useState } from 'react';
import '../styles/ContactUs.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="contact-us" id="contact" aria-label="Contact Fixly">
      <div className="container">
        <div className="contact-us__inner">
          <div className="contact-us__info">
            <p className="section-tag">GET IN TOUCH</p>
            <h2 className="contact-us__title">Have questions? We are here to help.</h2>
            <p className="contact-us__desc">
              Reach out to our support team or visit us at our offices. We are available 24/7 for urgent service support.
            </p>
            <div className="contact-us__details">
              <div className="contact-us__detail-item">
                <span className="contact-us__detail-icon">📍</span>
                <div>
                  <h4>Our Office</h4>
                  <p>123 Fixly Way, Chennai, TN 600001</p>
                </div>
              </div>
              <div className="contact-us__detail-item">
                <span className="contact-us__detail-icon">📞</span>
                <div>
                  <h4>Phone Support</h4>
                  <p>+91 44 2345 6789 (Toll-Free)</p>
                </div>
              </div>
              <div className="contact-us__detail-item">
                <span className="contact-us__detail-icon">✉️</span>
                <div>
                  <h4>Email Us</h4>
                  <p>support@fixly.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-us__form-wrapper">
            <form className="contact-us__form" onSubmit={handleSubmit}>
              <h3 className="contact-us__form-title">Send a Message</h3>
              {submitted && (
                <div className="contact-us__success" role="status">
                  Thanks for your message! We will get back to you shortly.
                </div>
              )}
              <div className="contact-us__field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={submitted}
                />
              </div>
              <div className="contact-us__field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={submitted}
                />
              </div>
              <div className="contact-us__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows="4"
                  placeholder="Describe your query..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={submitted}
                />
              </div>
              <button type="submit" className="contact-us__submit" disabled={submitted}>
                {submitted ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

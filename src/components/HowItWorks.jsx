import '../styles/HowItWorks.css';

const steps = [
  {
    id: 1,
    numColor: '#f59e0b',
    icon: '📋',
    title: 'Post Your Complaint',
    desc: 'Upload photos, describe the issue and add location in seconds.',
  },
  {
    id: 2,
    numColor: '#3b82f6',
    icon: '🔔',
    title: 'Nearby Workers Get It',
    desc: 'Verified professionals near you receive your request instantly.',
  },
  {
    id: 3,
    numColor: '#10b981',
    icon: '✅',
    title: 'Worker Accepts & Helps',
    desc: 'A worker accepts, reaches you quickly and gets the job done.',
  },
];

export default function HowItWorks() {
  return (
    <section className="howitworks" id="howitworks" aria-label="How Fixly works">
      <div className="container">
        <div className="howitworks__inner">
          {/* Left */}
          <div className="howitworks__left">
            <p className="howitworks__left-tag">HOW IT WORKS</p>
            <h2 className="howitworks__left-title">
              Simple, Fast &amp;<br />Reliable
            </h2>
            <p className="howitworks__left-desc">
              We make it easy to get things fixed. Post your issue and get a verified worker at your door in minutes.
            </p>
          </div>

          {/* Right — Steps */}
          <div className="howitworks__steps" role="list" aria-label="Steps to use Fixly">
            {steps.map(step => (
              <div key={step.id} className="howitworks__step" role="listitem" tabIndex={0} aria-label={`Step ${step.id}: ${step.title}`}>
                <div
                  className="howitworks__step-num"
                  aria-hidden="true"
                  style={{ background: step.numColor }}
                >
                  {step.id}
                </div>
                <div className="howitworks__step-icon" aria-hidden="true">
                  {step.icon}
                </div>
                <div className="howitworks__step-body">
                  <h3 className="howitworks__step-title">{step.title}</h3>
                  <p className="howitworks__step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

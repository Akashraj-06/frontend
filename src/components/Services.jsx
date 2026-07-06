import { useNavigate } from 'react-router-dom';
import '../styles/Services.css';

const services = [
  {
    id: 'electrical',
    variant: 'electrical',
    icon: '⚡',
    name: 'Electrical',
    desc: 'Wiring issues, switchboard repairs, installations, lighting fixes and more.',
  },
  {
    id: 'plumbing',
    variant: 'plumbing',
    icon: '🔧',
    name: 'Plumbing',
    desc: 'Leak repairs, pipe fitting, drainage cleaning, bathroom fittings and more.',
  },
  {
    id: 'painting',
    variant: 'painting',
    icon: '🎨',
    name: 'Painting',
    desc: 'Interior & exterior painting, wall repairs, waterproofing and touch-ups.',
  },
  {
    id: 'carpentry',
    variant: 'carpentry',
    icon: '🪵',
    name: 'Carpentry',
    desc: 'Furniture repair, door installation, modular work and more.',
  },
  {
    id: 'appliance',
    variant: 'appliance',
    icon: '🏠',
    name: 'Appliance Repair',
    desc: 'AC servicing, refrigerator repair, washing machine fixes and more.',
  },
  {
    id: 'maintenance',
    variant: 'maintenance',
    icon: '🔨',
    name: 'Home Maintenance',
    desc: 'General upkeep, cleaning, pest control, deep cleaning services.',
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Services() {
  const navigate = useNavigate();

  const handleExplore = (categoryName) => {
    navigate(`/nearby-workers?category=${encodeURIComponent(categoryName)}`, {
      state: { category: categoryName }
    });
  };

  return (
    <section className="services" id="services" aria-label="Services section">
      <div className="container">
        {/* Header */}
        <header className="services__header">
          <p className="section-tag">WHAT WE OFFER</p>
          <h2 className="services__title">Services You Can Request</h2>
          <p className="services__subtitle">
            From minor repairs to major fixes, find the right professional for every home service need.
          </p>
        </header>

        {/* Grid */}
        <div className="services__grid" role="list" aria-label="Available services">
          {services.map(service => (
            <article
              key={service.id}
              className={`services__card services__card--${service.variant}`}
              role="listitem"
              tabIndex={0}
              aria-label={`${service.name} service`}
            >
              <div className="services__card-icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="services__card-name">{service.name}</h3>
              <p className="services__card-desc">{service.desc}</p>
              <button
                className="services__card-link"
                id={`service-explore-${service.id}`}
                aria-label={`Explore ${service.name} service`}
                onClick={() => handleExplore(service.name)}
              >
                Explore Service
                <ArrowIcon />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

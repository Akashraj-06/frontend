import { useEffect, useRef, useState } from 'react';
import '../styles/Stats.css';

const stats = [
  {
    id: 'stat-customers',
    icon: '😊',
    value: 25000,
    display: '25K+',
    label: 'Happy Customers',
  },
  {
    id: 'stat-workers',
    icon: '👷',
    value: 10000,
    display: '10K+',
    label: 'Verified Workers',
  },
  {
    id: 'stat-response',
    icon: '⏱️',
    value: null,
    display: '2–5 mins',
    label: 'Average Response',
  },
  {
    id: 'stat-secure',
    icon: '🛡️',
    value: null,
    display: '100%',
    label: 'Secure & Safe',
  },
];

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function StatItem({ stat, index }) {
  const hasCountUp = stat.value !== null;
  const [count, countRef] = useCountUp(hasCountUp ? stat.value : 0);

  const displayValue = hasCountUp
    ? (count >= 1000 ? `${Math.round(count / 1000)}K+` : `${count}+`)
    : stat.display;

  return (
    <div
      className="stats__item"
      ref={hasCountUp ? countRef : undefined}
      id={stat.id}
      aria-label={`${stat.display} ${stat.label}`}
    >
      <div className="stats__icon-wrap" aria-hidden="true">{stat.icon}</div>
      <div className="stats__number" aria-live="polite">{displayValue}</div>
      <div className="stats__label">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats" id="stats" aria-label="Fixly statistics">
      <div className="container">
        <div className="stats__grid" role="list" aria-label="Platform statistics">
          {stats.map((stat, i) => (
            <StatItem key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

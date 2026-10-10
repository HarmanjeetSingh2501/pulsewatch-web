import Link from 'next/link';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BellRing,
  BrainCircuit,
  Check,
  Clock3,
  Globe2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    number: '01',
    title: 'Know the moment it changes',
    description:
      'Keep a constant pulse on every endpoint. Spot slowdowns and downtime before your customers do.',
  },
  {
    icon: BellRing,
    number: '02',
    title: 'Get the signal, not the noise',
    description:
      'Get a clear alert when something needs attention, with the context to know where to start.',
  },
  {
    icon: BrainCircuit,
    number: '03',
    title: 'Make sense of every incident',
    description:
      'AI-powered incident summaries turn a trail of checks into a story your whole team can act on.',
  },
];

const services = [
  { name: 'Website', url: 'pulsewatch.com', latency: '124 ms', bars: 'bars-one' },
  { name: 'API', url: 'api.pulsewatch.com', latency: '86 ms', bars: 'bars-two' },
  { name: 'Status page', url: 'status.pulsewatch.com', latency: '103 ms', bars: 'bars-three' },
];

export default function HomePage() {
  return (
    <main className="landing">
      <section className="hero-shell">
        <div className="hero container">
          <div className="hero-copy">
            <div className="announcement">
              <span className="announcement-dot" />
              <span>Uptime monitoring, minus the noise</span>
              <ArrowRight aria-hidden="true" size={14} />
            </div>

            <h1>
              Your services
              <br />
              have a <span>heartbeat.</span>
            </h1>
            <p className="hero-description">
              PulseWatch keeps an eye on your websites and APIs around the
              clock—so you can catch issues early and get back to building.
            </p>

            <div className="hero-actions">
              <Link className="button-primary" href="/dashboard">
                Go to your dashboard
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link className="button-secondary" href="/incidents">
                Explore incidents
              </Link>
            </div>

            <div className="hero-proof">
              <span className="proof-icon">
                <Check aria-hidden="true" size={14} />
              </span>
              Free to get started
              <span className="proof-divider" />
              No credit card needed
            </div>
          </div>

          <div className="preview-wrap" aria-label="PulseWatch monitoring dashboard preview">
            <div className="preview-glow" />
            <div className="preview-card">
              <div className="preview-topbar">
                <div className="preview-brand">
                  <span className="preview-mark">
                    <Activity aria-hidden="true" size={14} />
                  </span>
                  <span>pulsewatch</span>
                </div>
                <span className="preview-live">
                  <span className="status-dot" />
                  ALL SYSTEMS UP
                </span>
                <span className="preview-menu" aria-hidden="true">
                  •••
                </span>
              </div>

              <div className="preview-heading">
                <div>
                  <p className="preview-overline">YOUR MONITORING OVERVIEW</p>
                  <h2>Everything looks good.</h2>
                  <p className="preview-subtitle">Your services are healthy right now.</p>
                </div>
                <div className="uptime-stat">
                  <span className="uptime-number">99.98%</span>
                  <span className="uptime-caption">30-day uptime</span>
                </div>
              </div>

              <div className="heartbeat-panel">
                <div className="chart-label-row">
                  <span>Response time</span>
                  <span>
                    <span className="chart-key" /> Last 24 hours
                  </span>
                </div>
                <div className="heartbeat-chart">
                  <div className="chart-grid" />
                  <svg
                    aria-hidden="true"
                    className="heartbeat-svg"
                    viewBox="0 0 620 104"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="hero-pulse-line" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#a3e635" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                      <linearGradient id="hero-pulse-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity=".18" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      className="chart-area"
                      d="M0 72 C22 72 27 68 42 70 S63 75 78 69 S101 66 114 70 L133 70 L144 54 L153 83 L166 30 L178 73 L195 70 C217 68 226 72 244 68 S270 67 285 70 L306 70 L318 57 L328 77 L340 38 L350 70 L374 71 C396 73 404 66 421 69 S450 76 464 70 L482 70 L492 53 L502 80 L515 33 L528 71 L551 70 C574 69 586 71 620 68 L620 104 L0 104 Z"
                    />
                    <path
                      className="chart-line"
                      d="M0 72 C22 72 27 68 42 70 S63 75 78 69 S101 66 114 70 L133 70 L144 54 L153 83 L166 30 L178 73 L195 70 C217 68 226 72 244 68 S270 67 285 70 L306 70 L318 57 L328 77 L340 38 L350 70 L374 71 C396 73 404 66 421 69 S450 76 464 70 L482 70 L492 53 L502 80 L515 33 L528 71 L551 70 C574 69 586 71 620 68"
                    />
                    <circle className="chart-endpoint" cx="620" cy="68" r="4" />
                  </svg>
                </div>
                <div className="chart-axis">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>NOW</span>
                </div>
              </div>

              <div className="service-list">
                {services.map((service) => (
                  <div className="service-row" key={service.name}>
                    <span className="service-status">
                      <span className="status-dot" />
                    </span>
                    <span className="service-name">
                      <strong>{service.name}</strong>
                      <span>{service.url}</span>
                    </span>
                    <span className="service-bars" aria-label="Response time stable">
                      {Array.from({ length: 12 }, (_, index) => (
                        <i className={service.bars} key={index} />
                      ))}
                    </span>
                    <span className="service-latency">{service.latency}</span>
                    <span className="service-up">Operational</span>
                  </div>
                ))}
              </div>

              <div className="preview-footer">
                <span>
                  <Clock3 aria-hidden="true" size={13} /> Next check in 30 seconds
                </span>
                <span>
                  View all monitors <ArrowRight aria-hidden="true" size={13} />
                </span>
              </div>
            </div>

            <div className="floating-alert">
              <span className="alert-icon">
                <ShieldCheck aria-hidden="true" size={18} />
              </span>
              <span>
                <strong>All clear</strong>
                <small>Your uptime is looking healthy</small>
              </span>
              <span className="alert-check">
                <Check aria-hidden="true" size={13} />
              </span>
            </div>
          </div>
        </div>

        <a className="scroll-cue" href="#how-it-works">
          <span>See how it works</span>
          <ArrowDown aria-hidden="true" size={14} />
        </a>
      </section>

      <section className="trust-strip" aria-label="PulseWatch benefits">
        <div className="container trust-strip-inner">
          <div className="trust-item">
            <Globe2 aria-hidden="true" size={18} />
            <span>
              <strong>Always on</strong> monitoring
            </span>
          </div>
          <span className="trust-separator" />
          <div className="trust-item">
            <Zap aria-hidden="true" size={18} />
            <span>
              <strong>Fast</strong> incident alerts
            </span>
          </div>
          <span className="trust-separator" />
          <div className="trust-item">
            <BrainCircuit aria-hidden="true" size={18} />
            <span>
              <strong>AI-powered</strong> summaries
            </span>
          </div>
        </div>
      </section>

      <section className="features-section" id="how-it-works">
        <div className="container">
          <div className="features-intro">
            <span className="section-eyebrow">PEACE OF MIND, BUILT IN</span>
            <h2>
              Catch the little blips
              <br />
              <span>before they become big.</span>
            </h2>
            <p>
              The right signal at the right time makes all the difference.
              PulseWatch keeps monitoring simple, useful, and always on.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-card-top">
                    <span className="feature-icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span className="feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>

          <div className="closing-cta">
            <div>
              <span className="section-eyebrow">YOUR NEXT CHECK IS A CLICK AWAY</span>
              <h2>Keep your services in rhythm.</h2>
            </div>
            <Link className="button-primary" href="/dashboard">
              Get started for free
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
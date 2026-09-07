import { Link } from "react-router-dom";

const services = [
  ["AC Repair", "Cooling, servicing, installation", "❄"],
  ["Refrigerator", "Not cooling, leaks, noise", "▣"],
  ["Washing Machine", "Spin, drain, and vibration issues", "◌"],
  ["TV Repair", "Display, sound, and setup", "▱"],
  ["Water Purifier", "Filter and water-flow issues", "⌁"],
  ["Microwave", "Heating, power, and controls", "◫"],
  ["Geyser", "Heating and installation", "♨"],
  ["Cooler", "Cooling and pump service", "✦"],
];
const steps = [
  [
    "01",
    "Tell us what's broken",
    "Choose an appliance and describe the issue in a few simple steps.",
  ],
  [
    "02",
    "Find a nearby technician",
    "See local technicians who can receive and respond to your request.",
  ],
  [
    "03",
    "Confirm the repair",
    "Review the details, coordinate a time, and keep the conversation connected.",
  ],
  [
    "04",
    "Get it fixed",
    "Follow progress from request created to repair completed.",
  ],
];
function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M3 10h13m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Check() {
  return (
    <span className="landing-check" aria-hidden="true">
      ✓
    </span>
  );
}

function RepairRequestCard() {
  return (
    <div className="repair-visual" aria-label="Preview of a repair request">
      <div className="visual-glow" />
      <div className="floating-chip chip-found">
        <span>✓</span> Technician found
      </div>
      <div className="floating-chip chip-distance">
        2.4 km <small>away</small>
      </div>
      <div className="floating-chip chip-progress">
        <span className="pulse-dot" /> Repair in progress
      </div>
      <div className="repair-card">
        <div className="repair-card-top">
          <span className="eyebrow">REPAIR REQUEST</span>
          <span className="card-menu">•••</span>
        </div>
        <h2>AC not cooling</h2>
        <p className="repair-location">
          <span>⌖</span> LG Split AC · Lucknow, UP
        </p>
        <div className="card-divider" />
        <p className="eyebrow">TECHNICIAN MATCHED</p>
        <div className="technician-row">
          <div className="tech-avatar">RS</div>
          <div>
            <strong>Rahul Sharma</strong>
            <div className="rating">
              ★★★★★ <span>4.8</span>
            </div>
          </div>
          <span className="online-dot" />
        </div>
        <div className="repair-meta">
          <span>
            <b>2.4 km</b>
            <small>away</small>
          </span>
          <span>
            <b>From ₹499</b>
            <small>estimate</small>
          </span>
          <Link to="/technicians" aria-label="View technician">
            <Arrow />
          </Link>
        </div>
        <Link to="/technicians" className="visual-link">
          View technician <Arrow />
        </Link>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="dashboard-preview">
      <div className="dashboard-sidebar">
        <div className="mini-brand">
          L<span>R</span>
        </div>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="dashboard-main">
        <div className="dashboard-top">
          <span className="eyebrow">CUSTOMER DASHBOARD</span>
          <span className="mini-avatar">AK</span>
        </div>
        <h3>Good morning, Aman</h3>
        <p className="preview-muted">Keep your repair moving.</p>
        <div className="preview-stats">
          <div>
            <small>Active repair</small>
            <strong>01</strong>
          </div>
          <div>
            <small>Next update</small>
            <strong>Today</strong>
          </div>
        </div>
        <div className="job-preview">
          <div className="job-heading">
            <span className="service-icon">◌</span>
            <div>
              <strong>Washing Machine not spinning</strong>
              <small>Request #LR-2048</small>
            </div>
            <span className="status-pill">Assigned</span>
          </div>
          <div className="job-tech">
            <div className="tech-avatar small-avatar">AK</div>
            <div>
              <strong>Amit Kumar</strong>
              <small>★ 4.7 · 3.1 km away</small>
            </div>
          </div>
          <div className="timeline">
            <span className="done" />
            <span className="done" />
            <span />
            <span />
            <div>
              <b>Request created</b>
              <small>Technician assigned</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ technician = false }) {
  return (
    <div className={`experience-mock ${technician ? "tech-mock" : ""}`}>
      <div className="mock-header">
        <span className="eyebrow">{technician ? "NEW JOB" : "MY REPAIR"}</span>
        <span className="mock-more">•••</span>
      </div>
      <div className="mock-title-row">
        <div className="mock-icon">{technician ? "⌁" : "▣"}</div>
        <div>
          <h3>{technician ? "AC Repair" : "Refrigerator Repair"}</h3>
          <p>{technician ? "2.8 km away" : "Request #LR-1932"}</p>
        </div>
      </div>
      {technician ? (
        <>
          <div className="mock-detail">
            <span>Customer</span>
            <b>Aman · Lucknow</b>
          </div>
          <div className="mock-detail">
            <span>Estimated service</span>
            <b>₹500–₹800</b>
          </div>
          <button className="btn-primary mock-button">
            Accept job <Arrow />
          </button>
        </>
      ) : (
        <>
          <div className="mock-status">
            <span className="pulse-dot" />
            <div>
              <span>Status</span>
              <b>On the way</b>
            </div>
            <div>
              <span>ETA</span>
              <b>25 min</b>
            </div>
          </div>
          <div className="mock-actions">
            <button className="btn-secondary">Call technician</button>
            <Link to="/customer/repairs" className="btn-primary">
              Track request
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-hero section-container">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="badge-dot" /> LOCAL REPAIR, SIMPLIFIED
          </span>
          <h1>
            Your broken appliance deserves a <em>trusted fix.</em>
          </h1>
          <p>
            Find reliable local technicians, request a repair, track the job,
            and get your appliance working again — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/diagnosis" className="btn-primary">
              Find a technician <Arrow />
            </Link>
            <Link to="/register" className="btn-secondary">
              Become a technician
            </Link>
          </div>
          <div className="trust-line">
            <span>Local service</span>
            <i /> <span>Clear communication</span>
            <i /> <span>Nearby technicians</span>
          </div>
        </div>
        <RepairRequestCard />
      </section>
      <section className="metrics-strip">
        <div className="section-container">
          <p className="metrics-note">Illustrative product scope · connect to live stats when available</p>
          <div className="metrics-grid">
          <div>
            <strong>
              500<span>+</span>
            </strong>
            <small>Local technicians</small>
          </div>
          <div>
            <strong>
              20<span>+</span>
            </strong>
            <small>Repair categories</small>
          </div>
          <div>
            <strong>
              10<span>+</span>
            </strong>
            <small>Local areas</small>
          </div>
          <div>
            <strong>
              1k<span>+</span>
            </strong>
            <small>Repair requests</small>
          </div>
          </div>
        </div>
      </section>
      <section className="landing-section section-container problem-section">
        <div className="section-intro">
          <span className="section-kicker">THE OLD WAY</span>
          <h2>Repairing an appliance shouldn't be this complicated.</h2>
          <p>
            When something breaks, the search for help can feel harder than the
            repair itself.
          </p>
        </div>
        <div className="problem-grid">
          <article>
            <span className="problem-number">01</span>
            <h3>Finding someone trustworthy</h3>
            <p>
              Random listings make it difficult to know who to contact or what
              to expect.
            </p>
          </article>
          <article>
            <span className="problem-number">02</span>
            <h3>No clear communication</h3>
            <p>
              Customers often don't know when someone will arrive or what is
              happening next.
            </p>
          </article>
          <article>
            <span className="problem-number">03</span>
            <h3>Uncertain repair experience</h3>
            <p>
              The request, technician, and repair status live in different
              places.
            </p>
          </article>
        </div>
        <div className="solution-callout">
          <span className="solution-mark">↗</span>
          <div>
            <span className="section-kicker">THE LOCALREPAIR WAY</span>
            <h3>
              LocalRepair brings the entire repair journey into one simple
              workflow.
            </h3>
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        className="landing-section section-container how-section"
      >
        <div className="section-intro centered">
          <span className="section-kicker">HOW IT WORKS</span>
          <h2>From “what now?” to “all fixed.”</h2>
          <p>
            A clear path for every repair, with fewer unknowns along the way.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map(([number, title, description], index) => (
            <article className="step-card" key={number}>
              <div className="step-top">
                <span>{number}</span>
                {index < steps.length - 1 && <Arrow />}
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="services" className="landing-section services-section">
        <div className="section-container">
          <div className="section-intro centered">
            <span className="section-kicker">WHAT CAN WE FIX?</span>
            <h2>Help for the things you use every day.</h2>
            <p>Start with a category and tell us what your appliance needs.</p>
          </div>
          <div className="service-grid">
            {services.map(([name, description, icon]) => (
              <Link to="/diagnosis" className="service-card" key={name}>
                <span className="service-symbol">{icon}</span>
                <span>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-section section-container product-section">
        <div className="section-intro centered">
          <span className="section-kicker">A REAL WORKFLOW</span>
          <h2>Everything you need to manage a repair.</h2>
          <p>
            One view for the request, the technician, and what happens next.
          </p>
        </div>
        <DashboardPreview />
      </section>
      <section className="landing-section split-section section-container">
        <ExperienceCard />
        <div className="split-copy">
          <span className="section-kicker">FOR CUSTOMERS</span>
          <h2>One place for every repair.</h2>
          <p>
            Stay close to the details without chasing updates across calls and
            messages.
          </p>
          <ul>
            <li>
              <Check /> Create repair requests
            </li>
            <li>
              <Check /> View technician details
            </li>
            <li>
              <Check /> Track job status
            </li>
            <li>
              <Check /> Keep communication connected
            </li>
            <li>
              <Check /> Manage repair history
            </li>
          </ul>
          <Link to="/diagnosis" className="text-link">
            Start a repair <Arrow />
          </Link>
        </div>
      </section>
    <section id="for-technicians" className="landing-section split-section tech-section section-container">
        <div className="split-copy">
          <span className="section-kicker">FOR TECHNICIANS</span>
          <h2>More jobs. Less chasing.</h2>
          <p>
            See the work that fits your area, understand the request, and keep
            your day moving.
          </p>
          <ul>
            <li>
              <Check /> Receive nearby jobs
            </li>
            <li>
              <Check /> View customer requirements
            </li>
            <li>
              <Check /> Accept or reject requests
            </li>
            <li>
              <Check /> Manage active jobs
            </li>
            <li>
              <Check /> Build a useful profile
            </li>
          </ul>
          <Link to="/register" className="btn-primary">
            Join as a technician <Arrow />
          </Link>
        </div>
        <ExperienceCard technician />
      </section>
      <section className="landing-section trust-section">
        <div className="section-container">
          <div className="section-intro centered">
            <span className="section-kicker">BUILT AROUND TRUST</span>
            <h2>Simple tools that make the process clearer.</h2>
            <p>LocalRepair keeps useful information visible at every step.</p>
          </div>
          <div className="trust-grid">
            <article>
              <span className="trust-icon">◎</span>
              <h3>Clear profiles</h3>
              <p>
                See relevant technician information before you decide who to
                contact.
              </p>
            </article>
            <article>
              <span className="trust-icon">⌖</span>
              <h3>Local matching</h3>
              <p>
                Connect with technicians who operate in the areas they serve.
              </p>
            </article>
            <article>
              <span className="trust-icon">◷</span>
              <h3>Clear job status</h3>
              <p>
                Understand where your repair stands, from created to completed.
              </p>
            </article>
            <article>
              <span className="trust-icon">↔</span>
              <h3>Direct communication</h3>
              <p>
                Keep customer and technician communication connected to the
                repair.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="landing-section section-container testimonials">
        <div className="section-intro">
          <span className="section-kicker">IN THEIR WORDS</span>
          <h2>A simpler repair conversation.</h2>
          <p className="sample-label">
            Sample content — ready to be replaced with customer reviews from the
            backend.
          </p>
        </div>
        <div className="quote-grid">
          <blockquote>
            “I didn't have to search through random numbers. I could see the
            request and technician in one place.”
            <cite>Sample customer · Lucknow</cite>
          </blockquote>
          <blockquote>
            “The job details were clear before I responded, so I knew what the
            customer needed.”<cite>Sample technician · Lucknow</cite>
          </blockquote>
          <blockquote>
            “It was easier to understand what was happening next instead of
            waiting for an update.”<cite>Sample customer · Lucknow</cite>
          </blockquote>
        </div>
      </section>
      <section className="final-cta section-container">
        <div>
          <span className="section-kicker">READY WHEN YOU ARE</span>
          <h2>The next repair can be simpler.</h2>
          <p>
            Find a local technician or join LocalRepair and start helping people
            in your area.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/diagnosis" className="btn-primary">
            Find a technician <Arrow />
          </Link>
          <Link to="/register" className="btn-secondary">
            Join as technician
          </Link>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="section-container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-lockup">
              Local<span>Repair</span>
            </Link>
            <p>
              Making local appliance repair simpler, clearer, and closer to
              home.
            </p>
          </div>
          <div>
            <h3>Product</h3>
            <Link to="/diagnosis">Request repair</Link>
            <Link to="/technicians">Find technician</Link>
            <Link to="/customer/dashboard">Customer dashboard</Link>
            <Link to="/technician/dashboard">Technician dashboard</Link>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#how-it-works">How it works</a>
            <a href="#services">Services</a>
            <a href="mailto:hello@localrepair.example">Contact</a>
          </div>
          <div>
            <h3>Legal</h3>
            <span>Privacy policy</span>
            <span>Terms of service</span>
          </div>
        </div>
        <div className="section-container footer-bottom">
          <span>© 2026 LocalRepair. All rights reserved.</span>
          <span>Made for simpler repairs.</span>
        </div>
      </footer>
    </main>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const TrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

export default function Home() {
  const miniBars = [40, 65, 50, 85, 60, 95, 70, 80];
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="blob1" aria-hidden="true" />
      <div className="blob2" aria-hidden="true" />

      {/* NAV */}
      <nav className="care-nav">
        <Link to="/" className="logo">
          <div className="logo-ring"><LogoIcon /></div>
          <span className="logo-name">Care<em>Assist</em></span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        <div className="nav-r">
          <button className="btn-login" type="button" onClick={() => navigate("/roles")}>
            Log In
          </button>
          <button className="btn-start" type="button" onClick={() => navigate("/roles")}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main className="hero">

        {/* LEFT */}
        <div className="hero-l">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Trusted by 2,400+ Medical Practices
          </div>

          <h1>
            The Smartest Way<br />
            <span>to Manage <span className="hi-teal">Medical Billing</span></span><br />
            <span>&amp; <span className="hi-green">Claims</span></span>
          </h1>

          <p className="sub">
            Streamline healthcare billing, automate insurance claims, and enhance
            efficiency for patients, providers, and insurers — all in one secure platform.
          </p>

          <div className="cta-row">
            <button className="btn-main" type="button" onClick={() => navigate("/roles")}>
              Get Started <Arrow />
            </button>
          </div>

          <div className="stat-row">
            <div className="s"><span className="s-v"><b>98.6</b>%</span><span className="s-l">Claims Rate</span></div>
            <div className="s-div" />
            <div className="s"><span className="s-v"><b>2.4</b>K+</span><span className="s-l">Practices</span></div>
            <div className="s-div" />
            <div className="s"><span className="s-v">$<b>2.1</b>B</span><span className="s-l">Processed</span></div>
            <div className="s-div" />
            <div className="s"><span className="s-v"><b>4.9</b>★</span><span className="s-l">Rating</span></div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-r">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=900&q=90"
            alt="Doctor using CareAssist"
          />
          <div className="photo-fade" aria-hidden="true" />

          <div className="fc1">
            <div className="fc-label">Claims Acceptance</div>
            <div className="fc-stat">
              <div className="fc-circle">
                <div className="fc-inner">98%</div>
              </div>
              <div className="fc-info">
                <b>98.6%</b>
                <span>First-pass rate</span>
              </div>
            </div>
          </div>

          <div className="fc2">
            <div className="fc2-row">
              <span className="live-ring" />
              <span className="live-label">Live Claims Activity</span>
            </div>
            <div className="mini-bars">
              {miniBars.map((h, i) => (
                <div key={i} className="mb" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="fc3">
            <div className="fc3-icon"><TrendUp /></div>
            <div>
              <div className="fc3-val">$840K saved</div>
              <div className="fc3-lbl">Denial recovery · this month</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>
    </div>
  );
}
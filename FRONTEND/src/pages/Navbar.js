import React from "react";
import { Link } from "react-router-dom";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

// slim = true  →  auth pages (no right-side buttons)
// slim = false →  public pages (Home, About, Services) — shows Login + Get Started
export default function Navbar({ slim = false }) {
  return (
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

      {!slim && (
        <div className="nav-r">
          <Link to="/roles">
            <button className="btn-login" type="button">Log In</button>
          </Link>
          <Link to="/roles">
            <button className="btn-start" type="button">Get Started →</button>
          </Link>
        </div>
      )}

      {slim && <div className="nav-r" />}
    </nav>
  );
}
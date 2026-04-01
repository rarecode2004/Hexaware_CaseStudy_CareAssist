import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import ClaimsPage from "./ClaimsPage";
import Insurance from "./Insurance";
import Invoice from "./Invoice";
import "./Dashboard.css";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

const NAV_ITEMS = [
  { key: "profile",   label: "Profile",                  icon: "👤" },
  { key: "insurance", label: "Select Insurance",          icon: "🛡️" },
  { key: "invoice",   label: "View Invoice",      icon: "🧾" },
  { key: "claims",    label: "Submit and Track Claims",   icon: "📋" }
  
];

function PatientDashboard() {
  const [activePage, setActivePage] = useState("profile");
  const navigate = useNavigate();

  const renderPage = () => {
    switch (activePage) {
      case "profile":   return <Profile />;
      case "claims":    return <ClaimsPage />;
      case "insurance": return <Insurance />;
      case "invoice":   return <Invoice />;
      default:          return <Profile />;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">

      <nav className="care-nav">
        <Link to="/" className="logo">
          <div className="logo-ring"><LogoIcon /></div>
          <span className="logo-name">Care<em>Assist</em></span>
        </Link>
 <span className="nav-role-badge">Patient</span>
        <button className="logout-btn" type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dash-body">

        {/* SIDEBAR */}
        <aside className="sidebar">
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              className={`sidebar-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              <span className="s-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </aside>

        {/* CONTENT */}
        <main className="content">
          {renderPage()}
        </main>
      </div>

      
      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>

    </div>
  );
}

export default PatientDashboard;
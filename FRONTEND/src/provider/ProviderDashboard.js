import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProviderProfile from "./ProviderProfile";
import GenerateInvoice from "./GenerateInvoice";
import ProviderInvoices from "./ProviderInvoices";
import "./ProviderDashboard.css";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

const NAV_ITEMS = [
  { key: "profile",  label: "Profile",          icon: "🏥" },
  { key: "invoice",  label: "Generate Invoice",  icon: "📄" },
  { key: "history",  label: "Invoice History",   icon: "📋" },
];

export default function ProviderDashboard() {
  const [active, setActive] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const renderPage = () => {
    if (active === "profile")  return <ProviderProfile />;
    if (active === "invoice")  return <GenerateInvoice />;
    if (active === "history")  return <ProviderInvoices />;
  };

  return (
    <div className="dashboard">
      <nav className="care-nav">
        <Link to="/" className="logo">
          <div className="logo-ring"><LogoIcon /></div>
          <span className="logo-name">Care<em>Assist</em></span>
        </Link>
        <span className="nav-role-badge">Healthcare Provider</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dash-body">
        <aside className="sidebar">
          {NAV_ITEMS.map(item => (
            <div key={item.key}
              className={`sidebar-item ${active === item.key ? "active" : ""}`}
              onClick={() => setActive(item.key)}>
              <span className="s-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </aside>
        <main className="content">{renderPage()}</main>
      </div>

      
      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InsuranceProfile from "./InsuranceProfile";
import ViewClaims from "./ViewClaims";
import ProcessPayment from "./ProcessPayment";
import ClaimHistory from "./ClaimHistory";
import "./InsuranceDashboard.css";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

const NAV = [
  { key:"profile", label:"Company Profile",  icon:"🏢" },
  { key:"claims",  label:"View Claims",       icon:"📋" },
  { key:"payment", label:"Process Payment",   icon:"💳" },
  { key:"history", label:"Claim History",     icon:"📊" },
];

export default function InsuranceDashboard() {
  const [active, setActive] = useState("profile");
  const navigate = useNavigate();
  const logout   = () => { localStorage.clear(); navigate("/"); };

  const page = { profile:<InsuranceProfile/>, claims:<ViewClaims/>, payment:<ProcessPayment/>, history:<ClaimHistory/> };

  return (
    <div className="dashboard">
      <nav className="care-nav">
        <Link to="/" className="logo">
          <div className="logo-ring"><LogoIcon/></div>
          <span className="logo-name">Care<em>Assist</em></span>
        </Link>
        <span className="nav-role-badge">Insurance Company</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>

      <div className="dash-body">
        <aside className="sidebar">
          {NAV.map(n => (
            <div key={n.key} className={`sidebar-item${active===n.key?" active":""}`} onClick={()=>setActive(n.key)}>
              <span className="s-icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </aside>
        <main className="content">{page[active]}</main>
      </div>

     
      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>
    </div>
  );
}
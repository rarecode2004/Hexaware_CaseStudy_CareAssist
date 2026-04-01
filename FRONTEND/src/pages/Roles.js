import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/Roles.css";

const roles = [
  {
    name: "Patient",
    icon: "👤",
    desc: "Manage claims, invoices and insurance plans",
    value: "PATIENT",
  },
  {
    name: "Healthcare Provider",
    icon: "🏥",
    desc: "Generate invoices and manage services",
    value: "HEALTHCARE_PROVIDER",
  },
  {
    name: "Insurance Company",
    icon: "🏢",
    desc: "Review, approve claims and process payments",
    value: "INSURANCE_COMPANY",
  },
  {
    name: "Administrator",
    icon: "🛠️",
    desc: "Manage users, claims and system dashboard",
    value: "ADMIN",
  },
];

export default function Roles() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem("role", role.value);
    navigate("/login", { state: { role: role.value } });
  };

  return (
    <div className="roles-page">

      <Navbar />

      <div className="roles-bg" aria-hidden="true" />

      <main className="roles-main">

        <div className="roles-eyebrow">
          <span className="eyebrow-dot" />
          Get Started
        </div>

        <h1 className="roles-title">Select Your <span className="roles-hi">Role</span></h1>
        <p className="roles-sub">Choose how you want to continue with CareAssist</p>

        <div className="roles-grid">
          {roles.map((role, i) => (
            <div
              key={i}
              className="role-card"
              onClick={() => handleSelect(role)}
            >
              <div className="role-icon">{role.icon}</div>
              <h3 className="role-name">{role.name}</h3>
              <p className="role-desc">{role.desc}</p>
              <button className="role-btn" type="button">Continue →</button>
            </div>
          ))}
        </div>

      </main>

      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>

    </div>
  );
}
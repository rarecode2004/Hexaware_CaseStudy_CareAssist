import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Services.css";

import {
  FaUser,
  FaHospital,
  FaBuilding,
  FaTools,
  FaFileInvoice,
  FaShieldAlt,
  FaChartLine,
  FaBell,
} from "react-icons/fa";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

function Services() {
  const navigate = useNavigate();

  const serviceGroups = [
    {
      title: "Patient Services",
      icon: <FaUser />,
      route: "/roles",
      items: [
        "Profile Management",
        "Insurance Plans",
        "Submit Claims",
        "Invoice Viewing",
      ],
    },
    {
      title: "Healthcare Provider",
      icon: <FaHospital />,
      route: "/roles",
      items: [
        "Generate Invoices",
        "Service Billing",
        "Notify Patients",
        "Claim Submission",
      ],
    },
    {
      title: "Insurance Company",
      icon: <FaBuilding />,
      route: "/roles",
      items: [
        "Review Claims",
        "Approve/Reject",
        "Payment Processing",
        "Claim History",
      ],
    },
    {
      title: "Admin Dashboard",
      icon: <FaTools />,
      route: "/roles",
      items: [
        "Manage Users",
        "View Dashboard",
        "Track Claims",
        "System Monitoring",
      ],
    },
    {
      title: "Billing System",
      icon: <FaFileInvoice />,
      route: "/roles",
      items: [
        "Invoice Generation",
        "Tax Calculation",
        "Due Tracking",
      ],
    },
    {
      title: "Security",
      icon: <FaShieldAlt />,
      route: "/roles",
      items: [
        "JWT Authentication",
        "Role-Based Access",
        "Secure Storage",
      ],
    },
    {
      title: "Analytics",
      icon: <FaChartLine />,
      route: "/roles",
      items: [
        "Claims Insights",
        "Payment Reports",
        "Usage Stats",
      ],
    },
    {
      title: "Notifications",
      icon: <FaBell />,
      route: "/roles",
      items: [
        "Real-time Alerts",
        "Claim Updates",
        "Reminders",
      ],
    },
  ];

  return (
    <div className="services-page">

      {/* NAVBAR */}
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
          <button className="btn-login" onClick={() => navigate("/roles")}>
            Log In
          </button>
          <button className="btn-start" onClick={() => navigate("/roles")}>
            Get Started →
          </button>
        </div>
      </nav>

      <div className="services-content">

        <h1 className="services-title">Our Services</h1>
        <p className="services-sub">
          Explore powerful features designed for seamless medical billing and claims management.
        </p>

        <div className="services-grid">
          {serviceGroups.map((service, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => navigate(service.route)}
            >
              <div className="service-icon">{service.icon}</div>

              <h3>{service.title}</h3>

              <ul>
                {service.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <span className="card-link">Explore →</span>
            </div>
          ))}
        </div>

      </div>
      <footer className="care-footer">
        <p>© 2026 CareAssist · Medical Billing & Claims Platform · Secure & Reliable</p>
      </footer>
    </div>
  );
}
export default Services;



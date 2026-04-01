import React from "react";
import Navbar from "./Navbar";
import "../styles/About.css";

const sections = [
  {
    icon: "🎯",
    title: "Our Mission",
    desc: "Reduce administrative workload, improve billing accuracy, and enable seamless communication across all stakeholders.",
  },
  {
    icon: "💡",
    title: "What We Do",
    desc: "We automate invoice generation, claim submission, approval workflows, and real-time tracking using secure and scalable technologies.",
  },
  {
    icon: "🚀",
    title: "Our Vision",
    desc: "To digitally transform healthcare systems with intelligent automation and secure data management.",
  },
  {
    icon: "👥",
    title: "Multi-Role System",
    desc: "Supports Patients, Healthcare Providers, Insurance Companies, and Admins with dedicated dashboards and workflows.",
  },
  {
    icon: "📄",
    title: "Claims Workflow",
    desc: "Submit → Review → Approve/Reject → Payment Processing with complete tracking and transparency.",
  },
  {
    icon: "🔐",
    title: "Security",
    desc: "JWT authentication, role-based access control, and secure data storage ensure privacy and compliance.",
  },
];

const stats = [
  { value: "10K+", label: "Claims Processed" },
  { value: "5K+",  label: "Users" },
  { value: "99%",  label: "Accuracy" },
];

export default function About() {
  return (
    <div className="about-page">

      <Navbar />

      <div className="about-bg" aria-hidden="true" />

      <div className="about-container">

        <div className="about-eyebrow">
          <span className="eyebrow-dot" />
          Who We Are
        </div>

        <h1 className="about-title">About <span className="about-hi">CareAssist</span></h1>

        <p className="about-desc">
          CareAssist is a smart Medical Billing and Claims Management System designed
          to simplify healthcare workflows by connecting patients, healthcare providers,
          insurance companies, and administrators in a single platform.
        </p>

        <div className="about-grid">
          {sections.map((s, i) => (
            <div className="about-card" key={i}>
              <div className="about-card-icon">{s.icon}</div>
              <h2 className="about-card-title">{s.title}</h2>
              <p className="about-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-stats">
          {stats.map((s, i) => (
            <div className="about-stat" key={i}>
              <span className="about-stat-val">{s.value}</span>
              <span className="about-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>

    </div>
  );
}
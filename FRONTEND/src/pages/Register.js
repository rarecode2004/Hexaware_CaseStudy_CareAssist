import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { registerApi, roleToId } from "../utils/AuthService";
import "../styles/Auth.css";

export default function Register() {
  const location = useLocation();
  const navigate  = useNavigate();

  const role = location.state?.role || "PATIENT";

  const [form, setForm]   = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // password strength
  const strength = passwordStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await registerApi({
        username: form.username,
        email:    form.email,
        password: form.password,
        roleId:   roleToId(role),   
      });
      navigate("/login", { state: { role } });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar slim />
      <div className="auth-bg" aria-hidden="true" />

      <main className="auth-main">
        <div className="auth-card">

          <div className="auth-role-badge">{roleName(role)}</div>

          <h2 className="auth-title">Create account</h2>
          <p className="auth-sub">Register as {roleName(role)}</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleRegister}>

            <div className="auth-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {/* strength bar */}
              {form.password && (
                <div className="strength-bar">
                  <div className={`strength-fill s-${strength.level}`}
                    style={{ width: strength.pct }} />
                </div>
              )}
              {form.password && (
                <span className={`strength-label s-${strength.level}`}>{strength.label}</span>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Registering…" : "Create Account →"}
            </button>
          </form>

          <div className="auth-footer-links">
            <span className="auth-link"
              onClick={() => navigate("/login", { state: { role } })}>
              Already have an account? <strong>Sign In</strong>
            </span>
          </div>

        </div>
      </main>

      
      <footer className="care-footer">
        <p>© 2026 <a href="/">CareAssist Inc.</a> · Medical Billing &amp; Claims Platform - ISO 27001</p>
      </footer>
    </div>
  );
}

function roleName(r) {
  return {
    PATIENT:             "Patient",
    HEALTHCARE_PROVIDER: "Healthcare Provider",
    INSURANCE_COMPANY:   "Insurance Company",
  }[r] || r;
}

function passwordStrength(pw) {
  if (!pw) return { level: "empty", label: "", pct: "0%" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: "weak",   label: "Weak",   pct: "25%" };
  if (score <= 3) return { level: "medium", label: "Medium", pct: "60%" };
  return              { level: "strong", label: "Strong", pct: "100%" };
}
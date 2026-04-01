import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { loginApi, saveAuth, dashboardRoute} from "../utils/AuthService";
import "../styles/Auth.css";

export default function Login() {
  const location = useLocation();
  const navigate  = useNavigate();

  const role = location.state?.role || localStorage.getItem("role") || "PATIENT";

  const [form, setForm]       = useState({ username: "", password: "" });
  const [isForgot, setIsForgot] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);


  // ── LOGIN ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(form.username, form.password);
      // data = { token: "eyJ...", role: "PATIENT" }
      saveAuth(data.token, data.role, data.userId);
      navigate(dashboardRoute(data.role), { replace: true });
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setError("");
    alert("Password reset link sent to your email");
    setIsForgot(false);
  };

  const isAdmin = role === "ADMIN";

  return (
    <div className="auth-page">
      <Navbar slim />
      <div className="auth-bg" aria-hidden="true" />

      <main className="auth-main">
        <div className="auth-card">

          <div className="auth-role-badge">{roleName(role)}</div>

          <h2 className="auth-title">
            {isForgot ? "Reset Password" : "Welcome back"}
          </h2>
          <p className="auth-sub">
            {isForgot
              ? "Enter your email and we'll send a reset link"
              : `Sign in to your ${roleName(role)} account`}
          </p>

          {error && <div className="auth-error">{error}</div>}

          {!isForgot ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleForgot}>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <button className="auth-btn" type="submit">Send Reset Link</button>
            </form>
          )}

          {!isForgot ? (
            <div className="auth-footer-links">
              <span className="auth-link" onClick={() => setIsForgot(true)}>
                Forgot Password?
              </span>

              {!isAdmin && (
                <span className="auth-link" onClick={() => navigate("/register", { state: { role } })}>
                  Don't have an account? <strong>Register</strong>
                </span>
              )}
            </div>
          ) : (
            <span className="auth-link" onClick={() => setIsForgot(false)}>
              ← Back to Login
            </span>
          )}

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
    ADMIN:               "Administrator",
  }[r] || r;
}
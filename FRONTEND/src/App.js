// App.jsx — full routing with JWT-protected dashboards
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages ✅ FIXED PATHS
import Home         from "./pages/Home";
import About        from "./pages/About";
import Roles        from "./pages/Roles";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Services from "./pages/Services"; // adjust path if needed
// Protected dashboards ✅ FIXED PATHS
import PatientDashboard    from "./patient/PatientDashboard";
import ProviderDashboard   from "./provider/ProviderDashboard";
import InsuranceDashboard  from "./insurance/InsuranceDashboard";
import AdminDashboard      from "./admin/AdminDashboard";

import PrivateRoute from "./routes/PrivateRoute";

import "./styles/Auth.css";
import "./styles/Home.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ── */}
        <Route path="/"            element={<Home />} />
        <Route path="/about"       element={<About />} />
        <Route path="/roles"       element={<Roles />} />
        <Route path="/services" element={<Services/>}/>
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── PROTECTED DASHBOARDS ── */}

        <Route path="/patient-dashboard" element={
          <PrivateRoute allowedRole="PATIENT">
            <PatientDashboard />
          </PrivateRoute>
        } />

        <Route path="/provider-dashboard" element={
          <PrivateRoute allowedRole="HEALTHCARE_PROVIDER">
            <ProviderDashboard />
          </PrivateRoute>
        } />

        <Route path="/insurance-dashboard" element={
          <PrivateRoute allowedRole="INSURANCE_COMPANY">
            <InsuranceDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin-dashboard" element={
          <PrivateRoute allowedRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
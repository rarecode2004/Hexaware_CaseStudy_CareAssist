// PrivateRoute.jsx
// Wrap any dashboard route with this to enforce auth + role.
// Usage in App.jsx:
//   <Route path="/patient-dashboard" element={
//     <PrivateRoute allowedRole="PATIENT"><PatientDashboard /></PrivateRoute>
//   } />

import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/AuthService";

export default function PrivateRoute({ children, allowedRole }) {
  const token = getToken();
  const role  = getRole();

  // Not logged in at all
  if (!token) return <Navigate to="/login" replace />;

  // Logged in but wrong role (someone typed the URL manually)
  if (allowedRole && role !== allowedRole) return <Navigate to="/unauthorized" replace />;

  return children;
}

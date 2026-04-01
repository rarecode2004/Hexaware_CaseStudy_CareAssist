import api from "../api/axios"; 
const BASE_URL = "http://localhost:9090"; 

export const saveAuth = (token, role, userId) => {
  localStorage.setItem("token", token);   
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
};

export const getToken  = ()  => localStorage.getItem("token");
export const getRole   = ()  => localStorage.getItem("role");
export const getUserId = () => localStorage.getItem("userId");
export const isLoggedIn = () => !!getToken();

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};


// LOGIN
export const loginApi = async (username, password) => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
    });
    return res.data; // { token, role, userid }
  } catch (err) {
    throw new Error(err.response?.data.message || err.response?.data || "Login failed");
  }
};

// REGISTER
export const registerApi = async ({ username, email, password, roleId }) => {
  try {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
      roleId,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.message|| err.response?.data || "Registration failed");
  }
};

// LOGOUT
export const logoutApi = async () => {
  try {
    await api.post("/auth/logout");
    clearAuth();
  } catch (err) {
    clearAuth(); 
  }
};

// ── role - route mapping
export const dashboardRoute = (role) => {
  const map = {
    PATIENT:              "/patient-dashboard",
    HEALTHCARE_PROVIDER:  "/provider-dashboard",
    INSURANCE_COMPANY:    "/insurance-dashboard",
    ADMIN:                "/admin-dashboard",
  };
  return map[role] || "/";
};

// ── role → numeric roleId 
export const roleToId = (role) => {
  const map = {
    PATIENT:             2,
    HEALTHCARE_PROVIDER: 3,
    INSURANCE_COMPANY:   4,
  };
  return map[role];
};
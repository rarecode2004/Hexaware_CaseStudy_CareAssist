import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("➡️ REQUEST:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", response.status, response.config.url);
    return response;
  },

  (error) => {
    
    if (!error.response) {
      console.log("❌ NETWORK ERROR:", error.message);
      //alert("Backend not reachable. Check server.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    console.log("❌ ERROR STATUS:", status);
    console.log("❌ ERROR DATA:", error.response.data);

    if (status === 401) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    }

    else if (status === 403) {
      alert("You are not authorized to access this!");
    }

    else if (status === 404) {
      console.log("⚠️ Resource not found");
    }

else if (status === 500) {
  console.log("⚠️ Server error (may be normal, e.g. patient not found)");
}

    return Promise.reject(error);
  }
);

export default api;
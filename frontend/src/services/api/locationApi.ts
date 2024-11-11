import axios from "axios";

const locationApi = axios.create({
  baseURL: import.meta.env.VITE_LOCATION_SERVICE_URL || "http://localhost:8002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
locationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default locationApi;



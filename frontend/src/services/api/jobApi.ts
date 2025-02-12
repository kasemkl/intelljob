import axios from "axios";

const jobApi = axios.create({
  baseURL:
    import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8004/api/jobs",
  headers: {
    "Content-Type": "application/json",
  },
});

jobApi.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      const tokens = JSON.parse(authTokens);
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default jobApi;

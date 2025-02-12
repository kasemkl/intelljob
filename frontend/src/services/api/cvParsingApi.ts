import axios from "axios";

const cvParsingApi = axios.create({
  baseURL: "http://localhost:8005", // Base URL for the CV parsing service
  headers: {
    "Content-Type": "application/json",
  },
});

cvParsingApi.interceptors.request.use(
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

export default cvParsingApi;

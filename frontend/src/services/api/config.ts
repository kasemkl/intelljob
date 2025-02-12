export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8004/api",
  endpoints: {
    jobs: "/jobs",
    applications: "/applications",
    locations: "/locations",
    users: "/users",
    auth: "/auth",
  },
};

export const getAuthHeader = () => {
  const authTokens = localStorage.getItem("authTokens");
  if (authTokens) {
    const tokens = JSON.parse(authTokens);
    return { Authorization: `Bearer ${tokens.access}` };
  }
  return {};
};

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL && process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_BASE_URL
      : process.env.REACT_APP_API_BASE_URL || "/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.clearMyAuditLogs = () => api.delete("/file/audit/clear");

export default api;

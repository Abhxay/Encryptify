import axios from 'axios';

const api = axios.create({
  // Use relative path for API base URL to leverage Codespaces port forwarding
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.clearMyAuditLogs = () => api.delete('/file/audit/clear');

export default api;

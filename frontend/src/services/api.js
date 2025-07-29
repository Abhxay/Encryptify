import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8089', // Update if your backend runs elsewhere
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
api.clearMyAuditLogs = () => api.delete('/api/file/audit/clear');
export default api;

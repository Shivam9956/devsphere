import axios from 'axios';

const getBaseURL = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPrivateIp = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);

  if (isLocal) {
    return envUrl || 'http://localhost:5000/api';
  }
  if (isPrivateIp) {
    return `http://${hostname}:5000/api`;
  }
  // Production live domain (e.g., devsphereglobal.xyz)
  return envUrl || `${window.location.origin}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

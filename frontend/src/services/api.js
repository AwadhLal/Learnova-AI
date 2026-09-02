import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear localStorage if not on login page
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/admin/login' && path !== '/') {
        localStorage.removeItem('learnova_token');
        localStorage.removeItem('learnova_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;

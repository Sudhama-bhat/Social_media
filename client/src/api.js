import axios from 'axios';

const api = axios.create({
  // Use VITE_API_BASE_URL if provided, else default to root for Vercel rewrites
  baseURL: import.meta.env.VITE_API_BASE_URL || '', 
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

export default api;

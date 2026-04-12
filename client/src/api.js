import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Assuming backend runs on 5000, modify if necessary
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Just in case, though cookies are used
  }
  return config;
});

export default api;

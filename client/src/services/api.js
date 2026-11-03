import axios from 'axios';

const defaultBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://campus-lost-and-found-v0kl.onrender.com/api'
    : '/api');

const api = axios.create({
  baseURL: defaultBaseURL,
  withCredentials: true, // Send httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if stored locally (dual cookie + token support)
api.interceptors.request.use(
  (config) => {
    // Prevent duplicate /api when baseURL already ends with /api
    if (config.baseURL?.endsWith('/api') && config.url?.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api/, '');
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;


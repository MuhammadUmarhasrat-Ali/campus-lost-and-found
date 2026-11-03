import axios from 'axios';

let defaultBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://campus-lost-and-found-v0kl.onrender.com/api'
    : '/api');

// Auto-correct any typo of v0k1 (number 1) to v0kl (letter L)
if (typeof defaultBaseURL === 'string' && defaultBaseURL.includes('v0k1')) {
  defaultBaseURL = defaultBaseURL.replace(/v0k1/g, 'v0kl');
}

// Ensure baseURL ends with /api if pointing to the onrender backend
if (typeof defaultBaseURL === 'string' && defaultBaseURL.includes('onrender.com') && !defaultBaseURL.endsWith('/api')) {
  defaultBaseURL = defaultBaseURL.replace(/\/+$/, '') + '/api';
}

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
    // Guard against v0k1 typo at runtime
    if (config.baseURL?.includes('v0k1')) {
      config.baseURL = config.baseURL.replace(/v0k1/g, 'v0kl');
    }
    // Guard against missing /api on onrender URLs
    if (config.baseURL?.includes('onrender.com') && !config.baseURL.endsWith('/api')) {
      config.baseURL = config.baseURL.replace(/\/+$/, '') + '/api';
    }
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


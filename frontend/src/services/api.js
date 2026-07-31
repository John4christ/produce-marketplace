import axios from 'axios';

// Base Axios Instance for Produce Marketplace
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.agriharvest.example.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach Auth Token safely if stored
api.interceptors.request.use(
  (config) => {
    // Read token safely from in-memory or sessionStorage
    const token = sessionStorage.getItem('agri_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Safe Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let sanitizedMessage = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      if (error.response.status === 401) {
        sanitizedMessage = 'Session expired. Please log in again.';
      } else if (error.response.status === 403) {
        sanitizedMessage = 'You do not have permission to perform this action.';
      } else if (error.response.data && error.response.data.message) {
        sanitizedMessage = error.response.data.message;
      }
    } else if (error.request) {
      sanitizedMessage = 'Network error. Please check your internet connection.';
    }
    return Promise.reject(new Error(sanitizedMessage));
  }
);

export default api;

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('agri_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      if (error.response.status === 401) {
        message = 'Session expired. Please log in again.';
        sessionStorage.removeItem('agri_auth_token');
        sessionStorage.removeItem('agri_user');
      } else if (error.response.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data;
      }
    } else if (error.request) {
      message = 'Network error. Please check your internet connection.';
    }
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export default api;

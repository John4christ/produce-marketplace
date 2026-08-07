import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://produce-marketplace-production.up.railway.app/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    Accept: 'application/json'
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
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      message = 'Session expired. Please log in again.';
      sessionStorage.removeItem('agri_auth_token');
      sessionStorage.removeItem('agri_user');
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (data?.message) {
      message = data.message;
    } else if (typeof data === 'string') {
      message = data;
    } else if (error.request) {
      message = 'Network error. Please check your internet connection.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.errors = data?.errors || null;
    enhancedError.originalData = data;
    return Promise.reject(enhancedError);
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

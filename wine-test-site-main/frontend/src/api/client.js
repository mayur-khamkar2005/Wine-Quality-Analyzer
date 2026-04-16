import axios from 'axios';

export const AUTH_UNAUTHORIZED_EVENT = 'wine-quality:unauthorized';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wine-quality-token');
  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error) {
      return Promise.reject({ message: 'An unknown error occurred' });
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    if (
      status === 401 &&
      !requestUrl.includes('/auth/login') &&
      !requestUrl.includes('/auth/register')
    ) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    if (!error.response) {
      return Promise.reject({
        message: error.message || 'Network error. Please check your connection.',
      });
    }

    return Promise.reject(
      error.response?.data || {
        message: error.message || 'Request failed',
      },
    );
  },
);

export default apiClient;

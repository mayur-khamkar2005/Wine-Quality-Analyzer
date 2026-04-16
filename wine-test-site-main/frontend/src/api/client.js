import axios from 'axios';

export const AUTH_UNAUTHORIZED_EVENT = 'wine-quality:unauthorized';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // ✅ important fix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 for cookies / auth
  timeout: 15000,
});

// 🔹 Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wine-quality-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error) {
      return Promise.reject({ message: 'Unknown error occurred' });
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // 🔥 Auto logout logic
    if (
      status === 401 &&
      !requestUrl.includes('/auth/login') &&
      !requestUrl.includes('/auth/register')
    ) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    // 🔥 Network error
    if (!error.response) {
      return Promise.reject({
        message: error.message || 'Network error',
      });
    }

    return Promise.reject(
      error.response.data || {
        message: error.message || 'Request failed',
      }
    );
  }
);

export default apiClient;
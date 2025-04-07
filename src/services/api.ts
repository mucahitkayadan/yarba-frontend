import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Create Axios instance with default configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

console.log('API URL:', API_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', `${config.baseURL || ''}${config.url || ''}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });

    if (error.response?.status === 401) {
      // Remove the token on unauthorized response
      removeToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
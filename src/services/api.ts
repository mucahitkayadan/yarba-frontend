import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { createDebugger } from '../utils/debug';

const debug = createDebugger('API');

// Create Axios instance with default configuration
const API_URL = process.env.REACT_APP_API_URL;

debug.log('API URL:', API_URL);
console.log('Creating API service with URL:', API_URL);
console.log('Environment:', process.env.NODE_ENV);

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    debug.group(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      debug.log('Using auth token');
    }
    
    debug.log('Request URL:', `${config.baseURL || ''}${config.url || ''}`);
    debug.log('Request Headers:', config.headers);
    
    if (config.data) {
      debug.log('Request Data:', config.data);
    }
    
    debug.groupEnd();
    return config;
  },
  (error) => {
    debug.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    debug.group(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    debug.log('Status:', response.status, response.statusText);
    debug.log('Response Headers:', response.headers);
    debug.log('Response Data:', response.data);
    debug.groupEnd();
    return response;
  },
  (error) => {
    debug.group('API Error Response');
    
    if (error.response) {
      // The request was made and the server responded with error status
      debug.error('Status:', error.response.status, error.response.statusText);
      debug.error('Headers:', error.response.headers);
      debug.error('Data:', error.response.data);
      debug.error('Config:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      });
      
      if (error.response.status === 401) {
        debug.warn('Authentication error - clearing token and redirecting to login');
        // Remove the token on unauthorized response
        removeToken();
        // Redirect to login page
        window.location.href = '/login';
      } else if (error.response.status === 404) {
        // Let the component handle 404 errors (e.g., resource not found)
        debug.warn('Resource not found (404):', error.config?.url);
      }
    } else if (error.request) {
      // The request was made but no response was received
      debug.error('No response received. Request details:', error.request);
    } else {
      // Something happened in setting up the request
      debug.error('Request setup error:', error.message);
    }
    
    debug.groupEnd();
    return Promise.reject(error);
  }
);

export default api; 
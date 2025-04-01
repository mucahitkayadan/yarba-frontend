import api from './api';
import { storeToken } from '../utils/auth';
import { RegisterRequest, LoginRequest, LoginResponse, User } from '../types/models';
import axios from 'axios';

// Register user
export const register = async (data: RegisterRequest): Promise<{ message: string }> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Login user
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // Convert to FormData as the login endpoint requires x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store the token upon successful login
    if (response.data.access_token) {
      storeToken(response.data.access_token);
    }
    return response.data;
  } catch (error) {
    // Make sure the error is propagated with response data for proper handling in UI
    if (axios.isAxiosError(error) && error.response) {
      throw error; // Already has response property
    } else {
      // For non-axios errors, create a standardized error
      const err = new Error(error instanceof Error ? error.message : 'Login failed');
      throw err;
    }
  }
};

// Get current user information
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
}; 
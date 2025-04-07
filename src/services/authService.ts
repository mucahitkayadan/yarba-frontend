import api from './api';
import { storeToken } from '../utils/auth';
import { RegisterRequest, LoginRequest, LoginResponse, User } from '../types/models';
import axios from 'axios';
import { 
  registerWithFirebase, 
  loginWithFirebase, 
  exchangeFirebaseTokenForJWT, 
  signOutFromFirebase,
  signInWithGoogleProvider
} from './firebaseAuthService';

// Register user
export const register = async (data: RegisterRequest): Promise<{ message: string }> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Firebase register
export const registerWithEmail = async (data: RegisterRequest): Promise<{ message: string }> => {
  try {
    // Register with Firebase first
    await registerWithFirebase(data.email, data.password);
    
    // Exchange the Firebase token for a backend JWT
    const tokenResponse = await exchangeFirebaseTokenForJWT();
    
    if (tokenResponse?.access_token) {
      storeToken(tokenResponse.access_token);
      
      // Register additional user info with the backend
      await api.post('/auth/firebase/register', {
        username: data.username,
        email: data.email,
        full_name: data.full_name
      });
      
      return { message: 'Registration successful' };
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
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

// Firebase login
export const loginWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Login with Firebase
    await loginWithFirebase(email, password);
    
    // Exchange Firebase token for backend JWT
    const tokenResponse = await exchangeFirebaseTokenForJWT();
    
    if (tokenResponse?.access_token) {
      storeToken(tokenResponse.access_token);
      return tokenResponse;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
};

// Google sign-in
export const loginWithGoogle = async (): Promise<LoginResponse> => {
  try {
    console.log('Starting Google sign-in process in authService...');
    
    // Sign in with Google
    const firebaseUser = await signInWithGoogleProvider();
    console.log('Successfully signed in with Google, user:', firebaseUser.email);
    
    // Exchange Firebase token for backend JWT
    console.log('Exchanging Firebase token for backend JWT...');
    const tokenResponse = await exchangeFirebaseTokenForJWT();
    
    if (tokenResponse?.access_token) {
      console.log('Received backend token, storing it...');
      storeToken(tokenResponse.access_token);
      return tokenResponse;
    } else {
      console.error('Backend did not return an access token');
      throw new Error('Failed to get access token from backend');
    }
  } catch (error: any) {
    console.error('Google sign-in error in authService:', error);
    
    // Create a more specific error message
    if (error.message && error.message.includes('Backend did not return')) {
      console.error('This appears to be a backend issue, not a Firebase auth issue');
    } else {
      console.error('This appears to be a Firebase authentication issue');
    }
    
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    // Sign out from Firebase
    await signOutFromFirebase();
    // Remove token from local storage
    storeToken('');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get current user information
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
}; 
import api from './api';
import { storeToken } from '../utils/auth';
import { RegisterRequest, LoginRequest, LoginResponse, User } from '../types/models';
import axios from 'axios';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { createDebugger } from '../utils/debug';

// Create a debugger for this file
const debug = createDebugger('Auth');

// Track ongoing token exchange to prevent infinite retries
let tokenExchangeInProgress = false;
let lastTokenExchangeError: Error | null = null;
let lastTokenExchangeTime = 0;
const TOKEN_RETRY_DELAY = 30000; // 30 seconds

// Get current Firebase user
export const getCurrentFirebaseUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      debug.log('Current Firebase user:', user ? `${user.email} (${user.uid})` : 'None');
      resolve(user);
    });
  });
};

// Get Firebase ID token
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    debug.warn('No current Firebase user found when getting ID token');
    return null;
  }

  try {
    debug.log('Getting Firebase ID token');
    const token = await user.getIdToken(true);
    debug.log('Successfully retrieved Firebase ID token');
    return token;
  } catch (error) {
    debug.error('Error getting ID token:', error);
    return null;
  }
};

// Exchange Firebase token for backend JWT
export const exchangeFirebaseTokenForJWT = async (): Promise<LoginResponse | null> => {
  // Check if a request is already in progress
  if (tokenExchangeInProgress) {
    debug.warn('Token exchange already in progress, skipping duplicate request');
    if (lastTokenExchangeError) {
      throw lastTokenExchangeError;
    }
    return null;
  }
  
  // Check if we've tried recently and failed
  const now = Date.now();
  if (lastTokenExchangeError && (now - lastTokenExchangeTime < TOKEN_RETRY_DELAY)) {
    const timeRemaining = Math.round((TOKEN_RETRY_DELAY - (now - lastTokenExchangeTime))/1000);
    debug.warn(`Token exchange recently failed, waiting before retry (${timeRemaining}s remaining)`);
    throw lastTokenExchangeError;
  }
  
  const idToken = await getFirebaseIdToken();
  if (!idToken) {
    debug.error('No Firebase ID token available');
    return null;
  }

  // Set the flag before starting the request
  tokenExchangeInProgress = true;
  lastTokenExchangeTime = now;
  
  try {
    debug.log('Sending Firebase token to backend for JWT exchange');
    const response = await api.post<LoginResponse>('/auth/login', { id_token: idToken });
    debug.log('JWT exchange successful, response:', response.data);
    
    // Reset error state on success
    tokenExchangeInProgress = false;
    lastTokenExchangeError = null;
    return response.data;
  } catch (error: any) {
    debug.error('Error exchanging Firebase token:', error);
    
    // Store the error for future reference
    lastTokenExchangeError = error instanceof Error ? error : new Error(error.message || 'Unknown error');
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Backend error: ${error.response.data?.detail || error.message}`);
    } else {
      throw error;
    }
  } finally {
    // Reset the flag when the request is complete
    tokenExchangeInProgress = false;
  }
};

// Register with backend (Flow A)
export const registerWithEmail = async (data: RegisterRequest): Promise<LoginResponse> => {
  try {
    debug.log('Sending registration details to backend for:', data.email);
    const { email, password } = data;
    const response = await api.post<LoginResponse>('/auth/register', { email, password });
    debug.log('Backend registration successful, response:', response.data);
    
    if (response.data.access_token) {
      storeToken(response.data.access_token);
      // The response from /auth/register should be compatible with LoginResponse
      return response.data; 
    } else {
      debug.error('Backend registration did not return an access token.');
      throw new Error('Registration completed but failed to log in automatically.');
    }
  } catch (error) {
    debug.error('Backend registration error:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Propagate detailed error message from backend if available
      const errorDetail = error.response.data?.detail || error.message;
      throw new Error(errorDetail || 'Registration failed due to a server error.');
    }
    throw error; // Re-throw other types of errors
  }
};

// Traditional login (for backward compatibility)
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

// Firebase login with email/password
export const loginWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    debug.log('Attempting Firebase login with email:', email);
    // Login with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    debug.log('Firebase login successful');
    
    // Exchange Firebase token for backend JWT
    const tokenResponse = await exchangeFirebaseTokenForJWT();
    
    if (tokenResponse?.access_token) {
      storeToken(tokenResponse.access_token);
      return tokenResponse;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    debug.error('Firebase login error:', error);
    throw error;
  }
};

// Google sign-in
export const loginWithGoogle = async (): Promise<LoginResponse> => {
  try {
    debug.log('Starting Google sign-in process');
    
    // Sign in with Google
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    debug.log('Google sign-in successful with Firebase user:', firebaseUser.email);

    let isNewUser = false;
    if (firebaseUser.metadata.creationTime && firebaseUser.metadata.lastSignInTime) {
      // Check if creation time and last sign-in time are very close (e.g., within a few seconds)
      // Firebase times are strings, convert to numbers for comparison
      const creationTimestamp = new Date(firebaseUser.metadata.creationTime).getTime();
      const lastSignInTimestamp = new Date(firebaseUser.metadata.lastSignInTime).getTime();
      if (Math.abs(lastSignInTimestamp - creationTimestamp) < 5000) { // 5 seconds threshold
        isNewUser = true;
        debug.log('Detected new user from Google Sign-In based on timestamps.');
      }
    }
    
    // Exchange Firebase token for backend JWT
    // The backend /auth/login endpoint might also determine if it's a new user 
    // and ideally would return this information. For now, we rely on Firebase metadata.
    const tokenResponse = await exchangeFirebaseTokenForJWT();
    
    if (tokenResponse?.access_token) {
      storeToken(tokenResponse.access_token);
      return { ...tokenResponse, isNewUser };
    } else {
      throw new Error('Failed to get access token from backend');
    }
  } catch (error) {
    debug.error('Google sign-in error:', error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    debug.log('Signing out user');
    // Sign out from Firebase
    await firebaseSignOut(auth);
    // Remove token from local storage
    storeToken('');
    debug.log('Sign out successful');
  } catch (error) {
    debug.error('Logout error:', error);
    throw error;
  }
};

// Get current user information from backend
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

// Change Firebase password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    debug.error('No current Firebase user found when changing password');
    throw new Error('You must be logged in to change your password');
  }

  try {
    debug.log('Reauthenticating user before password change');
    // First, reauthenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Then change the password
    debug.log('Updating password');
    await updatePassword(user, newPassword);
    debug.log('Password update successful');
  } catch (error: any) {
    debug.error('Error changing password:', error);
    
    // Provide more specific error messages
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('New password is too weak. It should be at least 6 characters');
    } else {
      throw error;
    }
  }
};

// Verify Firebase token (for testing)
export const verifyFirebaseToken = async (): Promise<any> => {
  const idToken = await getFirebaseIdToken();
  if (!idToken) throw new Error('No Firebase ID token available');

  try {
    debug.log('Verifying Firebase token');
    const response = await api.post('/auth/firebase/verify-token', { id_token: idToken });
    debug.log('Token verification successful:', response.data);
    return response.data;
  } catch (error) {
    debug.error('Error verifying Firebase token:', error);
    throw error;
  }
}; 
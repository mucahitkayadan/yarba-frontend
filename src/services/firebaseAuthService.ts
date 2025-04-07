import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import api from './api';
import { createDebugger } from '../utils/debug';

// Create a debugger for this file
const debug = createDebugger('FirebaseAuth');

// Track ongoing token exchange to prevent infinite retries
let tokenExchangeInProgress = false;
let lastTokenExchangeError: Error | null = null;
let lastTokenExchangeTime = 0;
const TOKEN_RETRY_DELAY = 30000; // 30 seconds

// Firebase registration
export const registerWithFirebase = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    debug.error('Firebase registration error:', error);
    throw error;
  }
};

// Firebase login
export const loginWithFirebase = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    debug.log('Attempting Firebase login with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    debug.log('Firebase login successful');
    return userCredential.user;
  } catch (error) {
    debug.error('Firebase login error:', error);
    throw error;
  }
};

// Google sign-in
export const signInWithGoogleProvider = async (): Promise<FirebaseUser> => {
  try {
    debug.log('Initiating Google sign-in');
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    debug.log('Google sign-in successful');
    return result.user;
  } catch (error) {
    debug.error('Google sign-in error:', error);
    throw error;
  }
};

// Firebase logout
export const signOutFromFirebase = async (): Promise<void> => {
  try {
    debug.log('Signing out from Firebase');
    await firebaseSignOut(auth);
    // Reset token exchange state
    tokenExchangeInProgress = false;
    lastTokenExchangeError = null;
    debug.log('Sign out successful');
  } catch (error) {
    debug.error('Firebase sign out error:', error);
    throw error;
  }
};

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
export const exchangeFirebaseTokenForJWT = async (): Promise<{ access_token: string; token_type: string } | null> => {
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
    debug.group('Token Exchange Process');
    debug.log('Sending Firebase token to backend...');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
    debug.log('API URL:', apiUrl);
    
    // Display the payload we're sending to the backend
    const payload = { id_token: idToken };
    debug.log('Payload being sent:', { 
      ...payload, 
      id_token: payload.id_token.substring(0, 20) + '...' 
    });
    
    // Note: Route should NOT include /api/v1 since it's in the baseURL already
    const response = await api.post('/auth/firebase/login', payload);
    debug.log('Backend response:', response.data);
    debug.groupEnd();
    
    // Reset error state on success
    lastTokenExchangeError = null;
    return response.data;
  } catch (error: any) {
    debug.group('Token Exchange Error');
    debug.error('Error exchanging Firebase token:', error);
    
    // Store the error for future reference
    if (error instanceof Error) {
      lastTokenExchangeError = error;
    } else {
      lastTokenExchangeError = new Error(error.message || 'Unknown error');
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      debug.error('Backend API error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.response.config?.url,
          method: error.response.config?.method,
          baseURL: error.response.config?.baseURL,
          headers: error.response.config?.headers
        }
      });
      
      // Create a more user-friendly error message
      let errorMessage = 'Backend validation error';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          // If we can't extract a specific message, show the full response
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      
      debug.error('User-friendly error message:', errorMessage);
      debug.groupEnd();
      
      // Create a custom error with the extracted message
      const customError = new Error(`Backend error: ${errorMessage} (${error.response.status})`);
      throw customError;
    } else if (error.request) {
      // The request was made but no response was received
      debug.error('No response received from backend. Check API endpoint and server status.');
      debug.groupEnd();
      throw new Error('Backend server did not respond. Check if the server is running.');
    } else {
      // Something happened in setting up the request
      debug.error('Error setting up the request:', error.message);
      debug.groupEnd();
      throw error;
    }
  } finally {
    // Reset the flag when the request is complete
    tokenExchangeInProgress = false;
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
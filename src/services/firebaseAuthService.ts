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

// Firebase registration
export const registerWithFirebase = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase registration error:', error);
    throw error;
  }
};

// Firebase login
export const loginWithFirebase = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
};

// Google sign-in
export const signInWithGoogleProvider = async (): Promise<FirebaseUser> => {
  try {
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Firebase logout
export const signOutFromFirebase = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase sign out error:', error);
    throw error;
  }
};

// Get current Firebase user
export const getCurrentFirebaseUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Get Firebase ID token
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

// Exchange Firebase token for backend JWT
export const exchangeFirebaseTokenForJWT = async (): Promise<{ access_token: string; token_type: string } | null> => {
  const idToken = await getFirebaseIdToken();
  if (!idToken) {
    console.error('No Firebase ID token available');
    return null;
  }

  try {
    console.log('Sending Firebase token to backend...');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
    console.log('API URL:', apiUrl);
    
    // Display the payload we're sending to the backend
    const payload = { id_token: idToken };
    console.log('Payload being sent:', { 
      ...payload, 
      id_token: payload.id_token.substring(0, 20) + '...' 
    });
    
    // Note: Route should NOT include /api/v1 since it's in the baseURL already
    const response = await api.post('/auth/firebase/login', payload);
    console.log('Backend response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error exchanging Firebase token:', error);
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error('Backend API error details:', {
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
      
      // Create a custom error with the extracted message
      const customError = new Error(`Backend error: ${errorMessage} (${error.response.status})`);
      throw customError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from backend. Check API endpoint and server status.');
      throw new Error('Backend server did not respond. Check if the server is running.');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', error.message);
      throw error;
    }
  }
};

// Verify Firebase token (for testing)
export const verifyFirebaseToken = async (): Promise<any> => {
  const idToken = await getFirebaseIdToken();
  if (!idToken) throw new Error('No Firebase ID token available');

  try {
    const response = await api.post('/auth/firebase/verify-token', { id_token: idToken });
    return response.data;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw error;
  }
}; 
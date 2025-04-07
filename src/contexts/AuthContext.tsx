import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import api from '../services/api';
import { 
  loginWithFirebase, 
  registerWithFirebase, 
  signInWithGoogleProvider, 
  signOutFromFirebase,
  exchangeFirebaseTokenForJWT,
  getCurrentFirebaseUser
} from '../services/firebaseAuthService';
import { createDebugger } from '../utils/debug';

const debug = createDebugger('AuthContext');

// Define the shape of our auth context state
export interface AuthContextState {
  user: any | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  updateProfile: (userData: any) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextState>({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  setError: () => {},
  updateProfile: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps app and provides auth context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch current user data from backend
  const fetchCurrentUser = async () => {
    debug.log('Fetching current user data from backend');
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      debug.warn('No auth token found in localStorage');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      debug.log('User data successfully fetched', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      debug.error('Error fetching user data:', err);
      // Clear token if it's invalid
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        debug.warn('Token is invalid, clearing authentication');
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase token exchange and user data fetch
  const handleTokenExchange = async (fbUser: FirebaseUser) => {
    try {
      debug.log('Starting token exchange for user:', fbUser.email);
      const tokenResponse = await exchangeFirebaseTokenForJWT();
      
      if (tokenResponse) {
        const { access_token } = tokenResponse;
        localStorage.setItem('auth_token', access_token);
        
        // Set Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        debug.log('Token exchange successful, token saved');
        
        // Fetch user data
        await fetchCurrentUser();
      } else {
        debug.warn('Token exchange did not return a valid response');
        setLoading(false);
      }
    } catch (err: any) {
      debug.error('Token exchange error:', err);
      setError(err.message || 'Error during authentication');
      setLoading(false);
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    debug.log('Setting up Firebase auth state listener');
    const checkCurrentUser = async () => {
      try {
        const fbUser = await getCurrentFirebaseUser();
        setFirebaseUser(fbUser);
        
        if (fbUser) {
          debug.log('Firebase user is logged in:', fbUser.email);
          await handleTokenExchange(fbUser);
        } else {
          debug.log('No Firebase user found');
          setLoading(false);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        debug.error('Error checking current user:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    checkCurrentUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      debug.log('Starting login process for:', email);
      setLoading(true);
      setError(null);
      
      const fbUser = await loginWithFirebase(email, password);
      setFirebaseUser(fbUser);
      debug.log('Firebase login successful');
      
      // Token exchange will be handled by the auth state listener
    } catch (err: any) {
      debug.error('Login error:', err);
      setError(err.message);
      setLoading(false);
      throw err; // Re-throw for component-level handling
    }
  };

  // Register function
  const register = async (email: string, password: string, username: string, fullName: string) => {
    try {
      debug.log('Starting registration process for:', email);
      setLoading(true);
      setError(null);
      
      const fbUser = await registerWithFirebase(email, password);
      setFirebaseUser(fbUser);
      debug.log('Firebase registration successful');
      
      // Token exchange will be handled by the auth state listener
    } catch (err: any) {
      debug.error('Registration error:', err);
      setError(err.message);
      setLoading(false);
      throw err; // Re-throw for component-level handling
    }
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    try {
      debug.log('Starting Google sign-in process');
      setLoading(true);
      setError(null);
      
      const fbUser = await signInWithGoogleProvider();
      setFirebaseUser(fbUser);
      debug.log('Google sign-in successful');
      
      // Token exchange will be handled by the auth state listener
    } catch (err: any) {
      debug.error('Google sign-in error:', err);
      setError(err.message);
      setLoading(false);
      throw err; // Re-throw for component-level handling
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      debug.log('Starting sign-out process');
      setLoading(true);
      
      await signOutFromFirebase();
      
      // Clear auth data
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
      setFirebaseUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      debug.log('Sign-out successful');
    } catch (err: any) {
      debug.error('Sign-out error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: any) => {
    try {
      debug.log('Updating user profile');
      setLoading(true);
      
      const response = await api.patch('/auth/me', userData);
      setUser(response.data);
      
      debug.log('Profile update successful');
    } catch (err: any) {
      debug.error('Profile update error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // The context value that will be supplied to any descendants of this provider
  const value = {
    user,
    firebaseUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    signInWithGoogle,
    signOut,
    setError,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
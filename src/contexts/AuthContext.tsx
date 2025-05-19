import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import api from '../services/api';
import { 
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as loginWithGoogleService,
  logout,
  exchangeFirebaseTokenForJWT,
  getCurrentFirebaseUser
} from '../services/authService';
import { createDebugger } from '../utils/debug';
import { UpdateSetupProgressRequest, UserSetupProgressResponse } from '../types/models';

const debug = createDebugger('AuthContext');

// Define user setup steps explicitly
export enum UserSetupStep {
  NONE = 0,
  PERSONAL_INFO = 1,
  PREFERENCES = 2,
  LIFE_STORY = 3,
  COMPLETE = 4
}

// Map setup steps to routes for navigation
export const setupStepToRoute: Record<UserSetupStep, string | null> = {
  [UserSetupStep.NONE]: null,
  [UserSetupStep.PERSONAL_INFO]: '/user/setup/personal-info',
  [UserSetupStep.PREFERENCES]: '/user/setup/prompt-preferences',
  [UserSetupStep.LIFE_STORY]: '/user/setup/life-story',
  [UserSetupStep.COMPLETE]: null
};

// Define the shape of our auth context state with more accurate typing
export interface AuthContextState {
  user: any | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isOfflineMode: boolean;
  setupStep: UserSetupStep;
  setupRoute: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ setupRoute: string }>;
  signInWithGoogleFlow: () => Promise<{ isNewUser?: boolean, setupRoute?: string }>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  updateProfile: (userData: any) => Promise<void>;
  updateUserSetupProgress: (data: UpdateSetupProgressRequest) => Promise<void>;
  getRedirectPathForUser: () => string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextState>({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isOfflineMode: false,
  setupStep: UserSetupStep.NONE,
  setupRoute: null,
  login: async () => {},
  register: async () => ({ setupRoute: '' }),
  signInWithGoogleFlow: async () => ({ isNewUser: false }),
  signOut: async () => {},
  setError: () => {},
  updateProfile: async () => {},
  updateUserSetupProgress: async () => {},
  getRedirectPathForUser: () => '/dashboard',
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
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<UserSetupStep>(UserSetupStep.NONE);
  const [setupRoute, setSetupRoute] = useState<string | null>(null);

  // Function to detect if we're offline
  const checkNetworkConnectivity = () => {
    const isOffline = !navigator.onLine;
    debug.log(`Network connectivity check: ${isOffline ? 'OFFLINE' : 'ONLINE'}`);
    setIsOfflineMode(isOffline);
    return isOffline;
  };

  // Utility function to determine the correct route based on user state
  const getRedirectPathForUser = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    
    if (setupRoute) {
      return setupRoute;
    }
    
    return '/dashboard';
  };

  // Update setupStep and setupRoute based on user data
  const updateSetupState = (currentSetupStep: number | null | undefined) => {
    debug.log('Updating setup state based on current_setup_step:', currentSetupStep);
    
    if (typeof currentSetupStep !== 'number') {
      setSetupStep(UserSetupStep.COMPLETE);
      setSetupRoute(null);
      return;
    }
    
    const step = currentSetupStep as UserSetupStep;
    setSetupStep(step);
    
    // Map the step number to a route
    const route = setupStepToRoute[step];
    if (route) {
      debug.log(`Setting setup route to ${route} for step ${step}`);
      setSetupRoute(route);
    } else if (step === UserSetupStep.COMPLETE || step === UserSetupStep.NONE) {
      debug.log('User setup is complete or not required');
      setSetupRoute(null);
    } else {
      debug.log('Unknown setup step:', step);
      setSetupRoute(null);
    }
  };

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
      
      // Check if we're offline before making API calls
      if (checkNetworkConnectivity()) {
        debug.warn('Device appears to be offline, skipping API call');
        setLoading(false);
        return;
      }
      
      const response = await api.get('/auth/me');
      debug.log('User data successfully fetched from /auth/me', response.data);
      
      setUser(response.data);
      setIsAuthenticated(true);
      updateSetupState(response.data.current_setup_step);
      setLoading(false);
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
      setLoading(false);
    }
  };

  // Handle Firebase token exchange and user data fetch
  const handleTokenExchange = async (fbUser: FirebaseUser) => {
    try {
      debug.log('Starting token exchange for user:', fbUser.email);
      
      // Check if we're offline before making API calls
      if (checkNetworkConnectivity()) {
        debug.warn('Device appears to be offline, skipping token exchange');
        setLoading(false);
        return;
      }
      
      const tokenResponse = await exchangeFirebaseTokenForJWT();
      
      if (tokenResponse) {
        const { access_token, user: responseUser, current_setup_step } = tokenResponse;
        localStorage.setItem('auth_token', access_token);
        
        // Set Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        debug.log('Token exchange successful, token saved');
        
        // Set authenticated state immediately
        setIsAuthenticated(true);
        
        if (responseUser) {
          setUser({ ...responseUser, current_setup_step });
        }
        
        // Update setup state
        updateSetupState(current_setup_step);
        
        // Fetch full user data to ensure we have the latest
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
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      debug.log('Device is now ONLINE');
      setIsOfflineMode(false);
    };
    
    const handleOffline = () => {
      debug.log('Device is now OFFLINE');
      setIsOfflineMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const checkCurrentUser = async () => {
      try {
        // Initial network check
        const isOffline = checkNetworkConnectivity();
        
        // If offline, we can skip the Firebase auth check to prevent errors
        if (isOffline) {
          debug.warn('Device is offline, skipping Firebase auth check');
          setLoading(false);
          return;
        }
        
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
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      debug.log('Starting login process for:', email);
      setLoading(true);
      setError(null);
      
      // Check if we're offline first
      if (checkNetworkConnectivity()) {
        const errorMsg = 'Cannot login while offline. Please check your internet connection.';
        debug.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
      
      const result = await loginWithEmail(email, password);
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      debug.log('Firebase login successful');
      setIsAuthenticated(true);
      
      if (result.user) {
        setUser(result.user);
        updateSetupState(result.current_setup_step);
      }
      
      return;
    } catch (err: any) {
      debug.error('Login error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string): Promise<{ setupRoute: string }> => {
    try {
      debug.log('Starting registration process for:', email);
      setLoading(true);
      setError(null);
      
      // Check if we're offline first
      if (checkNetworkConnectivity()) {
        const errorMsg = 'Cannot register while offline. Please check your internet connection.';
        debug.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
      
      const result = await registerWithEmail({ email, password });
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      debug.log('Firebase registration successful');
      setIsAuthenticated(true);

      if (result.user) {
        setUser({ ...result.user, current_setup_step: result.current_setup_step });
      }
      
      // Determine the setup step from the registration response
      updateSetupState(result.current_setup_step);
      
      // Return the appropriate setup route for immediate redirect
      return { setupRoute: setupRoute || '/dashboard' };
    } catch (err: any) {
      debug.error('Registration error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google flow
  const signInWithGoogleFlow = async (): Promise<{ isNewUser?: boolean, setupRoute?: string }> => {
    try {
      debug.log('Starting Google sign-in flow');
      setLoading(true);
      setError(null);
      
      if (checkNetworkConnectivity()) {
        const errorMsg = 'Cannot sign in with Google while offline. Please check your internet connection.';
        debug.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
      
      const result = await loginWithGoogleService();
      debug.log('Google sign-in flow completed with result:', result);
      
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      setIsAuthenticated(true);
      
      if (result.user) {
        setUser({ ...result.user, current_setup_step: result.current_setup_step });
        updateSetupState(result.current_setup_step);
      }
      
      return { 
        isNewUser: result.is_new_user,
        setupRoute: setupRoute || '/dashboard'
      };
    } catch (err: any) {
      debug.error('Google sign-in error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      debug.log('Starting sign out process');
      setLoading(true);
      
      await logout();
      
      // Clean up local state
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      
      setUser(null);
      setFirebaseUser(null);
      setIsAuthenticated(false);
      setSetupStep(UserSetupStep.NONE);
      setSetupRoute(null);
      
      debug.log('Sign out successful');
    } catch (err: any) {
      debug.error('Sign out error:', err);
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
      
      if (checkNetworkConnectivity()) {
        throw new Error('Cannot update profile while offline');
      }
      
      const response = await api.put('/profiles/me', userData);
      debug.log('Profile updated successfully', response.data);
      
      // Update local user state
      await fetchCurrentUser();
    } catch (err: any) {
      debug.error('Profile update error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user setup progress
  const updateUserSetupProgress = async (data: UpdateSetupProgressRequest): Promise<void> => {
    try {
      debug.log('Updating user setup progress:', data);
      setLoading(true);
      
      if (checkNetworkConnectivity()) {
        throw new Error('Cannot update setup progress while offline');
      }
      
      // Using the correct endpoint with PUT method
      const response = await api.put<UserSetupProgressResponse>('/auth/users/me/setup-progress', data);
      debug.log('Setup progress updated successfully', response.data);
      
      // Update local state with new step
      updateSetupState(response.data.current_setup_step);
      
      // Refresh user data
      await fetchCurrentUser();
    } catch (err: any) {
      debug.error('Setup progress update error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Provide the auth context value
  const value: AuthContextState = {
    user,
    firebaseUser,
    isAuthenticated,
    loading,
    error,
    isOfflineMode,
    setupStep,
    setupRoute,
    login,
    register,
    signInWithGoogleFlow,
    signOut,
    setError,
    updateProfile,
    updateUserSetupProgress,
    getRedirectPathForUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
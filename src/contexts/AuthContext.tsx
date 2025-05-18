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

// Define the shape of our auth context state
export interface AuthContextState {
  user: any | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isOfflineMode: boolean;
  pendingSetupStep: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signInWithGoogleFlow: () => Promise<{ isNewUser?: boolean }>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  updateProfile: (userData: any) => Promise<void>;
  updateUserSetupProgress: (data: UpdateSetupProgressRequest) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextState>({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isOfflineMode: false,
  pendingSetupStep: null,
  login: async () => {},
  register: async () => {},
  signInWithGoogleFlow: async () => ({ isNewUser: false }),
  signOut: async () => {},
  setError: () => {},
  updateProfile: async () => {},
  updateUserSetupProgress: async () => {}
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
  // Add a state to track network connectivity issues
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [pendingSetupStep, setPendingSetupStep] = useState<string | null>(null);

  // Function to detect if we're offline
  const checkNetworkConnectivity = () => {
    const isOffline = !navigator.onLine;
    debug.log(`Network connectivity check: ${isOffline ? 'OFFLINE' : 'ONLINE'}`);
    setIsOfflineMode(isOffline);
    return isOffline;
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
      debug.log('User data successfully fetched', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
      // pendingSetupStep will be determined by the useEffect hook based on response.data
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
        
        // Set authenticated state immediately so redirects can happen
        setIsAuthenticated(true);
        
        if (responseUser) setUser(responseUser); // Set user from token exchange if available
        
        // Directly use current_setup_step from token response if available
        if (typeof current_setup_step === 'number') {
          if (current_setup_step === 1) {
            setPendingSetupStep('/user/setup/personal-info');
          } else if (current_setup_step === 2) {
            setPendingSetupStep('/user/setup/preferences'); // Example for next step
          } else {
            setPendingSetupStep(null); // Or based on other step numbers
          }
        }
        // Fetch full user data, which might override pendingSetupStep via useEffect if /auth/me is more authoritative
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
    window.addEventListener('online', () => {
      debug.log('Device is now ONLINE');
      setIsOfflineMode(false);
    });
    
    window.addEventListener('offline', () => {
      debug.log('Device is now OFFLINE');
      setIsOfflineMode(true);
    });
    
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
      window.removeEventListener('online', () => setIsOfflineMode(false));
      window.removeEventListener('offline', () => setIsOfflineMode(true));
    };
  }, []);

  // Effect to determine pending setup step based on user profile
  useEffect(() => {
    if (isAuthenticated && user) {
      // Prioritize current_setup_step from the user object if available
      if (typeof user.current_setup_step === 'number') {
        if (user.current_setup_step === 1 && !user.full_name) { // Ensure full_name is also checked if step 1 means filling it
          debug.log('User has current_setup_step 1, setting pendingSetupStep to /user/setup/personal-info');
          setPendingSetupStep('/user/setup/personal-info');
        } else if (user.current_setup_step === 2) { // Example for a potential second step
          debug.log('User has current_setup_step 2, setting pendingSetupStep to /user/setup/preferences');
          setPendingSetupStep('/user/setup/preferences');
        // Add more steps as needed
        // else if (user.current_setup_step === 0 || user.current_setup_step > MAX_SETUP_STEP) {
        } else {
          debug.log('User current_setup_step indicates completion or is unknown, clearing pendingSetupStep.');
          setPendingSetupStep(null);
        }
      } else if (!user.full_name) { // Fallback to checking full_name if current_setup_step is not on user object
        debug.log('User is missing full_name (and current_setup_step is not available/determinative), setting pendingSetupStep to /user/setup/personal-info');
        setPendingSetupStep('/user/setup/personal-info');
      } else {
        debug.log('User has full_name or setup step is complete, clearing pendingSetupStep.');
        setPendingSetupStep(null);
      }
    } else if (!isAuthenticated) {
      setPendingSetupStep(null);
    }
  }, [user, isAuthenticated]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      debug.log('Starting login process for:', email);
      setLoading(true);
      setError(null);
      
      // Check if we're offline first
      if (checkNetworkConnectivity()) {
        const errorMsg = 'Cannot log in while offline. Please check your internet connection.';
        debug.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
      
      const authResponse = await loginWithEmail(email, password);
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      debug.log('Firebase login successful');
      
      if (authResponse.access_token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.access_token}`;
        setIsAuthenticated(true);
        if (authResponse.user) setUser(authResponse.user); // Set user from login response

        // Use current_setup_step from login response
        if (typeof authResponse.current_setup_step === 'number') {
          if (authResponse.current_setup_step === 1) {
            setPendingSetupStep('/user/setup/personal-info');
          } else if (authResponse.current_setup_step === 2) {
            setPendingSetupStep('/user/setup/preferences');
          } else {
            setPendingSetupStep(null);
          }
        }
        await fetchCurrentUser(); // This will fetch the full user object and might refine pendingSetupStep via useEffect
      }
    } catch (err: any) {
      debug.error('Login error:', err);
      setError(err.message);
      setLoading(false);
      throw err; // Re-throw for component-level handling
    }
  };

  // Register function
  const register = async (email: string, password: string) => {
    try {
      debug.log('Starting registration process for:', email);
      setLoading(true);
      setError(null);
      
      const registrationData = {
        email,
        password,
      };
      
      // Check if we're offline first
      if (checkNetworkConnectivity()) {
        const errorMsg = 'Cannot register while offline. Please check your internet connection.';
        debug.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
      
      const result = await registerWithEmail(registrationData);
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      debug.log('Firebase registration successful');
      setIsAuthenticated(true);

      if (result.user) setUser(result.user); // Set user from registration response

      // Directly use current_setup_step from registration response
      if (typeof result.current_setup_step === 'number') {
        if (result.current_setup_step === 1) {
            setPendingSetupStep('/user/setup/personal-info');
        } else if (result.current_setup_step === 2) {
            setPendingSetupStep('/user/setup/preferences');
        } else {
            setPendingSetupStep(null);
        }
      } else {
        // Fallback if current_setup_step is not in the registration response for some reason
        setPendingSetupStep('/user/setup/personal-info'); 
      }
      
      await fetchCurrentUser(); // Fetches full user data, potentially refining pendingSetupStep
    } catch (err: any) {
      debug.error('Registration error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Sign in with Google Flow
  const signInWithGoogleFlow = async (): Promise<{ isNewUser?: boolean }> => {
    try {
      debug.log('Starting Google sign-in process in AuthContext');
      setLoading(true);
      setError(null);
      
      const authResponse = await loginWithGoogleService();
      const fbUser = await getCurrentFirebaseUser();
      setFirebaseUser(fbUser);
      debug.log('Google sign-in service call successful');
      
      if (authResponse.access_token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.access_token}`;
        setIsAuthenticated(true);
        if (authResponse.user) setUser(authResponse.user);
        
        // Use current_setup_step from google response
        if (typeof authResponse.current_setup_step === 'number') {
          if (authResponse.current_setup_step === 1) {
            setPendingSetupStep('/user/setup/personal-info');
          } else if (authResponse.current_setup_step === 2) {
            setPendingSetupStep('/user/setup/preferences');
          } else {
            setPendingSetupStep(null);
          }
        } else if (authResponse.isNewUser || authResponse.is_new_user) {
            // Fallback for Google sign-in if current_setup_step isn't directly available
            // but it's a new user
            setPendingSetupStep('/user/setup/personal-info');
        }

        await fetchCurrentUser();
        setLoading(false);
        debug.log('Google sign-in flow complete. isNewUser:', authResponse.isNewUser || authResponse.is_new_user);
        return { isNewUser: authResponse.isNewUser || authResponse.is_new_user };
      }
      setLoading(false);
      debug.warn('Google sign-in flow: No access token received.');
      return { isNewUser: false }; // Default if no access token
    } catch (err: any) {
      debug.error('Google sign-in flow error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      debug.log('Starting sign-out process');
      setLoading(true);
      
      await logout();
      
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
      
      const response = await api.put('/auth/me', userData);
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

  // New function to update user setup progress
  const updateUserSetupProgress = async (data: UpdateSetupProgressRequest) => {
    try {
      debug.log('Updating user setup progress with data:', data);
      setLoading(true);
      const response = await api.put<UserSetupProgressResponse>('/api/v1/auth/users/me/setup-progress', data);
      
      // Update user state with the new current_setup_step and potentially other fields from response
      setUser((prevUser: any) => ({
        ...prevUser,
        id: response.data.id, // Ensure user id remains consistent or is updated if necessary
        email: response.data.email, // Ensure email remains consistent
        current_setup_step: response.data.current_setup_step,
        // If your User object in context needs is_new_user, you can add it here:
        // is_new_user: response.data.is_new_user, 
      }));
      
      debug.log('User setup progress update successful:', response.data);
      // The useEffect hook listening to 'user' state should automatically update pendingSetupStep
    } catch (err: any) {
      debug.error('User setup progress update error:', err);
      setError(err.message);
      throw err; // Re-throw for component-level handling
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
    isOfflineMode,
    pendingSetupStep,
    login,
    register,
    signInWithGoogleFlow,
    signOut,
    setError,
    updateProfile,
    updateUserSetupProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
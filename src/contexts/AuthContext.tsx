import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { loginWithEmail, registerWithEmail, logout, loginWithGoogle, getCurrentUser } from '../services/authService';
import { getToken, removeToken, storeToken } from '../utils/auth';
import { User, LoginRequest, RegisterRequest } from '../types/models';
import api from '../services/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getFirebaseIdToken, exchangeFirebaseTokenForJWT } from '../services/firebaseAuthService';

// Extend User type with profile fields through UserProfile interface
export interface UserProfile {
  full_name?: string;
  bio?: string;
  job_title?: string;
  company?: string;
  location?: string;
  phone?: string;
  website?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithFirebase: (email: string, password: string) => Promise<void>;
  registerWithFirebase: (data: RegisterRequest) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profileData: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async (): Promise<void> => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      setUser(null); // Ensure user is null if no token
      return;
    }

    setIsLoading(true); // Set loading before API call
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      removeToken(); // Remove token if fetching user fails (e.g., token invalid)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get the ID token
        try {
          // Check if we have a backend token
          const token = getToken();
          if (!token) {
            // If no token, exchange Firebase token for backend JWT
            const tokenResponse = await exchangeFirebaseTokenForJWT();
            if (tokenResponse?.access_token) {
              // Store new token and fetch user data
              storeToken(tokenResponse.access_token);
              await fetchCurrentUser();
            }
          } else {
            // If we already have a token, just fetch user data
            await fetchCurrentUser();
          }
        } catch (error) {
          console.error('Error processing Firebase auth state change:', error);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        // User is signed out
        removeToken();
        setUser(null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const loginWithFirebaseHandler = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      await fetchCurrentUser(); // Fetch user data after successful login
    } catch (error) {
      console.error('Firebase login failed:', error);
      setUser(null);
      removeToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogleHandler = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      await fetchCurrentUser(); // Fetch user data after successful login
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setUser(null);
      removeToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithFirebaseHandler = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      await registerWithEmail(data);
      await fetchCurrentUser(); // Fetch user data after successful registration
    } catch (error) {
      console.error('Firebase registration failed:', error);
      setUser(null);
      removeToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async (): Promise<void> => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData: UserProfile): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.patch('/users/me', profileData);
      // Update the user object with the new data
      setUser(prev => prev ? { ...prev, ...response.data } : null);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user, // Derive isAuthenticated directly from user state
    isLoading,
    loginWithFirebase: loginWithFirebaseHandler,
    registerWithFirebase: registerWithFirebaseHandler,
    signInWithGoogle: signInWithGoogleHandler,
    logout: logoutHandler,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}; 
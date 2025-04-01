import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { login as apiLogin, getCurrentUser } from '../services/authService';
import { getToken, removeToken } from '../utils/auth';
import { User, LoginRequest } from '../types/models';
import api from '../services/api';

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
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
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

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const loginHandler = async (data: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      await apiLogin(data);
      await fetchCurrentUser(); // Fetch user data after successful login
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null); // Ensure user is null on login failure
      removeToken(); // Clear any potentially lingering invalid token
      throw error; // Re-throw error to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = (): void => {
    removeToken();
    setUser(null);
    // Optional: Redirect to login page or home page after logout
    // window.location.href = '/login';
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
    login: loginHandler,
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
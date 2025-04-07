import { createDebugger } from './debug';

const debug = createDebugger('AuthUtils');

// Local storage key for auth token
const TOKEN_KEY = 'auth_token';

/**
 * Store authentication token in localStorage
 */
export const storeToken = (token: string): void => {
  debug.log('Storing auth token');
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve authentication token from localStorage
 */
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  debug.log(`Retrieved auth token: ${token ? 'present' : 'missing'}`);
  return token;
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  debug.log('Removing auth token');
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
  const hasToken = !!getToken();
  debug.log(`Authentication check: ${hasToken ? 'Authenticated' : 'Not authenticated'}`);
  return hasToken;
}; 
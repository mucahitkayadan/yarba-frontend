// Auth utilities
const TOKEN_KEY = 'auth_token';

// Store token
export const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token on logout
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token; // Returns true if token exists
}; 
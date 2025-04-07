import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography, Alert } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, isOfflineMode } = useAuth();
  const location = useLocation();

  // If the app is still loading auth state, show spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle offline mode more gracefully - if offline, show a message instead of redirecting
  if (isOfflineMode) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        p: 3 
      }}>
        <Alert severity="warning" sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
          You appear to be offline. Some features may be limited.
        </Alert>
        
        {!isAuthenticated ? (
          <>
            <Typography variant="h6" gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body1">
              This page requires authentication, but we can't connect to our servers.
              Please check your internet connection and try again.
            </Typography>
            <Box mt={2}>
              <Navigate to="/login" state={{ from: location, offline: true }} replace />
            </Box>
          </>
        ) : (
          // If somehow authenticated while offline, allow access
          <>{children}</>
        )}
      </Box>
    );
  }

  // Normal case - if not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and not loading, render the children components
  return <>{children}</>;
}; 
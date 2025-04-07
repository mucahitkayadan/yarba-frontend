import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Display a loading indicator while checking auth status
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the login page if the user is not authenticated
    // Save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and not loading, render the children components
  return <>{children}</>;
}; 
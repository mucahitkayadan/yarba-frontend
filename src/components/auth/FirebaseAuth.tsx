import React, { useState, useCallback } from 'react';
import {
  Box, Button, Divider, Grid, Link, Paper, TextField, Typography, CircularProgress, Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../utils/errorHandler';
import { createDebugger } from '../../utils/debug';
import { useLocation } from 'react-router-dom';

const debug = createDebugger('FirebaseAuth');

type AuthMode = 'login' | 'register';

const FirebaseAuth: React.FC = () => {
  // State management
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth context
  const { 
    login, 
    register, 
    signInWithGoogle, 
    error: contextError, 
    setError,
    isOfflineMode 
  } = useAuth();

  // Get offline state from location if passed
  const location = useLocation();
  const isOffline = isOfflineMode || (location.state && location.state.offline);

  // Reset error when switching modes
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setUsername('');
    setFullName('');
    setLocalError(null);
    setError(null);
  }, [setError]);

  // Handle form submission for login or register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);
    
    // Check for offline mode first
    if (isOffline) {
      setLocalError('Cannot authenticate while offline. Please check your internet connection.');
      return;
    }
    
    if (!email || !password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && (!username || !fullName)) {
      setLocalError('Please fill in all required fields');
      return;
    }

    debug.log(`Submitting ${mode} form for email: ${email}`);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        debug.log('Attempting to log in');
        await login(email, password);
        debug.log('Login successful');
      } else {
        debug.log('Attempting to register');
        await register(email, password, username, fullName);
        debug.log('Registration successful');
      }
    } catch (error: any) {
      const errorMsg = getFirebaseErrorMessage(error);
      debug.error(`${mode} error:`, error);
      setLocalError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    // Check for offline mode first
    if (isOffline) {
      setLocalError('Cannot authenticate with Google while offline. Please check your internet connection.');
      return;
    }
    
    debug.log('Attempting Google sign-in');
    setLocalError(null);
    setError(null);
    setIsSubmitting(true);
    
    try {
      await signInWithGoogle();
      debug.log('Google sign-in successful');
    } catch (error: any) {
      const errorMsg = getFirebaseErrorMessage(error);
      debug.error('Google sign-in error:', error);
      setLocalError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    resetForm();
    setMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
    debug.log(`Switched mode to: ${mode === 'login' ? 'register' : 'login'}`);
  };

  // Show error if exists
  const errorMessage = localError || contextError;
  
  // Display offline mode message
  if (isOffline) {
    return (
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, mx: 'auto' }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {mode === 'login' ? 'Sign In' : 'Create an Account'}
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          You appear to be offline. Authentication requires an internet connection.
        </Alert>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please check your internet connection and try again. If you believe this is an error, 
          try refreshing the page once your connection is restored.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, mx: 'auto' }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        {mode === 'login' ? 'Sign In' : 'Create an Account'}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />

        {mode === 'register' && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
            />
          </>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : mode === 'login' ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <Link
            component="button"
            variant="body2"
            onClick={toggleMode}
            type="button"
          >
            {mode === 'login'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default FirebaseAuth; 
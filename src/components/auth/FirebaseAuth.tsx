import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Button, Divider, Grid, Link, Paper, TextField, Typography, CircularProgress, Alert, InputAdornment, IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../utils/errorHandler';
import { createDebugger } from '../../utils/debug';
import { useLocation, useNavigate } from 'react-router-dom';

const debug = createDebugger('FirebaseAuth');

type AuthMode = 'login' | 'register';

const FirebaseAuth: React.FC = () => {
  // State management
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auth context
  const { 
    login, 
    register, 
    signInWithGoogle, 
    error: contextError, 
    setError,
    isOfflineMode,
    isAuthenticated
  } = useAuth();

  // Navigation
  const navigate = useNavigate();
  
  // Get offline state from location if passed
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const isOffline = isOfflineMode || (location.state && location.state.offline);

  // Effect to redirect when authentication state changes
  useEffect(() => {
    debug.log('Auth state check - isAuthenticated:', isAuthenticated);
    debug.log('Auth state check - from location:', from);
    
    if (isAuthenticated) {
      debug.log('User is authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Reset error when switching modes
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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

    if (mode === 'register') {
      if (!fullName) {
        setLocalError('Please fill in all required fields');
        return;
      }
      
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
    }

    debug.log(`Submitting ${mode} form for email: ${email}`);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        debug.log('Attempting to log in');
        await login(email, password);
        debug.log('Login successful');
        
        // Force navigation - don't wait for isAuthenticated state change
        debug.log('Force navigating to dashboard after login');
        navigate('/dashboard', { replace: true });
      } else {
        debug.log('Attempting to register');
        await register(email, password, "", fullName);
        debug.log('Registration successful');
        
        // Force navigation - don't wait for isAuthenticated state change
        debug.log('Force navigating to dashboard after registration');
        navigate('/dashboard', { replace: true });
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
      
      // Force navigation - don't wait for isAuthenticated state change
      debug.log('Force navigating to dashboard after Google sign-in');
      navigate('/dashboard', { replace: true });
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

  // Handle password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
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
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {mode === 'register' && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Re-enter Password"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={confirmPassword !== '' && password !== confirmPassword}
                  helperText={confirmPassword !== '' && password !== confirmPassword ? 'Passwords do not match' : ''}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1 }}
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
          </Grid>
        </Grid>

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
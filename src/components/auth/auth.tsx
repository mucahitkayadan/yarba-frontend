import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Button, Divider, Grid, Link, Paper, TextField, Typography, CircularProgress, Alert, InputAdornment, IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../utils/errorHandler';
import { createDebugger } from '../../utils/debug';
import { useLocation, useNavigate } from 'react-router-dom';

const debug = createDebugger('FirebaseAuth');

type AuthMode = 'login' | 'register';

interface FirebaseAuthProps {
  initialMode?: AuthMode;
}

const FirebaseAuth: React.FC<FirebaseAuthProps> = ({ initialMode = 'login' }) => {
  // State management
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auth context
  const { 
    login, 
    register, 
    signInWithGoogleFlow,
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

  // Effect to update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Reset error when switching modes
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
        await register(email, password);
        debug.log('Registration successful');
        
        // Force navigation - don't wait for isAuthenticated state change
        debug.log('Force navigating to user setup after registration');
        navigate('/user/setup/personal-info', { replace: true });
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
    if (isOffline) {
      setLocalError('Cannot authenticate with Google while offline. Please check your internet connection.');
      return;
    }
    
    debug.log('Attempting Google sign-in');
    setLocalError(null);
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { isNewUser } = await signInWithGoogleFlow();
      debug.log('Google sign-in successful. isNewUser:', isNewUser);
      
      if (isNewUser) {
        debug.log('Force navigating to user setup after Google sign-in for new user');
        navigate('/user/setup/personal-info', { replace: true });
      } else {
        debug.log('Force navigating to dashboard after Google sign-in for existing user');
        navigate(from, { replace: true });
      }
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
    if (mode === 'login') {
      navigate('/register', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
    debug.log(`Navigating to: ${mode === 'login' ? '/register' : '/login'}`);
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
    <Grid container spacing={0} sx={{ maxWidth: 900, mx: 'auto', boxShadow: 3, borderRadius: 1, overflow: 'hidden' }}>
      <Grid 
        item 
        xs={12} 
        md={6}
        sx={{ 
          display: 'block',
          order: { xs: 2, md: 1 }
        }}
      >
        <Box sx={{ 
          aspectRatio: mode === 'login' ? '1/1' : '2/3',
          borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.12)' },
          borderTop: { xs: '1px solid rgba(0, 0, 0, 0.12)', md: 'none' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          minHeight: { xs: '200px', sm: '300px', md: 'auto' },
          height: { md: '100%' },
          p: 0
        }}>
          <img 
            src={mode === 'login' ? "/login_resume.webp" : "/register_cover_letter.webp"} 
            alt={mode === 'login' ? "Login" : "Register"} 
            style={{ 
              maxWidth: '100%',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </Box>
      </Grid>
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{ 
          display: 'flex', 
          alignItems: 'stretch',
          order: { xs: 1, md: 2 }
        }}
      >
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
          height: '100%'
        }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              {mode === 'login' ? 'Sign In' : 'Create an Account'}
            </Typography>

            {errorMessage && (
              <Box sx={{ mb: 2, width: '100%' }}>
                <Alert 
                  severity="error" 
                  icon={<ErrorOutlineIcon fontSize="inherit" />}
                  sx={{ 
                    width: '100%',
                    '.MuiAlert-message': {
                      width: '100%', 
                      textAlign: 'center',
                      fontWeight: 500
                    }
                  }}
                >
                  {errorMessage}
                </Alert>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                    error={!!localError && email === ''}
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
                {mode === 'login' && (
                  <Box mt={1}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate('/forgot-password')}
                      type="button"
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FirebaseAuth; 
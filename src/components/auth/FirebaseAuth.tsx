import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest } from '../../types/models';
import { Google as GoogleIcon } from '@mui/icons-material';

type AuthMode = 'login' | 'register';

const FirebaseAuth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithFirebase, registerWithFirebase, signInWithGoogle } = useAuth();

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithFirebase(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login';
      // Extract Firebase error message
      const firebaseError = errorMessage.includes('Firebase:') 
        ? errorMessage.split('Firebase:')[1].trim() 
        : errorMessage;
      setError(firebaseError);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !email || !password || !fullName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const data: RegisterRequest = {
        username,
        email,
        password,
        full_name: fullName
      };
      await registerWithFirebase(data);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during registration';
      // Extract Firebase error message
      const firebaseError = errorMessage.includes('Firebase:') 
        ? errorMessage.split('Firebase:')[1].trim() 
        : errorMessage;
      setError(firebaseError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    console.log('Starting Google sign-in process...');
    
    try {
      console.log('Calling signInWithGoogle...');
      await signInWithGoogle();
      console.log('Google sign-in successful!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google sign-in error (detailed):', err);
      
      const errorMessage = err.message || 'An error occurred with Google sign-in';
      const errorCode = err.code || 'unknown';
      
      console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      
      // Create a more user-friendly error message
      let userMessage = 'Failed to sign in with Google';
      
      if (errorCode === 'auth/popup-closed-by-user') {
        userMessage = 'Sign-in was canceled because the popup was closed.';
      } else if (errorCode === 'auth/popup-blocked') {
        userMessage = 'Sign-in popup was blocked by your browser. Please enable popups for this site.';
      } else if (errorCode === 'auth/cancelled-popup-request') {
        userMessage = 'The popup request was cancelled.';
      } else if (errorCode === 'auth/network-request-failed') {
        userMessage = 'Network error occurred. Please check your internet connection.';
      }
      
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={loading}
          sx={{ py: 1.2 }}
        >
          {loading ? <CircularProgress size={24} /> : `${mode === 'login' ? 'Sign in' : 'Sign up'} with Google`}
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In with Email'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register with Email'}
            </Button>
          </form>
        )}
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="text"
          onClick={toggleMode}
          sx={{ textTransform: 'none' }}
        >
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Sign In'}
        </Button>
      </Box>
    </Paper>
  );
};

export default FirebaseAuth; 
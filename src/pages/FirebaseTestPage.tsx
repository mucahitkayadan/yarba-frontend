import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert, Divider, Stack, TextField } from '@mui/material';
import { verifyFirebaseToken, getFirebaseIdToken, signInWithGoogleProvider } from '../services/firebaseAuthService';
import { useAuth } from '../contexts/AuthContext';
import { Google as GoogleIcon } from '@mui/icons-material';
import api from '../services/api';

const FirebaseTestPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [paramName, setParamName] = useState('id_token');
  const apiUrl = process.env.REACT_APP_API_URL || 'Not configured';

  // Get Firebase ID token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getFirebaseIdToken();
        setIdToken(token);
      } catch (err) {
        console.error('Error fetching token:', err);
      }
    };
    
    fetchToken();
  }, []);

  const handleTestVerification = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await verifyFirebaseToken();
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to verify token');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setFirebaseUser(null);
    
    try {
      // This directly tests Firebase Google auth without involving the backend
      const fbUser = await signInWithGoogleProvider();
      setFirebaseUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      });
      
      // Get the Firebase token to display
      const token = await fbUser.getIdToken();
      setIdToken(token);
    } catch (err: any) {
      console.error('Direct Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google directly');
    } finally {
      setLoading(false);
    }
  };

  const handleManualTokenExchange = async () => {
    if (!idToken) {
      setError('No Firebase ID token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log(`Sending token to backend with parameter name: ${paramName}`);
      
      // Create a payload with the user-specified parameter name
      const payload = {
        [paramName]: idToken
      };
      
      console.log('Payload:', payload);
      
      // Send the token to the backend
      const response = await api.post('/auth/firebase/login', payload);
      
      console.log('Backend response:', response.data);
      setResult(response.data);
    } catch (err: any) {
      console.error('Token exchange error:', err);
      
      let errorMessage = err.message || 'Failed to exchange token';
      
      if (err.response) {
        console.error('Backend error details:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage += ` - ${err.response.data}`;
          } else if (err.response.data.detail) {
            errorMessage += ` - ${err.response.data.detail}`;
          } else if (err.response.data.message) {
            errorMessage += ` - ${err.response.data.message}`;
          } else if (err.response.data.error) {
            errorMessage += ` - ${err.response.data.error}`;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Firebase Authentication Test
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuration
        </Typography>
        <Box>
          <Typography><strong>API URL:</strong> {apiUrl}</Typography>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Direct Firebase Auth Test
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleDirectGoogleSignIn}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Test Google Sign-in Directly'}
        </Button>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {firebaseUser && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Firebase User:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(firebaseUser, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        
        {user ? (
          <Box>
            <Typography>
              <strong>User ID:</strong> {user.id}
            </Typography>
            <Typography>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Full Name:</strong> {user.full_name || 'Not set'}
            </Typography>
          </Box>
        ) : (
          <Typography color="error">
            Not logged in or user information not available
          </Typography>
        )}
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Firebase ID Token
        </Typography>
        
        {idToken ? (
          <Box>
            <Typography variant="body2" sx={{ 
              maxHeight: '100px', 
              overflowY: 'auto', 
              p: 1, 
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              wordBreak: 'break-all'
            }}>
              {idToken}
            </Typography>
          </Box>
        ) : (
          <Typography color="error">
            No Firebase ID token available
          </Typography>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleTestVerification}
          disabled={loading || !idToken}
        >
          {loading ? <CircularProgress size={24} /> : 'Test Token Verification'}
        </Button>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Verification Result:
            </Typography>
            <Paper sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              color: 'info.contrastText',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manual Token Exchange Testing
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Parameter Name"
            value={paramName}
            onChange={(e) => setParamName(e.target.value)}
            fullWidth
            size="small"
            helperText="The parameter name to use when sending the token to the backend"
            margin="normal"
          />
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleManualTokenExchange}
            disabled={loading || !idToken}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Token to Backend'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Backend Response:
            </Typography>
            <Paper sx={{ 
              p: 2, 
              bgcolor: 'success.light', 
              color: 'success.contrastText',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FirebaseTestPage; 
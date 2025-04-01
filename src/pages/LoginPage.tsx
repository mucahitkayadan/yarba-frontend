import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Link, FormHelperText } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginRequest } from '../types/models';

// Updated validation schema to allow email format
const LoginSchema = Yup.object().shape({
  // Change username field to identifier to represent username or email
  identifier: Yup.string()
    .required('Username or email is required'),
  password: Yup.string().required('Password is required'),
});

// Interface extending LoginRequest to use identifier field
interface LoginFormValues {
  identifier: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      // Map form values to API request
      // Determine if input is email or username
      const isEmail = values.identifier.includes('@');
      
      // Create login request object with the appropriate field
      const loginData: LoginRequest = {
        username: values.identifier, // Pass as username; API handles both username and email
        password: values.password,
      };
      
      await login(loginData);
      navigate(from, { replace: true }); // Redirect to the intended page or dashboard
    } catch (err: any) {
      // More specific error messages based on response status
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Invalid credentials. Please check your username/email and password.');
            break;
          case 403:
            setError('Your account has been locked. Please contact support.');
            break;
          case 429:
            setError('Too many login attempts. Please try again later.');
            break;
          default:
            setError(err.response.data?.detail || 'Login failed. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ identifier: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: 1 }}>
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="identifier"
                label="Username or Email"
                name="identifier"
                autoComplete="username email"
                autoFocus
              />
              <ErrorMessage name="identifier">
                {msg => <FormHelperText error>{msg}</FormHelperText>}
              </ErrorMessage>

              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <ErrorMessage name="password">
                 {msg => <FormHelperText error>{msg}</FormHelperText>}
              </ErrorMessage>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || isSubmitting}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginPage; 
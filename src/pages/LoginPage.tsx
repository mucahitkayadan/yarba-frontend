import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import FirebaseAuth from '../components/auth/FirebaseAuth';

const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to YARBA
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
          Your personal AI-powered resume and cover letter builder
        </Typography>
        
        <FirebaseAuth />
      </Box>
    </Container>
  );
};

export default LoginPage; 
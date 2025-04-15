import React from 'react';
import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import FirebaseAuth from '../components/auth/auth';
import { Link as RouterLink } from 'react-router-dom';

interface LoginPageProps {
  authMode?: 'login' | 'register';
}

const LoginPage: React.FC<LoginPageProps> = ({ authMode = 'login' }) => {
  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          width: '100%',
          ml: 0,
          backgroundImage: 'linear-gradient(to right,rgb(142, 92, 150),rgb(122, 172, 216))',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 3,
          height: { 
            xs: '56px',
            sm: '56px',
            md: '64px'
          }
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: { xs: 56, sm: 56, md: 64 }, 
            py: { xs: 0, md: 0.5 },
            px: { xs: 1, sm: 2 }
          }}
        >
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.svg" alt="YARBA" style={{ height: '50px', width: 'auto' }} />
            </RouterLink>
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="sm" sx={{ mb: authMode === 'register' ? 6 : 3 }}>
        <Box
          sx={{
            marginTop: 12, // Increased from 8 to account for the AppBar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3" fontWeight="700" color="primary.main" gutterBottom>
            Welcome to YARBA
          </Typography>
          {/* <Typography variant="h6" color="text.secondary" align="center" sx={{ fontWeight: 500, mb: 4 }}>
            Your personal AI-powered resume and cover letter builder
            <Box component="span" sx={{ display: 'block', fontSize: '0.8rem', mt: 1, fontStyle: 'italic', opacity: 0.8 }}>
              (Yet Another Resume Builder App)
            </Box>
          </Typography> */}
          
          <FirebaseAuth initialMode={authMode} />
        </Box>
      </Container>
    </>
  );
};

export default LoginPage; 
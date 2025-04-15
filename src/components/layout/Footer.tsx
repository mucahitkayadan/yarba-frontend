import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'center',
          maxWidth: '100%',
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center'
          }}
        >
          © {new Date().getFullYear()} YARBA
        </Typography>
        
        <Box 
          component="ul" 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            p: 0,
            m: 0,
            gap: 2,
            listStyle: 'none'
          }}
        >
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="/about" color="text.secondary" underline="hover" fontSize="0.875rem">
              About
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Support
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              FAQ
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Blog
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Careers
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Privacy
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Terms
            </Link>
          </Box>
          <Box component="li" sx={{ display: 'inline' }}>
            <Link component={RouterLink} to="#" color="text.secondary" underline="hover" fontSize="0.875rem">
              Contact
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer; 
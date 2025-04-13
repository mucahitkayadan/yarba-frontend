import { createTheme } from '@mui/material/styles';
import React from 'react';

// Modern blue-focused color palette
const palette = {
  primary: {
    main: '#3F72AF', // Modern blue
    light: '#4C84CF',
    dark: '#2C5282',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#5E60CE', // Purple-blue accent
    light: '#7B78E5',
    dark: '#4C4BB0',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F7FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2D3748',
    secondary: '#718096',
  },
  error: {
    main: '#F56565',
  },
  warning: {
    main: '#ED8936',
  },
  info: {
    main: '#4299E1',
  },
  success: {
    main: '#48BB78',
  },
  divider: 'rgba(0, 0, 0, 0.06)',
};

// Custom theme with Söhne Breit font and modern styling
const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Söhne Breit", "Söhne", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 3px 6px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.12)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 14px 28px rgba(0, 0, 0, 0.20)',
    '0px 16px 32px rgba(0, 0, 0, 0.24)',
    '0px 18px 36px rgba(0, 0, 0, 0.28)',
    '0px 20px 40px rgba(0, 0, 0, 0.32)',
    '0px 22px 44px rgba(0, 0, 0, 0.36)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)',
    '0px 24px 48px rgba(0, 0, 0, 0.40)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(63, 114, 175, 0.2)',
          },
        },
        contained: {
          boxShadow: '0px 3px 6px rgba(63, 114, 175, 0.2)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          maxWidth: '100% !important',
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      },
      styleOverrides: {
        root: {
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
          bgcolor: 'primary.main',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px',
          '@media (min-width: 600px)': {
            minHeight: '56px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundImage: 'linear-gradient(180deg, rgba(63, 114, 175, 0.03) 0%, rgba(94, 96, 206, 0.03) 100%)',
          boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)', // 16dp elevation
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'rgba(63, 114, 175, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(63, 114, 175, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(63, 114, 175, 0.05)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
});

export default theme; 
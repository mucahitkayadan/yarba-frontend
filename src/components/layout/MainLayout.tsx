import React, { ReactNode, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  ListItemButton,
  Tooltip,
  Avatar,
  Fab
} from '@mui/material';
import { 
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Description as ResumeIcon,
  Mail as CoverLetterIcon,
  Person as ProfileIcon,
  Work as PortfolioIcon,
  Palette as TemplatesIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Define navigation items
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Resumes', icon: <ResumeIcon />, path: '/resumes' },
  { text: 'Cover Letters', icon: <CoverLetterIcon />, path: '/cover-letters' },
  { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
  { text: 'Templates', icon: <TemplatesIcon />, path: '/templates' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface MainLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;
const miniDrawerWidth = 65;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const drawer = (
    <>
      <List sx={{ mt: 1 }}>
        {navItems.map((item, index) => (
          <Tooltip 
            title={!drawerOpen ? item.text : ""} 
            placement="right" 
            key={item.text}
            TransitionProps={{ timeout: 0 }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              className="slide-up nav-item"
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(63, 114, 175, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 114, 175, 0.15)',
                  },
                },
                animation: `slideUp 0.3s ease-out forwards ${index * 0.05 + 0.2}s`,
                opacity: 0,
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  transition: 'none',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    opacity: 1,
                    display: 'block',
                    '& span': {
                      transition: 'none !important',
                    }
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        <Tooltip 
          title={!drawerOpen ? "Logout" : ""} 
          placement="right"
          TransitionProps={{ timeout: 0 }}
        >
          <ListItemButton 
            onClick={logout}
            className="nav-item"
            sx={{
              minHeight: 48,
              justifyContent: drawerOpen ? 'initial' : 'center',
              px: 2.5,
              margin: '4px 8px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(63, 114, 175, 0.08)',
              },
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: drawerOpen ? 3 : 'auto',
                justifyContent: 'center',
                color: 'error.main',
                transition: 'none',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {drawerOpen && (
              <ListItemText 
                primary="Logout"
                sx={{
                  '& span': {
                    transition: 'none !important',
                  }
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{
          width: '100%',
          ml: 0,
          backgroundImage: 'linear-gradient(to right, #3F72AF, #5E60CE)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 56 }, py: 0.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              YARBA
            </RouterLink>
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2, opacity: 0.9 }}>Welcome, {user.username}</Typography>
              <Avatar 
                sx={{ 
                  bgcolor: 'secondary.main',
                  width: 36,
                  height: 36,
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Responsive drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={isMobile ? toggleDrawer : undefined}
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          [`& .MuiDrawer-paper`]: { 
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            paddingTop: '56px', // Height of thinner AppBar
            height: '100%',
            ...(isMobile && !drawerOpen && { display: 'none' }),
            borderRight: 'none',
            background: 'linear-gradient(180deg, rgba(63, 114, 175, 0.02) 0%, rgba(155, 89, 182, 0.05) 100%)',
            zIndex: (theme) => theme.zIndex.drawer,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box 
        component="main" 
        className="fade-in"
        sx={{ 
          flexGrow: 1,
          p: 2, // Smaller padding
          pt: 3, // Keep top padding larger
          width: '100%',
          marginTop: '64px', // Height of AppBar
          marginLeft: '20px', // Fixed small margin regardless of drawer state
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          opacity: 0, // Start with opacity 0 for the fade-in animation
          animation: 'fadeIn 0.5s ease-out forwards 0.2s',
        }}
      >
        {children}
      </Box>

      {/* Floating toggle button */}
      <Fab
        size="small"
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          left: drawerOpen ? drawerWidth - 20 : 20,
          bottom: 20,
          zIndex: 1300,
          backgroundColor: '#3F72AF',
          color: 'white',
          transition: 'left 0.2s ease',
          '&:hover': {
            backgroundColor: '#2C5282',
          }
        }}
      >
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Fab>
    </Box>
  );
};

export default MainLayout; 
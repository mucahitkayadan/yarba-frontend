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
  Tooltip
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
        {navItems.map((item) => (
          <Tooltip 
            title={!drawerOpen ? item.text : ""} 
            placement="right" 
            key={item.text}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.18)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && <ListItemText primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        <Tooltip title={!drawerOpen ? "Logout" : ""} placement="right">
          <ListItemButton 
            onClick={logout}
            sx={{
              minHeight: 48,
              justifyContent: drawerOpen ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: drawerOpen ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Logout" />}
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 3,
          width: '100%'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              YARBA
            </RouterLink>
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
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
            marginTop: '64px', // Height of AppBar
            height: 'calc(100% - 64px)',
            ...(isMobile && !drawerOpen && { display: 'none' }),
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box 
        component="main" 
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
        }}
      >
        {children}
      </Box>

      {/* Floating toggle button */}
      <IconButton 
        onClick={toggleDrawer} 
        aria-label={drawerOpen ? "collapse sidebar" : "expand sidebar"}
        sx={{
          position: 'fixed',
          top: '120px', // Positioned between Dashboard and Resumes tabs
          left: isMobile ? 
                 (drawerOpen ? drawerWidth - 20 : 10) : 
                 (drawerOpen ? drawerWidth - 20 : miniDrawerWidth - 20),
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          zIndex: (theme) => theme.zIndex.drawer + 2,
          transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        size="small"
      >
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

export default MainLayout; 
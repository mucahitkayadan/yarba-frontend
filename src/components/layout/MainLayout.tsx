import React, { ReactNode, useState, useEffect } from 'react';
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
  Fab,
  Menu,
  MenuItem,
  Button
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
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Key as KeyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Login as LoginIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getUserProfile } from '../../services/profileService';
import { Profile } from '../../types/models';
import Footer from './Footer';

// Define navigation items
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Resumes', icon: <ResumeIcon />, path: '/resumes' },
  { text: 'Cover Letters', icon: <CoverLetterIcon />, path: '/cover-letters' },
  { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Website', icon: <LanguageIcon />, path: '/website' },
  // To add nested navigation in the future, we could use this structure:
  // { 
  //   text: 'Settings', 
  //   icon: <SettingsIcon />, 
  //   children: [
  //     { text: 'User Settings', icon: <AccountIcon />, path: '/user' },
  //     { text: 'Templates', icon: <TemplatesIcon />, path: '/templates' },
  //   ] 
  // },
];

interface MainLayoutProps {
  children: ReactNode;
  hideDrawer?: boolean;
}

const drawerWidth = 210;
const miniDrawerWidth = 65;

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideDrawer = false }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile && !hideDrawer);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imageVersion, setImageVersion] = useState<number>(Date.now());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fetch user profile to get profile picture if user is authenticated
    if (user) {
      fetchProfile();
    }
    if (hideDrawer) {
        setDrawerOpen(false);
    }
  }, [user, hideDrawer]);

  // Add a timer to refresh the image version periodically to catch updates
  useEffect(() => {
    // Update image version to force refresh
    setImageVersion(Date.now());
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      setImageVersion(Date.now());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await getUserProfile();
      setProfile(profileData);
      // Reset image error state to try loading the image again
      setImageError(false);
      // Force image refresh when profile is loaded
      setImageVersion(Date.now());
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const toggleDrawer = () => {
    if (!hideDrawer) {
        setDrawerOpen(!drawerOpen);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigate = () => {
    handleClose();
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
              onClick={() => {
                if (isMobile) {
                  setDrawerOpen(false);
                }
              }}
              selected={location.pathname === item.path}
              className="slide-up nav-item"
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                py: 1,
                ml: 1, // 8dp from left edge (16dp keyline)
                mr: 1, // 8dp from right edge
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                },
                animation: `slideUp 0.3s ease-out forwards ${index * 0.05 + 0.2}s`,
                opacity: 0,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  ml: drawerOpen ? 0 : 0, // Proper alignment when collapsed
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#E05B49' : 'rgba(255, 255, 255, 0.8)',
                  transition: 'none',
                  fontSize: '1.5rem',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: item.text.length > 10 ? '0.85rem' : '1rem',
                    letterSpacing: item.text.length > 10 ? '0' : '0.02em',
                    fontFamily: "'Dreaming Outloud Pro', cursive",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  sx={{
                    opacity: 1,
                    display: 'block',
                    color: '#ffffff',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                    '& span': {
                      transition: 'none !important',
                    },
                    maxWidth: '100%'
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Divider sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        my: 1, // 8dp padding above and below divider (1 = 8px in the default MUI theme)
      }} />
      <List>
        <Tooltip 
          title={!drawerOpen ? "Logout" : ""} 
          placement="right"
          TransitionProps={{ timeout: 0 }}
        >
          <ListItemButton 
            onClick={() => {
              if (isMobile) {
                setDrawerOpen(false);
              }
              signOut();
            }}
            className="nav-item"
            sx={{
              minHeight: 48,
              justifyContent: drawerOpen ? 'initial' : 'center',
              px: 2.5,
              margin: '4px 8px',
              ml: 1, // 8dp from left edge (16dp keyline)
              mr: 1, // 8dp from right edge
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: drawerOpen ? 2 : 'auto',
                ml: drawerOpen ? 0 : 0, // Proper alignment when collapsed
                justifyContent: 'center',
                color: '#E05B49',
                transition: 'none',
                fontSize: '1.5rem',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                }
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {drawerOpen && (
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  letterSpacing: '0.02em',
                  fontFamily: "'Dreaming Outloud Pro', cursive",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                sx={{
                  color: '#ffffff',
                  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                  '& span': {
                    transition: 'none !important',
                  },
                  maxWidth: '100%'
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            px: { xs: 1, sm: 2 } // Reduce horizontal padding on mobile for more space
          }}
        >
          {!hideDrawer && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: !user ? 'none' : { sm: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.svg" alt="YARBA Icon" style={{ height: '40px', width: 'auto', marginRight: '10px' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontFamily: "'Dreaming Outloud Pro', cursive",
                    fontWeight: 'bold',
                    color: 'white',
                    lineHeight: 1,
                  }}
                >
                  YARBA
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    fontFamily: "'Dreaming Outloud Pro', cursive",
                    color: 'white',
                    fontSize: '0.85rem',
                    opacity: 0.9,
                    lineHeight: 1,
                  }}
                >
                  Yet Another Resume Builder App
                </Typography>
              </Box>
            </RouterLink>
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                sx={{ 
                  mr: 2, 
                  opacity: 0.9,
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  fontFamily: "'Dreaming Outloud Pro', cursive",
                  fontSize: '1.1rem'
                }}
              >
                {profile?.personal_information?.full_name || user.username?.replace(/_[0-9]+$/, '').replace(/_/g, ' ') || 'User'}
              </Typography>
              {/* Avatar/Image that opens dropdown */}
              <Box
                onClick={handleProfileClick}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    cursor: 'pointer',
                  },
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                {profile?.profile_picture_key && !imageError ? (
                  <img 
                    src={`${process.env.REACT_APP_CLOUDFRONT_URL}${profile.profile_picture_key}?v=${imageVersion}`}
                    alt={profile?.personal_information?.full_name || "User profile"}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.warn('Profile image failed to load, using avatar fallback');
                      setImageError(true);
                    }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main',
                      width: '100%',
                      height: '100%',
                      fontSize: 18,
                    }}
                  >
                    {profile?.personal_information?.full_name?.charAt(0).toUpperCase() || 
                     user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                )}
              </Box>
              
              {/* Profile dropdown menu */}
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'profile-button',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {profile?.personal_information?.full_name || user.username}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                    {user.email || profile?.personal_information?.email || ''}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfileNavigate} component={RouterLink} to="/user">
                  <ListItemIcon sx={{ minWidth: '25px' }}>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Manage Your Account</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={signOut}>
                  <ListItemIcon sx={{ minWidth: '25px' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              component={RouterLink}
              to="/login"
              variant="contained"
              color="secondary"
              startIcon={<LoginIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: 'secondary.dark'
                },
                textTransform: 'none'
              }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Responsive drawer */}
      {!hideDrawer && user && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={isMobile ? toggleDrawer : undefined}
          keepMounted={false}
          disableScrollLock={true}
          ModalProps={{
            keepMounted: false,
            disableAutoFocus: true,
            disableEnforceFocus: true,
            disableRestoreFocus: true,
            disablePortal: true,
            hideBackdrop: !isMobile,
            BackdropProps: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Proper scrim opacity
              }
            }
          }}
          sx={{
            display: 'block',
            '& .MuiDrawer-paper': {
              position: 'fixed',
              width: isMobile ? 240 : (drawerOpen ? drawerWidth : miniDrawerWidth),
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
              paddingTop: isMobile ? '56px' : '64px', // Proper padding for header height
              marginTop: 0, // Ensure no additional margin
              height: '100%',
              backgroundColor: '#ffffff',
              backgroundImage: 'linear-gradient(to bottom right, rgb(142, 92, 150), rgb(122, 172, 216))',
              boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)', // 16dp elevation
              zIndex: theme.zIndex.drawer,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main content */}
      <Box 
        component="main" 
        className="fade-in"
        sx={{ 
          flexGrow: 1,
          p: 0,
          width: { 
            xs: '100%',
            md: (hideDrawer || !user) ? '100%' : (drawerOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)`)
          },
          marginTop: {
            xs: '56px', // Mobile header height
            sm: '56px', // Small tablets
            md: '64px'  // Desktop header height
          },
          marginLeft: {
            xs: 0, // Mobile: no margin
            md: (hideDrawer || !user) ? 0 : (drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`)
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          opacity: 0,
          animation: 'fadeIn 0.5s ease-out forwards 0.2s',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)', // Subtract the header height
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>

      {/* Floating toggle button - only visible on non-mobile and if drawer is not hidden and user is logged in */}
      {!isMobile && !hideDrawer && user && (
        <Fab
          size="small"
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            left: drawerOpen ? drawerWidth - 20 : miniDrawerWidth - 20,
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
      )}
    </Box>
  );
};

export default MainLayout; 
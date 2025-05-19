import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { 
  LoginPage, 
  RegisterPage, 
  DashboardPage, 
  ResumesPage, 
  PortfolioPage, 
  TemplatesPage,
  ProfilePage,
  ViewResumePage,
  FirebaseTestPage,
  CreateResumePage,
  ProfileEditPage,
  PortfolioCreatePage,
  PortfolioEditPage,
  PortfolioViewPage,
  UserPage,
  CoverLettersPage,
  CoverLetterNewPage,
  CoverLetterViewPage,
  AboutPage,
  // Import new pages from index.ts
  SupportPage,
  FAQPage,
  BlogPage,
  CareersPage,
  PrivacyPage,
  TermsPage,
  ContactPage,
  UploadPortfolioPage,
  MainPage,
} from './pages';
import PersonalInfoSetupPage from './pages/user/setup/PersonalInfoSetupPage';
import PromptPreferencesSetupPage from './pages/user/setup/PromptPreferencesSetupPage';
import SystemPreferencesSetupPage from './pages/user/setup/SystemPreferencesSetupPage';
import LifeStorySetupPage from './pages/user/setup/LifeStorySetupPage';
import PortfolioUploadPage from './pages/user/setup/PortfolioUploadPage';
import PortfolioReviewPage from './pages/user/setup/PortfolioReviewPage';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Typography } from '@mui/material';
import theme from './theme';
import { Box, CircularProgress } from '@mui/material';

// Note: We'll need to create these page components
// import ResumeEditPage from './pages/ResumeEditPage';
// import CoverLettersPage from './pages/CoverLettersPage';
// import CoverLetterEditPage from './pages/CoverLetterEditPage';
// import SettingsPage from './pages/SettingsPage';

// Root route component to handle conditional rendering based on auth state
const RootRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <MainLayout hideDrawer={true}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <MainLayout hideDrawer={true}>
      <MainPage />
    </MainLayout>
  );
};

const App: React.FC = () => {
  // Log environment variables on app initialization
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables check:');
      console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
      console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY);
      console.log('NODE_ENV:', process.env.NODE_ENV);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */} 
      <AuthProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              {/* Default Main Page Route with Layout */}
              <Route path="/" element={<RootRoute />} />

              {/* Public Routes - No Layout */}
              <Route path="/login" element={<LoginPage authMode="login" />} />
              <Route path="/register" element={<LoginPage authMode="register" />} />
              
              {/* User Setup Pages - No Drawer */}
              <Route 
                path="/user/setup/personal-info"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <PersonalInfoSetupPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              <Route 
                path="/user/setup/prompt-preferences"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <PromptPreferencesSetupPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              <Route 
                path="/user/setup/system-preferences"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <SystemPreferencesSetupPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              <Route 
                path="/user/setup/life-story"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <LifeStorySetupPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              <Route 
                path="/user/setup/portfolio-upload"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <PortfolioUploadPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              <Route 
                path="/user/setup/portfolio-review"
                element={(
                  <ProtectedRoute>
                    <MainLayout hideDrawer={true}>
                      <PortfolioReviewPage />
                    </MainLayout>
                  </ProtectedRoute>
                )}
              />
              
              {/* Public Pages with Layout */}
              <Route path="/about" element={
                <MainLayout>
                  <AboutPage />
                </MainLayout>
              } />
              
              <Route path="/support" element={
                <MainLayout>
                  <SupportPage />
                </MainLayout>
              } />
              
              <Route path="/faq" element={
                <MainLayout>
                  <FAQPage />
                </MainLayout>
              } />
              
              <Route path="/blog" element={
                <MainLayout>
                  <BlogPage />
                </MainLayout>
              } />
              
              <Route path="/careers" element={
                <MainLayout>
                  <CareersPage />
                </MainLayout>
              } />
              
              <Route path="/privacy" element={
                <MainLayout>
                  <PrivacyPage />
                </MainLayout>
              } />
              
              <Route path="/terms" element={
                <MainLayout>
                  <TermsPage />
                </MainLayout>
              } />
              
              <Route path="/contact" element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              } />

              {/* Protected Routes - Use MainLayout */}
              <Route 
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Firebase Test Page */}
              <Route 
                path="/firebase-test"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <FirebaseTestPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Resumes Management */}
              <Route 
                path="/resumes"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ResumesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/resumes/new"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateResumePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/resumes/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ViewResumePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/resumes/:id/edit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div>Edit Resume Page Placeholder</div>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Cover Letters Management */}
              <Route 
                path="/cover-letters"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CoverLettersPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/cover-letters/new"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CoverLetterNewPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/cover-letters/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CoverLetterViewPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/cover-letters/:id/edit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div>Edit Cover Letter Page Placeholder</div>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Portfolio Management */}
              <Route 
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PortfolioViewPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/portfolio/upload"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UploadPortfolioPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/portfolio/create"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PortfolioCreatePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/portfolio/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PortfolioViewPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/portfolio/:id/edit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PortfolioEditPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Templates */}
              <Route 
                path="/templates"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TemplatesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* User Profile */}
              <Route 
                path="/user"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfileEditPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect to dashboard if logged in, otherwise to login page */}
              <Route path="*" element={
                <Navigate to="/dashboard" />
              } />
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

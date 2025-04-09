import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
  FirebaseTestPage
} from './pages';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Typography } from '@mui/material';
import theme from './theme';

// Note: We'll need to create these page components
// import ResumeEditPage from './pages/ResumeEditPage';
// import CoverLettersPage from './pages/CoverLettersPage';
// import CoverLetterEditPage from './pages/CoverLetterEditPage';
// import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  // Log environment variables on app initialization
  React.useEffect(() => {
    console.log('Environment variables check:');
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY);
    console.log('NODE_ENV:', process.env.NODE_ENV);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */} 
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/login" element={<LoginPage authMode="login" />} />
            <Route path="/register" element={<LoginPage authMode="register" />} />

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
                    <div>Create Resume Page Placeholder</div>
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
                    <div>Cover Letters Page Placeholder</div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/cover-letters/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Create Cover Letter Page Placeholder</div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/cover-letters/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>View Cover Letter Page Placeholder</div>
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
                    <PortfolioPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Templates, Profile, Settings */}
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
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Settings Page Placeholder</div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root path to dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Not Found */}
            <Route path="*" element={
              <MainLayout>
                <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                  <Typography variant="h4">404 - Page Not Found</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    The page you're looking for doesn't exist.
                  </Typography>
                </div>
              </MainLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

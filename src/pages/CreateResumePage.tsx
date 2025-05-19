import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Container,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createResume } from '../services/resumeService';
import { getUserProfile } from '../services/profileService';
import { Resume, ResumeCreateRequest, Profile } from '../types/models';
import { Toast } from '../components/common';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resume-creation-tabpanel-${index}`}
      aria-labelledby={`resume-creation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '0 3px 3px 3px' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CreateResumePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [createdResume, setCreatedResume] = useState<Resume | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateResume = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the job description from either tab
      const finalJobDescription = tabValue === 0 ? jobDescription : jobDescriptionUrl;
      
      if (!finalJobDescription) {
        setError('Please provide a job description or URL.');
        setLoading(false);
        return;
      }

      // Prepare request data based on API requirements
      const resumeData: ResumeCreateRequest = {
        job_description: finalJobDescription
      };

      // Make the API request
      const response = await createResume(resumeData);
      
      // Set success toast and navigate to view resume page
      setToastMessage('Resume created successfully!');
      setToastSeverity('success');
      setToastOpen(true);
      
      // Navigate directly to the view resume page
      if (response && response.id) {
        navigate(`/resumes/${response.id}`);
      }

    } catch (err: any) {
      console.error('Failed to create resume:', err);
      setError(err.message || 'Failed to create resume. Please try again.');
      setToastMessage('Failed to create resume. Please try again.');
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleEditPreferences = () => {
    navigate('/profile/edit');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="resume creation tabs">
            <Tab label="Job Description" id="resume-creation-tab-0" />
            <Tab label="Job URL" id="resume-creation-tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TextField
            label="Job Description"
            multiline
            rows={8}
            fullWidth
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            variant="outlined"
            margin="normal"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TextField
            label="Job Posting URL"
            fullWidth
            value={jobDescriptionUrl}
            onChange={(e) => setJobDescriptionUrl(e.target.value)}
            placeholder="Enter the URL of the job posting..."
            variant="outlined"
            margin="normal"
            helperText="Please note: URL parsing functionality will be implemented later."
          />
        </TabPanel>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleCreateResume}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Resume'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Resume Preferences</Typography>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />} 
                onClick={handleEditPreferences}
                size="small"
              >
                Edit Preferences
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {profileLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Content Sections */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary">Content Limits</Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Career Summary:</Typography>
                      <Typography variant="body2">
                        {profile?.prompt_preferences?.career_summary?.min_words || 'Not set'} - {profile?.prompt_preferences?.career_summary?.max_words || 'Not set'} words
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Work Experience:</Typography>
                      <Typography variant="body2">
                        Max {profile?.prompt_preferences?.work_experience?.max_jobs || 'Not set'} jobs, {profile?.prompt_preferences?.work_experience?.bullet_points_per_job || 'Not set'} bullets each
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Projects:</Typography>
                      <Typography variant="body2">
                        Max {profile?.prompt_preferences?.project?.max_projects || 'Not set'} projects, {profile?.prompt_preferences?.project?.bullet_points_per_project || 'Not set'} bullets each
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Skills:</Typography>
                      <Typography variant="body2">
                        {profile?.prompt_preferences?.skills?.max_categories || 'Not set'} categories, {profile?.prompt_preferences?.skills?.min_per_category || 'Not set'}-{profile?.prompt_preferences?.skills?.max_per_category || 'Not set'} skills each
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Education:</Typography>
                      <Typography variant="body2">
                        Max {profile?.prompt_preferences?.education?.max_entries || 'Not set'} entries, {profile?.prompt_preferences?.education?.max_courses || 'Not set'} courses
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Awards:</Typography>
                      <Typography variant="body2">
                        Max {profile?.prompt_preferences?.awards?.max_awards || 'Not set'} awards
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Publications:</Typography>
                      <Typography variant="body2">
                        Max {profile?.prompt_preferences?.publications?.max_publications || 'Not set'} publications
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Cover Letter:</Typography>
                      <Typography variant="body2">
                        {profile?.prompt_preferences?.cover_letter?.paragraphs || 'Not set'} paragraphs, age {profile?.prompt_preferences?.cover_letter?.target_age || 'Not set'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Processing Preferences */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary">System Settings</Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Security Check:</Typography>
                      <Typography variant="body2">
                        {profile?.system_preferences?.features?.check_clearance ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Model:</Typography>
                      <Typography variant="body2">
                        {profile?.system_preferences?.llm?.model_name || 'Not set'} (Temperature: {profile?.system_preferences?.llm?.temperature || 'Default'})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Toast notification */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
    </Container>
  );
};

export default CreateResumePage; 
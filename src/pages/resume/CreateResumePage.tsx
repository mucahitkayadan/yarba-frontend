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
import { createResume, extractJobDetails, JobExtractionDetails } from '../../services/resumeService';
import { getUserProfile } from '../../services/profileService';
import { Resume, ResumeCreateRequest, Profile } from '../../types/models';
import { Toast } from '../../components/common';
import { Settings as SettingsIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

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
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [extractedJobDetails, setExtractedJobDetails] = useState<JobExtractionDetails | null>(null);
  const [isJobExtracted, setIsJobExtracted] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

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
    setExtractionError(null);
  };

  const handleExtractJobDetails = async () => {
    if (!jobDescriptionUrl) {
      setExtractionError('Please enter a Job Posting URL.');
      setToastMessage('Please enter a Job Posting URL.');
      setToastSeverity('error');
      setToastOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    setExtractionError(null);
    try {
      const details = await extractJobDetails(jobDescriptionUrl);
      setExtractedJobDetails(details);

      if (details.description && details.description.trim() !== '') {
        setJobDescription(details.description);
        setIsJobExtracted(true);
        setToastMessage('Job details extracted successfully! Review below or switch to "Job Description" tab to edit.');
        setToastSeverity('success');
      } else {
        setIsJobExtracted(false);
        const errorMsg = `Successfully contacted URL, but could not extract a usable job description. ${details.title ? 'Title found: ' + details.title + '.' : ''} Please try pasting the description manually or check the URL.`;
        setExtractionError(errorMsg);
        setToastMessage(errorMsg);
        setToastSeverity('warning');
      }
      setToastOpen(true);
    } catch (err: any) {
      console.error('Failed to extract job details:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to extract job details.';
      setExtractionError(errorMessage);
      setIsJobExtracted(false);
      setToastMessage(errorMessage);
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    setLoading(true);
    setError(null);

    let jobDescToUse: string | undefined | null = null;

    if (tabValue === 0) {
      jobDescToUse = jobDescription;
      if (!jobDescToUse || jobDescToUse.trim() === '') {
        setError('Please provide a job description.');
        setToastMessage('Job description is missing or empty.');
        setToastSeverity('error');
        setToastOpen(true);
        setLoading(false);
        return;
      }
    } else if (tabValue === 1) {
      if (!isJobExtracted || !extractedJobDetails?.description) {
        setError('Extracted job description is not available. Please extract again or enter manually.');
        setToastMessage('Extracted job description is not available.');
        setToastSeverity('error');
        setToastOpen(true);
        setLoading(false);
        return;
      }
      jobDescToUse = extractedJobDetails.description;
    }

    if (!jobDescToUse || jobDescToUse.trim() === '') {
      setError('Job description is missing or empty.');
      setToastMessage('Job description is missing or empty.');
      setToastSeverity('error');
      setToastOpen(true);
      setLoading(false);
      return;
    }
    
    try {
      const resumeData: ResumeCreateRequest = {
        job_description: jobDescToUse
      };
      const response = await createResume(resumeData);
      setToastMessage('Resume created successfully!');
      setToastSeverity('success');
      setToastOpen(true);
      if (response && response.id) {
        navigate(`/resumes/${response.id}`);
      }
    } catch (err: any) {
      console.error('Failed to create resume:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create resume. Please try again.';
      setError(errorMsg);
      setToastMessage(errorMsg);
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
            onChange={(e) => {
              setJobDescription(e.target.value);
              if(isJobExtracted) {
                setIsJobExtracted(false);
                setExtractedJobDetails(null);
              }
            }}
            placeholder="Paste the job description here, or extract it from a URL in the 'Job URL' tab."
            variant="outlined"
            margin="normal"
          />
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCreateResume}
              disabled={loading || !jobDescription.trim()}
            >
              {loading && tabValue === 0 ? <CircularProgress size={24} /> : 'Create Resume'}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {!isJobExtracted ? (
            <>
              <TextField
                label="Job Posting URL"
                fullWidth
                value={jobDescriptionUrl}
                onChange={(e) => setJobDescriptionUrl(e.target.value)}
                placeholder="Enter the URL of the job posting..."
                variant="outlined"
                margin="normal"
                helperText="We'll try to extract the job description from this URL."
                disabled={loading}
              />
              <Box sx={{ mt: 3, mb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={handleExtractJobDetails}
                  disabled={loading || !jobDescriptionUrl.trim()}
                >
                  {loading && !extractionError ? <CircularProgress size={24} /> : 'Extract Job Details'}
                </Button>
              </Box>
              {extractionError && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {extractionError}
                </Alert>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Extracted Job Details
              </Typography>
              {extractedJobDetails?.title && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Title:</strong> {extractedJobDetails.title}
                </Typography>
              )}
              <Paper elevation={1} sx={{ p: 2, my: 2, maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
                <ReactMarkdown>{extractedJobDetails!.description!}</ReactMarkdown>
              </Paper>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleCreateResume}
                  disabled={loading}
                >
                  {loading && tabValue === 1 ? <CircularProgress size={24} /> : 'Create Resume with this Description'}
                </Button>
              </Box>

              <Box sx={{ mt: 1, mb: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setIsJobExtracted(false);
                    setExtractedJobDetails(null);
                    setJobDescription('');
                    setJobDescriptionUrl('');
                    setExtractionError(null);
                  }}
                  disabled={loading}
                >
                  Extract Different URL
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => {
                    setTabValue(0);
                  }}
                  disabled={loading}
                >
                  Edit Manually
                </Button>
              </Box>
            </>
          )}
        </TabPanel>
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
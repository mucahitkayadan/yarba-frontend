import React, { useState } from 'react';
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
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createResume } from '../services/resumeService';
import { Resume, ResumeCreateRequest } from '../types/models';

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CreateResumePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [createdResume, setCreatedResume] = useState<Resume | null>(null);

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
        title: "Resume for " + new Date().toLocaleDateString(),
        job_description: finalJobDescription
      };

      // Make the API request
      const response = await createResume(resumeData);
      
      // Set the created resume data for display
      setCreatedResume(response);
      setSuccess(true);
      
      // Clear form after successful creation
      setJobDescription('');
      setJobDescriptionUrl('');

    } catch (err: any) {
      console.error('Failed to create resume:', err);
      setError(err.message || 'Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (createdResume && createdResume.id) {
      navigate(`/resumes/${createdResume.id}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3, mb: 3 }}>

        {createdResume ? (
          <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Resume created successfully!
            </Alert>
            <Typography variant="h6" gutterBottom>
              {createdResume.title || 'New Resume'}
            </Typography>
            {createdResume.job_title && (
              <Typography variant="body1" gutterBottom>
                Job Title: {createdResume.job_title}
              </Typography>
            )}
            {createdResume.company_name && (
              <Typography variant="body1" gutterBottom>
                Company: {createdResume.company_name}
              </Typography>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleViewResume}
              sx={{ mt: 2 }}
            >
              View Resume
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => setCreatedResume(null)}
              sx={{ mt: 2, ml: 2 }}
            >
              Create Another Resume
            </Button>
          </Box>
        ) : (
          <>
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
          </>
        )}
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateResumePage; 
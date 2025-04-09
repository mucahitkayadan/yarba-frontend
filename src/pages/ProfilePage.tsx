import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/profileService';
import { Profile } from '../types/models';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfile(response);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Profile Information
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            Unable to load your profile information. Please try refreshing the page.
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Profile
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
        >
          Edit Profile
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" id="profile-tab-0" />
            <Tab label="Preferences" id="profile-tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
            <Box sx={{ mr: { md: 4 }, mb: { xs: 3, md: 0 }, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  fontSize: 40,
                  bgcolor: 'primary.main',
                  mx: 'auto'
                }}
              >
                {profile.personal_information?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </Avatar>
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {profile.personal_information?.full_name}
              </Typography>
              
              <Typography variant="body1" gutterBottom color="text.secondary">
                {profile.personal_information?.email}
              </Typography>
              
              {profile.personal_information?.phone && (
                <Typography variant="body1" gutterBottom>
                  📱 {profile.personal_information.phone}
                </Typography>
              )}
              
              {profile.personal_information?.location && (
                <Typography variant="body1" gutterBottom>
                  📍 {profile.personal_information.location}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Professional Links
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {profile.personal_information?.linkedin ? (
              <Chip 
                label="LinkedIn" 
                component="a" 
                href={profile.personal_information.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ) : (
              <Chip label="LinkedIn" disabled variant="outlined" />
            )}
            
            {profile.personal_information?.github ? (
              <Chip 
                label="GitHub" 
                component="a" 
                href={profile.personal_information.github}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ) : (
              <Chip label="GitHub" disabled variant="outlined" />
            )}
            
            {profile.personal_information?.website ? (
              <Chip 
                label="Website" 
                component="a" 
                href={profile.personal_information.website}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            ) : (
              <Chip label="Website" disabled variant="outlined" />
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Life Story
          </Typography>
          {profile.life_story ? (
            <Typography variant="body1" paragraph>
              {profile.life_story}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No life story provided. Add your career journey, motivations, and aspirations to help the AI better understand you.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Career Summary Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Career Summary
              </Typography>
              <Typography variant="body2">
                Minimum Words: {profile.preferences?.career_summary_details?.min_words || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Maximum Words: {profile.preferences?.career_summary_details?.max_words || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Work Experience Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Work Experience
              </Typography>
              <Typography variant="body2">
                Maximum Jobs: {profile.preferences?.work_experience_details?.max_jobs || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Bullet Points Per Job: {profile.preferences?.work_experience_details?.bullet_points_per_job || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Project Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Projects
              </Typography>
              <Typography variant="body2">
                Maximum Projects: {profile.preferences?.project_details?.max_projects || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Bullet Points Per Project: {profile.preferences?.project_details?.bullet_points_per_project || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Skills Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Skills
              </Typography>
              <Typography variant="body2">
                Maximum Categories: {profile.preferences?.skills_details?.max_categories || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Min Skills Per Category: {profile.preferences?.skills_details?.min_skills_per_category || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Max Skills Per Category: {profile.preferences?.skills_details?.max_skills_per_category || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Education Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Education
              </Typography>
              <Typography variant="body2">
                Maximum Entries: {profile.preferences?.education_details?.max_entries || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Maximum Courses: {profile.preferences?.education_details?.max_courses || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Cover Letter Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Cover Letter
              </Typography>
              <Typography variant="body2">
                Paragraphs: {profile.preferences?.cover_letter_details?.paragraphs || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Target Grade Level: {profile.preferences?.cover_letter_details?.target_grade_level || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Other Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Other Sections
              </Typography>
              <Typography variant="body2">
                Maximum Awards: {profile.preferences?.awards_details?.max_awards || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Maximum Publications: {profile.preferences?.publications_details?.max_publications || 'Not set'}
              </Typography>
            </Paper>
            
            {/* AI Settings */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Settings
              </Typography>
              <Typography variant="body2">
                Model Type: {profile.preferences?.llm_preferences?.model_type || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Model Name: {profile.preferences?.llm_preferences?.model_name || 'Not set'}
              </Typography>
              <Typography variant="body2">
                Temperature: {profile.preferences?.llm_preferences?.temperature || 'Not set'}
              </Typography>
            </Paper>
            
            {/* Feature Preferences */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                Feature Preferences
              </Typography>
              <Typography variant="body2">
                Dark Mode: {profile.preferences?.feature_preferences?.dark_mode ? 'Enabled' : 'Disabled'}
              </Typography>
              <Typography variant="body2">
                Auto Save: {profile.preferences?.feature_preferences?.auto_save ? 'Enabled' : 'Disabled'}
              </Typography>
              <Typography variant="body2">
                Check Clearance: {profile.preferences?.feature_preferences?.check_clearance ? 'Enabled' : 'Disabled'}
              </Typography>
            </Paper>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 
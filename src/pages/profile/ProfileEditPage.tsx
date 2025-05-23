import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Tabs,
  Tab,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { 
  getUserProfile, 
  updatePersonalInformation,
  updateLifeStory,
  updatePromptPreferences,
  updateSystemPreferences
} from '../../services/profileService';
import { Profile } from '../../types/models';

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
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: ''
  });
  
  const [lifeStory, setLifeStory] = useState('');
  
  const [preferences, setPreferences] = useState({
    career_summary_min_words: '',
    career_summary_max_words: '',
    work_experience_max_jobs: '',
    work_experience_bullet_points_per_job: '',
    project_max_projects: '',
    project_bullet_points_per_project: '',
    cover_letter_paragraphs: '',
    cover_letter_target_age: '',
    skills_max_categories: '',
    skills_min_per_category: '',
    skills_max_per_category: '',
    education_max_entries: '',
    education_max_courses: '',
    awards_max_awards: '',
    publications_max_publications: '',
    feature_check_clearance: true,
    feature_auto_save: true,
    feature_dark_mode: false,
    default_resume_template_id: 'classic',
    default_cover_letter_template_id: 'standard',
    llm_model_name: '',
    llm_temperature: '0.1',
  });
  
  // Helper function to safely parse number values
  const parseNumberOrDefault = (value: string, defaultValue: number = 0): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setError(null);
    
    try {
      const profileData = await getUserProfile();
      setProfile(profileData);
      
      // Initialize personal info form
      if (profileData.personal_information) {
        setPersonalInfo({
          full_name: profileData.personal_information.full_name || '',
          email: profileData.personal_information.email || '',
          phone: profileData.personal_information.phone || '',
          address: profileData.personal_information.address || '',
          linkedin: profileData.personal_information.linkedin || '',
          github: profileData.personal_information.github || '',
          website: profileData.personal_information.website || ''
        });
      }
      
      // Initialize life story
      setLifeStory(profileData.life_story || '');
      
      // Initialize preferences form
      if (profileData.prompt_preferences || profileData.system_preferences) {
        setPreferences({
          career_summary_min_words: profileData.prompt_preferences?.career_summary?.min_words?.toString() || '',
          career_summary_max_words: profileData.prompt_preferences?.career_summary?.max_words?.toString() || '',
          work_experience_max_jobs: profileData.prompt_preferences?.work_experience?.max_jobs?.toString() || '',
          work_experience_bullet_points_per_job: profileData.prompt_preferences?.work_experience?.bullet_points_per_job?.toString() || '',
          project_max_projects: profileData.prompt_preferences?.project?.max_projects?.toString() || '',
          project_bullet_points_per_project: profileData.prompt_preferences?.project?.bullet_points_per_project?.toString() || '',
          cover_letter_paragraphs: profileData.prompt_preferences?.cover_letter?.paragraphs?.toString() || '',
          cover_letter_target_age: profileData.prompt_preferences?.cover_letter?.target_age?.toString() || '',
          skills_max_categories: profileData.prompt_preferences?.skills?.max_categories?.toString() || '',
          skills_min_per_category: profileData.prompt_preferences?.skills?.min_per_category?.toString() || '',
          skills_max_per_category: profileData.prompt_preferences?.skills?.max_per_category?.toString() || '',
          education_max_entries: profileData.prompt_preferences?.education?.max_entries?.toString() || '',
          education_max_courses: profileData.prompt_preferences?.education?.max_courses?.toString() || '',
          awards_max_awards: profileData.prompt_preferences?.awards?.max_awards?.toString() || '',
          publications_max_publications: profileData.prompt_preferences?.publications?.max_publications?.toString() || '',
          feature_check_clearance: profileData.system_preferences?.features?.check_clearance !== undefined ? profileData.system_preferences.features.check_clearance : true,
          feature_auto_save: profileData.system_preferences?.features?.auto_save !== undefined ? profileData.system_preferences.features.auto_save : true,
          feature_dark_mode: profileData.system_preferences?.features?.dark_mode !== undefined ? profileData.system_preferences.features.dark_mode : false,
          llm_model_name: profileData.system_preferences?.llm?.model_name || '',
          llm_temperature: profileData.system_preferences?.llm?.temperature?.toString() || '0.1',
          default_resume_template_id: profileData.system_preferences?.templates?.default_resume_template_id || 'classic',
          default_cover_letter_template_id: profileData.system_preferences?.templates?.default_cover_letter_template_id || 'standard',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLifeStoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLifeStory(e.target.value);
  };

  const handlePreferenceChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    setPreferences(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (tabValue === 0) {
        // Update personal information
        const personalInfoData = {
          full_name: personalInfo.full_name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          address: personalInfo.address,
          linkedin: personalInfo.linkedin,
          github: personalInfo.github,
          website: personalInfo.website
        };
        
        await updatePersonalInformation(personalInfoData);
        setSuccess('Personal information updated successfully!');
        navigate('/profile');
      } else if (tabValue === 1) {
        // Update life story
        await updateLifeStory(lifeStory);
        setSuccess('Life story updated successfully!');
        navigate('/profile');
      } else if (tabValue === 2) {
        await handleSavePreferences();
      }
      
      // Refresh profile data
      await fetchProfile();
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      setError(null);

      const promptPreferencesData: Partial<NonNullable<Profile['prompt_preferences']>> = {
        career_summary: {
          min_words: parseNumberOrDefault(preferences.career_summary_min_words),
          max_words: parseNumberOrDefault(preferences.career_summary_max_words)
        },
        work_experience: {
          max_jobs: parseNumberOrDefault(preferences.work_experience_max_jobs),
          bullet_points_per_job: parseNumberOrDefault(preferences.work_experience_bullet_points_per_job)
        },
        project: {
          max_projects: parseNumberOrDefault(preferences.project_max_projects),
          bullet_points_per_project: parseNumberOrDefault(preferences.project_bullet_points_per_project)
        },
        skills: {
          max_categories: parseNumberOrDefault(preferences.skills_max_categories),
          min_per_category: parseNumberOrDefault(preferences.skills_min_per_category),
          max_per_category: parseNumberOrDefault(preferences.skills_max_per_category)
        },
        education: {
          max_entries: parseNumberOrDefault(preferences.education_max_entries),
          max_courses: parseNumberOrDefault(preferences.education_max_courses)
        },
        cover_letter: {
          paragraphs: parseNumberOrDefault(preferences.cover_letter_paragraphs),
          target_age: parseNumberOrDefault(preferences.cover_letter_target_age)
        },
        awards: {
          max_awards: parseNumberOrDefault(preferences.awards_max_awards)
        },
        publications: {
          max_publications: parseNumberOrDefault(preferences.publications_max_publications)
        }
      };

      const systemPreferencesData: Partial<NonNullable<Profile['system_preferences']>> = {
        features: {
          check_clearance: preferences.feature_check_clearance,
          auto_save: preferences.feature_auto_save,
          dark_mode: preferences.feature_dark_mode
        },
        llm: {
          model_name: preferences.llm_model_name,
          temperature: parseFloat(preferences.llm_temperature)
        },
        templates: {
          default_resume_template_id: preferences.default_resume_template_id,
          default_cover_letter_template_id: preferences.default_cover_letter_template_id
        }
      };
      
      // Preserve existing privacy and notification settings from the full profile if they exist
      if (profile?.system_preferences?.privacy) {
        systemPreferencesData.privacy = profile.system_preferences.privacy;
      }
      if (profile?.system_preferences?.notifications) {
        systemPreferencesData.notifications = profile.system_preferences.notifications;
      }

      await updatePromptPreferences(promptPreferencesData);
      await updateSystemPreferences(systemPreferencesData);
      
      setSuccess('Preferences updated successfully!');
    } catch (err: any) {
      console.error('Failed to update preferences:', err);
      setError('Failed to update preferences. ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Unable to load profile information. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile edit tabs">
            <Tab label="Personal Information" id="profile-tab-0" />
            <Tab label="Life Story" id="profile-tab-1" />
            <Tab label="Preferences" id="profile-tab-2" />
          </Tabs>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit}>
          {/* Personal Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={personalInfo.full_name}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                  required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                  required
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Professional Links
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedin"
                  value={personalInfo.linkedin}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                  placeholder="https://linkedin.com/in/username"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="GitHub"
                  name="github"
                  value={personalInfo.github}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                  placeholder="https://github.com/username"
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  label="Personal Website"
                  name="website"
                  value={personalInfo.website}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                  placeholder="https://example.com"
                />
              </Box>
            </Stack>
          </TabPanel>
          
          {/* Life Story Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="subtitle1" gutterBottom>
              Life Story
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Your life story helps build better resume content and cover letters. Share your career journey, motivations, and aspirations. This information helps the AI better understand you when generating documents.
            </Typography>
            
            <TextField
              fullWidth
              label="Life Story"
              name="life_story"
              value={lifeStory}
              onChange={handleLifeStoryChange}
              margin="normal"
              multiline
              rows={10}
              placeholder="Tell us about your career journey, professional interests, and aspirations..."
            />
          </TabPanel>
          
          {/* Preferences Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="subtitle1" gutterBottom>
              Career Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Words"
                  name="career_summary_min_words"
                  value={preferences.career_summary_min_words}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 100
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Words"
                  name="career_summary_max_words"
                  value={preferences.career_summary_max_words}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 500
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Jobs"
                  name="work_experience_max_jobs"
                  value={preferences.work_experience_max_jobs}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bullet Points Per Job"
                  name="work_experience_bullet_points_per_job"
                  value={preferences.work_experience_bullet_points_per_job}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Projects
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Projects"
                  name="project_max_projects"
                  value={preferences.project_max_projects}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bullet Points Per Project"
                  name="project_bullet_points_per_project"
                  value={preferences.project_bullet_points_per_project}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Skills
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Categories"
                  name="skills_max_categories"
                  value={preferences.skills_max_categories}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Skills Per Category"
                  name="skills_min_per_category"
                  value={preferences.skills_min_per_category}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
            </Stack>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Skills Per Category"
                  name="skills_max_per_category"
                  value={preferences.skills_max_per_category}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 20
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Education
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Entries"
                  name="education_max_entries"
                  value={preferences.education_max_entries}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 5
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Courses"
                  name="education_max_courses"
                  value={preferences.education_max_courses}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Cover Letter
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Paragraphs"
                  name="cover_letter_paragraphs"
                  value={preferences.cover_letter_paragraphs}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Target Age"
                  name="cover_letter_target_age"
                  value={preferences.cover_letter_target_age}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 100
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Other Sections
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Awards"
                  name="awards_max_awards"
                  value={preferences.awards_max_awards}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Publications"
                  name="publications_max_publications"
                  value={preferences.publications_max_publications}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0,
                    max: 10
                  }}
                />
              </Box>
            </Stack>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Feature Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormGroup>
              <FormControlLabel 
                control={<Switch 
                  checked={preferences.feature_check_clearance}
                  onChange={handleSwitchChange}
                  name="feature_check_clearance"
                />} 
                label="Check Clearance" 
              />
              <FormControlLabel 
                control={<Switch 
                  checked={preferences.feature_auto_save}
                  onChange={handleSwitchChange}
                  name="feature_auto_save"
                />} 
                label="Auto Save" 
              />
              <FormControlLabel 
                control={<Switch 
                  checked={preferences.feature_dark_mode}
                  onChange={handleSwitchChange}
                  name="feature_dark_mode"
                />} 
                label="Dark Mode" 
              />
            </FormGroup>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Default Templates
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={1} sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Default Resume Template</InputLabel>
                <Select
                  name="default_resume_template_id"
                  value={preferences.default_resume_template_id}
                  label="Default Resume Template"
                  onChange={handlePreferenceChange}
                >
                  <MenuItem value="classic">Classic</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="elegant">Elegant</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Default Cover Letter Template</InputLabel>
                <Select
                  name="default_cover_letter_template_id"
                  value={preferences.default_cover_letter_template_id}
                  label="Default Cover Letter Template"
                  onChange={handlePreferenceChange}
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="creative">Creative</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </TabPanel>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileEditPage; 
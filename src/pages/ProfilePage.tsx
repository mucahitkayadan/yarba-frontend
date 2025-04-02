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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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

interface ProfileData {
  _id: string;
  user_id: string;
  personal_information: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  signature?: string;
  life_story?: string;
  supported_api_keys: string[];
  api_keys: Record<string, string>;
  preferences: {
    project_details: {
      max_projects: number;
      bullet_points_per_project: number;
    };
    work_experience_details: {
      max_jobs: number;
      bullet_points_per_job: number;
    };
    skills_details: {
      max_categories: number;
      min_skills_per_category: number;
      max_skills_per_category: number;
    };
    career_summary_details: {
      min_words: number;
      max_words: number;
    };
    education_details: {
      max_entries: number;
      max_courses: number;
    };
    cover_letter_details: {
      paragraphs: number;
      target_age: number;
    };
    awards_details: {
      max_awards: number;
    };
    publications_details: {
      max_publications: number;
    };
    feature_preferences: {
      check_clearance: boolean;
      auto_save: boolean;
      dark_mode: boolean;
    };
    llm_preferences: {
      model_type: string;
      model_name: string;
      temperature: number;
    };
    section_preferences: Record<string, string>;
    latex_template_preferences: {
      resume_template: string;
      cover_letter_template: string;
    };
    default_latex_templates: {
      default_cover_letter_template_id: string;
      default_resume_template_id: string;
    };
  };
  created_at: string;
  updated_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  
  const [personalInfoForm, setPersonalInfoForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: ''
  });

  const [preferencesForm, setPreferencesForm] = useState({
    llm_model_type: '',
    llm_model_name: '',
    llm_temperature: 0.1,
    resume_template: '',
    cover_letter_template: ''
  });

  const [lifeStory, setLifeStory] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await api.get('/profiles/me');
        setProfile(response.data);
        
        // Initialize form data
        if (response.data.personal_information) {
          setPersonalInfoForm({
            full_name: response.data.personal_information.full_name || '',
            email: response.data.personal_information.email || '',
            phone: response.data.personal_information.phone || '',
            address: response.data.personal_information.address || '',
            linkedin: response.data.personal_information.linkedin || '',
            github: response.data.personal_information.github || '',
            website: response.data.personal_information.website || ''
          });
        }
        
        if (response.data.preferences) {
          setPreferencesForm({
            llm_model_type: response.data.preferences.llm_preferences?.model_type || '',
            llm_model_name: response.data.preferences.llm_preferences?.model_name || '',
            llm_temperature: response.data.preferences.llm_preferences?.temperature || 0.1,
            resume_template: response.data.preferences.latex_template_preferences?.resume_template || '',
            cover_letter_template: response.data.preferences.latex_template_preferences?.cover_letter_template || ''
          });
        }
        
        setLifeStory(response.data.life_story || '');
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferencesForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPreferencesForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLifeStoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLifeStory(e.target.value);
  };

  const updateLifeStory = async (storyText: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Updating life story:", storyText);
      const response = await api.patch('/profiles/me/life-story', { life_story: storyText });
      console.log("Life story update response:", response.data);
      setProfile(response.data);
      setSuccess('Life story updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Failed to update life story:', err);
      setError('Failed to update life story. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInformation = async (personalInfo: typeof personalInfoForm) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Updating personal information:", personalInfo);
      const response = await api.patch('/profiles/me/personal-information', personalInfo);
      console.log("Personal information update response:", response.data);
      setProfile(response.data);
      setSuccess('Personal information updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Failed to update personal information:', err);
      setError('Failed to update personal information. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: typeof preferencesForm) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Updating preferences:", preferences);
      const preferencesData = {
        llm_preferences: {
          model_type: preferences.llm_model_type,
          model_name: preferences.llm_model_name,
          temperature: preferences.llm_temperature
        },
        latex_template_preferences: {
          resume_template: preferences.resume_template,
          cover_letter_template: preferences.cover_letter_template
        }
      };
      const response = await api.patch('/profiles/me/preferences', preferencesData);
      console.log("Preferences update response:", response.data);
      setProfile(response.data);
      setSuccess('Preferences updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Failed to update preferences:', err);
      setError('Failed to update preferences. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Use specialized endpoints based on active tab
    if (tabValue === 0) {
      // Personal Information tab
      const success = await updatePersonalInformation(personalInfoForm);
      if (success) {
        setEditMode(false);
        return;
      }
    } else if (tabValue === 1) {
      // Life Story tab
      const success = await updateLifeStory(lifeStory);
      if (success) {
        setEditMode(false);
        return;
      }
    } else if (tabValue === 2) {
      // Preferences tab
      const success = await updatePreferences(preferencesForm);
      if (success) {
        setEditMode(false);
        return;
      }
    } else {
      // API Keys tab - no editable content
      setEditMode(false);
      return;
    }
    
    // Fallback to updating the entire profile if specialized endpoints fail
    try {
      // Create update payload based on the active tab
      let updateData: any = {};
      
      if (tabValue === 0) {
        updateData.personal_information = {
          full_name: personalInfoForm.full_name,
          email: personalInfoForm.email,
          phone: personalInfoForm.phone,
          address: personalInfoForm.address,
          linkedin: personalInfoForm.linkedin,
          github: personalInfoForm.github,
          website: personalInfoForm.website
        };
      } else if (tabValue === 1) {
        updateData.life_story = lifeStory;
      } else if (tabValue === 2) {
        updateData.preferences = {
          ...profile?.preferences,
          llm_preferences: {
            model_type: preferencesForm.llm_model_type,
            model_name: preferencesForm.llm_model_name,
            temperature: preferencesForm.llm_temperature
          },
          latex_template_preferences: {
            resume_template: preferencesForm.resume_template,
            cover_letter_template: preferencesForm.cover_letter_template
          }
        };
      }
      
      console.log("Fallback: Sending update with data:", updateData);
      const updateResponse = await api.patch('/profiles/me', updateData);
      console.log("Update response:", updateResponse.data);
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Refresh profile data
      const refreshResponse = await api.get('/profiles/me');
      console.log("Refresh response:", refreshResponse.data);
      setProfile(refreshResponse.data);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset success message when entering edit mode
    if (!editMode) {
      setSuccess(null);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Unable to load profile information. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ml: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Profile
        </Typography>
        
        <Button
          variant="outlined"
          color={editMode ? "secondary" : "primary"}
          startIcon={editMode ? <SaveIcon /> : <EditIcon />}
          onClick={toggleEditMode}
          disabled={loading}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
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

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" id="profile-tab-0" />
            <Tab label="Life Story" id="profile-tab-1" />
            <Tab label="Preferences" id="profile-tab-2" />
            <Tab label="API Keys" id="profile-tab-3" />
          </Tabs>
        </Box>

        {editMode ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TabPanel value={tabValue} index={0}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Full Name"
                    name="full_name"
                    value={personalInfoForm.full_name}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                  required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                    value={personalInfoForm.email}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                    required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                    value={personalInfoForm.phone}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                    label="Address"
                    name="address"
                    value={personalInfoForm.address}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                    label="LinkedIn"
                    name="linkedin"
                    value={personalInfoForm.linkedin}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                    label="GitHub"
                    name="github"
                    value={personalInfoForm.github}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                    value={personalInfoForm.website}
                    onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TextField
                  fullWidth
                label="Life Story"
                name="life_story"
                value={lifeStory}
                onChange={handleLifeStoryChange}
                  margin="normal"
                  multiline
                rows={8}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>LLM Preferences</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
                mb: 4
              }}>
                <Box>
                  <FormControl 
                    fullWidth 
                    margin="normal"
                  >
                    <InputLabel id="model-type-label">Model Type</InputLabel>
                    <Select
                      labelId="model-type-label"
                      name="llm_model_type"
                      value={preferencesForm.llm_model_type}
                      label="Model Type"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="Claude">Claude</MenuItem>
                      <MenuItem value="GPT">GPT</MenuItem>
                      <MenuItem value="Gemini">Gemini</MenuItem>
                      <MenuItem value="Mistral">Mistral</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Model Name"
                    name="llm_model_name"
                    value={preferencesForm.llm_model_name}
                    onChange={handlePreferenceChange}
                    margin="normal"
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Temperature"
                    name="llm_temperature"
                    type="number"
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    value={preferencesForm.llm_temperature}
                    onChange={handlePreferenceChange}
                    margin="normal"
                  />
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>LaTeX Template Preferences</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
                mb: 4
              }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Resume Template"
                    name="resume_template"
                    value={preferencesForm.resume_template}
                    onChange={handlePreferenceChange}
                    margin="normal"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Cover Letter Template"
                    name="cover_letter_template"
                    value={preferencesForm.cover_letter_template}
                    onChange={handlePreferenceChange}
                    margin="normal"
                  />
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="subtitle1" gutterBottom>
                Supported API Keys:
              </Typography>
              <Box sx={{ mb: 3 }}>
                {profile.supported_api_keys.map((key) => (
                  <Chip 
                    key={key} 
                    label={key} 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                API key management is only available via settings page
              </Typography>
            </TabPanel>

            <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
                <Box sx={{ mr: { xs: 0, sm: 4 }, mb: { xs: 3, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Avatar
                    src="/default-avatar.png"
                    alt={profile.personal_information.full_name}
                    sx={{ width: 120, height: 120, mx: { xs: 'auto', sm: 0 } }}
                  />
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5">{profile.personal_information.full_name}</Typography>
                  <Typography variant="body1" color="text.secondary">{profile.personal_information.email}</Typography>
                  
                  {profile.personal_information.phone && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Phone: {profile.personal_information.phone}
                    </Typography>
                  )}
                  
                  {profile.personal_information.address && (
                    <Typography variant="body2">
                      Address: {profile.personal_information.address}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>Contact & Social Links</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                {profile.personal_information.linkedin && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>LinkedIn</Typography>
                    <Typography variant="body2" component="a" href={profile.personal_information.linkedin} target="_blank" sx={{ color: 'primary.main' }}>
                      {profile.personal_information.linkedin}
                    </Typography>
                  </Box>
                )}
                
                {profile.personal_information.github && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>GitHub</Typography>
                    <Typography variant="body2" component="a" href={profile.personal_information.github} target="_blank" sx={{ color: 'primary.main' }}>
                      {profile.personal_information.github}
                    </Typography>
                  </Box>
                )}
                
                {profile.personal_information.website && (
          <Box>
                    <Typography variant="subtitle2" gutterBottom>Website</Typography>
                    <Typography variant="body2" component="a" href={profile.personal_information.website} target="_blank" sx={{ color: 'primary.main' }}>
                      {profile.personal_information.website}
                    </Typography>
                  </Box>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Life Story</Typography>
            <Typography variant="body1" paragraph>
                {profile.life_story || 'No life story provided yet.'}
            </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>LLM Preferences</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
                mb: 4
              }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Model Type</Typography>
                  <Typography variant="body2">{profile.preferences.llm_preferences.model_type}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Model Name</Typography>
                  <Typography variant="body2">{profile.preferences.llm_preferences.model_name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Temperature</Typography>
                  <Typography variant="body2">{profile.preferences.llm_preferences.temperature}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>LaTeX Template Preferences</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
                mb: 4
              }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Resume Template</Typography>
                  <Typography variant="body2">{profile.preferences.latex_template_preferences.resume_template}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Cover Letter Template</Typography>
                  <Typography variant="body2">{profile.preferences.latex_template_preferences.cover_letter_template}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>Document Generation Settings</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Projects</Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      Max projects: {profile.preferences.project_details.max_projects}
                    </Typography>
                    <Typography variant="body2">
                      Bullet points per project: {profile.preferences.project_details.bullet_points_per_project}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Work Experience</Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      Max jobs: {profile.preferences.work_experience_details.max_jobs}
                    </Typography>
                    <Typography variant="body2">
                      Bullet points per job: {profile.preferences.work_experience_details.bullet_points_per_job}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Skills</Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      Max categories: {profile.preferences.skills_details.max_categories}
                    </Typography>
                    <Typography variant="body2">
                      Min skills per category: {profile.preferences.skills_details.min_skills_per_category}
                    </Typography>
                    <Typography variant="body2">
                      Max skills per category: {profile.preferences.skills_details.max_skills_per_category}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Cover Letter</Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      Paragraphs: {profile.preferences.cover_letter_details.paragraphs}
                    </Typography>
                    <Typography variant="body2">
                      Target age: {profile.preferences.cover_letter_details.target_age}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="subtitle1" gutterBottom>
                Supported API Keys:
              </Typography>
              <Box sx={{ mb: 3 }}>
                {profile.supported_api_keys.map((key) => (
                  <Chip 
                    key={key} 
                    label={key} 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
          </Box>
              <Typography variant="body2" color="text.secondary">
                API key management is only available via settings page
              </Typography>
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage; 
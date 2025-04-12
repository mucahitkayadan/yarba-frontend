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
  SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { getUserProfile, updateProfile, updatePersonalInformation, updatePreferences, updateLifeStory } from '../../services/profileService';
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
        <Box sx={{ p: 2 }}>
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
    career_summary_min_words: 50,
    career_summary_max_words: 200,
    work_experience_max_jobs: 5,
    work_experience_bullet_points_per_job: 4,
    project_max_projects: 3,
    project_bullet_points_per_project: 3,
    cover_letter_paragraphs: 3,
    cover_letter_target_grade_level: 9,
    skills_max_categories: 5,
    skills_min_per_category: 3,
    skills_max_per_category: 8,
    education_max_entries: 3,
    education_max_courses: 5,
    awards_max_awards: 3,
    publications_max_publications: 3,
    certifications_max_certifications: 3
  });
  
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
          address: profileData.personal_information.location || '',
          linkedin: profileData.personal_information.linkedin || '',
          github: profileData.personal_information.github || '',
          website: profileData.personal_information.website || ''
        });
      }
      
      // Initialize life story
      setLifeStory(profileData.life_story || '');
      
      // Initialize preferences form
      if (profileData.preferences) {
        setPreferences({
          career_summary_min_words: profileData.preferences.career_summary_details?.min_words || 50,
          career_summary_max_words: profileData.preferences.career_summary_details?.max_words || 200,
          work_experience_max_jobs: profileData.preferences.work_experience_details?.max_jobs || 5,
          work_experience_bullet_points_per_job: profileData.preferences.work_experience_details?.bullet_points_per_job || 4,
          project_max_projects: profileData.preferences.project_details?.max_projects || 3,
          project_bullet_points_per_project: profileData.preferences.project_details?.bullet_points_per_project || 3,
          cover_letter_paragraphs: profileData.preferences.cover_letter_details?.paragraphs || 3,
          cover_letter_target_grade_level: profileData.preferences.cover_letter_details?.target_grade_level || 9,
          skills_max_categories: profileData.preferences.skills_details?.max_categories || 5,
          skills_min_per_category: profileData.preferences.skills_details?.min_skills_per_category || 3,
          skills_max_per_category: profileData.preferences.skills_details?.max_skills_per_category || 8,
          education_max_entries: profileData.preferences.education_details?.max_entries || 3,
          education_max_courses: profileData.preferences.education_details?.max_courses || 5,
          awards_max_awards: profileData.preferences.awards_details?.max_awards || 3,
          publications_max_publications: profileData.preferences.publications_details?.max_publications || 3,
          certifications_max_certifications: profileData.preferences.certifications_max_certifications || 3,
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
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    setPreferences(prev => ({
      ...prev,
      [name]: newValue
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
          location: personalInfo.address,
          linkedin: personalInfo.linkedin,
          github: personalInfo.github,
          website: personalInfo.website
        };
        
        await updatePersonalInformation(personalInfoData);
        setSuccess('Personal information updated successfully!');
      } else if (tabValue === 1) {
        // Update life story
        await updateLifeStory(lifeStory);
        setSuccess('Life story updated successfully!');
      } else if (tabValue === 2) {
        // Transform flat preferences to nested structure that matches backend
        const preferencesData: Partial<NonNullable<Profile['preferences']>> = {
          career_summary_details: {
            min_words: parseInt(preferences.career_summary_min_words.toString()),
            max_words: parseInt(preferences.career_summary_max_words.toString())
          },
          work_experience_details: {
            max_jobs: parseInt(preferences.work_experience_max_jobs.toString()),
            bullet_points_per_job: parseInt(preferences.work_experience_bullet_points_per_job.toString())
          },
          project_details: {
            max_projects: parseInt(preferences.project_max_projects.toString()),
            bullet_points_per_project: parseInt(preferences.project_bullet_points_per_project.toString())
          },
          skills_details: {
            max_categories: parseInt(preferences.skills_max_categories.toString()),
            min_skills_per_category: parseInt(preferences.skills_min_per_category.toString()),
            max_skills_per_category: parseInt(preferences.skills_max_per_category.toString())
          },
          education_details: {
            max_entries: parseInt(preferences.education_max_entries.toString()),
            max_courses: parseInt(preferences.education_max_courses.toString())
          },
          cover_letter_details: {
            paragraphs: parseInt(preferences.cover_letter_paragraphs.toString()),
            target_grade_level: parseInt(preferences.cover_letter_target_grade_level.toString())
          },
          awards_details: {
            max_awards: parseInt(preferences.awards_max_awards.toString())
          },
          publications_details: {
            max_publications: parseInt(preferences.publications_max_publications.toString())
          }
        };
        
        // Make sure we keep any other preferences fields that exist in the current profile
        // but aren't directly editable in our form
        if (profile?.preferences) {
          // Preserve feature preferences
          if (profile.preferences.feature_preferences) {
            preferencesData.feature_preferences = profile.preferences.feature_preferences;
          }
          
          // Preserve LLM preferences
          if (profile.preferences.llm_preferences) {
            preferencesData.llm_preferences = profile.preferences.llm_preferences;
          }
          
          // Preserve section preferences
          if (profile.preferences.section_preferences) {
            preferencesData.section_preferences = profile.preferences.section_preferences;
          }
          
          // Preserve LaTeX template preferences
          if (profile.preferences.latex_template_preferences) {
            preferencesData.latex_template_preferences = profile.preferences.latex_template_preferences;
          }
          
          // Preserve default LaTeX templates
          if (profile.preferences.default_latex_templates) {
            preferencesData.default_latex_templates = profile.preferences.default_latex_templates;
          }
        }
        
        await updatePreferences(preferencesData);
        setSuccess('Preferences updated successfully!');
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
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Edit Profile
          </Typography>
          
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
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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

            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
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
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Words"
                  name="career_summary_min_words"
                  value={preferences.career_summary_min_words}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{
                    inputProps: { 
                      min: 0,
                      max: 100
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Words"
                  name="career_summary_max_words"
                  value={preferences.career_summary_max_words}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 500
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Jobs"
                  name="work_experience_max_jobs"
                  value={preferences.work_experience_max_jobs}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bullet Points Per Job"
                  name="work_experience_bullet_points_per_job"
                  value={preferences.work_experience_bullet_points_per_job}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Projects
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Projects"
                  name="project_max_projects"
                  value={preferences.project_max_projects}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bullet Points Per Project"
                  name="project_bullet_points_per_project"
                  value={preferences.project_bullet_points_per_project}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Skills
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Categories"
                  name="skills_max_categories"
                  value={preferences.skills_max_categories}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Skills Per Category"
                  name="skills_min_per_category"
                  value={preferences.skills_min_per_category}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Skills Per Category"
                  name="skills_max_per_category"
                  value={preferences.skills_max_per_category}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 20
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Education
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Entries"
                  name="education_max_entries"
                  value={preferences.education_max_entries}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 5
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Courses"
                  name="education_max_courses"
                  value={preferences.education_max_courses}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Cover Letter
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Paragraphs"
                  name="cover_letter_paragraphs"
                  value={preferences.cover_letter_paragraphs}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Target Grade Level"
                  name="cover_letter_target_grade_level"
                  value={preferences.cover_letter_target_grade_level}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 20
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Other Sections
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Awards"
                  name="awards_max_awards"
                  value={preferences.awards_max_awards}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Publications"
                  name="publications_max_publications"
                  value={preferences.publications_max_publications}
                  onChange={handleNumberInputChange}
                  margin="normal"
                  InputProps={{ 
                    inputProps: { 
                      min: 0,
                      max: 10
                    }
                  }}
                />
              </Box>
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
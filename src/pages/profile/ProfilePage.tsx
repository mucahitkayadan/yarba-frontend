import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProfile, 
  uploadProfilePicture, 
  deleteProfilePicture,
  uploadSignature,
  deleteSignature
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
  const [uploadType, setUploadType] = useState<'profile' | 'signature' | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageVersion, setImageVersion] = useState<number>(Date.now());
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      console.log('Fetched profile:', response);
      console.log('Profile picture key from API:', response.profile_picture_key);
      console.log('Signature key from API:', response.signature_key);
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

  const handleOpenUploadDialog = (type: 'profile' | 'signature') => {
    setUploadType(type);
    setOpenDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) return;
    
    try {
      setUploading(true);
      if (uploadType === 'profile') {
        const result = await uploadProfilePicture(selectedFile);
        console.log('Profile picture upload result:', result);
        // Update profile state directly if needed
        if (result && result.profile_picture_key) {
          setProfile(prev => prev ? { ...prev, profile_picture_key: result.profile_picture_key } : prev);
          setImageVersion(Date.now());
        } else {
          // Fallback to refetching the profile
          await fetchProfile();
        }
      } else {
        const result = await uploadSignature(selectedFile);
        console.log('Signature upload result:', result);
        // Update profile state directly if needed
        if (result && result.signature_key) {
          setProfile(prev => prev ? { ...prev, signature_key: result.signature_key } : prev);
          setImageVersion(Date.now());
        } else {
          // Fallback to refetching the profile
          await fetchProfile();
        }
      }
      
      handleCloseUploadDialog();
    } catch (err) {
      console.error(`Failed to upload ${uploadType === 'profile' ? 'profile picture' : 'signature'}:`, err);
      setError(`Failed to upload ${uploadType === 'profile' ? 'profile picture' : 'signature'}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      const result = await deleteProfilePicture();
      console.log('Delete profile picture result:', result);
      // Update profile state directly
      setProfile(prev => prev ? { ...prev, profile_picture_key: undefined } : prev);
      setImageVersion(Date.now());
    } catch (err) {
      console.error('Failed to delete profile picture:', err);
      setError('Failed to delete profile picture. Please try again.');
    }
  };

  const handleDeleteSignature = async () => {
    try {
      const result = await deleteSignature();
      console.log('Delete signature result:', result);
      // Update profile state directly
      setProfile(prev => prev ? { ...prev, signature_key: undefined } : prev);
      setImageVersion(Date.now());
    } catch (err) {
      console.error('Failed to delete signature:', err);
      setError('Failed to delete signature. Please try again.');
    }
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
    <Box sx={{ width: '100%', p: 3, pl: 2, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', mb: 3 }}>
        
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
            <Tab label="Life Story" id="profile-tab-2" />
            <Tab label="Profile Picture & Signature" id="profile-tab-3" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
            <Box sx={{ mr: { md: 4 }, mb: { xs: 3, md: 0 }, textAlign: 'center' }}>
              {/* User avatar in personal tab */}
              {profile.profile_picture_key ? (
                <img 
                  src={`${process.env.REACT_APP_CLOUDFRONT_URL}${profile.profile_picture_key}?v=${imageVersion}`}
                  alt={profile.personal_information?.full_name || "User profile picture"}
                  style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
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
              )}
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
              
              {profile.personal_information?.address && (
                <Typography variant="body1" gutterBottom>
                  📍 {profile.personal_information.address}
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
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ width: '100%' }}>
            {/* Career Summary */}
            <Typography variant="h6" gutterBottom>
              Career Summary (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Minimum Words:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.career_summary?.min_words || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Words:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.career_summary?.max_words || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Work Experience */}
            <Typography variant="h6" gutterBottom>
              Work Experience (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Jobs:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.work_experience?.max_jobs || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Bullet Points Per Job:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.work_experience?.bullet_points_per_job || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Projects */}
            <Typography variant="h6" gutterBottom>
              Projects (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Projects:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.project?.max_projects || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Bullet Points Per Project:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.project?.bullet_points_per_project || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Skills */}
            <Typography variant="h6" gutterBottom>
              Skills (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Categories:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.skills?.max_categories || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Min Skills Per Category:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.skills?.min_skills_per_category || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Max Skills Per Category:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.skills?.max_skills_per_category || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Education */}
            <Typography variant="h6" gutterBottom>
              Education (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Entries:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.education?.max_entries || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Courses:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.education?.max_courses || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Cover Letter */}
            <Typography variant="h6" gutterBottom>
              Cover Letter (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Paragraphs:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.cover_letter?.paragraphs || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Target Age:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.cover_letter?.target_age || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Awards and Publications (Prompt Preferences) */}
            <Typography variant="h6" gutterBottom>
              Awards & Publications (Prompt Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Awards:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.awards?.max_awards || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Maximum Publications:
                </Typography>
                <Typography variant="body2">
                  {profile.prompt_preferences?.publications?.max_publications || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Default Templates (System Preferences) */}
            <Typography variant="h6" gutterBottom>
              Default Templates (System Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Resume Template:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.templates?.default_resume_template_id || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Cover Letter Template:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.templates?.default_cover_letter_template_id || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Privacy Settings (System Preferences) */}
            <Typography variant="h6" gutterBottom>
              Privacy Settings (System Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {Object.keys(profile.system_preferences?.privacy || {}).length > 0 
                  ? 'Custom privacy settings configured' 
                  : 'No privacy settings configured'}
              </Typography>
            </Box>
            
            {/* Notification Settings (System Preferences) */}
            <Typography variant="h6" gutterBottom>
              Notification Settings (System Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {Object.keys(profile.system_preferences?.notifications || {}).length > 0 
                  ? 'Custom notification settings configured' 
                  : 'No notification settings configured'}
              </Typography>
            </Box>
            
            {/* AI Settings (System Preferences) */}
            <Typography variant="h6" gutterBottom>
              AI Settings (System Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Model Name:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.llm?.model_name || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Temperature:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.llm?.temperature || 'Not set'}
                </Typography>
              </Box>
            </Box>
            
            {/* Feature Preferences (System Preferences) */}
            <Typography variant="h6" gutterBottom>
              Feature Preferences (System Preferences)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Dark Mode:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.features?.dark_mode ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Auto Save:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.features?.auto_save ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ width: 200, fontWeight: 'bold' }}>
                  Check Clearance:
                </Typography>
                <Typography variant="body2">
                  {profile.system_preferences?.features?.check_clearance ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
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
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Profile Picture Section */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                {profile?.profile_picture_key ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img
                      src={`${process.env.REACT_APP_CLOUDFRONT_URL}${profile.profile_picture_key}?v=${imageVersion}`}
                      alt={profile?.personal_information?.full_name || "User profile"}
                      style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </Box>
                ) : (
                  <Avatar
                    sx={{ width: 150, height: 150, fontSize: 60, mb: 2 }}
                  >
                    {profile?.personal_information?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                  </Avatar>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                    onClick={() => handleOpenUploadDialog('profile')}
                  >
                    {profile?.profile_picture_key ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                  
                  {profile?.profile_picture_key && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteProfilePicture}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
            
            {/* Signature Section */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Signature
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                {profile?.signature_key ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img
                      src={`${process.env.REACT_APP_CLOUDFRONT_URL}${profile.signature_key}?v=${imageVersion}`}
                      alt="Signature"
                      style={{ maxWidth: '100%', maxHeight: 150 }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No signature uploaded
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                    onClick={() => handleOpenUploadDialog('signature')}
                  >
                    {profile?.signature_key ? 'Change Signature' : 'Upload Signature'}
                  </Button>
                  
                  {profile?.signature_key && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteSignature}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseUploadDialog}>
        <DialogTitle>
          {uploadType === 'profile' ? 'Upload Profile Picture' : 'Upload Signature'}
          <IconButton
            aria-label="close"
            onClick={handleCloseUploadDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span">
                Choose File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            variant="contained"
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 
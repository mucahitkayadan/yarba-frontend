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
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, isLoading, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        jobTitle: user.job_title || '',
        company: user.company || '',
        location: user.location || '',
        phone: user.phone || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Transform the data according to your API requirements
      const profileData: UserProfile = {
        full_name: formData.fullName,
        bio: formData.bio,
        job_title: formData.jobTitle,
        company: formData.company,
        location: formData.location,
        phone: formData.phone,
        website: formData.website
      };
      
      await updateUserProfile(profileData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
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

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
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

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, alignItems: 'center' }}>
          <Box sx={{ position: 'relative', mr: { sm: 4 }, mb: { xs: 3, sm: 0 } }}>
            <Avatar
              src={user.avatar_url}
              alt={user.full_name}
              sx={{ width: 120, height: 120 }}
            />
            {editMode && (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper'
                }}
              >
                <input hidden accept="image/*" type="file" />
                <PhotoCameraIcon />
              </IconButton>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{user.full_name}</Typography>
            <Typography variant="body1" color="text.secondary">@{user.username}</Typography>
            {formData.jobTitle && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                {formData.jobTitle} {formData.company ? `at ${formData.company}` : ''}
              </Typography>
            )}
            {formData.location && (
              <Typography variant="body2" color="text.secondary">
                {formData.location}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {editMode ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  disabled
                  helperText="Email cannot be changed"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  disabled
                  margin="normal"
                  helperText="Username cannot be changed"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>About</Typography>
            <Typography variant="body1" paragraph>
              {formData.bio || 'No bio provided'}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Contact Information</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
              </Box>
              {formData.phone && (
                <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography variant="body2" color="text.secondary">{formData.phone}</Typography>
                </Box>
              )}
              {formData.website && (
                <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                  <Typography variant="subtitle2">Website</Typography>
                  <Typography variant="body2" color="text.secondary">{formData.website}</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { createPortfolio } from '../../services/portfolioService';
import { getUserProfile } from '../../services/profileService';
import { Profile } from '../../types/models';

const PortfolioCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Basic form state
  const [portfolioName, setPortfolioName] = useState('');
  const [skills, setSkills] = useState<Array<{ category: string; skills: string[] }>>([
    { category: 'Technical Skills', skills: [] },
    { category: 'Soft Skills', skills: [] }
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  // Fetch user profile to link with portfolio
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        
        // If profile doesn't exist, redirect to profile creation
        if (err.response && err.response.status === 404) {
          setError('You need to create a profile before creating a portfolio.');
        } else {
          setError('Failed to load user profile. Please try again.');
        }
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    setSkills(prevSkills => {
      const updatedSkills = [...prevSkills];
      const category = updatedSkills[selectedCategoryIndex];
      if (category && !category.skills.includes(newSkill.trim())) {
        category.skills = [...category.skills, newSkill.trim()];
      }
      return updatedSkills;
    });
    
    setNewSkill('');
  };
  
  const handleDeleteSkill = (categoryIndex: number, skillIndex: number) => {
    setSkills(prevSkills => {
      const updatedSkills = [...prevSkills];
      const category = updatedSkills[categoryIndex];
      if (category) {
        category.skills = category.skills.filter((_, index) => index !== skillIndex);
      }
      return updatedSkills;
    });
  };
  
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryIndex = parseInt(e.target.value);
    setSelectedCategoryIndex(categoryIndex);
  };
  
  const handleAddCategory = () => {
    setSkills(prev => [...prev, { category: `Category ${prev.length + 1}`, skills: [] }]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      setError('You need a profile before creating a portfolio.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare portfolio data - start with minimal required data
      const portfolioData = {
        profile_id: profile._id,
        skills: skills
          .filter(category => category.skills.length > 0)
          .map(category => ({
            category: category.category,
            skills: category.skills
          })),
        work_experience: [],
        education: [],
        projects: [],
        certifications: [],
        awards: [],
        publications: []
      };
      
      const response = await createPortfolio(portfolioData);
      
      // Redirect to portfolio view page
      navigate(`/portfolio/${response._id}`);
    } catch (err: any) {
      console.error('Failed to create portfolio:', err);
      setError(err.response?.data?.detail || 'Failed to create portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/portfolio');
  };
  
  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If no profile exists, show message to create profile first
  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create Portfolio
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            You need to create a profile before creating a portfolio.
          </Alert>
          
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile/create')}
            >
              Create Profile First
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleCancel} 
        sx={{ mb: 2 }}
      >
        Back to Portfolio
      </Button>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Start by adding your skills. You can add more details like work experience, education, and projects later.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Skills
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            {skills.map((category, categoryIndex) => (
              <Box key={categoryIndex} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {category.category}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {category.skills.map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      onDelete={() => handleDeleteSkill(categoryIndex, skillIndex)}
                      deleteIcon={<CloseIcon />}
                    />
                  ))}
                  {category.skills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <TextField
                select
                label="Category"
                value={selectedCategoryIndex}
                onChange={handleNewCategoryChange}
                variant="outlined"
                size="small"
                sx={{ width: 200, mr: 2 }}
                SelectProps={{
                  native: true
                }}
              >
                {skills.map((category, index) => (
                  <option key={index} value={index}>
                    {category.category}
                  </option>
                ))}
              </TextField>
              
              <TextField
                label="New Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, mr: 2 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              
              <Button
                variant="outlined"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                Add
              </Button>
            </Box>
            
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{ mt: 2 }}
            >
              Add New Category
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Portfolio'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        You'll be able to add work experience, education, and other details after creating your portfolio.
      </Typography>
    </Box>
  );
};

export default PortfolioCreatePage; 
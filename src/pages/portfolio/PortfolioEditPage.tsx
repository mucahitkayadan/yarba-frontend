import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Divider,
  TextField,
  Chip,
  Grid
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getPortfolioById, updatePortfolio } from '../../services/portfolioService';
import { Portfolio } from '../../types/models';

// Define interface for skill categories
interface SkillCategory {
  category: string;
  skills: string[];
}

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
      id={`portfolio-edit-tabpanel-${index}`}
      aria-labelledby={`portfolio-edit-tab-${index}`}
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

const PortfolioEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Skills state
  const [skills, setSkills] = useState<Array<{ category: string; skills: string[] }>>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  useEffect(() => {
    if (!id) return;
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const portfolioData = await getPortfolioById(id);
      
      // Fixed assignment to match the updated interface
      setPortfolio(portfolioData);
      
      // Initialize skills state from portfolio data
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        setSkills(portfolioData.skills.map((skill: SkillCategory) => {
          return {
            category: skill.category,
            skills: [...skill.skills]
          };
        }));
      } else {
        setSkills([
          { category: 'Technical Skills', skills: [] },
          { category: 'Soft Skills', skills: [] }
        ]);
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio:', err);
      setError('Failed to load portfolio. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    if (!newCategory.trim()) return;
    
    setSkills(prev => [...prev, { category: newCategory.trim(), skills: [] }]);
    setNewCategory('');
  };
  
  const handleDeleteCategory = (categoryIndex: number) => {
    setSkills(prev => prev.filter((_, index) => index !== categoryIndex));
    if (selectedCategoryIndex >= categoryIndex && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex(selectedCategoryIndex - 1);
    }
  };

  const handleSave = async () => {
    if (!id || !portfolio) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save based on current tab
      if (tabValue === 0) { // Skills tab
        // Convert our internal skills format to match the API's expected format
        const formattedSkills = skills
          .filter(category => category.skills.length > 0)
          .map(category => ({
            category: category.category,
            skills: [...category.skills]
          }));
        
        // Use the portfolio _id from params or the portfolio object
        const portfolioId = portfolio._id || id;
        
        const updatedPortfolio = {
          ...portfolio,
          skills: formattedSkills
        };
        
        await updatePortfolio(portfolioId, updatedPortfolio);
        setSuccess('Skills updated successfully!');
        
        // Refresh portfolio data
        await fetchPortfolio();
      }
      // Add more tab conditions here for other sections when implementing them
      
    } catch (err: any) {
      console.error('Failed to update portfolio:', err);
      setError(err.response?.data?.detail || 'Failed to update portfolio. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (portfolio && portfolio._id) {
      navigate(`/portfolio/${portfolio._id}`);
    } else if (id) {
      navigate(`/portfolio/${id}`);
    } else {
      navigate('/portfolio');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !portfolio) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!portfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Portfolio not found. Please try again or create a new portfolio.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/portfolio')}
          sx={{ mt: 2 }}
        >
          Back to Portfolios
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleCancel} 
        sx={{ mb: 2 }}
      >
        Back to Portfolio
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Edit Portfolio
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'Save Changes'}
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
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="portfolio edit tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Skills" />
            {/* Add more tabs when implementing other sections */}
            {/* <Tab label="Work Experience" /> */}
            {/* <Tab label="Education" /> */}
            {/* <Tab label="Projects" /> */}
          </Tabs>
        </Box>

        {/* Skills Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {skills.map((category, categoryIndex) => (
              <Grid item xs={12} key={categoryIndex}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      {category.category}
                    </Typography>
                    
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteCategory(categoryIndex)}
                      disabled={skills.length <= 1}
                    >
                      Remove Category
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {category.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        onDelete={() => handleDeleteSkill(categoryIndex, skillIndex)}
                        deleteIcon={<CloseIcon />}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    {category.skills.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet in this category
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add New Skills
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                Add Skill
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add New Category
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="New Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, mr: 2 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              
              <Button
                variant="outlined"
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                Add Category
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Add more tab panels here for other sections */}
      </Paper>
    </Box>
  );
};

export default PortfolioEditPage; 
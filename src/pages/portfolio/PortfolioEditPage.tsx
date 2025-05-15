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
  Grid,
  IconButton,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { 
  getPortfolioById, 
  updatePortfolio,
  updateSkills,
  updateCareerSummary,
  updateWorkExperience,
  updateEducation,
  updateProjects,
  updateAwards,
  updatePublications,
  updateCertifications
} from '../../services/portfolioService';
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
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  // Career Summary state
  const [careerSummary, setCareerSummary] = useState<{
    job_titles: string[];
    years_of_experience: string;
    default_summary: string;
    default_job_title?: string;
  }>({
    job_titles: [],
    years_of_experience: '',
    default_summary: ''
  });
  const [newJobTitle, setNewJobTitle] = useState('');
  const [jobTitleDialogOpen, setJobTitleDialogOpen] = useState(false);
  
  // Work Experience state
  const [workExperience, setWorkExperience] = useState<Array<{
    job_title: string;
    company: string;
    location: string;
    time: string;
    responsibilities: string[];
  }>>([]);
  const [newResponsibility, setNewResponsibility] = useState('');
  
  // Education state
  const [education, setEducation] = useState<Array<{
    degree_type: string;
    degree: string;
    university_name: string;
    time: string;
    location: string;
    GPA: string;
    transcript: string[];
  }>>([]);
  const [newCourse, setNewCourse] = useState('');
  
  // Projects state
  const [projects, setProjects] = useState<Array<{
    name: string;
    bullet_points: string[];
    date: string;
    link?: string;
  }>>([]);
  const [newBulletPoint, setNewBulletPoint] = useState('');
  
  // Awards state
  const [awards, setAwards] = useState<Array<{
    name: string;
    explanation: string;
  }>>([]);
  
  // Publications state
  const [publications, setPublications] = useState<Array<{
    name: string;
    publisher: string;
    link: string;
    time: string;
  }>>([]);
  
  // Certifications state
  const [certifications, setCertifications] = useState<Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    description?: string;
  }>>([]);
  
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
      
      // Initialize career summary
      if (portfolioData.career_summary) {
        setCareerSummary({
          job_titles: portfolioData.career_summary.job_titles || [],
          years_of_experience: portfolioData.career_summary.years_of_experience || '',
          default_summary: portfolioData.career_summary.default_summary || '',
          default_job_title: portfolioData.career_summary.default_job_title || undefined
        });
      }
      
      // Initialize work experience
      if (portfolioData.work_experience && portfolioData.work_experience.length > 0) {
        setWorkExperience(portfolioData.work_experience.map((exp: any) => ({
          job_title: exp.job_title || exp.position || '',
          company: exp.company || '',
          location: exp.location || '',
          time: exp.time || `${exp.start_date || ''} - ${exp.current ? 'Present' : (exp.end_date || '')}`,
          responsibilities: exp.responsibilities || exp.achievements || []
        })));
      } else {
        setWorkExperience([]);
      }
      
      // Initialize education
      if (portfolioData.education && portfolioData.education.length > 0) {
        setEducation(portfolioData.education.map((edu: any) => ({
          degree_type: edu.degree_type || '',
          degree: edu.degree || '',
          university_name: edu.university_name || edu.institution || '',
          time: edu.time || `${edu.start_date || ''} - ${edu.current ? 'Present' : (edu.end_date || '')}`,
          location: edu.location || '',
          GPA: edu.GPA || '',
          transcript: edu.transcript || edu.courses || []
        })));
      } else {
        setEducation([]);
      }
      
      // Initialize projects
      if (portfolioData.projects && portfolioData.projects.length > 0) {
        setProjects(portfolioData.projects.map((proj: any) => ({
          name: proj.name || '',
          bullet_points: proj.bullet_points || proj.achievements || [],
          date: proj.date || proj.start_date || '',
          link: proj.link || ''
        })));
      } else {
        setProjects([]);
      }
      
      // Initialize awards
      if (portfolioData.awards && portfolioData.awards.length > 0) {
        setAwards(portfolioData.awards.map((award: any) => ({
          name: award.name || award.title || '',
          explanation: award.explanation || award.description || ''
        })));
      } else {
        setAwards([]);
      }
      
      // Initialize publications
      if (portfolioData.publications && portfolioData.publications.length > 0) {
        setPublications(portfolioData.publications.map((pub: any) => ({
          name: pub.name || pub.title || '',
          publisher: pub.publisher || '',
          link: pub.link || pub.url || '',
          time: pub.time || pub.date || ''
        })));
      } else {
        setPublications([]);
      }
      
      // Initialize certifications
      if (portfolioData.certifications && portfolioData.certifications.length > 0) {
        setCertifications(portfolioData.certifications);
      } else {
        setCertifications([]);
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

  const handleDeleteJobTitle = (index: number) => {
    const updatedTitles = [...careerSummary.job_titles];
    const titleToRemove = updatedTitles[index];
    updatedTitles.splice(index, 1);
    
    setCareerSummary({
      ...careerSummary,
      job_titles: updatedTitles,
      default_job_title: careerSummary.default_job_title === titleToRemove ? 
        (updatedTitles.length > 0 ? updatedTitles[0] : undefined) : 
        careerSummary.default_job_title
    });
  };

  const handleSave = async () => {
    if (!id || !portfolio) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save based on current tab
      switch(tabValue) {
        case 0: // Career Summary tab
          await updateCareerSummary(id, careerSummary);
          setSuccess('Career summary updated successfully!');
          break;
          
        case 1: // Skills tab
          // Convert our internal skills format to match the API's expected format
          const formattedSkills = skills
            .filter(category => category.skills.length > 0)
            .map(category => ({
              category: category.category,
              skills: [...category.skills]
            }));
          
          await updateSkills(id, formattedSkills);
          setSuccess('Skills updated successfully!');
          break;
          
        case 2: // Work Experience tab
          await updateWorkExperience(id, workExperience);
          setSuccess('Work experience updated successfully!');
          break;
          
        case 3: // Education tab
          await updateEducation(id, education);
          setSuccess('Education updated successfully!');
          break;
          
        case 4: // Projects tab
          await updateProjects(id, projects);
          setSuccess('Projects updated successfully!');
          break;
          
        case 5: // Awards tab
          await updateAwards(id, awards);
          setSuccess('Awards updated successfully!');
          break;
          
        case 6: // Publications tab
          await updatePublications(id, publications);
          setSuccess('Publications updated successfully!');
          break;
          
        case 7: // Certifications tab
          await updateCertifications(id, certifications);
          setSuccess('Certifications updated successfully!');
          break;
          
        default:
          break;
      }
      
      // Refresh portfolio data
      await fetchPortfolio();
      
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
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        
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
            <Tab label="Career Summary" />
            <Tab label="Skills" />
            <Tab label="Work Experience" />
            <Tab label="Education" />
            <Tab label="Projects" />
            <Tab label="Awards" />
            <Tab label="Publications" />
            <Tab label="Certifications" />
          </Tabs>
        </Box>

        {/* Career Summary Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Career Summary</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            {/* Preview of how it will look */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">Preview:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, pl: 1 }}>
                  <Typography variant="body1">A</Typography>
                  <Chip 
                    label={careerSummary.default_job_title || (careerSummary.job_titles.length > 0 ? careerSummary.job_titles[0] : 'Your Job Title')} 
                    size="small"
                    sx={{
                      bgcolor: careerSummary.default_job_title ? '#E05B49' : 'primary.main',
                      color: 'white',
                    }}
                  />
                  <Typography variant="body1">
                    with <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-flex',
                        fontWeight: 'bold',
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                        mx: 0.5,
                        border: '1px solid rgba(25, 118, 210, 0.3)',
                        color: 'primary.main'
                      }}
                    >
                      {careerSummary.years_of_experience || '...'}
                    </Box> years of experience {careerSummary.default_summary || '...'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Default Job Title Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="default-job-title-label">Default Job Title</InputLabel>
                <Select
                  labelId="default-job-title-label"
                  id="default-job-title"
                  value={careerSummary.default_job_title || ''}
                  onChange={(e) => setCareerSummary({
                    ...careerSummary,
                    default_job_title: e.target.value || undefined
                  })}
                  label="Default Job Title"
                  disabled={careerSummary.job_titles.length === 0}
                >
                  <MenuItem value="">
                    <em>None (Auto-generate from experience)</em>
                  </MenuItem>
                  {careerSummary.job_titles.map((title, index) => (
                    <MenuItem key={index} value={title}>{title}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select a default job title to display in resumes
                </FormHelperText>
              </FormControl>
            </Grid>
            
            {/* Years of Experience */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                value={careerSummary.years_of_experience}
                onChange={(e) => setCareerSummary({
                  ...careerSummary,
                  years_of_experience: e.target.value
                })}
                variant="outlined"
                placeholder="e.g., 5"
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                }}
              />
            </Grid>
            
            {/* Professional Summary */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Summary"
                value={careerSummary.default_summary}
                onChange={(e) => setCareerSummary({
                  ...careerSummary,
                  default_summary: e.target.value
                })}
                variant="outlined"
                placeholder="e.g., in software development, machine learning, and computer vision."
                margin="normal"
                multiline
                rows={3}
                helperText="Describe your experience and expertise without mentioning job title or years - those are automatically filled in"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider>
                <Chip label="Job Titles" size="small" />
              </Divider>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Available Job Titles
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {careerSummary.job_titles.map((title, index) => (
                  <Chip
                    key={index}
                    label={title}
                    color={title === careerSummary.default_job_title ? undefined : "primary"}
                    sx={{ 
                      bgcolor: title === careerSummary.default_job_title ? '#E05B49' : undefined,
                      color: title === careerSummary.default_job_title ? 'white' : undefined,
                    }}
                    onDelete={() => handleDeleteJobTitle(index)}
                  />
                ))}
                <Chip
                  icon={<AddIcon />}
                  label="Add Job Title"
                  onClick={() => setJobTitleDialogOpen(true)}
                  color="default"
                  variant="outlined"
                  sx={{ borderStyle: 'dashed' }}
                />
                {careerSummary.job_titles.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No job titles added yet
                  </Typography>
                )}
              </Box>
              
              {/* Add Job Title Dialog */}
              <Dialog open={jobTitleDialogOpen} onClose={() => setJobTitleDialogOpen(false)}>
                <DialogTitle>Add New Job Title</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="jobTitle"
                    label="Job Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newJobTitle.trim()) {
                        setCareerSummary({
                          ...careerSummary,
                          job_titles: [...careerSummary.job_titles, newJobTitle.trim()]
                        });
                        setNewJobTitle('');
                        setJobTitleDialogOpen(false);
                      }
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setJobTitleDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => {
                      if (newJobTitle.trim()) {
                        setCareerSummary({
                          ...careerSummary,
                          job_titles: [...careerSummary.job_titles, newJobTitle.trim()]
                        });
                        setNewJobTitle('');
                        setJobTitleDialogOpen(false);
                      }
                    }} 
                    disabled={!newJobTitle.trim()}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel value={tabValue} index={1}>
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
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    <Chip
                      icon={<AddIcon />}
                      label="Add Skill"
                      onClick={() => {
                        setSelectedCategoryIndex(categoryIndex);
                        setSkillDialogOpen(true);
                      }}
                      color="default"
                      variant="outlined"
                      sx={{ borderStyle: 'dashed', m: 0.5 }}
                    />
                    {category.skills.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {/* Add Skill Dialog */}
          <Dialog open={skillDialogOpen} onClose={() => setSkillDialogOpen(false)}>
            <DialogTitle>Add New Skill to {skills[selectedCategoryIndex]?.category || 'Category'}</DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="skill-category-label">Category</InputLabel>
                <Select
                  labelId="skill-category-label"
                  value={selectedCategoryIndex}
                  onChange={(e) => setSelectedCategoryIndex(Number(e.target.value))}
                  label="Category"
                >
                  {skills.map((category, index) => (
                    <MenuItem key={index} value={index}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                autoFocus
                margin="dense"
                id="skillName"
                label="Skill"
                type="text"
                fullWidth
                variant="outlined"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newSkill.trim()) {
                    handleAddSkill();
                    setSkillDialogOpen(false);
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  handleAddSkill();
                  setSkillDialogOpen(false);
                }} 
                disabled={!newSkill.trim()}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Add Category Dialog */}
          <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="categoryName"
                label="Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newCategory.trim()) {
                    handleAddCategory();
                    setCategoryDialogOpen(false);
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  handleAddCategory();
                  setCategoryDialogOpen(false);
                }} 
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Add Category Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Chip
              icon={<AddIcon />}
              label="Add New Category"
              onClick={() => setCategoryDialogOpen(true)}
              color="primary"
              variant="outlined"
              sx={{ borderStyle: 'dashed', cursor: 'pointer' }}
            />
          </Box>
        </TabPanel>
        
        {/* Work Experience Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Work Experience</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {workExperience.map((exp, expIndex) => (
            <Paper 
              key={expIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.job_title} at {exp.company}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setWorkExperience(workExperience.filter((_, index) => index !== expIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={exp.job_title}
                    onChange={(e) => {
                      const updatedExperience = [...workExperience];
                      updatedExperience[expIndex].job_title = e.target.value;
                      setWorkExperience(updatedExperience);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updatedExperience = [...workExperience];
                      updatedExperience[expIndex].company = e.target.value;
                      setWorkExperience(updatedExperience);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={exp.location}
                    onChange={(e) => {
                      const updatedExperience = [...workExperience];
                      updatedExperience[expIndex].location = e.target.value;
                      setWorkExperience(updatedExperience);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time Period"
                    value={exp.time}
                    onChange={(e) => {
                      const updatedExperience = [...workExperience];
                      updatedExperience[expIndex].time = e.target.value;
                      setWorkExperience(updatedExperience);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 01/2023 - Present"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Responsibilities
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {exp.responsibilities.map((responsibility, respIndex) => (
                  <Box key={respIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      value={responsibility}
                      onChange={(e) => {
                        const updatedExperience = [...workExperience];
                        updatedExperience[expIndex].responsibilities[respIndex] = e.target.value;
                        setWorkExperience(updatedExperience);
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        const updatedExperience = [...workExperience];
                        updatedExperience[expIndex].responsibilities = 
                          updatedExperience[expIndex].responsibilities.filter((_, idx) => idx !== respIndex);
                        setWorkExperience(updatedExperience);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                {exp.responsibilities.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No responsibilities added yet
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="New Responsibility"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, mr: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newResponsibility.trim()) {
                        const updatedExperience = [...workExperience];
                        updatedExperience[expIndex].responsibilities.push(newResponsibility.trim());
                        setWorkExperience(updatedExperience);
                        setNewResponsibility('');
                      }
                    }
                  }}
                />
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (newResponsibility.trim()) {
                      const updatedExperience = [...workExperience];
                      updatedExperience[expIndex].responsibilities.push(newResponsibility.trim());
                      setWorkExperience(updatedExperience);
                      setNewResponsibility('');
                    }
                  }}
                  disabled={!newResponsibility.trim()}
                >
                  Add
                </Button>
              </Box>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setWorkExperience([
                ...workExperience,
                {
                  job_title: '',
                  company: '',
                  location: '',
                  time: '',
                  responsibilities: []
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Work Experience
          </Button>
        </TabPanel>
        
        {/* Education Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Education</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {education.map((edu, eduIndex) => (
            <Paper 
              key={eduIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree_type} in {edu.degree} at {edu.university_name}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setEducation(education.filter((_, index) => index !== eduIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Degree Type"
                    value={edu.degree_type}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].degree_type = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Bachelor's Degree"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].degree = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Computer Science"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="University/Institution"
                    value={edu.university_name}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].university_name = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time Period"
                    value={edu.time}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].time = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 2020 - 2024"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={edu.location}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].location = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="GPA"
                    value={edu.GPA}
                    onChange={(e) => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].GPA = e.target.value;
                      setEducation(updatedEducation);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 3.8"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Courses/Transcript
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {edu.transcript.map((course, courseIndex) => (
                  <Chip
                    key={courseIndex}
                    label={course}
                    onDelete={() => {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].transcript = 
                        updatedEducation[eduIndex].transcript.filter((_, idx) => idx !== courseIndex);
                      setEducation(updatedEducation);
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
                {edu.transcript.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No courses added yet
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="New Course"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, mr: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCourse.trim()) {
                        const updatedEducation = [...education];
                        updatedEducation[eduIndex].transcript.push(newCourse.trim());
                        setEducation(updatedEducation);
                        setNewCourse('');
                      }
                    }
                  }}
                />
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (newCourse.trim()) {
                      const updatedEducation = [...education];
                      updatedEducation[eduIndex].transcript.push(newCourse.trim());
                      setEducation(updatedEducation);
                      setNewCourse('');
                    }
                  }}
                  disabled={!newCourse.trim()}
                >
                  Add Course
                </Button>
              </Box>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setEducation([
                ...education,
                {
                  degree_type: '',
                  degree: '',
                  university_name: '',
                  time: '',
                  location: '',
                  GPA: '',
                  transcript: []
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Education
          </Button>
        </TabPanel>
        
        {/* Projects Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Projects</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {projects.map((project, projectIndex) => (
            <Paper 
              key={projectIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {project.name || 'Untitled Project'}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setProjects(projects.filter((_, index) => index !== projectIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={project.name}
                    onChange={(e) => {
                      const updatedProjects = [...projects];
                      updatedProjects[projectIndex].name = e.target.value;
                      setProjects(updatedProjects);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Date"
                    value={project.date}
                    onChange={(e) => {
                      const updatedProjects = [...projects];
                      updatedProjects[projectIndex].date = e.target.value;
                      setProjects(updatedProjects);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 2023"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Project Link"
                    value={project.link || ''}
                    onChange={(e) => {
                      const updatedProjects = [...projects];
                      updatedProjects[projectIndex].link = e.target.value;
                      setProjects(updatedProjects);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., https://github.com/user/project"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Project Details
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {project.bullet_points.map((point, pointIndex) => (
                  <Box key={pointIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      value={point}
                      onChange={(e) => {
                        const updatedProjects = [...projects];
                        updatedProjects[projectIndex].bullet_points[pointIndex] = e.target.value;
                        setProjects(updatedProjects);
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        const updatedProjects = [...projects];
                        updatedProjects[projectIndex].bullet_points = 
                          updatedProjects[projectIndex].bullet_points.filter((_, idx) => idx !== pointIndex);
                        setProjects(updatedProjects);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                {project.bullet_points.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No project details added yet
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="New Detail"
                  value={newBulletPoint}
                  onChange={(e) => setNewBulletPoint(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, mr: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newBulletPoint.trim()) {
                        const updatedProjects = [...projects];
                        updatedProjects[projectIndex].bullet_points.push(newBulletPoint.trim());
                        setProjects(updatedProjects);
                        setNewBulletPoint('');
                      }
                    }
                  }}
                />
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (newBulletPoint.trim()) {
                      const updatedProjects = [...projects];
                      updatedProjects[projectIndex].bullet_points.push(newBulletPoint.trim());
                      setProjects(updatedProjects);
                      setNewBulletPoint('');
                    }
                  }}
                  disabled={!newBulletPoint.trim()}
                >
                  Add Detail
                </Button>
              </Box>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setProjects([
                ...projects,
                {
                  name: '',
                  bullet_points: [],
                  date: '',
                  link: ''
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Project
          </Button>
        </TabPanel>
        
        {/* Awards Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>Awards</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {awards.map((award, awardIndex) => (
            <Paper 
              key={awardIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {award.name || 'Untitled Award'}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setAwards(awards.filter((_, index) => index !== awardIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Award Name"
                    value={award.name}
                    onChange={(e) => {
                      const updatedAwards = [...awards];
                      updatedAwards[awardIndex].name = e.target.value;
                      setAwards(updatedAwards);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Best Project Award"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Explanation"
                    value={award.explanation}
                    onChange={(e) => {
                      const updatedAwards = [...awards];
                      updatedAwards[awardIndex].explanation = e.target.value;
                      setAwards(updatedAwards);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Awarded for innovative approach to AI research"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setAwards([
                ...awards,
                {
                  name: '',
                  explanation: ''
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Award
          </Button>
        </TabPanel>
        
        {/* Publications Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>Publications</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {publications.map((publication, pubIndex) => (
            <Paper 
              key={pubIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {publication.name || 'Untitled Publication'}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setPublications(publications.filter((_, index) => index !== pubIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Publication Title"
                    value={publication.name}
                    onChange={(e) => {
                      const updatedPublications = [...publications];
                      updatedPublications[pubIndex].name = e.target.value;
                      setPublications(updatedPublications);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Research Paper Title"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Publisher"
                    value={publication.publisher}
                    onChange={(e) => {
                      const updatedPublications = [...publications];
                      updatedPublications[pubIndex].publisher = e.target.value;
                      setPublications(updatedPublications);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Academic Journal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date/Time"
                    value={publication.time}
                    onChange={(e) => {
                      const updatedPublications = [...publications];
                      updatedPublications[pubIndex].time = e.target.value;
                      setPublications(updatedPublications);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Jan, 2023"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Link/URL"
                    value={publication.link}
                    onChange={(e) => {
                      const updatedPublications = [...publications];
                      updatedPublications[pubIndex].link = e.target.value;
                      setPublications(updatedPublications);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., https://example.com/paper"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setPublications([
                ...publications,
                {
                  name: '',
                  publisher: '',
                  link: '',
                  time: ''
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Publication
          </Button>
        </TabPanel>
        
        {/* Certifications Tab */}
        <TabPanel value={tabValue} index={7}>
          <Typography variant="h6" gutterBottom>Certifications</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {certifications.map((certification, certIndex) => (
            <Paper 
              key={certIndex} 
              variant="outlined" 
              sx={{ p: 2, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {certification.name || 'Untitled Certification'}
                </Typography>
                
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setCertifications(certifications.filter((_, index) => index !== certIndex));
                  }}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Certification Name"
                    value={certification.name}
                    onChange={(e) => {
                      const updatedCertifications = [...certifications];
                      updatedCertifications[certIndex].name = e.target.value;
                      setCertifications(updatedCertifications);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Issuer"
                    value={certification.issuer}
                    onChange={(e) => {
                      const updatedCertifications = [...certifications];
                      updatedCertifications[certIndex].issuer = e.target.value;
                      setCertifications(updatedCertifications);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    value={certification.date}
                    onChange={(e) => {
                      const updatedCertifications = [...certifications];
                      updatedCertifications[certIndex].date = e.target.value;
                      setCertifications(updatedCertifications);
                    }}
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Jan, 2023"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={certification.url || ''}
                    onChange={(e) => {
                      const updatedCertifications = [...certifications];
                      updatedCertifications[certIndex].url = e.target.value;
                      setCertifications(updatedCertifications);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={certification.description || ''}
                    onChange={(e) => {
                      const updatedCertifications = [...certifications];
                      updatedCertifications[certIndex].description = e.target.value;
                      setCertifications(updatedCertifications);
                    }}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setCertifications([
                ...certifications,
                {
                  name: '',
                  issuer: '',
                  date: '',
                  url: '',
                  description: ''
                }
              ]);
            }}
            sx={{ mt: 2 }}
          >
            Add Certification
          </Button>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PortfolioEditPage; 
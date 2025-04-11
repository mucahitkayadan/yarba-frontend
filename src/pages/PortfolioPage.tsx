import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Code as ProjectsIcon,
  EmojiEvents as AwardsIcon,
  MenuBook as PublicationsIcon,
  Badge as CertificationsIcon,
  VerifiedUser as Badge
} from '@mui/icons-material';
import { getUserPortfolios, createPortfolio } from '../services/portfolioService';
import { Portfolio } from '../types/models';

// Define the actual API response structure
interface ApiPortfolio {
  _id: string;
  user_id: string;
  profile_id: string;
  user: any;
  profile: any;
  career_summary: {
    job_titles: string[];
    years_of_experience: string;
    default_summary: string;
  };
  skills: {
    category: string;
    skills: string[];
  }[];
  work_experience: {
    job_title: string;
    company: string;
    location: string;
    time: string;
    responsibilities: string[];
  }[];
  education: {
    degree_type: string;
    degree: string;
    university_name: string;
    time: string;
    location: string;
    GPA: string;
    transcript: string[];
  }[];
  projects: {
    name: string;
    bullet_points: string[];
    date: string;
  }[];
  awards: {
    name: string;
    explanation: string;
  }[];
  publications: {
    name: string;
    publisher: string;
    link: string;
    time: string;
  }[];
  certifications: any[];
  custom_sections: {
    enabled: string[];
    order: string[];
  };
  is_active: boolean;
  version: string;
  created_at: string;
  updated_at: string;
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
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `portfolio-tab-${index}`,
    'aria-controls': `portfolio-tabpanel-${index}`,
  };
}

const PortfolioPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [portfolio, setPortfolio] = useState<ApiPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const portfolios = await getUserPortfolios();
      if (portfolios && portfolios.length > 0) {
        // Use the portfolio as is from the API response
        const portfolioData = portfolios[0] as unknown as ApiPortfolio;
        console.log('Portfolio data:', portfolioData);
        console.log('Career summary job titles:', portfolioData.career_summary?.job_titles);
        console.log('Skills categories:', portfolioData.skills?.map(s => s.category));
        setPortfolio(portfolioData);
      } else {
        // If no portfolio exists, create one
        const newPortfolio = await createPortfolio({});
        setPortfolio(newPortfolio as unknown as ApiPortfolio);
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio:', err);
      setError('Failed to load your portfolio. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveChanges = () => {
    // Implement saving functionality
    console.log('Save changes');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!portfolio) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">
          No portfolio found. Please create your portfolio.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={fetchPortfolio}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Portfolio
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Box>

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="portfolio tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Personal Info" {...a11yProps(0)} />
            <Tab icon={<WorkIcon />} label="Skills" {...a11yProps(1)} />
            <Tab icon={<WorkIcon />} label="Work Experience" {...a11yProps(2)} />
            <Tab icon={<EducationIcon />} label="Education" {...a11yProps(3)} />
            <Tab icon={<ProjectsIcon />} label="Projects" {...a11yProps(4)} />
            <Tab icon={<CertificationsIcon />} label="Certifications" {...a11yProps(5)} />
            <Tab icon={<AwardsIcon />} label="Awards" {...a11yProps(6)} />
            <Tab icon={<PublicationsIcon />} label="Publications" {...a11yProps(7)} />
          </Tabs>
        </Box>

        {/* Personal Information */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" gutterBottom>PROFESSIONAL TITLES</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {portfolio.career_summary && portfolio.career_summary.job_titles && portfolio.career_summary.job_titles.length > 0 ? (
                    portfolio.career_summary.job_titles.map((title, idx) => (
                      <Chip key={idx} label={title} color="primary" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No professional titles added yet</Typography>
                  )}
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" gutterBottom>YEARS OF EXPERIENCE</Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  {portfolio.career_summary && portfolio.career_summary.years_of_experience 
                    ? `${portfolio.career_summary.years_of_experience} years` 
                    : 'Not specified'}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" gutterBottom>SUMMARY</Typography>
                <Typography variant="body1">
                  {portfolio.career_summary && portfolio.career_summary.default_summary 
                    ? portfolio.career_summary.default_summary
                    : 'No career summary provided yet'}
                </Typography>
              </Box>
              
              <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">CAREER PROFILE</Typography>
                {portfolio.career_summary && portfolio.career_summary.job_titles && portfolio.career_summary.job_titles.length > 0 ? (
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {portfolio.career_summary.job_titles.slice(0, 3).join(' / ')}
                  </Typography>
                ) : (
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, opacity: 0.7 }}>
                    Professional
                  </Typography>
                )}
                <Typography variant="body1">
                  {portfolio.career_summary 
                    ? `${portfolio.career_summary.years_of_experience || ''} years of experience ${portfolio.career_summary.default_summary || ''}` 
                    : 'Add your career summary to showcase your professional experience'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Skills */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Skills
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.skills && portfolio.skills.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {portfolio.skills.map((skillCategory, index) => {
                  // Create a deterministic color from the category name
                  const colorIndex = index % 5; // 5 different colors
                  const chipColors = ['primary', 'secondary', 'success', 'info', 'warning'];
                  const chipColor = chipColors[colorIndex] as 'primary' | 'secondary' | 'success' | 'info' | 'warning';
                  
                  // Get the actual skills array
                  let skillsArray: string[] = [];
                  
                  if ('skills' in skillCategory && Array.isArray(skillCategory.skills)) {
                    skillsArray = skillCategory.skills;
                    console.log(`Category ${skillCategory.category} has skills:`, skillsArray);
                  } else {
                    console.log(`Category ${skillCategory.category} has NO skills array!`);
                    console.log('Category structure:', JSON.stringify(skillCategory, null, 2));
                  }
                  
                  return (
                    <Box key={index}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          color: `${chipColor}.main`,
                          fontWeight: 'bold',
                          pb: 0.5,
                          borderBottom: 1,
                          borderColor: `${chipColor}.light`,
                          display: 'inline-block'
                        }}
                      >
                        {skillCategory.category}
                      </Typography>
                      
                      {skillsArray.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 1 }}>
                          {skillsArray.map((skill, idx) => (
                            <Chip 
                              key={idx} 
                              label={skill} 
                              color={chipColor}
                              variant="outlined"
                              size="medium"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary" sx={{ ml: 1 }}>
                          No skills found in this category
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Alert severity="info">
                No skills added yet. Add skills to showcase your expertise.
              </Alert>
            )}
          </Box>
        </TabPanel>

        {/* Work Experience */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.work_experience && portfolio.work_experience.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {portfolio.work_experience.map((job, index) => (
                  <Box key={index} sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper', 
                    borderRadius: 2, 
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">{job.job_title}</Typography>
                        <Typography variant="subtitle1" fontWeight="medium">{job.company}</Typography>
                        <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                      </Box>
                      <Chip 
                        label={job.time} 
                        size="small" 
                        color="secondary" 
                        sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-start' }, mt: { xs: 1, sm: 0 } }}
                      />
                    </Box>
                    
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
                          Key Responsibilities:
                        </Typography>
                        <Box component="ol" sx={{ m: 0, pl: 3 }}>
                          {job.responsibilities.map((responsibility, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                {responsibility}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1">
                No work experience added yet. Add your professional history.
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Education */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Education
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.education && portfolio.education.length > 0 ? (
              <Stack spacing={3}>
                {portfolio.education.map((edu, index) => (
                  <Box key={index} sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper', 
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">{edu.degree}</Typography>
                        <Typography variant="subtitle1" fontWeight="medium">{edu.university_name}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'flex-start', sm: 'flex-end' }, 
                        mt: { xs: 1, sm: 0 }
                      }}>
                        <Chip 
                          label={edu.time} 
                          size="small" 
                          color="secondary" 
                          sx={{ mb: 1 }}
                        />
                        <Chip 
                          label={`GPA: ${edu.GPA}`} 
                          size="small" 
                          color="info" 
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary">{edu.degree_type}</Typography>
                      <Typography variant="body2" color="text.secondary">•</Typography>
                      <Typography variant="body2" color="text.secondary">{edu.location}</Typography>
                    </Box>
                    
                    {edu.transcript && edu.transcript.length > 0 && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                          COURSEWORK
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1, 
                          maxHeight: edu.transcript.length > 15 ? '150px' : 'auto',
                          overflowY: edu.transcript.length > 15 ? 'auto' : 'visible',
                          pr: 1
                        }}>
                          {edu.transcript.map((course, idx) => (
                            <Chip 
                              key={idx} 
                              label={course} 
                              size="small" 
                              variant="outlined"
                              color={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "secondary" : "default"}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1">
                No education history added yet. Add your academic background.
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Projects */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Projects
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.projects && portfolio.projects.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {portfolio.projects.map((project, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper', 
                      borderRadius: 2,
                      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">{project.name}</Typography>
                      <Chip 
                        label={project.date} 
                        size="small" 
                        color="secondary" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    {project.bullet_points && project.bullet_points.length > 0 && (
                      <>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
                          Key Features:
                        </Typography>
                        <Box component="ol" sx={{ m: 0, pl: 3 }}>
                          {project.bullet_points.map((point, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                {point}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No projects added yet. Showcase your work by adding projects.
              </Alert>
            )}
          </Box>
        </TabPanel>

        {/* Certifications */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Certifications
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.certifications && portfolio.certifications.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {portfolio.certifications.map((cert, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      py: 2, 
                      px: 3,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 4,
                      boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <Badge 
                      sx={{ 
                        mr: 1.5, 
                        color: 'primary.main',
                        fontSize: '1.2rem'
                      }} 
                    /> 
                    <Typography fontWeight="medium">
                      {typeof cert === 'string' ? cert : cert.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1">
                No certifications added yet. Add your professional certifications.
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Awards */}
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Awards
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.awards && portfolio.awards.length > 0 ? (
              <Stack spacing={3}>
                {portfolio.awards.map((award, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                      borderLeft: '4px solid gold',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        width: 24,
                        height: 24,
                        backgroundImage: 'radial-gradient(circle, gold 0%, transparent 60%)',
                        borderRadius: '50%',
                        opacity: 0.6
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                      {award.name}
                    </Typography>
                    <Typography variant="body2">
                      {award.explanation}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1">
                No awards added yet. Add your achievements.
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Publications */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Publications
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {portfolio.publications && portfolio.publications.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {portfolio.publications.map((pub, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                      {pub.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      {pub.publisher} • {pub.time}
                    </Typography>
                    
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      {pub.link && (
                        <Button 
                          variant="text" 
                          size="small" 
                          href={pub.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          View Publication →
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1">
                No publications added yet. Add your research or articles.
              </Typography>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PortfolioPage; 
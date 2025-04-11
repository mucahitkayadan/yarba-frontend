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
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Code as ProjectsIcon,
  EmojiEvents as AwardsIcon,
  MenuBook as PublicationsIcon,
  Badge as CertificationsIcon
} from '@mui/icons-material';
import { getUserPortfolios, getPortfolioById } from '../../services/portfolioService';
import { Portfolio } from '../../types/models';

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

// Define the actual API response structure that PortfolioViewPage uses
interface ViewPortfolio {
  id: string;
  user_id: string;
  profile_id: string;
  career_summary?: {
    job_titles: string[];
    years_of_experience: string;
    default_summary: string;
  };
  skills?: Array<{
    category: string;
    items?: string[];
    skills?: string[];
  }>;
  work_experience?: {
    job_title?: string;
    company: string;
    position?: string;
    location?: string;
    time?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
    responsibilities?: string[];
    achievements?: string[];
  }[];
  education?: {
    institution: string;
    degree: string;
    field_of_study: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
    courses?: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    url?: string;
    start_date?: string;
    end_date?: string;
    current: boolean;
    technologies: string[];
    achievements: string[];
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
    description?: string;
  }[];
  awards?: {
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }[];
  publications?: {
    title: string;
    publisher: string;
    date: string;
    url?: string;
    description?: string;
    authors?: string[];
  }[];
  created_at?: string;
  updated_at?: string;
}

const PortfolioViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [portfolio, setPortfolio] = useState<ViewPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      // If ID is provided, fetch specific portfolio, otherwise get user's portfolios
      let portfolioData: ViewPortfolio | null = null;
      
      if (id) {
        const response = await getPortfolioById(id);
        portfolioData = response;
      } else {
        const portfolios = await getUserPortfolios();
        if (portfolios && portfolios.length > 0) {
          portfolioData = portfolios[0];
        }
      }
      
      if (portfolioData) {
        console.log('Portfolio data:', JSON.stringify(portfolioData, null, 2));
        
        // Debug skills structure
        if (portfolioData.skills && portfolioData.skills.length > 0) {
          console.log('Number of skill categories:', portfolioData.skills.length);
          
          portfolioData.skills.forEach((category, index) => {
            console.log(`Skill category ${index + 1}:`, category.category);
            
            if ('skills' in category && Array.isArray(category.skills)) {
              console.log(`  - Skills array found with ${category.skills.length} skills`);
              console.log(`  - First few skills: ${category.skills.slice(0, 3).join(', ')}...`);
            } else if ('items' in category && Array.isArray(category.items)) {
              console.log(`  - Items array found with ${category.items.length} skills`);
              console.log(`  - First few items: ${category.items.slice(0, 3).join(', ')}...`);
            } else {
              console.log('  - No skills or items array found in this category!');
              console.log('  - Category structure:', JSON.stringify(category, null, 2));
            }
          });
        } else {
          console.log('No skills data found in portfolio');
        }
      }
      
      setPortfolio(portfolioData);
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

  const handleEditClick = () => {
    if (portfolio) {
      navigate(`/portfolio/${portfolio.id}/edit`);
    }
  };

  const handleCreateClick = () => {
    navigate('/portfolio/create');
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
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Portfolio
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            You don't have a portfolio yet. Creating a portfolio is essential for organizing your professional information and generating targeted resumes and cover letters.
          </Alert>
          
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Create New Portfolio
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Portfolio
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
        >
          Edit Portfolio
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
            <Tab icon={<PersonIcon />} label="Summary" />
            <Tab icon={<WorkIcon />} label="Skills" />
            <Tab icon={<WorkIcon />} label="Work Experience" />
            <Tab icon={<EducationIcon />} label="Education" />
            <Tab icon={<ProjectsIcon />} label="Projects" />
            <Tab icon={<CertificationsIcon />} label="Certifications" />
            <Tab icon={<AwardsIcon />} label="Awards" />
            <Tab icon={<PublicationsIcon />} label="Publications" />
          </Tabs>
        </Box>

        {/* Career Summary */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Career Summary</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Job Titles</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {portfolio.career_summary && portfolio.career_summary.job_titles && portfolio.career_summary.job_titles.length > 0 ? (
                portfolio.career_summary.job_titles.map((title: string, index: number) => (
                  <Chip key={index} label={title} color="primary" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No job titles specified</Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Professional Summary</Typography>
            <Typography variant="body1">
              {portfolio.career_summary && portfolio.career_summary.default_summary ? (
                portfolio.career_summary.default_summary
              ) : (
                "No professional summary provided yet."
              )}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Years of Experience</Typography>
            <Typography variant="body1">
              {portfolio.career_summary && portfolio.career_summary.years_of_experience ? (
                `${portfolio.career_summary.years_of_experience} years`
              ) : (
                "Not specified"
              )}
            </Typography>
          </Box>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.skills && portfolio.skills.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {portfolio.skills.map((skillCategory, index) => {
                // Create a deterministic color based on index
                const colorIndex = index % 5;
                const colors = ['primary', 'secondary', 'success', 'info', 'warning'];
                const color = colors[colorIndex] as 'primary' | 'secondary' | 'success' | 'info' | 'warning';
                
                // Determine where the skills are stored (could be in 'items' or 'skills' property)
                let skillsArray: string[] = [];
                
                if ('skills' in skillCategory && Array.isArray(skillCategory.skills)) {
                  skillsArray = skillCategory.skills;
                  console.log(`Category ${skillCategory.category} has skills:`, skillsArray);
                } else if ('items' in skillCategory && Array.isArray(skillCategory.items)) {
                  skillsArray = skillCategory.items;
                  console.log(`Category ${skillCategory.category} has items:`, skillsArray);
                } else {
                  console.log(`Category ${skillCategory.category} has no skills or items arrays!`);
                }
                
                return (
                  <Box key={index}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        color: `${color}.main`,
                        fontWeight: 'bold',
                        pb: 0.5,
                        borderBottom: 1,
                        borderColor: `${color}.light`,
                        display: 'inline-block'
                      }}
                    >
                      {skillCategory.category}
                    </Typography>
                    
                    {skillsArray.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 1 }}>
                        {skillsArray.map((skill, skillIndex) => (
                          <Chip 
                            key={skillIndex} 
                            label={skill} 
                            color={color}
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
            <Typography variant="body2" color="text.secondary">No skills added yet</Typography>
          )}
        </TabPanel>

        {/* Work Experience Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Work Experience</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.work_experience && portfolio.work_experience.map((job, index) => (
            <Box key={index} sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' 
            }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {job.job_title || job.position || 'Untitled Position'}
                  </Typography>
                  <Typography variant="subtitle1">{job.company}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                <Chip 
                  label={job.time || (job.start_date && `${job.start_date}${job.end_date ? ` - ${job.end_date}` : ''}${job.current ? ' - Present' : ''}`)}
                  size="small" 
                  color="secondary" 
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-start' }, mt: { xs: 1, sm: 0 } }}
                />
              </Box>
              
              {job.description && (
                <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                  {job.description}
                </Typography>
              )}
              
              {job.responsibilities && job.responsibilities.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Key Responsibilities:</Typography>
                  <Box component="ol" sx={{ m: 0, pl: 3 }}>
                    {job.responsibilities.map((responsibility, responsibilityIndex) => (
                      <Box component="li" key={responsibilityIndex} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {responsibility}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {job.achievements && job.achievements.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Key Achievements:</Typography>
                  <Box component="ol" sx={{ m: 0, pl: 3 }}>
                    {job.achievements.map((achievement, achievementIndex) => (
                      <Box component="li" key={achievementIndex} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {achievement}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          ))}
          {(!portfolio.work_experience || portfolio.work_experience.length === 0) && (
            <Typography variant="body2" color="text.secondary">No work experience added yet</Typography>
          )}
        </TabPanel>

        {/* Education Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Education</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.education && portfolio.education.map((edu, index) => (
            <Paper key={index} elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">{edu.degree}</Typography>
              <Typography variant="subtitle1">{edu.institution}</Typography>
              <Typography variant="body2" color="text.secondary">
                {edu.start_date} - {edu.current ? 'Present' : edu.end_date} | {edu.field_of_study}
                {edu.location && ` | ${edu.location}`}
              </Typography>
              
              {edu.description && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {edu.description}
                </Typography>
              )}
              
              {edu.courses && edu.courses.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Relevant Courses:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {edu.courses.map((course, courseIndex) => (
                      <Chip key={courseIndex} label={course} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
          {(!portfolio.education || portfolio.education.length === 0) && (
            <Typography variant="body2" color="text.secondary">No education details added yet</Typography>
          )}
        </TabPanel>

        {/* Projects Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Projects</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.projects && portfolio.projects.map((project, index) => (
            <Box key={index} sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' 
            }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">{project.name}</Typography>
                <Chip 
                  label={`${project.start_date || ''}${project.end_date ? ` - ${project.end_date}` : ''}${project.current ? ' - Present' : ''}`}
                  size="small" 
                  color="secondary" 
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-start' }, mt: { xs: 1, sm: 0 } }}
                />
              </Box>
              
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                {project.description}
              </Typography>
              
              {project.technologies && project.technologies.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Technologies:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.technologies.map((tech, techIndex) => (
                      <Chip key={techIndex} label={tech} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {project.achievements && project.achievements.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Key Achievements:</Typography>
                  <Box component="ol" sx={{ m: 0, pl: 3 }}>
                    {project.achievements.map((achievement, achievementIndex) => (
                      <Box component="li" key={achievementIndex} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {achievement}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              
              {project.url && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </Button>
              )}
            </Box>
          ))}
          {(!portfolio.projects || portfolio.projects.length === 0) && (
            <Typography variant="body2" color="text.secondary">No projects added yet</Typography>
          )}
        </TabPanel>

        {/* Certifications Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>Certifications</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {portfolio.certifications && portfolio.certifications.map((cert, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>{cert.name}</Typography>
                  <Typography variant="body2">Issuer: {cert.issuer}</Typography>
                  <Typography variant="body2" color="text.secondary">Date: {cert.date}</Typography>
                  {cert.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>{cert.description}</Typography>
                  )}
                  {cert.url && (
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
            {(!portfolio.certifications || portfolio.certifications.length === 0) && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">No certifications added yet</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Awards Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>Awards & Honors</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {portfolio.awards && portfolio.awards.map((award, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>{award.title}</Typography>
                  <Typography variant="body2">Issuer: {award.issuer}</Typography>
                  <Typography variant="body2" color="text.secondary">Date: {award.date}</Typography>
                  {award.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>{award.description}</Typography>
                  )}
                </Paper>
              </Grid>
            ))}
            {(!portfolio.awards || portfolio.awards.length === 0) && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">No awards added yet</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Publications Tab */}
        <TabPanel value={tabValue} index={7}>
          <Typography variant="h6" gutterBottom>Publications</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.publications && portfolio.publications.map((pub, index) => (
            <Paper key={index} elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">{pub.title}</Typography>
              <Typography variant="subtitle1">{pub.publisher}</Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {pub.date}
              </Typography>
              
              {pub.authors && pub.authors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Authors: {pub.authors.join(', ')}
                  </Typography>
                </Box>
              )}
              
              {pub.description && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {pub.description}
                </Typography>
              )}
              
              {pub.url && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Publication
                </Button>
              )}
            </Paper>
          ))}
          {(!portfolio.publications || portfolio.publications.length === 0) && (
            <Typography variant="body2" color="text.secondary">No publications added yet</Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PortfolioViewPage; 
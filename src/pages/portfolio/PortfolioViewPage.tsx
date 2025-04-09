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

const PortfolioViewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
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
      let portfolioData: Portfolio | null = null;
      
      if (id) {
        const response = await getPortfolioById(id);
        portfolioData = response;
      } else {
        const portfolios = await getUserPortfolios();
        if (portfolios && portfolios.length > 0) {
          portfolioData = portfolios[0];
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
              {portfolio.skills && portfolio.skills.map((skill, index) => (
                <Chip key={index} label={skill.category} />
              ))}
              {(!portfolio.skills || portfolio.skills.length === 0) && (
                <Typography variant="body2" color="text.secondary">No job titles specified</Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Professional Summary</Typography>
            <Typography variant="body1">
              {/* Replace with actual career summary once API structure is finalized */}
              A professional with experience in various roles, focused on delivering high-quality results and continuous improvement.
            </Typography>
          </Box>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {portfolio.skills && portfolio.skills.map((skillCategory, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>{skillCategory.category}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skillCategory.items && skillCategory.items.map((skill, skillIndex) => (
                      <Chip key={skillIndex} label={skill} size="small" />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
            {(!portfolio.skills || portfolio.skills.length === 0) && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">No skills added yet</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Work Experience Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Work Experience</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {portfolio.work_experience && portfolio.work_experience.map((job, index) => (
            <Paper key={index} elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">{job.position}</Typography>
              <Typography variant="subtitle1">{job.company}</Typography>
              <Typography variant="body2" color="text.secondary">
                {job.start_date} - {job.current ? 'Present' : job.end_date} | {job.location}
              </Typography>
              
              {job.description && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {job.description}
                </Typography>
              )}
              
              {job.achievements && job.achievements.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Key Achievements:</Typography>
                  <List dense disablePadding>
                    {job.achievements.map((achievement, achievementIndex) => (
                      <ListItem key={achievementIndex} sx={{ py: 0.5 }}>
                        <ListItemText primary={achievement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Paper>
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
            <Paper key={index} elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {project.start_date && `${project.start_date}`}
                {project.end_date && ` - ${project.end_date}`}
                {project.current && ' - Present'}
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 2 }}>
                {project.description}
              </Typography>
              
              {project.technologies && project.technologies.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Technologies:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.technologies.map((tech, techIndex) => (
                      <Chip key={techIndex} label={tech} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {project.achievements && project.achievements.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Key Achievements:</Typography>
                  <List dense disablePadding>
                    {project.achievements.map((achievement, achievementIndex) => (
                      <ListItem key={achievementIndex} sx={{ py: 0.5 }}>
                        <ListItemText primary={achievement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
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
            </Paper>
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
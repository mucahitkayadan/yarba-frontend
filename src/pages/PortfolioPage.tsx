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
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Code as ProjectsIcon,
  EmojiEvents as AwardsIcon,
  MenuBook as PublicationsIcon,
  Badge as CertificationsIcon
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
        setPortfolio(portfolios[0] as unknown as ApiPortfolio);
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
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Professional Titles</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {portfolio.career_summary.job_titles.map((title, idx) => (
                      <Chip key={idx} label={title} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Years of Experience</Typography>
                  <Typography>{portfolio.career_summary.years_of_experience} years</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Summary</Typography>
                  <Typography>{portfolio.career_summary.default_summary}</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Card elevation={1} sx={{ mb: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Career Profile</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {portfolio.career_summary.job_titles[0]}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      {portfolio.career_summary.years_of_experience} years of experience {portfolio.career_summary.default_summary}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Skills */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {portfolio.skills && portfolio.skills.length > 0 ? (
                portfolio.skills.map((skillCategory, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', md: 'calc(50% - 24px)' }, mb: 2 }}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          {skillCategory.category}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {skillCategory.skills.map((skill, idx) => (
                            <Chip 
                              key={idx} 
                              label={skill} 
                              color="primary" 
                              variant="outlined" 
                              size="small"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">
                  No skills added yet. Add skills to showcase your expertise.
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Work Experience */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              {portfolio.work_experience && portfolio.work_experience.length > 0 ? (
                portfolio.work_experience.map((job, index) => (
                  <Card elevation={1} key={index}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{job.job_title}</Typography>
                      <Typography variant="subtitle1" color="primary">{job.company}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {job.location} | {job.time}
                      </Typography>
                      
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>Responsibilities:</Typography>
                          <List dense>
                            {job.responsibilities.map((responsibility, idx) => (
                              <ListItem key={idx} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                                <ListItemText primary={responsibility} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No work experience added yet. Add your professional history.
                </Typography>
              )}
            </Stack>
          </Box>
        </TabPanel>

        {/* Education */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              {portfolio.education && portfolio.education.length > 0 ? (
                portfolio.education.map((edu, index) => (
                  <Card elevation={1} key={index}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{edu.degree}</Typography>
                      <Typography variant="subtitle1" color="primary">{edu.university_name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {edu.degree_type} | {edu.location} | {edu.time} | GPA: {edu.GPA}
                      </Typography>
                      
                      {edu.transcript && edu.transcript.length > 0 && (
                        <>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>Courses:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {edu.transcript.map((course, idx) => (
                              <Chip key={idx} label={course} size="small" />
                            ))}
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No education history added yet. Add your academic background.
                </Typography>
              )}
            </Stack>
          </Box>
        </TabPanel>

        {/* Projects */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {portfolio.projects && portfolio.projects.length > 0 ? (
                portfolio.projects.map((project, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', md: 'calc(50% - 24px)' }, mb: 2 }}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">{project.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {project.date}
                        </Typography>
                        
                        {project.bullet_points && project.bullet_points.length > 0 && (
                          <List dense>
                            {project.bullet_points.map((point, idx) => (
                              <ListItem key={idx} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                                <ListItemText primary={point} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">
                  No projects added yet. Showcase your work by adding projects.
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Certifications */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {portfolio.certifications && portfolio.certifications.length > 0 ? (
                portfolio.certifications.map((cert, index) => (
                  <Chip 
                    key={index} 
                    label={typeof cert === 'string' ? cert : cert.name} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mb: 1 }}
                  />
                ))
              ) : (
                <Typography variant="body1">
                  No certifications added yet. Add your professional certifications.
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Awards */}
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Awards
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {portfolio.awards && portfolio.awards.length > 0 ? (
                portfolio.awards.map((award, index) => (
                  <Card elevation={1} key={index}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{award.name}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{award.explanation}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No awards added yet. Add your achievements.
                </Typography>
              )}
            </Stack>
          </Box>
        </TabPanel>

        {/* Publications */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Publications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {portfolio.publications && portfolio.publications.length > 0 ? (
                portfolio.publications.map((pub, index) => (
                  <Card elevation={1} key={index}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{pub.name}</Typography>
                      <Typography variant="subtitle1" color="primary">{pub.publisher}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {pub.time}
                      </Typography>
                      
                      {pub.link && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          href={pub.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1 }}
                        >
                          View Publication
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No publications added yet. Add your research or articles.
                </Typography>
              )}
            </Stack>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PortfolioPage; 
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Divider
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
import { getUserPortfolio } from '../services/portfolioService';
import { Portfolio } from '../types/models';

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
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserPortfolio();
      setPortfolio(data);
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
            {/* Personal information form components would go here */}
            <Typography variant="body1">
              This section will contain form fields for editing personal information.
            </Typography>
          </Box>
        </TabPanel>

        {/* Skills */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Skills form components would go here */}
            <Typography variant="body1">
              Current Skills Categories: {portfolio.skills.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Work Experience */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Work experience form components would go here */}
            <Typography variant="body1">
              Current Positions: {portfolio.work_experience.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Education */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Education form components would go here */}
            <Typography variant="body1">
              Current Education Entries: {portfolio.education.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Projects */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Projects form components would go here */}
            <Typography variant="body1">
              Current Projects: {portfolio.projects.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Certifications */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Certifications form components would go here */}
            <Typography variant="body1">
              Current Certifications: {portfolio.certifications.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Awards */}
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Awards
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Awards form components would go here */}
            <Typography variant="body1">
              Current Awards: {portfolio.awards.length}
            </Typography>
          </Box>
        </TabPanel>

        {/* Publications */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Publications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Publications form components would go here */}
            <Typography variant="body1">
              Current Publications: {portfolio.publications.length}
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PortfolioPage; 
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
  Chip,
  Stack,
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
import { getUserPortfolio, createPortfolio } from '../../services/portfolioService';
import { Portfolio } from '../../types/models';

// Define the actual API response structure
interface ApiPortfolio {
  id: string;
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
      try {
        const portfolio = await getUserPortfolio();
        const portfolioData = portfolio as unknown as ApiPortfolio;
        console.log('Portfolio data:', portfolioData);
        console.log('Career summary job titles:', portfolioData.career_summary?.job_titles);
        console.log('Skills categories:', portfolioData.skills?.map(s => s.category));
        setPortfolio(portfolioData);
      } catch (error: any) {
        // If portfolio doesn't exist or other error, create one
        if (error.response?.status === 404) {
          const newPortfolio = await createPortfolio({});
          setPortfolio(newPortfolio as unknown as ApiPortfolio);
        } else {
          throw error;
        }
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
    <div>
      {/* Rest of the component content */}
    </div>
  );
};

export default PortfolioPage; 
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Button, 
  TextField, 
  CircularProgress, 
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Link,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline, Language } from '@mui/icons-material';
import { 
  createPortfolioWebsite, 
  getPortfolioWebsite, 
  checkSubdomainAvailability, 
  deployPortfolioWebsite,
  deletePortfolioWebsite,
  getDeploymentStatus
} from '../services/websiteService';
import { PortfolioWebsiteResponse, PortfolioWebsiteConfig, SubdomainAvailabilityResponse, DeploymentStatus } from '../types/models';
import debounce from 'lodash/debounce';

const THEMES = [
  { 
    name: 'Modern', 
    value: 'modern', 
    previewImage: '/assets/website_template_1.png', 
    description: 'A clean and professional look for your portfolio.'
  },
  // Add more themes here as they become available
];

const DEFAULT_CONFIG: PortfolioWebsiteConfig = {
  theme: 'modern',
  primary_color: '#3B82F6',
  secondary_color: '#1F2937',
  social_media_enabled: true,
  enabled_sections: ['about', 'experience', 'education', 'skills', 'projects', 'contact'],
  section_order: ['about', 'experience', 'education', 'skills', 'projects', 'contact'],
  contact_form_enabled: true,
};

const WebsitePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<string>(THEMES[0].value);
  const [subdomain, setSubdomain] = useState<string>('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [suggestedSubdomains, setSuggestedSubdomains] = useState<string[]>([]);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState<PortfolioWebsiteResponse | null>(null);
  const [deploymentPollInterval, setDeploymentPollInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchUserWebsite = useCallback(async () => {
    setIsLoading(true);
    try {
      const existingWebsite = await getPortfolioWebsite();
      setWebsite(existingWebsite);
      if (existingWebsite) {
        setActiveStep(2); // Skip to management if website exists
        setSelectedTheme(existingWebsite.config.theme);
        setSubdomain(existingWebsite.subdomain);
        if (isDeploymentInProgress(existingWebsite.deployment_status)) {
          pollDeploymentStatus();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch website data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserWebsite();
    return () => {
      if (deploymentPollInterval) clearInterval(deploymentPollInterval);
    };
  }, [fetchUserWebsite, deploymentPollInterval]);

  const debouncedCheckSubdomain = useCallback(
    debounce(async (name: string) => {
      if (!name || name.length < 3) {
        setSubdomainAvailable(null);
        setSubdomainError('Subdomain must be at least 3 characters long.');
        setSuggestedSubdomains([]);
        return;
      }
      setIsCheckingSubdomain(true);
      setSubdomainError(null);
      try {
        const response = await checkSubdomainAvailability(name);
        setSubdomainAvailable(response.available);
        if (!response.available) {
          setSubdomainError('This subdomain is not available.');
          setSuggestedSubdomains(response.suggested_alternatives || []);
        } else {
          setSuggestedSubdomains([]);
        }
      } catch (err: any) {
        setSubdomainAvailable(null);
        setSubdomainError(err.message || 'Error checking subdomain.');
        setSuggestedSubdomains([]);
      } finally {
        setIsCheckingSubdomain(false);
      }
    }, 500), // 500ms debounce time
    []
  );

  const handleSubdomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubdomain = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(newSubdomain);
    if (newSubdomain) {
      debouncedCheckSubdomain(newSubdomain);
    }
  };

  const handleCreateAndDeploy = async () => {
    if (!subdomain || !subdomainAvailable) {
      setError('Please enter a valid and available subdomain.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const config: PortfolioWebsiteConfig = { ...DEFAULT_CONFIG, theme: selectedTheme };
      const newWebsite = await createPortfolioWebsite(config, subdomain);
      setWebsite(newWebsite);
      setActiveStep(2);
      if (isDeploymentInProgress(newWebsite.deployment_status)){
        pollDeploymentStatus();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to create website.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeploy = async () => {
    if (!website) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedWebsite = await deployPortfolioWebsite(true); // Force rebuild
      setWebsite(updatedWebsite);
      if (isDeploymentInProgress(updatedWebsite.deployment_status)){
        pollDeploymentStatus();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to redeploy website.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!website) return;
    if (!window.confirm('Are you sure you want to delete your portfolio website? This action cannot be undone.')) return;
    setIsLoading(true);
    setError(null);
    try {
      await deletePortfolioWebsite();
      setWebsite(null);
      setActiveStep(0);
      setSubdomain('');
      setSelectedTheme(THEMES[0].value);
      setSubdomainAvailable(null);
      setSubdomainError(null);
      if (deploymentPollInterval) clearInterval(deploymentPollInterval);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete website.');
    } finally {
      setIsLoading(false);
    }
  }

  const pollDeploymentStatus = useCallback(() => {
    if (deploymentPollInterval) clearInterval(deploymentPollInterval);
    const interval = setInterval(async () => {
      try {
        const statusData = await getDeploymentStatus();
        setWebsite(prev => prev ? { ...prev, deployment_status: statusData } : null);
        if (!isDeploymentInProgress(statusData)) {
          clearInterval(interval);
          setDeploymentPollInterval(null);
          fetchUserWebsite(); // Re-fetch to get final state
        }
      } catch (err) {
        console.error('Failed to poll deployment status:', err);
        // Optionally stop polling on error or notify user
      }
    }, 10000); // Poll every 10 seconds
    setDeploymentPollInterval(interval);
  }, [deploymentPollInterval, fetchUserWebsite]);

  const isDeploymentInProgress = (status: DeploymentStatus | undefined): boolean => {
    return !!status && (status.status === 'pending' || status.status === 'building');
  }

  const steps = [
    {
      label: 'Select Theme',
      content: (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {THEMES.map((theme) => (
            <Grid item xs={12} sm={6} md={4} key={theme.value}>
              <Card 
                sx={{ 
                  border: selectedTheme === theme.value ? '2px solid' : '2px solid transparent',
                  borderColor: selectedTheme === theme.value ? 'primary.main' : 'transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onClick={() => setSelectedTheme(theme.value)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={theme.previewImage}
                  alt={theme.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {theme.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {theme.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
           <Grid item xs={12} sx={{ textAlign: 'right'}}>
            <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!selectedTheme}>
              Next
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Choose Subdomain & Deploy',
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Subdomain"
            variant="outlined"
            value={subdomain}
            onChange={handleSubdomainChange}
            helperText={subdomainError || (subdomainAvailable === false && suggestedSubdomains.length > 0 ? `Try: ${suggestedSubdomains.join(', ')}` : 'e.g., yourname.yarba.app (min 3 chars, a-z, 0-9, - allowed)')}
            error={subdomainAvailable === false || !!subdomainError}
            InputProps={{
              endAdornment: isCheckingSubdomain ? <CircularProgress size={20} /> : 
                            (subdomainAvailable === true ? <CheckCircleOutline color="success" /> : 
                             (subdomainAvailable === false ? <ErrorOutline color="error" /> : null))
            }}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleCreateAndDeploy} 
            disabled={isLoading || !subdomain || subdomainAvailable !== true}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Language />}
          >
            Create & Deploy Website
          </Button>
        </Box>
      ),
    },
    {
      label: 'Manage Website',
      content: (
        <Box sx={{ mt: 2 }}>
          {website && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Your Portfolio Website is Live!</Typography>
              <Typography variant="body1" gutterBottom>
                Access it at: <Link href={website.website_url} target="_blank" rel="noopener">{website.website_url}</Link>
              </Typography>
              <Chip 
                label={`Deployment: ${website.deployment_status.status}`}
                color={website.deployment_status.status === 'success' ? 'success' : (isDeploymentInProgress(website.deployment_status) ? 'info' : 'error')}
                icon={isDeploymentInProgress(website.deployment_status) ? <CircularProgress size={16} color="inherit" /> : undefined}
                sx={{ my:1 }}
              />
              {website.deployment_status.status === 'failed' && (
                <Alert severity="error" sx={{my:1}}>Error: {website.deployment_status.error_message || 'Deployment failed'}</Alert>
              )}
              {isDeploymentInProgress(website.deployment_status) && (
                <Alert severity="info" sx={{my:1}}>Your website is currently {website.deployment_status.status}. This page will update automatically.</Alert>
              )}
               <Box sx={{ mt: 2, display: 'flex', gap: 2}}>
                <Button 
                    variant="contained" 
                    onClick={handleRedeploy} 
                    disabled={isLoading || isDeploymentInProgress(website.deployment_status)}
                    startIcon={isLoading && isDeploymentInProgress(website.deployment_status) ? <CircularProgress size={20} /> : <Language />}
                >
                    Redeploy
                </Button>
                <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleDelete} 
                    disabled={isLoading || isDeploymentInProgress(website.deployment_status)}
                >
                    Delete Website
                </Button>
               </Box>
            </Paper>
          )}
        </Box>
      ),
    },
  ];

  if (isLoading && !website && activeStep ===0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading website information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom component="h1">
          Portfolio Website Management
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                onClick={() => !website || index < activeStep ? setActiveStep(index) : null}
                sx={{ cursor: (!website || index < activeStep) ? 'pointer' : 'default'}}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mb: 2, mt:2 }}>
                  <div>
                    {index > 0 && activeStep !== 2 && (
                        <Button
                            disabled={index === 0}
                            onClick={() => setActiveStep(prev => prev -1)}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            Back
                        </Button>
                    )}
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

      </Paper>
    </Container>
  );
};

export default WebsitePage; 
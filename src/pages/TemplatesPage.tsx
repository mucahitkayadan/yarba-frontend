import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Description as ResumeIcon,
  Mail as CoverLetterIcon,
  Code as PreambleIcon
} from '@mui/icons-material';
import { 
  getPreambles, 
  getResumeTemplates, 
  getCoverLetterTemplates 
} from '../services/templateService';
import { Preamble, TexHeader } from '../types/models';

// Unified template interface for display purposes
interface Template {
  id: string;
  name: string;
  description: string;
  preview_url?: string;
  created_at: string;
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
      id={`templates-tabpanel-${index}`}
      aria-labelledby={`templates-tab-${index}`}
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
    id: `templates-tab-${index}`,
    'aria-controls': `templates-tabpanel-${index}`,
  };
}

const TemplatesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [resumeTemplates, setResumeTemplates] = useState<Template[]>([]);
  const [coverLetterTemplates, setCoverLetterTemplates] = useState<Template[]>([]);
  const [preambles, setPreambles] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all template types in parallel
      const [preambleData, resumeData, coverLetterData] = await Promise.all([
        getPreambles(),
        getResumeTemplates(),
        getCoverLetterTemplates()
      ]);
      
      // Map to the unified Template interface
      setPreambles(preambleData.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || 'LaTeX preamble',
        created_at: p.created_at,
        preview_url: undefined
      })));
      
      // Convert each template to our unified Template interface
      // TypeScript type assertion to handle the unknown structure
      setResumeTemplates((resumeData as any[]).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || 'Resume template',
        created_at: t.created_at,
        preview_url: t.preview_url || undefined
      })));
      
      setCoverLetterTemplates((coverLetterData as any[]).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || 'Cover letter template',
        created_at: t.created_at,
        preview_url: t.preview_url || undefined
      })));
    } catch (err: any) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUseTemplate = (templateId: string, type: 'resume' | 'coverLetter' | 'preamble') => {
    // Implementation for using a template
    console.log(`Using ${type} template: ${templateId}`);
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
        <Button
          onClick={fetchTemplates}
          variant="outlined"
          size="small"
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Templates
      </Typography>

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="template tabs"
            variant="fullWidth"
          >
            <Tab icon={<ResumeIcon />} label="Resume Templates" {...a11yProps(0)} />
            <Tab icon={<CoverLetterIcon />} label="Cover Letter Templates" {...a11yProps(1)} />
            <Tab icon={<PreambleIcon />} label="LaTeX Preambles" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Resume Templates */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resume Templates
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {resumeTemplates.length === 0 ? (
              <Typography>No resume templates available</Typography>
            ) : (
              <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                {resumeTemplates.map((template) => (
                  <Box 
                    key={template.id} 
                    sx={{ 
                      width: { xs: '100%', sm: '45%', md: '30%' }, 
                      mb: 3 
                    }}
                  >
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={template.preview_url || '/static/images/template-placeholder.png'}
                        alt={template.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                          {template.description}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleUseTemplate(template.id, 'resume')}
                          fullWidth
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </TabPanel>

        {/* Cover Letter Templates */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cover Letter Templates
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {coverLetterTemplates.length === 0 ? (
              <Typography>No cover letter templates available</Typography>
            ) : (
              <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                {coverLetterTemplates.map((template) => (
                  <Box 
                    key={template.id} 
                    sx={{ 
                      width: { xs: '100%', sm: '45%', md: '30%' }, 
                      mb: 3 
                    }}
                  >
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={template.preview_url || '/static/images/template-placeholder.png'}
                        alt={template.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                          {template.description}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleUseTemplate(template.id, 'coverLetter')}
                          fullWidth
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </TabPanel>

        {/* LaTeX Preambles */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              LaTeX Preambles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {preambles.length === 0 ? (
              <Typography>No preambles available</Typography>
            ) : (
              <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                {preambles.map((preamble) => (
                  <Box 
                    key={preamble.id} 
                    sx={{ 
                      width: { xs: '100%', sm: '45%', md: '30%' }, 
                      mb: 3 
                    }}
                  >
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {preamble.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                          {preamble.description}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleUseTemplate(preamble.id, 'preamble')}
                          fullWidth
                        >
                          Use Preamble
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TemplatesPage; 
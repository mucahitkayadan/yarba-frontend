import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  CircularProgress, 
  Chip,
  Stack,
  Alert,
  Breadcrumbs,
  Link,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { getResumeById, getResumePdf } from '../services/resumeService';
import { Resume } from '../types/models';

const ViewResumePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getResumeById(id);
        setResume(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch resume:', err);
        setError(err.message || 'Failed to fetch resume details');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/resumes/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/resumes');
  };

  const handleDownloadPdf = async () => {
    if (!id || !resume) return;
    
    setGeneratingPdf(true);
    try {
      // Check if portfolio_id exists and is valid
      if (!resume.portfolio_id) {
        setError('This resume has no associated portfolio. Please update the resume with a valid portfolio first.');
        return;
      }
      
      const pdfBlob = await getResumePdf(id);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename
      const filename = `${resume.title}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to download PDF:', err);
      
      let errorMsg = 'Failed to download PDF';
      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await err.response.data.text();
          errorMsg = errorText || errorMsg;
        } catch (blobError) {
          // If we can't read the blob as text, use the default message
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Parse JSON if it's a string
  const parseJsonContent = (content: any) => {
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        return content;
      }
    }
    return content;
  };

  // Render sections based on content type
  const renderSection = (title: string, content: any) => {
    if (!content) return null;
    
    const parsedContent = parseJsonContent(content);
    
    return (
      <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {typeof parsedContent === 'string' ? (
          <Typography variant="body1" whiteSpace="pre-wrap">
            {parsedContent}
          </Typography>
        ) : Array.isArray(parsedContent) ? (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {parsedContent.map((item, index) => (
              <li key={index}>
                <Typography variant="body1">
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </Typography>
              </li>
            ))}
          </ul>
        ) : typeof parsedContent === 'object' ? (
          <Box component="pre" sx={{ 
            overflow: 'auto', 
            maxHeight: '300px',
            backgroundColor: '#f5f5f5',
            p: 1,
            borderRadius: 1,
            fontSize: '0.875rem'
          }}>
            {JSON.stringify(parsedContent, null, 2)}
          </Box>
        ) : (
          <Typography variant="body1">{String(parsedContent)}</Typography>
        )}
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Resumes
        </Button>
      </Box>
    );
  }

  if (!resume) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Resume not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Resumes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={handleBack} 
          sx={{ cursor: 'pointer' }}
        >
          Resumes
        </Link>
        <Typography color="text.primary">{resume.title}</Typography>
      </Breadcrumbs>
      
      {/* Header with Title and Actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {resume.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {resume.job_title && (
              <Chip 
                label={resume.job_title} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            )}
            {resume.company_name && (
              <Chip 
                label={resume.company_name} 
                size="small" 
              />
            )}
            <Chip 
              label={`v${resume.version}`} 
              size="small" 
              variant="outlined" 
              color="secondary"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatDate(resume.updated_at)}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
          >
            Back
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            startIcon={generatingPdf ? <CircularProgress size={18} /> : <PdfIcon />}
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
          >
            {generatingPdf ? 'Generating...' : 'Download PDF'}
          </Button>
        </Stack>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}>
        {/* Left Column - 60% */}
        <Box sx={{ flex: { md: '0 0 60%' } }}>
          {resume.content?.personal_information && 
            renderSection('Personal Information', resume.content.personal_information)}
            
          {resume.content?.career_summary && 
            renderSection('Career Summary', resume.content.career_summary)}
            
          {resume.content?.work_experience && 
            renderSection('Work Experience', resume.content.work_experience)}
            
          {resume.content?.education && 
            renderSection('Education', resume.content.education)}
            
          {resume.content?.projects && 
            renderSection('Projects', resume.content.projects)}
        </Box>
        
        {/* Right Column - 40% */}
        <Box sx={{ flex: { md: '0 0 40%' } }}>
          {/* Resume Details */}
          <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Resume Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ '& > *': { mb: 1.5 } }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Template</Typography>
                <Typography variant="body2">{resume.template_id}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                <Typography variant="body2">{formatDate(resume.created_at)}</Typography>
              </Box>
              
              {resume.job_description && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                  <Typography variant="body2" sx={{ 
                    maxHeight: '100px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      left: 0,
                      height: '30px',
                      background: 'linear-gradient(to bottom, rgba(249,249,249,0), rgba(249,249,249,1))'
                    }
                  }}>
                    {resume.job_description}
                  </Typography>
                  <Button size="small" sx={{ mt: 0.5 }}>View full description</Button>
                </Box>
              )}
            </Box>
          </Paper>
          
          {resume.content?.skills && 
            renderSection('Skills', resume.content.skills)}
            
          {resume.content?.certifications && 
            renderSection('Certifications', resume.content.certifications)}
            
          {resume.content?.awards && 
            renderSection('Awards', resume.content.awards)}
            
          {resume.content?.publications && 
            renderSection('Publications', resume.content.publications)}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewResumePage; 
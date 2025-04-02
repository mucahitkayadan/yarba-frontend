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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getResumeById, getResumePdf, deleteResume } from '../services/resumeService';
import { Resume } from '../types/models';

const ViewResumePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setDeletingResume(true);
    try {
      await deleteResume(id);
      navigate('/resumes');
    } catch (err: any) {
      console.error('Failed to delete resume:', err);
      // Extract more detailed error message
      let errorMsg = 'Failed to delete resume';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setDeletingResume(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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
      <Paper elevation={0} sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {typeof parsedContent === 'string' ? (
          <Typography variant="body2" whiteSpace="pre-wrap">
            {parsedContent}
          </Typography>
        ) : Array.isArray(parsedContent) ? (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {parsedContent.map((item, index) => (
              <li key={index}>
                <Typography variant="body2">
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </Typography>
              </li>
            ))}
          </ul>
        ) : typeof parsedContent === 'object' ? (
          <Box component="pre" sx={{ 
            overflow: 'auto', 
            maxHeight: '250px',
            backgroundColor: '#f5f5f5',
            p: 1,
            borderRadius: 1,
            fontSize: '0.8rem'
          }}>
            {JSON.stringify(parsedContent, null, 2)}
          </Box>
        ) : (
          <Typography variant="body2">{String(parsedContent)}</Typography>
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
    <Box sx={{ 
      p: '16px 16px 16px 0',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
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
        alignItems: 'flex-start', 
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {resume.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
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
        
        <Stack 
          direction={{ xs: 'row', sm: 'row' }} 
          spacing={1} 
          sx={{ 
            flexWrap: 'wrap', 
            gap: 1,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'flex-start', md: 'flex-end' }
          }}
        >
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            size="small"
          >
            Back
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            size="small"
          >
            Edit
          </Button>
          <Button 
            variant="outlined"
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={handleDeleteClick}
            size="small"
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            startIcon={generatingPdf ? <CircularProgress size={16} /> : <PdfIcon />}
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            size="small"
          >
            {generatingPdf ? 'Generating...' : 'Download PDF'}
          </Button>
        </Stack>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ width: '100%' }}>
        {/* Resume Details */}
        <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Resume Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Template</Typography>
              <Typography variant="body2">{resume.template_id}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Created</Typography>
              <Typography variant="body2">{formatDate(resume.created_at)}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Updated</Typography>
              <Typography variant="body2">{formatDate(resume.updated_at)}</Typography>
            </Box>
          </Box>
              
          {resume.job_description && (
            <Box sx={{ mt: 2 }}>
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
        </Paper>
        
        {resume.content?.personal_information && 
          renderSection('Personal Information', resume.content.personal_information)}
          
        {resume.content?.career_summary && 
          renderSection('Career Summary', resume.content.career_summary)}
          
        {resume.content?.skills && 
          renderSection('Skills', resume.content.skills)}
          
        {resume.content?.work_experience && 
          renderSection('Work Experience', resume.content.work_experience)}
          
        {resume.content?.education && 
          renderSection('Education', resume.content.education)}
          
        {resume.content?.projects && 
          renderSection('Projects', resume.content.projects)}
          
        {resume.content?.certifications && 
          renderSection('Certifications', resume.content.certifications)}
          
        {resume.content?.awards && 
          renderSection('Awards', resume.content.awards)}
          
        {resume.content?.publications && 
          renderSection('Publications', resume.content.publications)}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this resume? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deletingResume}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deletingResume}
            startIcon={deletingResume ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deletingResume ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewResumePage; 
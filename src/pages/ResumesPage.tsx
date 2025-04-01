import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  TextField, 
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Pagination,
  Divider,
  Paper,
  Stack,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume, getResumePdf, updateResume } from '../services/resumeService';
import { getUserPortfolios } from '../services/portfolioService';
import { Portfolio } from '../types/models';

// Define the API Resume interface
interface APIResume {
  id: string;
  title: string;
  template_id: string;
  user_id: string;
  profile_id: string;
  portfolio_id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  content: {
    personal_information: {
      full_name: string;
      email: string;
      phone: string;
      address: string;
      linkedin: string;
      github: string;
      website: string;
    };
    career_summary: string;
    skills: string;
    work_experience: string;
    education: string;
    projects: string;
    awards: any[];
    publications: any[];
  };
  created_at: string;
  updated_at: string;
}

const PAGE_SIZE = 6;

const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<APIResume[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [availablePortfolios, setAvailablePortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [updatingResume, setUpdatingResume] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const title = searchTerm ? searchTerm : undefined;
      const result = await getResumes(skip, PAGE_SIZE, title);
      
      if (Array.isArray(result)) {
        // API returns an array directly
        setResumes(result as unknown as APIResume[]);
        setTotalResumes(result.length); // This is not accurate for total count
      } else if (result?.items) {
        // API returns pagination object
        setResumes(result.items as unknown as APIResume[]);
        setTotalResumes(result.total || 0);
      } else {
        setResumes([]);
        setTotalResumes(0);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumes([]);
      setTotalResumes(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [page, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resumeId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedResumeId(resumeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResumeId(null);
  };

  const handleCreateResume = () => {
    navigate('/resumes/new');
  };

  const handleViewResume = (resumeId: string) => {
    navigate(`/resumes/${resumeId}`);
    handleMenuClose();
  };

  const handleEditResume = (resumeId: string) => {
    navigate(`/resumes/${resumeId}/edit`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResumeId) return;
    
    setDeletingResume(true);
    try {
      await deleteResume(selectedResumeId);
      // Remove the deleted resume from the local state
      setResumes(resumes.filter(resume => resume.id !== selectedResumeId));
      setTotalResumes(prevTotal => prevTotal - 1);
    } catch (error) {
      console.error('Failed to delete resume:', error);
    } finally {
      setDeletingResume(false);
      setDeleteDialogOpen(false);
      setSelectedResumeId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedResumeId(null);
  };

  const handleDuplicateResume = (resumeId: string) => {
    // This would need to call a backend API to duplicate the resume
    console.log('Duplicate resume:', resumeId);
    handleMenuClose();
  };

  const handleOpenPortfolioDialog = async (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setLoadingPortfolios(true);
    setPortfolioDialogOpen(true);
    
    try {
      const portfolios = await getUserPortfolios();
      setAvailablePortfolios(portfolios);
      
      if (portfolios.length > 0) {
        setSelectedPortfolioId(portfolios[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      setErrorMessage('Failed to load available portfolios');
      setSnackbarOpen(true);
    } finally {
      setLoadingPortfolios(false);
    }
  };
  
  const handlePortfolioChange = (event: SelectChangeEvent) => {
    setSelectedPortfolioId(event.target.value);
  };
  
  const handleUpdateResumePortfolio = async () => {
    if (!selectedResumeId || !selectedPortfolioId) return;
    
    setUpdatingResume(true);
    try {
      await updateResume(selectedResumeId, { portfolio_id: selectedPortfolioId });
      
      // Update the resume in our local state
      setResumes(resumes.map(resume => 
        resume.id === selectedResumeId 
          ? { ...resume, portfolio_id: selectedPortfolioId } 
          : resume
      ));
      
      setErrorMessage('Resume successfully updated with new portfolio');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update resume:', error);
      setErrorMessage('Failed to update resume with new portfolio');
      setSnackbarOpen(true);
    } finally {
      setUpdatingResume(false);
      setPortfolioDialogOpen(false);
    }
  };

  const handleDownloadPdf = async (resumeId: string) => {
    setGeneratingPdf(true);
    try {
      // Log the resume details before requesting PDF
      const resume = resumes.find(r => r.id === resumeId);
      console.log('Requesting PDF for resume:', resume);
      
      // Check if portfolio_id exists and is valid
      if (!resume?.portfolio_id) {
        setErrorMessage('This resume has no associated portfolio. Please update the resume with a valid portfolio first.');
        setSnackbarOpen(true);
        handleOpenPortfolioDialog(resumeId);
        return;
      }
      
      const pdfBlob = await getResumePdf(resumeId);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Find the resume title for the filename
      const filename = resume ? `${resume.title}.pdf` : `resume-${resumeId}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to download PDF:', error);
      // Extract and display the error message
      let errorMsg = 'Failed to download PDF';
      if (error.response?.data) {
        // If error response has data as blob, try to read it
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            console.error('Blob error message:', errorText);
            
            // Check for portfolio not found error
            if (errorText.includes('Portfolio with ID') && errorText.includes('not found')) {
              errorMsg = 'The portfolio associated with this resume could not be found. Please update the resume with a valid portfolio.';
              
              // Offer to attach a valid portfolio
              handleOpenPortfolioDialog(resumeId);
            } else {
              errorMsg = errorText;
            }
          } catch (blobError) {
            // If we can't read the blob, use error.message
            errorMsg = error.message || errorMsg;
          }
        } else {
          // Handle regular JSON error response
          const errorData = error.response.data;
          if (typeof errorData === 'string') {
            errorMsg = errorData;
          } else if (errorData.detail) {
            errorMsg = errorData.detail;
          } else if (error.message) {
            errorMsg = error.message;
          }
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Show specific message for common errors
      if (errorMsg.includes('Portfolio with ID') && errorMsg.includes('not found')) {
        errorMsg = 'The portfolio associated with this resume could not be found. Please update the resume with a valid portfolio.';
        
        // Offer to attach a valid portfolio
        handleOpenPortfolioDialog(resumeId);
      }
      
      setErrorMessage(errorMsg);
      setSnackbarOpen(true);
    } finally {
      setGeneratingPdf(false);
      handleMenuClose();
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

  // Get personal information summary
  const getPersonalInfo = (resume: APIResume) => {
    const info = resume.content?.personal_information;
    if (!info) return null;
    
    return info.full_name;
  };

  // Extract job title from career summary
  const getJobTitle = (resume: APIResume) => {
    try {
      if (resume.job_title) return resume.job_title;
      
      if (resume.content?.career_summary) {
        const summary = JSON.parse(resume.content.career_summary);
        return summary.job_title || '';
      }
    } catch (e) {
      return '';
    }
    return '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Resumes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateResume}
        >
          Create Resume
        </Button>
      </Box>
      
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resumes..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : resumes.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm 
              ? "No resumes found matching your search." 
              : "You haven't created any resumes yet."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateResume}
            sx={{ mt: 2 }}
          >
            Create Your First Resume
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {resumes.map((resume) => (
              <Card 
                key={resume.id} 
                sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {resume.title}
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, resume.id)}
                      aria-label="more options"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1 }}
                  >
                    {getPersonalInfo(resume)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={getJobTitle(resume) || 'No Position'} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      label={resume.company_name || 'No Company'} 
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mt: 2 }}
                  >
                    Last updated: {formatDate(resume.updated_at)}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewResume(resume.id)}
                  >
                    View
                  </Button>
                  <Button 
                    size="small" 
                    color="primary" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEditResume(resume.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary" 
                    startIcon={<PdfIcon />}
                    onClick={() => handleDownloadPdf(resume.id)}
                  >
                    PDF
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
          
          {totalResumes > PAGE_SIZE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination 
                count={Math.ceil(totalResumes / PAGE_SIZE)} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Resume Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedResumeId && handleViewResume(selectedResumeId)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleEditResume(selectedResumeId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleDuplicateResume(selectedResumeId)}>
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleDownloadPdf(selectedResumeId)}>
          <PdfIcon fontSize="small" sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleOpenPortfolioDialog(selectedResumeId)}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Attach Portfolio
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

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

      {/* Portfolio Selection Dialog */}
      <Dialog
        open={portfolioDialogOpen}
        onClose={() => setPortfolioDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Attach Portfolio to Resume</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select a portfolio to attach to this resume. This is required for PDF generation.
          </DialogContentText>
          
          {loadingPortfolios ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : availablePortfolios.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You don't have any portfolios. Please create a portfolio first.
            </Alert>
          ) : (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="portfolio-select-label">Portfolio</InputLabel>
              <Select
                labelId="portfolio-select-label"
                value={selectedPortfolioId}
                onChange={handlePortfolioChange}
                label="Portfolio"
              >
                {availablePortfolios.map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    Portfolio {portfolio.id.substring(0, 8)}...
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPortfolioDialogOpen(false)} 
            disabled={updatingResume}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateResumePortfolio}
            disabled={updatingResume || availablePortfolios.length === 0}
            variant="contained"
            color="primary"
            startIcon={updatingResume ? <CircularProgress size={16} /> : null}
          >
            {updatingResume ? 'Updating...' : 'Update Resume'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={errorMessage?.includes('success') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumesPage; 
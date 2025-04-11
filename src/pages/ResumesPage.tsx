import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
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
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup
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
import { getUserPortfolio } from '../services/portfolioService';
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

// Define page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 10;

const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<APIResume[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
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
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const title = searchTerm ? searchTerm : undefined;
      
      console.log(`Fetching resumes with skip=${skip}, limit=${limit}, title=${title}, sort_by=updated_desc`);
      
      // Use the new sort_by parameter 
      const result = await getResumes(skip, limit, title, undefined, 'updated_desc');
      console.log('API result:', result);
      
      // Log timestamps to verify sorting
      if (result.items.length > 0) {
        console.log('First resume updated_at:', result.items[0].updated_at);
        if (result.items.length > 1) {
          console.log('Second resume updated_at:', result.items[1].updated_at);
        }
      }
      
      // API now returns data already sorted, no need for client-side sorting
      setResumes(result.items as unknown as APIResume[]);
      
      // Set the total count from the total property
      setTotalResumes(result.total || 0);
      
      console.log(`Loaded ${result.items.length} resumes, total: ${result.total}`);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumes([]);
      setTotalResumes(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`Page/PageSize changed: page=${page}, pageSize=${pageSize}, fetching resumes...`);
    fetchResumes();
  }, [page, pageSize, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(`Page changing from ${page} to ${value}`);
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };
  
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value as number;
    console.log(`Page size changing from ${pageSize} to ${newPageSize}`);
    // Calculate what page we should be on to show same items when possible
    const firstItemIndex = (page - 1) * pageSize;
    const newPage = Math.floor(firstItemIndex / newPageSize) + 1;
    setPageSize(newPageSize);
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resumeId: string) => {
    console.log('Menu opened for resume ID:', resumeId);
    setAnchorEl(event.currentTarget);
    setSelectedResumeId(resumeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    console.log('Delete clicked, selectedResumeId:', selectedResumeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResumeId) return;
    
    setDeletingResume(true);
    try {
      await deleteResume(selectedResumeId);
      
      // Remove the deleted resume from the local state
      const updatedResumes = resumes.filter(resume => resume.id !== selectedResumeId);
      setResumes(updatedResumes);
      
      const newTotalCount = totalResumes - 1;
      setTotalResumes(newTotalCount);
      
      // Check if we need to adjust the page number
      // This happens when we delete the last item on a page
      const totalPages = Math.ceil(newTotalCount / pageSize);
      if (page > totalPages && totalPages > 0) {
        // Go to the last available page
        setPage(totalPages);
      } else if (updatedResumes.length === 0 && newTotalCount > 0) {
        // If we deleted the last item on the page but there are more items, refresh
        fetchResumes();
      }
      
    } catch (error: any) {
      console.error('Failed to delete resume:', error);
      // Display error message to the user
      let errorMsg = 'Failed to delete resume';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
      setSnackbarOpen(true);
    } finally {
      setDeletingResume(false);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    handleMenuClose();
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
      const portfolio = await getUserPortfolio();
      setAvailablePortfolios([portfolio]);
      
      if (portfolio) {
        setSelectedPortfolioId(portfolio._id);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      setErrorMessage('Failed to load available portfolio');
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

  // Calculate pagination metadata
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalResumes);
  const hasMultiplePages = totalResumes > pageSize;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4">
          Your Resumes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateResume}
        >
          Create New Resume
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search resumes..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 0 }}
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
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="resumes table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '0.875rem'
                  }}>Resume Title</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '0.875rem'
                  }}>Name</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '0.875rem'
                  }}>Position & Company</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '0.875rem'
                  }}>Last Updated</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow 
                    key={resume.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      },
                      height: '72px'
                    }}
                    onClick={() => handleViewResume(resume.id)}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 'medium',
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {resume.title}
                    </TableCell>
                    <TableCell>{getPersonalInfo(resume)}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={0.5}>
                        {getJobTitle(resume) && (
                          <Typography variant="body2" component="span">
                            {getJobTitle(resume)}
                          </Typography>
                        )}
                        {resume.company_name && (
                          <Typography variant="body2" color="text.secondary" component="span">
                            {resume.company_name}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(resume.updated_at)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <ButtonGroup size="small" variant="outlined">
                        <Tooltip 
                          title="View" 
                          placement="top"
                          TransitionProps={{ timeout: 0 }}
                        >
                          <Button onClick={() => handleViewResume(resume.id)}>
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip 
                          title="Edit" 
                          placement="top"
                          TransitionProps={{ timeout: 0 }}
                        >
                          <Button onClick={() => handleEditResume(resume.id)}>
                            <EditIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip 
                          title="Download PDF" 
                          placement="top"
                          TransitionProps={{ timeout: 0 }}
                        >
                          <Button onClick={() => handleDownloadPdf(resume.id)}>
                            <PdfIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip 
                          title="Delete" 
                          placement="top"
                          TransitionProps={{ timeout: 0 }}
                        >
                          <Button 
                            onClick={() => {
                              setSelectedResumeId(resume.id);
                              setDeleteDialogOpen(true);
                            }}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip 
                          title="More options" 
                          placement="top"
                          TransitionProps={{ timeout: 0 }}
                        >
                          <Button onClick={(e) => handleMenuOpen(e, resume.id)}>
                            <MoreVertIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            flexWrap: 'wrap',
            gap: 2,
            mb: 4
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Typography variant="body2" color="text.secondary">
                {totalResumes === 0 ? 'No results' : 
                  `Showing ${startItem}-${endItem} of ${totalResumes} resume${totalResumes !== 1 ? 's' : ''}`
                }
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="page-size-select-label">Page Size</InputLabel>
                <Select
                  labelId="page-size-select-label"
                  id="page-size-select"
                  value={pageSize}
                  label="Page Size"
                  onChange={handlePageSizeChange}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size}>{size} per page</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Pagination 
              count={Math.max(1, Math.ceil(totalResumes / pageSize))}
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                }
              }}
            />
          </Box>
        </>
      )}

      {/* Resume Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedResumeId && handleDuplicateResume(selectedResumeId)}>
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleOpenPortfolioDialog(selectedResumeId)}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Attach Portfolio
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
        >
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
                {availablePortfolios.map((portfolio) => {
                  // Make sure _id exists
                  if (!portfolio._id) return null;
                  return (
                    <MenuItem key={portfolio._id} value={portfolio._id}>
                      Portfolio {portfolio._id.substring(0, 8)}...
                    </MenuItem>
                  );
                })}
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
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
  ButtonGroup,
  ListItemIcon
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
import { getCoverLetters, deleteCoverLetter, getCoverLetterPdf } from '../services/coverLetterService';
import { CoverLetter } from '../types/models';

// Define page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 10;

const CoverLettersPage: React.FC = () => {
  const navigate = useNavigate();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [totalCoverLetters, setTotalCoverLetters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCoverLetter, setDeletingCoverLetter] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchCoverLetters = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const title = searchTerm ? searchTerm : undefined;
      
      console.log(`Fetching cover letters with skip=${skip}, limit=${limit}, title=${title}, sort_by=updated_desc`);
      
      const result = await getCoverLetters(skip, limit, title, undefined, 'updated_desc');
      console.log('API result:', result);
      
      // Log timestamps to verify sorting
      if (result.items.length > 0) {
        console.log('First cover letter updated_at:', result.items[0].updated_at);
        if (result.items.length > 1) {
          console.log('Second cover letter updated_at:', result.items[1].updated_at);
        }
      }
      
      setCoverLetters(result.items);
      setTotalCoverLetters(result.total || 0);
      
      console.log(`Loaded ${result.items.length} cover letters, total: ${result.total}`);
    } catch (error) {
      console.error('Failed to fetch cover letters:', error);
      setCoverLetters([]);
      setTotalCoverLetters(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`Page/PageSize changed: page=${page}, pageSize=${pageSize}, fetching cover letters...`);
    fetchCoverLetters();
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, coverLetterId: string) => {
    console.log('Menu opened for cover letter ID:', coverLetterId);
    setAnchorEl(event.currentTarget);
    setSelectedCoverLetterId(coverLetterId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateCoverLetter = () => {
    navigate('/cover-letters/new');
  };

  const handleViewCoverLetter = (coverLetterId: string) => {
    navigate(`/cover-letters/${coverLetterId}`);
    handleMenuClose();
  };

  const handleEditCoverLetter = (coverLetterId: string) => {
    navigate(`/cover-letters/${coverLetterId}/edit`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    console.log('Delete clicked, selectedCoverLetterId:', selectedCoverLetterId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCoverLetterId) return;
    
    setDeletingCoverLetter(true);
    try {
      await deleteCoverLetter(selectedCoverLetterId);
      
      // Remove the deleted cover letter from the local state
      const updatedCoverLetters = coverLetters.filter(cl => cl.id !== selectedCoverLetterId);
      setCoverLetters(updatedCoverLetters);
      
      const newTotalCount = totalCoverLetters - 1;
      setTotalCoverLetters(newTotalCount);
      
      // Check if we need to adjust the page number
      // This happens when we delete the last item on a page
      const totalPages = Math.ceil(newTotalCount / pageSize);
      if (page > totalPages && totalPages > 0) {
        // Go to the last available page
        setPage(totalPages);
      } else if (updatedCoverLetters.length === 0 && newTotalCount > 0) {
        // If we deleted the last item on the page but there are more items, refresh
        fetchCoverLetters();
      }
      
    } catch (error: any) {
      console.error('Failed to delete cover letter:', error);
      // Display error message to the user
      let errorMsg = 'Failed to delete cover letter';
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
      setDeletingCoverLetter(false);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const handleDuplicateCoverLetter = (coverLetterId: string) => {
    // Future implementation for duplicating cover letters
    console.log('Duplicate cover letter:', coverLetterId);
    handleMenuClose();
  };

  const handleDownloadPdf = async (coverLetterId: string) => {
    console.log('Download PDF for cover letter:', coverLetterId);
    setGeneratingPdf(true);
    try {
      const pdfBlob = await getCoverLetterPdf(coverLetterId);
      
      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      
      // Get the cover letter's title for the filename
      const coverLetter = coverLetters.find(cl => cl.id === coverLetterId);
      const title = coverLetter ? coverLetter.title.replace(/\s+/g, '_') : 'cover_letter';
      
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Failed to download PDF:', error);
      let errorMsg = 'Failed to generate PDF';
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
      setGeneratingPdf(false);
      handleMenuClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRecipientInfo = (coverLetter: CoverLetter) => {
    if (coverLetter.recipient_name) {
      return coverLetter.recipient_name;
    }
    return 'No recipient specified';
  };

  const getCompanyInfo = (coverLetter: CoverLetter) => {
    if (coverLetter.company_name) {
      return coverLetter.company_name;
    }
    return 'No company specified';
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'right', 
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 4,
          gap: 2
        }}
      >
        <Button 
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateCoverLetter}
          sx={{ 
            borderRadius: 2,
            py: 1,
            px: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Create New Cover Letter
        </Button>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search cover letters by title..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: '100%', sm: 300 } }}
        />
        <FormControl sx={{ minWidth: 100, maxWidth: 150 }} size="small">
          <InputLabel id="page-size-select-label">Items per page</InputLabel>
          <Select
            labelId="page-size-select-label"
            id="page-size-select"
            value={pageSize}
            label="Items per page"
            onChange={handlePageSizeChange}
          >
            {PAGE_SIZE_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : coverLetters.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.8)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            No cover letters found
          </Typography>
          {searchTerm ? (
            <Typography variant="body1" sx={{ mb: 3 }}>
              Try changing your search criteria or clear the search field.
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 3 }}>
              Create your first cover letter to get started!
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateCoverLetter}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Create New Cover Letter
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mb: 3
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Recipient</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coverLetters.map((coverLetter) => (
                  <TableRow 
                    key={coverLetter.id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s ease',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.01)' }
                    }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewCoverLetter(coverLetter.id)}
                    >
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {coverLetter.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{getRecipientInfo(coverLetter)}</TableCell>
                    <TableCell>{getCompanyInfo(coverLetter)}</TableCell>
                    <TableCell>{formatDate(coverLetter.updated_at)}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleViewCoverLetter(coverLetter.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCoverLetter(coverLetter.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download PDF">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadPdf(coverLetter.id)}
                            disabled={generatingPdf}
                          >
                            <PdfIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, coverLetter.id)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Pagination 
              count={Math.ceil(totalCoverLetters / pageSize)} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 500,
                },
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          >
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCoverLetters)} of {totalCoverLetters} cover letters
          </Typography>
        </>
      )}
      
      {/* Menu for more options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
        elevation={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => selectedCoverLetterId && handleViewCoverLetter(selectedCoverLetterId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem onClick={() => selectedCoverLetterId && handleEditCoverLetter(selectedCoverLetterId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedCoverLetterId && handleDuplicateCoverLetter(selectedCoverLetterId)}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => selectedCoverLetterId && handleDownloadPdf(selectedCoverLetterId)}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          Download PDF
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this cover letter? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel} 
            color="primary"
            disabled={deletingCoverLetter}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={deletingCoverLetter}
            startIcon={deletingCoverLetter && <CircularProgress size={20} color="inherit" />}
          >
            {deletingCoverLetter ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoverLettersPage; 
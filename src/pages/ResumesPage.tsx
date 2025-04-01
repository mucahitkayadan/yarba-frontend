import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
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
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume, getResumePdf } from '../services/resumeService';
import { Resume } from '../types/models';

const PAGE_SIZE = 9;

const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const title = searchTerm ? searchTerm : undefined;
      const result = await getResumes(skip, PAGE_SIZE, title);
      
      setResumes(result?.items || []);
      setTotalResumes(result?.total || 0);
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

  const handleDownloadPdf = async (resumeId: string) => {
    setGeneratingPdf(true);
    try {
      const pdfBlob = await getResumePdf(resumeId);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Find the resume title for the filename
      const resume = resumes.find(r => r.id === resumeId);
      const filename = resume ? `${resume.title}.pdf` : `resume-${resumeId}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
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
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ mb: 4, flexWrap: 'wrap' }}
          >
            {resumes.map((resume) => (
              <Box 
                key={resume.id} 
                sx={{ 
                  width: { xs: '100%', sm: '45%', md: '30%' }, 
                  mb: 3 
                }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6
                    } 
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div" sx={{ mb: 1 }} noWrap>
                        {resume.title}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, resume.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Last updated: {formatDate(resume.updated_at)}
                    </Typography>
                    
                    {resume.job_title && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Job Title:</strong> {resume.job_title}
                      </Typography>
                    )}
                    
                    {resume.company_name && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Company:</strong> {resume.company_name}
                      </Typography>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button size="small" onClick={() => handleViewResume(resume.id)}>
                      View
                    </Button>
                    <Button size="small" onClick={() => handleEditResume(resume.id)}>
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="secondary" 
                      startIcon={<PdfIcon />}
                      onClick={() => handleDownloadPdf(resume.id)}
                      disabled={generatingPdf}
                    >
                      PDF
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Stack>
          
          {totalResumes > PAGE_SIZE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
      
      {/* Menu for resume actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedResumeId && handleViewResume(selectedResumeId)}>
          View
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleEditResume(selectedResumeId)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleDownloadPdf(selectedResumeId)}>
          <PdfIcon fontSize="small" sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => selectedResumeId && handleDuplicateResume(selectedResumeId)}>
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
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
            startIcon={deletingResume ? <CircularProgress size={20} /> : null}
          >
            {deletingResume ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumesPage; 
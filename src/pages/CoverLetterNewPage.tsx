import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { createCoverLetter } from '../services/coverLetterService';
import { getResumesForSelection } from '../services/resumeService';
import { ResumeForSelection } from '../types/models';
import { Refresh as RefreshIcon, Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

const CoverLetterNewPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeForSelection[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedResume, setSelectedResume] = useState<ResumeForSelection | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    resumeId?: string;
  }>({});

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalResumes, setModalResumes] = useState<ResumeForSelection[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSortBy, setModalSortBy] = useState('updated_desc'); // Default sort

  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setResumesLoading(true);
    setError(null);
    
    try {
      // Call the new service function with sorting parameter
      const response = await getResumesForSelection('updated_desc'); 
      setResumes(response.resumes); // Update state with response.resumes
    } catch (err: any) {
      console.error('Failed to fetch resumes for selection:', err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setResumesLoading(false);
    }
  };

  // Fetch Resumes for the Modal
  const fetchModalResumes = useCallback(async () => {
    setModalLoading(true);
    setModalError(null);
    try {
      // Pass sorting parameter. API doesn't support search yet based on description.
      const response = await getResumesForSelection(modalSortBy);
      // Simple frontend filtering for now
      const filtered = response.resumes.filter(r =>
        r.resume_name.toLowerCase().includes(modalSearchTerm.toLowerCase())
      );
      setModalResumes(filtered);
    } catch (err: any) {
      console.error('Failed to fetch resumes for modal:', err);
      setModalError(err.message || 'Failed to load resumes.');
      setModalResumes([]); // Clear resumes on error
    } finally {
      setModalLoading(false);
    }
  }, [modalSortBy, modalSearchTerm]);

  // Effect to fetch resumes when modal opens or sort/search changes
  useEffect(() => {
    if (isModalOpen) {
      fetchModalResumes();
    }
    // Dependency array includes things that trigger a refetch within the modal
  }, [isModalOpen, modalSortBy, modalSearchTerm, fetchModalResumes]);

  const validateForm = (): boolean => {
    const newErrors: { resumeId?: string } = {};
    
    if (!selectedResumeId) {
      newErrors.resumeId = 'Please select a resume using the button above.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create the request based on the API specification
      const coverLetterData = {
        resume_id: selectedResumeId,
        generate_pdf: generatePdf
      };
      
      const newCoverLetter = await createCoverLetter(coverLetterData);
      
      // Navigate to the cover letter view page
      navigate(`/cover-letters/${newCoverLetter.id}`);
    } catch (err: any) {
      console.error('Failed to create cover letter:', err);
      
      // Extract error message from response
      let errorMsg = 'Failed to create cover letter. Please try again.';
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cover-letters');
  };

  // Handle selection from the modal
  const handleSelectResumeFromModal = (resume: ResumeForSelection) => {
    setSelectedResume(resume);
    setSelectedResumeId(resume.id);
    setIsModalOpen(false); // Close modal on selection
    setModalSearchTerm(''); // Reset modal search
    if (errors.resumeId) {
      setErrors(prev => ({ ...prev, resumeId: undefined })); // Clear validation error
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Create New Cover Letter
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && !resumesLoading && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchResumes}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {resumesLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', mb: 3 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Resumes...</Typography>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: resumesLoading || (error && resumes.length === 0) ? 'none' : 'block' }}>
          <Typography variant="subtitle1" gutterBottom>
            Base your cover letter on an existing resume
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a resume to use as the basis for your cover letter. The job details, your profile, and portfolio information will be automatically extracted.
          </Typography>
          
          <FormControl fullWidth margin="normal" required error={!!errors.resumeId}>
             <InputLabel shrink htmlFor="selected-resume-display">Selected Resume</InputLabel>
             <Box
                id="selected-resume-display"
                sx={{
                    p: 2,
                    border: 1,
                    borderColor: errors.resumeId ? 'error.main' : 'grey.400',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '56px', // Match TextField height
                    mt: 3 // Adjust margin to align with label
                }}
             >
                <Typography variant="body1" sx={{ color: selectedResume ? 'text.primary' : 'text.disabled' }}>
                    {selectedResume ? selectedResume.resume_name : 'None selected'}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => setIsModalOpen(true)}
                    size="small"
                >
                    Select Resume
                </Button>
             </Box>
             {errors.resumeId && <FormHelperText>{errors.resumeId}</FormHelperText>}
          </FormControl>
          
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="flex-end"
            sx={{ mt: 4 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || resumesLoading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Cover Letter'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Resume Selection Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Select Resume
          <IconButton onClick={() => setIsModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search resumes..."
              variant="outlined"
              size="small"
              value={modalSearchTerm}
              onChange={(e) => setModalSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={modalSortBy}
                label="Sort By"
                onChange={(e) => setModalSortBy(e.target.value)}
              >
                <MenuItem value="updated_desc">Last Updated (Newest)</MenuItem>
                <MenuItem value="updated_asc">Last Updated (Oldest)</MenuItem>
                <MenuItem value="created_desc">Date Created (Newest)</MenuItem>
                <MenuItem value="created_asc">Date Created (Oldest)</MenuItem>
                <MenuItem value="title_asc">Title (A-Z)</MenuItem>
                <MenuItem value="title_desc">Title (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : modalError ? (
            <Alert severity="error">{modalError}</Alert>
          ) : (
            <List dense>
              {modalResumes.length > 0 ? (
                modalResumes.map((resume) => (
                  <ListItemButton key={resume.id} onClick={() => handleSelectResumeFromModal(resume)}>
                    <ListItemText primary={resume.resume_name} />
                  </ListItemButton>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary={modalSearchTerm ? "No resumes match your search." : "No resumes found."} />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CoverLetterNewPage; 
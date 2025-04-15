import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createCoverLetter } from '../services/coverLetterService';
import { getResumes } from '../services/resumeService';
import { Resume } from '../types/models';

const CoverLetterNewPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [generatePdf, setGeneratePdf] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    resumeId?: string;
  }>({});

  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setResumesLoading(true);
    setError(null);
    
    try {
      const response = await getResumes(0, 100); // Get up to 100 resumes
      setResumes(response.items);
    } catch (err: any) {
      console.error('Failed to fetch resumes:', err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setResumesLoading(false);
    }
  };

  const handleResumeChange = (event: SelectChangeEvent) => {
    setSelectedResumeId(event.target.value);
    
    // Clear validation error if present
    if (errors.resumeId) {
      setErrors(prev => ({ ...prev, resumeId: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { resumeId?: string } = {};
    
    if (!selectedResumeId) {
      newErrors.resumeId = 'Please select a resume';
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

  const getResumeLabel = (resume: Resume) => {
    let label = resume.title;
    
    if (resume.company_name) {
      label += ` - ${resume.company_name}`;
    }
    
    if (resume.job_title) {
      label += ` (${resume.job_title})`;
    }
    
    return label;
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Create New Cover Letter
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="subtitle1" gutterBottom>
            Base your cover letter on an existing resume
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a resume to use as the basis for your cover letter. The job details, your profile, and portfolio information will be automatically extracted.
          </Typography>
          
          <FormControl 
            fullWidth 
            margin="normal" 
            required 
            error={!!errors.resumeId}
            disabled={resumesLoading}
          >
            <InputLabel id="resume-select-label">Resume</InputLabel>
            <Select
              labelId="resume-select-label"
              id="resume-select"
              value={selectedResumeId}
              label="Resume"
              onChange={handleResumeChange}
            >
              {resumesLoading ? (
                <MenuItem value="" disabled>
                  Loading resumes...
                </MenuItem>
              ) : resumes.length === 0 ? (
                <MenuItem value="" disabled>
                  No resumes available. Please create a resume first.
                </MenuItem>
              ) : (
                resumes.map((resume) => (
                  <MenuItem key={resume.id} value={resume.id}>
                    {getResumeLabel(resume)}
                  </MenuItem>
                ))
              )}
            </Select>
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
    </Box>
  );
};

export default CoverLetterNewPage; 
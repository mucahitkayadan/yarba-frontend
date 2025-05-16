import React from 'react';
import { Typography, Box, Chip, Paper } from '@mui/material';
import { CareerSummary } from '../../../types/portfolio';

interface ParsedCareerSummaryDisplayProps {
  careerSummary: CareerSummary;
}

const ParsedCareerSummaryDisplay: React.FC<ParsedCareerSummaryDisplayProps> = ({ careerSummary }) => {
  if (!careerSummary) {
    return <Typography>No career summary data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Career Summary</Typography>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Default Job Title: </Typography>
        <Typography variant="body2" component="span">{careerSummary.default_job_title || 'N/A'}</Typography>
      </Box>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Years of Experience: </Typography>
        <Typography variant="body2" component="span">{careerSummary.years_of_experience || 'N/A'}</Typography>
      </Box>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Job Titles:</Typography>
        {careerSummary.job_titles && careerSummary.job_titles.length > 0 ? (
          careerSummary.job_titles.map((title, index) => (
            <Chip key={index} label={title} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))
        ) : (
          <Typography variant="body2" component="span">N/A</Typography>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Default Summary:</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{careerSummary.default_summary || 'N/A'}</Typography>
      </Box>
    </Paper>
  );
};

export default ParsedCareerSummaryDisplay; 
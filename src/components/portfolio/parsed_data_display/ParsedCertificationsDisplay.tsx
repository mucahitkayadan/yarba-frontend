import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';

interface ParsedCertificationsDisplayProps {
  certifications: string[];
}

const ParsedCertificationsDisplay: React.FC<ParsedCertificationsDisplayProps> = ({ certifications }) => {
  if (!certifications || certifications.length === 0) {
    return <Typography>No certifications data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Certifications</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {certifications.map((cert, index) => (
          <Chip key={index} label={cert} />
        ))}
      </Box>
    </Paper>
  );
};

export default ParsedCertificationsDisplay; 
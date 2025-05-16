import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Education } from '../../../types/portfolio';

interface ParsedEducationDisplayProps {
  education: Education[];
}

const ParsedEducationDisplay: React.FC<ParsedEducationDisplayProps> = ({ education }) => {
  if (!education || education.length === 0) {
    return <Typography>No education data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Education</Typography>
      <List disablePadding>
        {education.map((edu, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{edu.degree || 'N/A'}{edu.degree_type ? ` (${edu.degree_type})` : ''}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">{edu.university_name || 'N/A'}</Typography>
                    {edu.location && <Typography variant="body2" color="text.secondary">Location: {edu.location}</Typography>}
                    {edu.time && <Typography variant="body2" color="text.secondary">Time: {edu.time}</Typography>}
                    {edu.GPA && <Typography variant="body2" color="text.secondary">GPA: {edu.GPA}</Typography>}
                    {edu.transcript && edu.transcript.length > 0 && (
                      <Box mt={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Transcript/Notes:</Typography>
                        <List dense disablePadding sx={{ pl: 2 }}>
                          {edu.transcript.map((item, tIndex) => (
                            <ListItem key={tIndex} sx={{ display: 'list-item', listStyleType: 'disc', p: 0 }}>
                              <ListItemText primary={<Typography variant="body2">{item}</Typography>} sx={{m:0}}/>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < education.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedEducationDisplay; 
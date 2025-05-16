import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { WorkExperience } from '../../../types/portfolio';

interface ParsedWorkExperienceDisplayProps {
  workExperience: WorkExperience[];
}

const ParsedWorkExperienceDisplay: React.FC<ParsedWorkExperienceDisplayProps> = ({ workExperience }) => {
  if (!workExperience || workExperience.length === 0) {
    return <Typography>No work experience data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Work Experience</Typography>
      <List disablePadding>
        {workExperience.map((exp, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{exp.job_title || 'N/A'} at {exp.company || 'N/A'}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <>
                    {exp.location && <Typography variant="body2" color="text.secondary">Location: {exp.location}</Typography>}
                    {exp.time && <Typography variant="body2" color="text.secondary">Duration: {exp.time}</Typography>}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <Box mt={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Responsibilities:</Typography>
                        <List dense disablePadding sx={{ pl: 2 }}>
                          {exp.responsibilities.map((resp, rIndex) => (
                            <ListItem key={rIndex} sx={{ display: 'list-item', listStyleType: 'disc', p: 0 }}>
                              <ListItemText primary={<Typography variant="body2">{resp}</Typography>} sx={{m:0}}/>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < workExperience.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedWorkExperienceDisplay; 
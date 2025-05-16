import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, Link as MuiLink } from '@mui/material';
import { Project } from '../../../types/portfolio';

interface ParsedProjectsDisplayProps {
  projects: Project[];
}

const ParsedProjectsDisplay: React.FC<ParsedProjectsDisplayProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <Typography>No projects data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Projects</Typography>
      <List disablePadding>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{project.name || 'N/A'}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <>
                    {project.date && <Typography variant="body2" color="text.secondary">Date: {project.date}</Typography>}
                    {project.link && 
                      <Typography variant="body2" color="text.secondary">
                        Link: <MuiLink href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</MuiLink>
                      </Typography>
                    }
                    {project.bullet_points && project.bullet_points.length > 0 && (
                      <Box mt={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Details:</Typography>
                        <List dense disablePadding sx={{ pl: 2 }}>
                          {project.bullet_points.map((point, pIndex) => (
                            <ListItem key={pIndex} sx={{ display: 'list-item', listStyleType: 'disc', p: 0 }}>
                              <ListItemText primary={<Typography variant="body2">{point}</Typography>} sx={{m:0}}/>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < projects.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedProjectsDisplay; 
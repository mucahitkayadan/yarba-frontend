import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { CustomSection } from '../../../types/portfolio';

interface ParsedCustomSectionsDisplayProps {
  customSections?: {
    sections: CustomSection[];
  };
}

const ParsedCustomSectionsDisplay: React.FC<ParsedCustomSectionsDisplayProps> = ({ customSections }) => {
  if (!customSections || !customSections.sections || customSections.sections.length === 0) {
    return <Typography>No custom sections data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Custom Sections</Typography>
      <List disablePadding>
        {customSections.sections.map((section, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{section.title || 'N/A'}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <Box sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                    {typeof section.content === 'string' && <Typography variant="body2">{section.content}</Typography>}
                    {Array.isArray(section.content) && (
                      <List dense disablePadding>
                        {section.content.map((item, cIndex) => (
                          <ListItem key={cIndex} sx={{ display: 'list-item', listStyleType: 'disc', p: 0, pl: 2 }}>
                            <ListItemText primary={<Typography variant="body2">{item}</Typography>} sx={{m:0}}/>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {typeof section.content === 'object' && !Array.isArray(section.content) && (
                      <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
                        {JSON.stringify(section.content, null, 2)}
                      </pre>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < customSections.sections.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedCustomSectionsDisplay; 
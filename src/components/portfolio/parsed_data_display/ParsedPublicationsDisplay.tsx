import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, Link as MuiLink } from '@mui/material';
import { Publication } from '../../../types/portfolio';

interface ParsedPublicationsDisplayProps {
  publications: Publication[];
}

const ParsedPublicationsDisplay: React.FC<ParsedPublicationsDisplayProps> = ({ publications }) => {
  if (!publications || publications.length === 0) {
    return <Typography>No publications data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Publications</Typography>
      <List disablePadding>
        {publications.map((pub, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{pub.name || 'N/A'}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <>
                    {pub.publisher && <Typography variant="body2" color="text.secondary">Publisher: {pub.publisher}</Typography>}
                    {pub.time && <Typography variant="body2" color="text.secondary">Time: {pub.time}</Typography>}
                    {pub.link && 
                      <Typography variant="body2" color="text.secondary">
                        Link: <MuiLink href={pub.link} target="_blank" rel="noopener noreferrer">{pub.link}</MuiLink>
                      </Typography>
                    }
                  </>
                }
              />
            </ListItem>
            {index < publications.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedPublicationsDisplay; 
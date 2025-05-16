import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Award } from '../../../types/portfolio';

interface ParsedAwardsDisplayProps {
  awards: Award[];
}

const ParsedAwardsDisplay: React.FC<ParsedAwardsDisplayProps> = ({ awards }) => {
  if (!awards || awards.length === 0) {
    return <Typography>No awards data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Awards</Typography>
      <List disablePadding>
        {awards.map((award, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{award.name || 'N/A'}</Typography>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={award.explanation && <Typography variant="body2" color="text.secondary">{award.explanation}</Typography>}
              />
            </ListItem>
            {index < awards.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParsedAwardsDisplay; 
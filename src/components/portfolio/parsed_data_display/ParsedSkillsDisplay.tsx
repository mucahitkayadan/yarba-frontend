import React from 'react';
import { Typography, Box, Chip, Paper, Grid } from '@mui/material';
import { Skill as SkillType } from '../../../types/portfolio'; // Renamed to avoid conflict with component name

interface ParsedSkillsDisplayProps {
  skills: SkillType[];
}

const ParsedSkillsDisplay: React.FC<ParsedSkillsDisplayProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <Typography>No skills data provided.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Skills</Typography>
      <Grid container spacing={2}>
        {skills.map((skillCategory, categoryIndex) => (
          <Grid item xs={12} sm={6} md={4} key={categoryIndex}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{skillCategory.category}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {skillCategory.skills && skillCategory.skills.length > 0 ? (
                skillCategory.skills.map((skill, skillIndex) => (
                  <Chip key={skillIndex} label={skill} size="small" />
                ))
              ) : (
                <Typography variant="body2">No skills listed in this category.</Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ParsedSkillsDisplay; 
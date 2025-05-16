import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ParsedPortfolioData } from '../../../types/portfolio';

import ParsedCareerSummaryDisplay from './ParsedCareerSummaryDisplay';
import ParsedSkillsDisplay from './ParsedSkillsDisplay';
import ParsedWorkExperienceDisplay from './ParsedWorkExperienceDisplay';
import ParsedEducationDisplay from './ParsedEducationDisplay';
import ParsedProjectsDisplay from './ParsedProjectsDisplay';
import ParsedAwardsDisplay from './ParsedAwardsDisplay';
import ParsedPublicationsDisplay from './ParsedPublicationsDisplay';
import ParsedCertificationsDisplay from './ParsedCertificationsDisplay';
import ParsedCustomSectionsDisplay from './ParsedCustomSectionsDisplay';

interface ParsedPortfolioDisplayProps {
  portfolioData: ParsedPortfolioData;
}

const ParsedPortfolioDisplay: React.FC<ParsedPortfolioDisplayProps> = ({ portfolioData }) => {
  if (!portfolioData) {
    return <Typography>No portfolio data to display.</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      {portfolioData.professional_title && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                {portfolioData.professional_title}
            </Typography>
        </Paper>
      )}

      {portfolioData.career_summary && <ParsedCareerSummaryDisplay careerSummary={portfolioData.career_summary} />}
      {portfolioData.skills && portfolioData.skills.length > 0 && <ParsedSkillsDisplay skills={portfolioData.skills} />}
      {portfolioData.work_experience && portfolioData.work_experience.length > 0 && <ParsedWorkExperienceDisplay workExperience={portfolioData.work_experience} />}
      {portfolioData.education && portfolioData.education.length > 0 && <ParsedEducationDisplay education={portfolioData.education} />}
      {portfolioData.projects && portfolioData.projects.length > 0 && <ParsedProjectsDisplay projects={portfolioData.projects} />}
      {portfolioData.awards && portfolioData.awards.length > 0 && <ParsedAwardsDisplay awards={portfolioData.awards} />}
      {portfolioData.publications && portfolioData.publications.length > 0 && <ParsedPublicationsDisplay publications={portfolioData.publications} />}
      {portfolioData.certifications && portfolioData.certifications.length > 0 && <ParsedCertificationsDisplay certifications={portfolioData.certifications} />}
      {portfolioData.custom_sections && portfolioData.custom_sections.sections.length > 0 && <ParsedCustomSectionsDisplay customSections={portfolioData.custom_sections} />}
    </Box>
  );
};

export default ParsedPortfolioDisplay; 
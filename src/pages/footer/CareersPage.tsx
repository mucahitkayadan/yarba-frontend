import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Paper,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import { 
  WorkOutline,
  LocationOn,
  AccessTime,
  TrendingUp,
  HealthAndSafety,
  School,
  Home,
  WorkspacePremium,
  Celebration,
  EmojiPeople
} from '@mui/icons-material';

const CareersPage: React.FC = () => {
  // Sample job listings
  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      location: "Remote",
      type: "Full-time",
      department: "Engineering",
      description: "We're looking for an experienced software engineer to join our team and help build the next generation of AI-powered resume tools.",
      requirements: [
        "5+ years of experience in frontend or full-stack development",
        "Strong proficiency in React, TypeScript, and modern web technologies",
        "Experience with AI/ML integration is a plus",
        "Excellent problem-solving and communication skills"
      ]
    },
    {
      id: 2,
      title: "Product Designer",
      location: "Remote",
      type: "Full-time",
      department: "Design",
      description: "Join our design team to create beautiful, intuitive experiences for job seekers using our platform.",
      requirements: [
        "3+ years of experience in product design",
        "Strong portfolio showcasing UX/UI design work",
        "Proficiency in Figma and design systems",
        "Experience with user research and usability testing"
      ]
    },
    {
      id: 3,
      title: "Marketing Specialist",
      location: "Remote",
      type: "Full-time",
      department: "Marketing",
      description: "Help us reach more job seekers and grow our user base through innovative marketing strategies.",
      requirements: [
        "2+ years of experience in digital marketing",
        "Experience with SEO, content marketing, and social media",
        "Data-driven approach to marketing campaigns",
        "Excellent writing and communication skills"
      ]
    },
    {
      id: 4,
      title: "Machine Learning Engineer",
      location: "Remote",
      type: "Full-time",
      department: "AI Research",
      description: "Work on cutting-edge AI models to improve our resume and cover letter generation capabilities.",
      requirements: [
        "Advanced degree in Computer Science, AI, or related field",
        "Experience with NLP and text generation models",
        "Strong Python skills and familiarity with ML frameworks",
        "Publication record is a plus"
      ]
    }
  ];

  // Company benefits
  const benefits = [
    { icon: <WorkOutline color="primary" />, title: "Flexible Work", description: "Work from anywhere with flexible hours" },
    { icon: <HealthAndSafety color="primary" />, title: "Health Benefits", description: "Comprehensive health, dental, and vision insurance" },
    { icon: <School color="primary" />, title: "Learning Budget", description: "Annual budget for courses and conferences" },
    { icon: <Home color="primary" />, title: "Home Office Setup", description: "Budget for your perfect home office equipment" },
    { icon: <WorkspacePremium color="primary" />, title: "Competitive Salary", description: "Above-market compensation packages" },
    { icon: <Celebration color="primary" />, title: "Team Retreats", description: "Regular company retreats to connect in person" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Careers at YARBA
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Join our team and help job seekers succeed with AI-powered tools
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* About Working Here */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Why Work With Us
        </Typography>
        <Typography variant="body1" paragraph>
          At YARBA, we're on a mission to revolutionize how people approach their job search. We believe that everyone deserves access to tools that help them present their best professional self. Our AI-powered platform is changing the game for job seekers worldwide.
        </Typography>
        <Typography variant="body1" paragraph>
          We're a remote-first company with team members from around the world. We value autonomy, creativity, and impact. If you're passionate about helping people advance their careers and want to work with cutting-edge AI technology, we'd love to hear from you.
        </Typography>
      </Paper>

      {/* Benefits Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Benefits & Perks
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Open Positions */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Open Positions
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          We're growing our team! Check out our current openings below.
        </Typography>
        
        {jobListings.map((job) => (
          <Paper key={job.id} elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
              <Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {job.title}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.type}
                    </Typography>
                  </Box>
                </Stack>
                <Chip label={job.department} size="small" sx={{ mb: 2 }} />
              </Box>
              <Button variant="contained" color="primary" sx={{ mt: { xs: 2, md: 0 } }}>
                Apply Now
              </Button>
            </Box>
            
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Requirements:
            </Typography>
            <List dense disablePadding>
              {job.requirements.map((req, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <TrendingUp color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        py: 5, 
        px: { xs: 3, md: 6 }, 
        bgcolor: 'primary.light', 
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary.contrastText">
          Don't See a Fitting Position?
        </Typography>
        <Typography variant="body1" paragraph color="primary.contrastText" sx={{ mb: 3 }}>
          We're always looking for talented individuals to join our team. Send us your resume and tell us how you could contribute to YARBA.
        </Typography>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'primary.dark' }}>
          Contact Us
        </Button>
      </Box>
    </Container>
  );
};

export default CareersPage; 
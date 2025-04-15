import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Divider,
  Paper
} from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About YARBA
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Your AI-powered resume and career advancement platform
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* Company Overview */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph>
          YARBA was founded in [YEAR] with a simple mission: to revolutionize how job seekers create resumes and cover letters using AI technology. 
          We saw that the traditional resume creation process was time-consuming and often ineffective, with many qualified candidates being overlooked.
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform combines cutting-edge AI with human expertise to help you create professional, tailored resumes and cover letters that get results.
        </Typography>
      </Paper>

      {/* Mission & Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Mission & Values
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body2">
                  We're constantly pushing the boundaries of what's possible with AI in career advancement.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Accessibility
                </Typography>
                <Typography variant="body2">
                  We believe everyone deserves access to tools that help them showcase their best professional self.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Impact
                </Typography>
                <Typography variant="body2">
                  We measure our success by the careers we help launch and advance.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Team
        </Typography>
        <Typography variant="body1" paragraph>
          Behind YARBA is a dedicated team of AI specialists, career experts, and passionate technologists.
        </Typography>
        <Grid container spacing={4}>
          {/* Team member cards would go here - example: */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://via.placeholder.com/300x240"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" component="h3">
                  Jane Doe
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Founder & CEO
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  With over 15 years in tech and HR, Jane leads our vision to transform career advancement.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://via.placeholder.com/300x240"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" component="h3">
                  John Smith
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  CTO
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  John oversees our technical strategy and AI development, bringing 10+ years of experience in ML.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://via.placeholder.com/300x240"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" component="h3">
                  Sarah Johnson
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Head of Career Strategy
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Former recruiter with experience at Fortune 500 companies, Sarah ensures our platform delivers real-world results.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1">
          Have questions or want to learn more about YARBA? Contact us at <strong>contact@yarba.ai</strong>
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage; 
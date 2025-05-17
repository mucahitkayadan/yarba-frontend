"use client";
import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BuildIcon from '@mui/icons-material/Build';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import StarIcon from '@mui/icons-material/Star';
import { AnimatedBackground } from 'animated-backgrounds';
import MainLayout from '../components/layout/MainLayout';

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
}));

const TestimonialPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(5px)',
}));

const MainPage: React.FC = () => {
  const features = [
    { 
      icon: <AutoFixHighIcon fontSize="large" color="primary" sx={{ mb: 2, fontSize: '3rem' }}/>, 
      title: 'AI-Powered Resume Builder', 
      description: 'Craft compelling, professional resumes in minutes with our intelligent assistant. Beat the ATS and impress recruiters.'
    },
    { 
      icon: <BuildIcon fontSize="large" color="primary" sx={{ mb: 2, fontSize: '3rem' }}/>, 
      title: 'Dynamic Cover Letters', 
      description: 'Generate personalized cover letters tailored to each job application. Make a lasting first impression effortlessly.'
    },
    { 
      icon: <FindInPageIcon fontSize="large" color="primary" sx={{ mb: 2, fontSize: '3rem' }}/>, 
      title: 'Portfolio Showcase', 
      description: 'Display your projects and achievements in a beautifully designed portfolio. Let your work speak for itself.'
    },
  ];

  const testimonials = [
    { 
      avatar: 'JD', 
      name: 'Jane Doe, Software Engineer', 
      quote: 'YARBA revolutionized my job hunt! The AI resume builder is a game-changer.'
    },
    { 
      avatar: 'SM', 
      name: 'Samuel Miller, Product Manager', 
      quote: 'Creating tailored cover letters used to take hours. With YARBA, it\'s a breeze. Highly recommended!'
    },
    { 
      avatar: 'CH', 
      name: 'Carlos Hernandez, UX Designer', 
      quote: 'My portfolio looks amazing, and I landed three interviews within a week of using YARBA.'
    },
  ];

  return (
    <MainLayout>
      <AnimatedBackground animationName="fallingFoodFiesta" />
      <Box sx={{ overflowX: 'hidden' }}>
        <Container 
          disableGutters
          sx={theme => ({ 
            maxWidth: '85% !important',
            p: 0,
            backgroundColor: 'rgba(200, 200, 200, 0.9)',
            borderRadius: '12px',
            my: 2,
            mx: 'auto',
            overflow: 'hidden'
          })}
        >
          <Grid container spacing={0} alignItems="stretch"> 
            <Grid 
              item 
              xs={12} 
              md={5} 
              sx={{ 
                display: 'flex',
                justifyContent: 'flex-start',
                order: { xs: 1, md: 1 },
                p: 0,
                height: '100%'
              }}
            >
              <Box
                component="img"
                sx={theme => ({
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  boxShadow: 'none',
                  borderRadius: { xs: 0, md: '0 12px 12px 0' }
                })}
                alt="YARBA Hero Image"
                src="/assets/hero.webp"
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={7} 
              sx={{ 
                py: { xs: 4, md: 4 },
                pl: { md: 4 },
                pr: { md: 4 },
                order: { xs: 2, md: 2 },
                mb: { xs: 0, md: 0 }
              }}
            >
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                p: { xs: 2, md: 0 }
              }}> 
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  sx={theme => ({ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                    letterSpacing: '0.5px',
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' },
                    color: theme.palette.primary.dark,
                    '& .firstLetter': {
                      color: '#E05B49'
                    }
                  })}
                >
                  {'YET ANOTHER RESUME BUILDER APP'.split(' ').map((word, index) => (
                    <React.Fragment key={index}>
                      <span className="firstLetter">{word.charAt(0)}</span>
                      {word.slice(1)}
                      {index < 4 ? ' ' : ''}
                    </React.Fragment>
                  ))}
                </Typography>
                <Typography 
                  variant="h6" 
                  paragraph 
                  sx={theme => ({ 
                    mb: 3, 
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    color: theme.palette.text.primary, 
                    fontWeight: 500,
                    lineHeight: 1.5,
                    textAlign: { xs: 'center', md: 'left' }
                  })}
                >
                  We Do Not Generate Fake Resumes, We Choose From Your Portfolio.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-start' }, 
                  gap: 2, 
                  flexWrap: 'wrap',
                  mt: { xs: 3, md: 2 }
                }}>
                  <Button component={RouterLink} to="/register" variant="contained" color="primary" size="large" sx={{boxShadow: 3, '&:hover': { boxShadow: 5 } }}>
                    Get Started for Free
                  </Button>
                  <Button component={RouterLink} to="/login" variant="outlined" color="secondary" size="large">
                    Already have an account?
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* "How YARBA Works" Section - Replicated Hero Layout */}
        <Container
          disableGutters
          sx={theme => ({
            maxWidth: '85% !important',
            p: 0,
            backgroundColor: 'rgba(200, 200, 200, 0.9)',
            borderRadius: '12px',
            my: 2,
            mx: 'auto',
            overflow: 'hidden'
          })}
        >
          <Grid container spacing={0} alignItems="stretch">
            <Grid 
              item 
              xs={12} 
              md={5} 
              sx={{ 
                display: 'flex',
                justifyContent: 'flex-start',
                order: { xs: 1, md: 1 },
                p: 0,
                height: '100%'
              }}
            >
              <Box
                component="img"
                sx={theme => ({
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  boxShadow: 'none',
                  borderRadius: { xs: 0, md: '0 12px 12px 0' }
                })}
                alt="Steps to use YARBA"
                src="/assets/steps.webp"
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={7} 
              sx={{ 
                py: { xs: 4, md: 4 },
                pl: { md: 4 },
                pr: { md: 4 },
                order: { xs: 2, md: 2 }
              }}
            >
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' }, 
              }}>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={theme => ({
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                    letterSpacing: '0.5px',
                    color: theme.palette.primary.dark,
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' }
                  })}
                >
                  How YARBA Works
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    color: '#333333',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  No one has only few skills, each job requires different skills that you have. You did not do only few bullet points in your job. You upload your portfolio, we choose the most relevant skills, experiences, projects to build your resume.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 6, fontWeight: 600 }}>
            Why Choose YARBA?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeaturePaper elevation={6}>
                  {feature.icon}
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </FeaturePaper>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ backgroundColor: 'alternate.main', py: 8 }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 6, fontWeight: 600, color: 'white' }}>
              Loved by Professionals
            </Typography>
            <Grid container spacing={3}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TestimonialPaper elevation={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{testimonial.avatar}</Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{testimonial.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontStyle="italic">"{testimonial.quote}"</Typography>
                    <Box sx={{ mt: 1, textAlign: 'right' }}>
                      {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: '#FFD700'}} />)}
                    </Box>
                  </TestimonialPaper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Elevate Your Career?
          </Typography>
          <Typography variant="h6" color="primary" paragraph sx={{ mb: 4 }}>
            Join thousands of successful job seekers who trust YARBA.
          </Typography>
          <Button component={RouterLink} to="/register" variant="contained" color="primary" size="large" sx={{ py: 1.5, px: 5, fontSize: '1.2rem' }}>
            Sign Up Now & Get Hired!
          </Button>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default MainPage; 
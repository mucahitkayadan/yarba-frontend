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
  Chip,
  Button
} from '@mui/material';

const BlogPage: React.FC = () => {
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: "10 Resume Tips to Get Noticed by Recruiters",
      summary: "Learn the key strategies to make your resume stand out in a competitive job market. From formatting to content optimization.",
      date: "June 15, 2023",
      image: "https://source.unsplash.com/random/400x250/?resume",
      category: "Resume Tips",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "How AI is Revolutionizing Resume Creation",
      summary: "Discover how artificial intelligence is changing the way job seekers create and optimize their resumes for modern job applications.",
      date: "July 3, 2023",
      image: "https://source.unsplash.com/random/400x250/?artificial-intelligence",
      category: "AI Technology",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Writing Cover Letters That Get Interviews",
      summary: "Proven techniques for crafting compelling cover letters that complement your resume and increase your interview chances.",
      date: "August 12, 2023",
      image: "https://source.unsplash.com/random/400x250/?writing",
      category: "Cover Letters",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "The Future of Job Hunting in 2023 and Beyond",
      summary: "Insights into emerging trends in recruitment and how job seekers can prepare for the evolving job market landscape.",
      date: "September 5, 2023",
      image: "https://source.unsplash.com/random/400x250/?future",
      category: "Career Trends",
      readTime: "10 min read"
    },
    {
      id: 5,
      title: "Building a Professional Online Portfolio",
      summary: "Step-by-step guide to creating an impressive online portfolio that showcases your skills and accomplishments to potential employers.",
      date: "October 18, 2023",
      image: "https://source.unsplash.com/random/400x250/?portfolio",
      category: "Digital Presence",
      readTime: "7 min read"
    },
    {
      id: 6,
      title: "Navigating ATS Systems: What Every Job Seeker Needs to Know",
      summary: "Understanding how Applicant Tracking Systems work and how to optimize your resume to pass through automated screening.",
      date: "November 22, 2023",
      image: "https://source.unsplash.com/random/400x250/?technology",
      category: "Job Application",
      readTime: "9 min read"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          YARBA Blog
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Career insights, resume tips, and job search strategies
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* Featured Post */}
      <Card sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', md: '50%' },
            height: { xs: 240, md: 'auto' }
          }}
          image="https://source.unsplash.com/random/800x600/?career"
          alt="Featured post"
        />
        <CardContent sx={{ flex: 1, p: 4 }}>
          <Chip label="Featured" color="primary" size="small" sx={{ mb: 2 }} />
          <Typography variant="h4" component="h2" gutterBottom>
            Mastering the Modern Resume: AI-Powered Strategies for Job Seekers
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            December 1, 2023 • 12 min read
          </Typography>
          <Typography variant="body1" paragraph sx={{ my: 2 }}>
            In today's competitive job market, standing out requires more than just listing your experiences. 
            Learn how AI tools like YARBA can help you create targeted resumes that highlight your unique value proposition
            and significantly increase your chances of landing interviews.
          </Typography>
          <Button variant="outlined" color="primary">
            Read Full Article
          </Button>
        </CardContent>
      </Card>

      {/* Blog Posts Grid */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Latest Articles
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip label={post.category} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {post.readTime}
                  </Typography>
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {post.date}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {post.summary}
                </Typography>
                <Button 
                  sx={{ mt: 2 }} 
                  size="small" 
                  color="primary"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Newsletter Section */}
      <Box sx={{ 
        mt: 8, 
        py: 4, 
        px: { xs: 3, md: 6 }, 
        bgcolor: 'primary.light', 
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary.contrastText">
          Subscribe to Our Newsletter
        </Typography>
        <Typography variant="body1" paragraph color="primary.contrastText" sx={{ mb: 3 }}>
          Get the latest career advice, resume tips, and job search strategies delivered to your inbox.
        </Typography>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'primary.dark' }}>
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default BlogPage; 
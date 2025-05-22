import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField
} from '@mui/material';
import { 
  Email as EmailIcon,
  Help as HelpIcon,
  QuestionAnswer as FaqIcon,
  Chat as ChatIcon,
  PhoneCallback as CallbackIcon
} from '@mui/icons-material';

const SupportPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Support
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          We're here to help you with any questions or issues
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* Support Options */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Ways to Get Help
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Support" 
                  secondary="Send us an email at support@yarba.ai for assistance"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChatIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Live Chat" 
                  secondary="Chat with our support team during business hours"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaqIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="FAQ Section" 
                  secondary="Check our frequently asked questions for quick answers"
                />
                <Button 
                  variant="outlined" 
                  color="primary" 
                  href="/faq"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  View FAQs
                </Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CallbackIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Request a Callback" 
                  secondary="Leave your number and we'll call you back"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Contact Us Directly
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="message"
                label="Your Message"
                id="message"
                multiline
                rows={4}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Support Hours */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Support Hours
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" component="p" gutterBottom>
              <strong>Email Support:</strong> 24/7 response within 24 hours
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              <strong>Live Chat:</strong> Monday - Friday, 9 AM - 5 PM EST
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" component="p" gutterBottom>
              <strong>Callback Service:</strong> Monday - Friday, 9 AM - 5 PM EST
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              <strong>Response Time:</strong> We aim to resolve all issues within 48 hours
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SupportPage; 
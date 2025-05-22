import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Paper,
  TextField,
  Button,
  Alert,
  MenuItem,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { 
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as ClockIcon,
  Send as SendIcon
} from '@mui/icons-material';

const ContactPage: React.FC = () => {
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  // Form submission state
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formState.name || !formState.email || !formState.message) {
      setError(true);
      return;
    }
    
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formState);
    
    // Show success message
    setSubmitted(true);
    setError(false);
    
    // Reset form
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: ''
    });
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'feedback', label: 'Product Feedback' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership Opportunity' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          We'd love to hear from you. Reach out with any questions or feedback.
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" paragraph>
              Have questions about our services or need help? Contact us using the information below or fill out the form.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body2">
                      <Link href="mailto:info@yarba.ai" color="inherit">
                        info@yarba.ai
                      </Link>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      <Link href="tel:+11234567890" color="inherit">
                        +1 (123) 456-7890
                      </Link>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      Address
                    </Typography>
                    <Typography variant="body2">
                      123 AI Boulevard<br />
                      Tech City, TS 12345<br />
                      United States
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <ClockIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      Hours
                    </Typography>
                    <Typography variant="body2">
                      Monday - Friday: 9AM - 5PM EST<br />
                      Saturday - Sunday: Closed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Send Us a Message
            </Typography>
            
            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We'll get back to you as soon as possible.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Please fill in all required fields.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Inquiry Type"
                    name="inquiryType"
                    value={formState.inquiryType}
                    onChange={handleChange}
                    margin="normal"
                  >
                    {inquiryTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    fullWidth
                    endIcon={<SendIcon />}
                    sx={{ mt: 2 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Map Section - In a real implementation, you'd use Google Maps or another map provider */}
      <Box sx={{ mt: 8, width: '100%', height: '400px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Map placeholder - In a production environment, you would integrate Google Maps or another map service here
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage;
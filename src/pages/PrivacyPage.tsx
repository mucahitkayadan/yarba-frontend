import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Divider,
  Paper,
  List,
  ListItem
} from '@mui/material';

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: February 1, 2024
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Paper elevation={1} sx={{ p: { xs: 3, md: 5 } }}>
        {/* Introduction */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            At YARBA, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </Typography>
          <Typography variant="body1" paragraph>
            This privacy policy applies to all users of YARBA's services, including our website, resume builder, cover letter generator, and other related tools.
          </Typography>
        </Box>

        {/* Information We Collect */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect several types of information from and about users of our services, including:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Personal identifiers such as name, email address, and login credentials
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Resume and cover letter content that you create using our services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Professional information such as work history, education, skills, and certifications
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Usage data including how you interact with our services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Device and browser information
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* How We Use Your Information */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect for various purposes, including to:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Provide, maintain, and improve our services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Process and complete transactions
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Send you technical notices, updates, security alerts, and support messages
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Respond to your comments, questions, and customer service requests
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Develop new products and services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Train our AI models to improve resume and cover letter generation
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* Data Sharing and Disclosure */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell your personal information. We may share your personal information in the following situations:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                <strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and contractors who perform services for us.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, or sale of all or a portion of our assets.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* Data Security */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </Typography>
        </Box>

        {/* Data Retention */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </Typography>
        </Box>

        {/* Your Rights */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have various rights regarding your personal information, including:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                The right to access your personal information
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                The right to correct inaccurate information
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                The right to request deletion of your personal information
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                The right to restrict processing of your personal information
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                The right to data portability
              </Typography>
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            To exercise these rights, please contact us using the details provided in the "Contact Us" section.
          </Typography>
        </Box>

        {/* Updates to This Policy */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Updates to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
          </Typography>
        </Box>

        {/* Contact Us */}
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have questions or comments about this policy, you may contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email: privacy@yarba.ai
          </Typography>
          <Typography variant="body1" paragraph>
            Address: 123 AI Boulevard, Tech City, TS 12345
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPage; 
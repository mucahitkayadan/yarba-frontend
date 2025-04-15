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

const TermsPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms of Service
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
            Welcome to YARBA. These Terms of Service ("Terms") govern your access to and use of the YARBA website, services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
          </Typography>
          <Typography variant="body1" paragraph>
            Please read these Terms carefully. They contain important information about your legal rights, remedies, and obligations. By using our Services, you agree to these Terms and our Privacy Policy.
          </Typography>
        </Box>

        {/* Definitions */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. Definitions
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>"YARBA"</strong> refers to our company, website, platform, and services.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>"Services"</strong> refers to all features, applications, content, and products we provide, including but not limited to our resume builder, cover letter generator, and career resources.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>"User"</strong> or <strong>"you"</strong> refers to any individual who accesses or uses our Services.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>"Content"</strong> refers to all text, information, data, images, and other materials uploaded, downloaded, or appearing on our Services.
          </Typography>
        </Box>

        {/* Account Registration */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Account Registration
          </Typography>
          <Typography variant="body1" paragraph>
            To access certain features of the Services, you may be required to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to create an account if we have previously removed you, or if you have been previously banned from the Services. You are solely responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.
          </Typography>
        </Box>

        {/* User Conduct */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. User Conduct
          </Typography>
          <Typography variant="body1" paragraph>
            You agree that you will not:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Use the Services in any way that violates any applicable law or regulation
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Impersonate any person or entity, or falsely state or otherwise misrepresent yourself
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Use the Services to transmit any material that contains viruses, trojan horses, or other harmful code
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Attempt to hack, decompile, reverse-engineer, or disassemble any part of the Services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Use our Services to generate false, misleading, or fraudulent content
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* Intellectual Property */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            The Services and their original content, features, and functionality are and will remain the exclusive property of YARBA and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </Typography>
          <Typography variant="body1" paragraph>
            You retain ownership of any content you create using our Services, such as resumes and cover letters. However, by using our Services, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of providing the Services to you.
          </Typography>
        </Box>

        {/* Subscription and Billing */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Subscription and Billing
          </Typography>
          <Typography variant="body1" paragraph>
            Some of our Services are offered on a subscription basis. By subscribing to our Services, you agree to pay the applicable fees. We may change our fees at any time, but will provide you with advance notice of such changes.
          </Typography>
          <Typography variant="body1" paragraph>
            You can cancel your subscription at any time through your account settings. If you cancel, you may use your subscription until the end of your current billing period, but you will not receive a refund for any fees already paid.
          </Typography>
        </Box>

        {/* Disclaimer of Warranties */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" paragraph>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </Typography>
          <Typography variant="body1" paragraph>
            WE DO NOT GUARANTEE THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED. WE DO NOT MAKE ANY WARRANTIES OR REPRESENTATIONS REGARDING THE USE OF THE MATERIALS IN THE SERVICES IN TERMS OF THEIR ACCURACY, COMPLETENESS, RELIABILITY, OR OTHERWISE.
          </Typography>
        </Box>

        {/* Limitation of Liability */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            IN NO EVENT SHALL YARBA, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </Typography>
          <List sx={{ pl: 2, listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Your access to or use of or inability to access or use the Services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Any conduct or content of any third party on the Services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Any content obtained from the Services
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <Typography variant="body1">
                Unauthorized access, use, or alteration of your transmissions or content
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* Modifications to Terms */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            9. Modifications to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes by updating the date at the top of these Terms and, in some cases, we may provide additional notice. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
          </Typography>
        </Box>

        {/* Termination */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            10. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will immediately cease.
          </Typography>
        </Box>

        {/* Governing Law */}
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            11. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to or use of the Services shall be brought exclusively in the federal or state courts located in [Jurisdiction], and you hereby consent to the personal jurisdiction of such courts.
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms, please contact us at legal@yarba.ai.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsPage; 
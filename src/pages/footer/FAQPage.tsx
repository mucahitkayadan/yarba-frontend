import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQPage: React.FC = () => {
  const faqItems = [
    {
      question: "What is YARBA?",
      answer: "YARBA is an AI-powered resume and cover letter builder that helps job seekers create professional, tailored job application documents using artificial intelligence technology."
    },
    {
      question: "How does the AI resume builder work?",
      answer: "Our AI resume builder analyzes your input information and generates professionally formatted content tailored to specific job descriptions. It uses natural language processing to optimize your resume for applicant tracking systems (ATS) while highlighting your relevant skills and achievements."
    },
    {
      question: "Is my data secure with YARBA?",
      answer: "Yes, we take data security very seriously. All your information is encrypted and stored securely. We do not share your personal data with third parties without your consent. Please see our Privacy Policy for more details."
    },
    {
      question: "Can I generate multiple versions of my resume?",
      answer: "Absolutely! With YARBA, you can create multiple versions of your resume tailored to different job positions or industries, allowing you to customize your application for each opportunity."
    },
    {
      question: "How can I edit my resume after it's generated?",
      answer: "After your resume is generated, you can easily edit any section through our user-friendly interface. You can modify text, add or remove sections, and change formatting as needed."
    },
    {
      question: "Does YARBA offer cover letter creation?",
      answer: "Yes, YARBA provides AI-powered cover letter creation that complements your resume. Our system generates personalized cover letters that highlight your relevant experience and match the job requirements."
    },
    {
      question: "Can I download my resume in different formats?",
      answer: "Yes, you can download your resume in various formats including PDF, DOCX, and more to suit the requirements of different application systems."
    },
    {
      question: "Is there a limit to how many resumes I can create?",
      answer: "This depends on your subscription plan. Our basic plan allows you to create a limited number of resumes, while premium plans offer unlimited resume creation."
    },
    {
      question: "How do I get started with YARBA?",
      answer: "Simply create an account, input your information, and follow the guided steps to create your first resume. The process is intuitive and designed to help you showcase your skills effectively."
    },
    {
      question: "What if I need help using YARBA?",
      answer: "We offer comprehensive support through our help center, email support, and live chat during business hours. Visit our Support page for more information."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Find answers to common questions about YARBA
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* FAQ Accordion */}
      <Paper elevation={1} sx={{ p: { xs: 2, md: 4 }, mb: 6 }}>
        {faqItems.map((faq, index) => (
          <Accordion key={index} disableGutters sx={{ 
            mb: 1,
            boxShadow: 'none',
            '&:before': {
              display: 'none',
            },
            borderBottom: index < faqItems.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'
          }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ 
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)'
                }
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 3, pt: 0 }}>
              <Typography variant="body1">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Additional Help Section */}
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Still Have Questions?
        </Typography>
        <Typography variant="body1" paragraph>
          If you couldn't find what you're looking for, please visit our support page or contact us directly.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography variant="body1" color="primary" component="a" href="/support" sx={{ textDecoration: 'none' }}>
            Contact Support
          </Typography>
          <Typography variant="body1" color="primary" component="a" href="/contact" sx={{ textDecoration: 'none' }}>
            Email Us
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQPage; 
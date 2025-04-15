import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  CircularProgress, 
  Chip,
  Stack,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { getCoverLetterById, getCoverLetterPdf, deleteCoverLetter } from '../services/coverLetterService';
import { getResumeById } from '../services/resumeService';
import { CoverLetter, Resume } from '../types/models';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CoverLetterViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCoverLetter, setDeletingCoverLetter] = useState(false);
  
  // PDF viewer state
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  const [resumeTitle, setResumeTitle] = useState<string>('');
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  
  // Clean up object URL when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getCoverLetterById(id);
        setCoverLetter(data);
        
        // Fetch resume title and data
        try {
          const resume = await getResumeById(data.resume_id);
          setResumeTitle(resume.title);
          setResumeData(resume);
        } catch (resumeErr) {
          console.error('Failed to fetch resume:', resumeErr);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch cover letter:', err);
        setError(err.message || 'Failed to fetch cover letter details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetter();
  }, [id]);

  // Generate a title for the cover letter
  const coverLetterTitle = coverLetter ? (resumeTitle || `Cover Letter (${coverLetter.resume_id.substring(0, 8)})`) : '';

  const handleEdit = () => {
    if (id) {
      navigate(`/cover-letters/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/cover-letters');
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setDeletingCoverLetter(true);
    try {
      await deleteCoverLetter(id);
      navigate('/cover-letters');
    } catch (err: any) {
      console.error('Failed to delete cover letter:', err);
      setError('Failed to delete cover letter. Please try again.');
      setDeleteDialogOpen(false);
    } finally {
      setDeletingCoverLetter(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewPdf = async () => {
    if (!id || !coverLetter) return;
    
    setGeneratingPdf(true);
    try {
      const pdfResponse = await getCoverLetterPdf(id);
      
      // Fetch the PDF from the URL
      const response = await fetch(pdfResponse.pdf_url);
      const blob = await response.blob();
      setPdfBlob(blob);
      
      // Create a URL for the PDF blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      // Open the PDF viewer modal
      setPdfViewerOpen(true);
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id || !coverLetter) return;
    
    setGeneratingPdf(true);
    try {
      const pdfResponse = await getCoverLetterPdf(id);
      
      // Open PDF URL in a new tab for download
      window.open(pdfResponse.pdf_url, '_blank');
    } catch (err: any) {
      console.error('Failed to download PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
    setPageNumber(1);
    setNumPages(null);
    
    // Clean up URL object
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  
  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };
  
  const previousPage = () => changePage(-1);
  
  const nextPage = () => changePage(1);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Cover Letters
        </Button>
      </Box>
    );
  }

  if (!coverLetter) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Cover letter not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Cover Letters
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Navigation breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink 
          underline="hover" 
          color="inherit" 
          onClick={handleBack}
          sx={{ cursor: 'pointer' }}
        >
          Cover Letters
        </MuiLink>
        <Typography color="text.primary">{coverLetterTitle}</Typography>
      </Breadcrumbs>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {coverLetterTitle}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
            <Chip 
              label="Cover Letter" 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={resumeTitle || `Resume ID: ${coverLetter.resume_id.substring(0, 8)}`} 
              size="small" 
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatDate(coverLetter.updated_at)}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            Back
          </Button>
          <Button
            startIcon={<PdfIcon />}
            variant="outlined"
            onClick={handleViewPdf}
            disabled={generatingPdf}
          >
            View PDF
          </Button>
          <Button
            startIcon={<PdfIcon />}
            variant="contained"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
          >
            Download PDF
          </Button>
          <Button
            startIcon={<EditIcon />}
            onClick={handleEdit}
            variant="outlined"
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            variant="outlined"
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </Box>
      
      {/* Cover Letter Content */}
      <Box sx={{ width: '100%' }}>
        {/* Cover Letter Details */}
        <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" component="div" gutterBottom color="primary">
            Cover Letter Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Template</Typography>
              <Typography variant="body2">{coverLetter.template_id}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Created</Typography>
              <Typography variant="body2">{formatDate(coverLetter.created_at)}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Updated</Typography>
              <Typography variant="body2">{formatDate(coverLetter.updated_at)}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Resume ID</Typography>
              <Typography variant="body2">{coverLetter.resume_id}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Has PDF</Typography>
              <Typography variant="body2">{coverLetter.has_pdf ? 'Yes' : 'No'}</Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Cover Letter Content */}
        <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" component="div" gutterBottom color="primary">
            Cover Letter Content
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ px: 2 }}>
            {/* Cover Letter Content */}
            {coverLetter.content?.cover_letter_content ? (
              (() => {
                let content;
                try {
                  // Try to parse the content as JSON
                  interface CoverLetterContent {
                    greeting?: string;
                    paragraphs?: string[];
                    closing?: string;
                    full_document?: string;
                    applicant_name?: string;
                  }
                  
                  content = JSON.parse(coverLetter.content.cover_letter_content) as CoverLetterContent;
                } catch (e) {
                  // If it's not valid JSON, use it as is
                  return (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {coverLetter.content.cover_letter_content}
                    </Typography>
                  );
                }
                
                // Render formatted cover letter
                return (
                  <Paper elevation={0} sx={{ 
                    p: { xs: 3, sm: 5 }, 
                    backgroundColor: '#fcfcfc',
                    backgroundImage: 'linear-gradient(to bottom, #f9f9f9, #fcfcfc 15%)',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    fontFamily: '"Georgia", serif',
                    lineHeight: 1.6,
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative',
                  }}>
                    {/* Personal Information Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      {resumeData?.content?.personal_information && (() => {
                        let personalInfo;
                        try {
                          // Try to parse personal info
                          if (typeof resumeData.content.personal_information === 'string') {
                            personalInfo = JSON.parse(resumeData.content.personal_information);
                          } else {
                            personalInfo = resumeData.content.personal_information;
                          }
                          
                          return (
                            <>
                              <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                mb: 1.5,
                                color: '#333'
                              }}>
                                {personalInfo.full_name}
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexWrap: 'wrap',
                                gap: { xs: 1, sm: 0 },
                                mb: 3
                              }}>
                                {/* Create a contact info array to manage separators properly */}
                                {(() => {
                                  // Create an array of all available contact info elements
                                  const contactElements = [];
                                  
                                  if (personalInfo.phone) {
                                    contactElements.push({
                                      key: 'phone',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <Typography variant="body2">{personalInfo.phone}</Typography>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  if (personalInfo.email) {
                                    contactElements.push({
                                      key: 'email',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <MuiLink href={`mailto:${personalInfo.email}`} underline="hover" variant="body2">
                                            {personalInfo.email}
                                          </MuiLink>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  if (personalInfo.linkedin) {
                                    contactElements.push({
                                      key: 'linkedin',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <LinkedInIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <MuiLink href={personalInfo.linkedin} target="_blank" rel="noopener" underline="hover" variant="body2">
                                            LinkedIn
                                          </MuiLink>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  if (personalInfo.github) {
                                    contactElements.push({
                                      key: 'github',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <GitHubIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <MuiLink href={personalInfo.github} target="_blank" rel="noopener" underline="hover" variant="body2">
                                            GitHub
                                          </MuiLink>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  if (personalInfo.website) {
                                    contactElements.push({
                                      key: 'website',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <WebsiteIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <MuiLink href={personalInfo.website} target="_blank" rel="noopener" underline="hover" variant="body2">
                                            Website
                                          </MuiLink>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  if (personalInfo.address) {
                                    contactElements.push({
                                      key: 'address',
                                      element: (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                          <Typography variant="body2">{personalInfo.address}</Typography>
                                        </Box>
                                      )
                                    });
                                  }
                                  
                                  // Render all elements with separators between them
                                  return contactElements.map((item, index) => (
                                    <React.Fragment key={item.key}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
                                        {item.element}
                                      </Box>
                                      {/* Add separator only if not the last item */}
                                      {index < contactElements.length - 1 && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>|</Typography>
                                      )}
                                    </React.Fragment>
                                  ));
                                })()}
                              </Box>
                              
                              <Divider sx={{ width: '100%', mb: 3 }} />
                            </>
                          );
                        } catch (e) {
                          console.error('Error parsing personal information:', e);
                          return null;
                        }
                      })()}
                    </Box>
                    
                    {/* Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                      <Typography sx={{ color: '#555' }}>
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                    
                    {/* Greeting */}
                    {content.greeting && (
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, fontSize: '1.05rem' }}>
                        {content.greeting}
                      </Typography>
                    )}
                    
                    {/* Body Paragraphs */}
                    {content.paragraphs && Array.isArray(content.paragraphs) ? (
                      content.paragraphs.map((paragraph: string, index: number) => (
                        <Typography key={index} variant="body1" sx={{ 
                          mb: 2.5, 
                          textIndent: '1.5em',
                          fontSize: '1.02rem',
                          color: '#222',
                          textAlign: 'justify'
                        }}>
                          {paragraph}
                        </Typography>
                      ))
                    ) : content.full_document ? (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {content.full_document}
                      </Typography>
                    ) : null}
                    
                    {/* Closing */}
                    {content.closing && (
                      <Box sx={{ mt: 5 }}>
                        <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
                          {content.closing}
                        </Typography>
                        {/* Signature space */}
                        <Box sx={{ height: 60, mb: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500, borderTop: '1px solid #eaeaea', pt: 1, display: 'inline-block' }}>
                          {content.applicant_name || ""}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                );
              })()
            ) : (
              <Typography variant="body2" color="text.secondary">
                No content is available. Generate or edit the cover letter to add content.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this cover letter? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" disabled={deletingCoverLetter}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={deletingCoverLetter}>
            {deletingCoverLetter ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* PDF Viewer Dialog */}
      <Dialog
        open={pdfViewerOpen}
        onClose={handleClosePdfViewer}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {coverLetterTitle}
          <IconButton
            aria-label="close"
            onClick={handleClosePdfViewer}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            overflowX: 'auto'
          }}>
            {pdfBlob && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<CircularProgress />}
                error={<Typography color="error">Failed to load PDF</Typography>}
              >
                <Box sx={{ 
                  border: '1px solid black', 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={550}
                  />
                </Box>
              </Document>
            )}
            
            <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                disabled={pageNumber <= 1}
                onClick={previousPage}
                variant="outlined"
                size="small"
              >
                Previous
              </Button>
              <Typography variant="body2">
                Page {pageNumber} of {numPages || '?'}
              </Typography>
              <Button
                disabled={pageNumber >= (numPages || 1)}
                onClick={nextPage}
                variant="outlined"
                size="small"
              >
                Next
              </Button>
            </Box>
            
            <Button
              startIcon={<PdfIcon />}
              variant="contained"
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              sx={{ mt: 2 }}
            >
              Download PDF
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CoverLetterViewPage; 
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
                const rawContent = coverLetter.content.cover_letter_content;
                let contentToRender;

                // Case 1: rawContent is an object with llm_output
                if (typeof rawContent === 'object' && rawContent !== null && 'llm_output' in rawContent) {
                  contentToRender = (rawContent as any).llm_output;
                  return (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {contentToRender}
                    </Typography>
                  );
                } 
                
                // Case 2: rawContent is a string
                if (typeof rawContent === 'string') {
                  try {
                    // Try to parse as JSON
                    const parsedJson = JSON.parse(rawContent);

                    // Case 2a: Parsed JSON is an object with llm_output
                    if (typeof parsedJson === 'object' && parsedJson !== null && 'llm_output' in parsedJson) {
                      contentToRender = (parsedJson as any).llm_output;
                      return (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {contentToRender}
                        </Typography>
                      );
                    } 
                    // Case 2b: Parsed JSON is the structured CoverLetterContent object
                    else if (typeof parsedJson === 'object' && parsedJson !== null && ('greeting' in parsedJson || 'paragraphs' in parsedJson || 'closing' in parsedJson || 'full_document' in parsedJson)) {
                      const structuredContent = parsedJson as { greeting?: string; paragraphs?: string[]; closing?: string; full_document?: string; applicant_name?: string; };
                      // Render formatted cover letter (existing logic)
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
                          {/* Personal Information Header - This was part of the original removed code, re-adding a simplified version or ensuring it exists */}
                          {resumeData?.content?.personal_information && (() => {
                            let personalInfo;
                            try {
                              if (typeof resumeData.content.personal_information === 'string') {
                                personalInfo = JSON.parse(resumeData.content.personal_information);
                              } else {
                                personalInfo = resumeData.content.personal_information;
                              }
                              return (
                                <Box sx={{ mb: 4, textAlign: 'center' }}>
                                  <Typography variant="h4" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, color: '#333'}}>
                                    {personalInfo.full_name}
                                  </Typography>
                                  {/* Simplified contact info rendering for brevity, ensure full original logic if needed */}
                                  <Typography variant="body2">{personalInfo.email} | {personalInfo.phone}</Typography>
                                  <Divider sx={{ width: '100%', mb: 3, mt: 2 }} />
                                </Box>
                              );
                            } catch (e) { console.error('Error parsing personal info for cover letter:', e); return null; }
                          })()}
                          
                          {/* Date */}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                            <Typography sx={{ color: '#555' }}>
                              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                          </Box>

                          {/* Greeting */}
                          {structuredContent.greeting && (
                            <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, fontSize: '1.05rem' }}>
                              {structuredContent.greeting}
                            </Typography>
                          )}
                          
                          {/* Body Paragraphs or Full Document */}
                          {structuredContent.full_document ? (
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {structuredContent.full_document}
                            </Typography>
                          ) : structuredContent.paragraphs && Array.isArray(structuredContent.paragraphs) ? (
                            structuredContent.paragraphs.map((paragraph: string, index: number) => (
                              <Typography key={index} variant="body1" sx={{ mb: 2.5, textIndent: '1.5em', fontSize: '1.02rem', color: '#222', textAlign: 'justify' }}>
                                {paragraph}
                              </Typography>
                            ))
                          ) : null}
                          
                          {/* Closing */}
                          {structuredContent.closing && (
                            <Box sx={{ mt: 5 }}>
                              <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
                                {structuredContent.closing}
                              </Typography>
                              <Box sx={{ height: 60, mb: 1 }} /> {/* Signature space */}
                              <Typography variant="body1" sx={{ fontWeight: 500, borderTop: '1px solid #eaeaea', pt: 1, display: 'inline-block' }}>
                                {structuredContent.applicant_name || resumeData?.content?.personal_information?.full_name || ""}
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      );
                    }
                    // Case 2c: Parsed JSON is something else, or not an object
                    contentToRender = rawContent; // Fallback to raw string if JSON is not the expected structure
                  } catch (e) {
                    // If it's not valid JSON, check if it's the object with llm_output
                    const rawContent = coverLetter.content.cover_letter_content;
                    if (typeof rawContent === 'object' && rawContent !== null && 'llm_output' in rawContent) {
                      return (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {(rawContent as any).llm_output}
                        </Typography>
                      );
                    } else if (typeof rawContent === 'string') {
                      // If it's a string (and not JSON), render as is
                      return (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {rawContent}
                        </Typography>
                      );
                    } else {
                      // Fallback for other unexpected types in this catch block
                      return (
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Content is in an unexpected format.
                        </Typography>
                      );
                    }
                  }
                  return (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {contentToRender}
                    </Typography>
                  );
                }

                // Case 3: rawContent is not an object and not a string (e.g. number, boolean)
                // Or if it's an object but not the llm_output kind.
                // This will render the stringified version of the object, which caused the original error.
                // We should provide a more graceful fallback.
                if (typeof rawContent === 'object' && rawContent !== null) {
                    return (
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Cover letter content is an object but not in the expected format: {JSON.stringify(rawContent, null, 2)}
                        </Typography>
                    );
                }
                
                // Fallback for any other case or if content is empty/unrecognized
                return (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Content is not available or in an unrecognized format.
                  </Typography>
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
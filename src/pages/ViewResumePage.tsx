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
  Link,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  EmojiEvents as AwardIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { getResumeById, getResumePdf, deleteResume } from '../services/resumeService';
import { Resume } from '../types/models';

const ViewResumePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [jobDescriptionExpanded, setJobDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getResumeById(id);
        setResume(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch resume:', err);
        setError(err.message || 'Failed to fetch resume details');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/resumes/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/resumes');
  };

  const handleDownloadPdf = async () => {
    if (!id || !resume) return;
    
    setGeneratingPdf(true);
    try {
      // Check if portfolio_id exists and is valid
      if (!resume.portfolio_id) {
        setError('This resume has no associated portfolio. Please update the resume with a valid portfolio first.');
        return;
      }
      
      const pdfBlob = await getResumePdf(id);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename
      const filename = `${resume.title}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to download PDF:', err);
      
      let errorMsg = 'Failed to download PDF';
      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await err.response.data.text();
          errorMsg = errorText || errorMsg;
        } catch (blobError) {
          // If we can't read the blob as text, use the default message
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setDeletingResume(true);
    try {
      await deleteResume(id);
      navigate('/resumes');
    } catch (err: any) {
      console.error('Failed to delete resume:', err);
      // Extract more detailed error message
      let errorMsg = 'Failed to delete resume';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setDeletingResume(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleToggleJobDescription = () => {
    setJobDescriptionExpanded(!jobDescriptionExpanded);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format date range for display (YYYY-MM format)
  const formatDateRange = (startDate?: string, endDate?: string, current?: boolean) => {
    if (!startDate) return '';
    
    const formatYearMonth = (dateStr: string) => {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };
    
    const start = formatYearMonth(startDate);
    const end = current ? 'Present' : endDate ? formatYearMonth(endDate) : '';
    
    return `${start} - ${end}`;
  };

  // Parse JSON if it's a string
  const parseJsonContent = (content: any) => {
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        return content;
      }
    }
    return content;
  };

  // Specialized renderers for each section type
  const renderPersonalInformation = (data: any) => {
    const info = parseJsonContent(data);
    
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {info.full_name && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography variant="body2">{info.full_name}</Typography>
              </Box>
            )}
            {info.email && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body2">{info.email}</Typography>
              </Box>
            )}
            {info.phone && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body2">{info.phone}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {info.address && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body2">{info.address}</Typography>
              </Box>
            )}
            {info.website && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                <Typography variant="body2">
                  <Link href={info.website} target="_blank" rel="noopener noreferrer">
                    {info.website}
                  </Link>
                </Typography>
              </Box>
            )}
            {(info.linkedin || info.github) && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Profiles</Typography>
                <Stack direction="row" spacing={1}>
                  {info.linkedin && (
                    <Chip 
                      size="small" 
                      label="LinkedIn" 
                      component="a" 
                      href={info.linkedin} 
                      target="_blank"
                      clickable
                    />
                  )}
                  {info.github && (
                    <Chip 
                      size="small" 
                      label="GitHub" 
                      component="a" 
                      href={info.github} 
                      target="_blank"
                      clickable
                    />
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </Grid>
        {info.summary && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Summary</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {info.summary}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderCareerSummary = (data: any) => {
    // Career summary can be a nested JSON string
    let summary;
    try {
      if (typeof data === 'string') {
        summary = JSON.parse(data);
      } else if (typeof data === 'object') {
        // If already an object, try to parse nested JSON string if needed
        if (typeof data.default_summary === 'string' || typeof data.job_title === 'string') {
          summary = data;
        } else {
          const strValue = JSON.stringify(data);
          if (strValue.includes('job_title') || strValue.includes('default_summary')) {
            summary = data;
          } else {
            summary = JSON.parse(data);
          }
        }
      } else {
        summary = {};
      }
    } catch (e) {
      console.error('Error parsing career summary:', e);
      summary = data;
    }
    
    return (
      <Box>
        {summary.job_title && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Job Title</Typography>
            <Typography variant="body2">{summary.job_title}</Typography>
          </Box>
        )}
        
        {summary.job_titles && Array.isArray(summary.job_titles) && summary.job_titles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Professional Titles</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {summary.job_titles.map((title: string, index: number) => (
                <Chip key={index} label={title} size="small" />
              ))}
            </Stack>
          </Box>
        )}
        
        {summary.years_of_experience && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
            <Typography variant="body2">{summary.years_of_experience} years</Typography>
          </Box>
        )}
        
        {summary.default_summary && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Professional Summary</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {summary.default_summary}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderSkills = (data: any) => {
    // Skills can be a nested JSON string
    let skills;
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        // Handle nested structure where skills array is inside a "skills" property
        skills = parsed.skills || parsed;
      } else if (typeof data === 'object') {
        // If already an object, check if it has a skills property or is an array itself
        if (Array.isArray(data)) {
          skills = data;
        } else if (data.skills && Array.isArray(data.skills)) {
          skills = data.skills;
        } else {
          // Last attempt to parse it
          const strValue = JSON.stringify(data);
          const parsed = JSON.parse(strValue);
          skills = parsed.skills || parsed;
        }
      } else {
        skills = [];
      }
    } catch (e) {
      console.error('Error parsing skills:', e);
      if (Array.isArray(data)) {
        skills = data;
      } else {
        skills = [];
      }
    }
    
    if (!Array.isArray(skills) || skills.length === 0) {
      return <Typography variant="body2">No skills information available</Typography>;
    }
    
    return (
      <Grid container spacing={2}>
        {skills.map((skillCategory, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {skillCategory.category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {skillCategory.skills.map((skill: string, skillIndex: number) => (
                    <Chip 
                      key={skillIndex} 
                      label={skill} 
                      size="small"
                      sx={{ margin: '2px' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderWorkExperience = (data: any) => {
    // Work experience can be a nested JSON string
    let experiences;
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        experiences = parsed.work_experience || parsed;
      } else if (typeof data === 'object') {
        if (Array.isArray(data)) {
          experiences = data;
        } else if (data.work_experience && Array.isArray(data.work_experience)) {
          experiences = data.work_experience;
        } else {
          experiences = data;
        }
      } else {
        experiences = [];
      }
    } catch (e) {
      console.error('Error parsing work experience:', e);
      if (Array.isArray(data)) {
        experiences = data;
      } else {
        experiences = [];
      }
    }
    
    if (!Array.isArray(experiences) || experiences.length === 0) {
      return <Typography variant="body2">No work experience information available</Typography>;
    }
    
    return (
      <Box>
        {experiences.map((job, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 3 }}>
            {/* Date column */}
            <Box sx={{ width: '120px', pr: 2, pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {job.time || formatDateRange(job.start_date, job.end_date, job.current)}
              </Typography>
            </Box>
            
            {/* Connector line */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pr: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <WorkIcon fontSize="small" />
              </Avatar>
              {index < experiences.length - 1 && (
                <Box sx={{ width: '2px', bgcolor: 'divider', height: '100%', mt: '4px' }} />
              )}
            </Box>
            
            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" component="span" color="primary">
                {job.position || job.job_title}
              </Typography>
              <Typography variant="body2" component="div">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">{job.company}</Typography>
                </Box>
                {job.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                )}
              </Typography>
              
              {job.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {job.description}
                </Typography>
              )}
              
              {(job.achievements || job.responsibilities) && 
               (job.achievements?.length > 0 || job.responsibilities?.length > 0) && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Key Achievements:
                  </Typography>
                  <List dense sx={{ pl: 2, mt: 0.5 }}>
                    {(job.achievements || job.responsibilities || []).map((achievement: string, achievementIndex: number) => (
                      <ListItem key={achievementIndex} sx={{ py: 0, display: 'list-item', listStyleType: 'disc' }}>
                        <ListItemText 
                          primary={achievement} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderEducation = (data: any) => {
    // Education can be a nested JSON string
    let education;
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        education = parsed.education || parsed;
      } else if (typeof data === 'object') {
        if (Array.isArray(data)) {
          education = data;
        } else if (data.education && Array.isArray(data.education)) {
          education = data.education;
        } else {
          education = data;
        }
      } else {
        education = [];
      }
    } catch (e) {
      console.error('Error parsing education:', e);
      if (Array.isArray(data)) {
        education = data;
      } else {
        education = [];
      }
    }
    
    if (!Array.isArray(education) || education.length === 0) {
      return <Typography variant="body2">No education information available</Typography>;
    }
    
    return (
      <Box>
        {education.map((edu, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 3 }}>
            {/* Date column */}
            <Box sx={{ width: '120px', pr: 2, pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {edu.time || formatDateRange(edu.start_date, edu.end_date, edu.current)}
              </Typography>
            </Box>
            
            {/* Connector line */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pr: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <SchoolIcon fontSize="small" />
              </Avatar>
              {index < education.length - 1 && (
                <Box sx={{ width: '2px', bgcolor: 'divider', height: '100%', mt: '4px' }} />
              )}
            </Box>
            
            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" component="span" color="primary">
                {edu.degree_type ? `${edu.degree_type} in ${edu.degree}` : 
                 edu.degree ? edu.degree : 
                 `${edu.degree || edu.field_of_study || ''}`}
              </Typography>
              <Typography variant="body2" component="div">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">{edu.institution || edu.university_name}</Typography>
                </Box>
                {edu.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">{edu.location}</Typography>
                  </Box>
                )}
                {edu.GPA && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">GPA: {edu.GPA}</Typography>
                  </Box>
                )}
              </Typography>
              
              {edu.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {edu.description}
                </Typography>
              )}
              
              {(edu.courses || edu.transcript) && (edu.courses?.length > 0 || edu.transcript?.length > 0) && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Relevant Courses:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {(edu.courses || edu.transcript || []).map((course: string, courseIndex: number) => (
                      <Chip key={courseIndex} label={course} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderProjects = (data: any) => {
    // Projects can be a nested JSON string
    let projects;
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        projects = parsed.projects || parsed;
      } else if (typeof data === 'object') {
        if (Array.isArray(data)) {
          projects = data;
        } else if (data.projects && Array.isArray(data.projects)) {
          projects = data.projects;
        } else {
          projects = data;
        }
      } else {
        projects = [];
      }
    } catch (e) {
      console.error('Error parsing projects:', e);
      if (Array.isArray(data)) {
        projects = data;
      } else {
        projects = [];
      }
    }
    
    if (!Array.isArray(projects) || projects.length === 0) {
      return <Typography variant="body2">No project information available</Typography>;
    }
    
    return (
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" component="div" color="primary">
                      {project.name}
                    </Typography>
                    {(project.date || project.start_date) && (
                      <Typography variant="caption" color="text.secondary">
                        {project.date || formatDateRange(project.start_date, project.end_date, project.current)}
                      </Typography>
                    )}
                  </Box>
                  {project.url && (
                    <Tooltip title="View Project">
                      <IconButton 
                        size="small" 
                        component="a" 
                        href={project.url} 
                        target="_blank"
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                {project.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {project.description}
                  </Typography>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Technologies:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <Chip key={techIndex} label={tech} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}
                
                {(project.achievements || project.bullet_points) && 
                 (project.achievements?.length > 0 || project.bullet_points?.length > 0) && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Key Achievements:
                    </Typography>
                    <List dense sx={{ pl: 2, mt: 0.5 }}>
                      {(project.achievements || project.bullet_points || []).map((achievement: string, achievementIndex: number) => (
                        <ListItem key={achievementIndex} sx={{ py: 0, display: 'list-item', listStyleType: 'disc' }}>
                          <ListItemText 
                            primary={achievement} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderCertifications = (data: any) => {
    const certifications = parseJsonContent(data);
    
    if (!Array.isArray(certifications)) {
      return <Typography variant="body2">No certification information available</Typography>;
    }
    
    return (
      <Grid container spacing={2}>
        {certifications.map((cert, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {cert.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2">{cert.issuer}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(cert.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short'
                      })}
                    </Typography>
                  </Box>
                  {cert.url && (
                    <Link 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                    >
                      <LinkIcon fontSize="small" />
                      <Typography variant="body2">Verify</Typography>
                    </Link>
                  )}
                  {cert.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {cert.description}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAwards = (data: any) => {
    // Awards may come in various formats
    let awards = [];
    
    try {
      if (Array.isArray(data)) {
        // Handle the nested array format shown in the example data
        if (data.length > 0 && Array.isArray(data[0])) {
          // Format: [[["name", "Award Name"], ["explanation", "Award Description"]], [...]]
          awards = data.map((awardArray: any[]) => {
            const award: any = {};
            awardArray.forEach((pair: any[]) => {
              if (Array.isArray(pair) && pair.length === 2) {
                award[pair[0]] = pair[1];
              }
            });
            return award;
          });
        } else {
          // Standard array of award objects
          awards = data;
        }
      } else if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        awards = parsed.awards || parsed;
      } else if (typeof data === 'object') {
        if (data.awards && Array.isArray(data.awards)) {
          awards = data.awards;
        } else {
          awards = [data]; // Single award object
        }
      }
    } catch (e) {
      console.error('Error parsing awards:', e);
      awards = [];
    }
    
    if (!Array.isArray(awards) || awards.length === 0) {
      return <Typography variant="body2">No awards information available</Typography>;
    }
    
    return (
      <List disablePadding>
        {awards.map((award, index) => (
          <ListItem key={index} alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <AwardIcon />
            </Avatar>
            <ListItemText
              primary={award.title || award.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {award.issuer}
                  </Typography>
                  {award.date && (
                    <>
                      {' — '}
                      <Typography component="span" variant="body2">
                        {typeof award.date === 'string' && award.date.length > 4 ? 
                         new Date(award.date).toLocaleDateString('en-US', { 
                           year: 'numeric', 
                           month: 'short'
                         }) : award.date}
                      </Typography>
                    </>
                  )}
                  {(award.description || award.explanation) && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {award.description || award.explanation}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderPublications = (data: any) => {
    // Publications may come in various formats
    let publications = [];
    
    try {
      if (Array.isArray(data)) {
        // Handle the nested array format shown in the example data
        if (data.length > 0 && Array.isArray(data[0])) {
          // Format: [[["name", "Publication Name"], ["publisher", "Publisher Name"], ...], [...]]
          publications = data.map((pubArray: any[]) => {
            const pub: any = {};
            pubArray.forEach((pair: any[]) => {
              if (Array.isArray(pair) && pair.length === 2) {
                pub[pair[0]] = pair[1];
              }
            });
            return pub;
          });
        } else {
          // Standard array of publication objects
          publications = data;
        }
      } else if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        publications = parsed.publications || parsed;
      } else if (typeof data === 'object') {
        if (data.publications && Array.isArray(data.publications)) {
          publications = data.publications;
        } else {
          publications = [data]; // Single publication object
        }
      }
    } catch (e) {
      console.error('Error parsing publications:', e);
      publications = [];
    }
    
    if (!Array.isArray(publications) || publications.length === 0) {
      return <Typography variant="body2">No publications information available</Typography>;
    }
    
    return (
      <List disablePadding>
        {publications.map((pub, index) => (
          <ListItem key={index} alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
              <DescriptionIcon />
            </Avatar>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  {pub.title || pub.name}
                  {(pub.url || pub.link) && (
                    <IconButton 
                      size="small" 
                      component="a" 
                      href={pub.url || pub.link} 
                      target="_blank"
                      sx={{ ml: 1 }}
                    >
                      <LinkIcon fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {pub.publisher}
                  </Typography>
                  {(pub.date || pub.time) && (
                    <>
                      {' — '}
                      <Typography component="span" variant="body2">
                        {typeof (pub.date || pub.time) === 'string' && (pub.date || pub.time).length > 4 ? 
                         new Date(pub.date || pub.time).toLocaleDateString('en-US', { 
                           year: 'numeric', 
                           month: 'short'
                         }) : (pub.date || pub.time)}
                      </Typography>
                    </>
                  )}
                  {pub.authors && pub.authors.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Authors: {pub.authors.join(', ')}
                    </Typography>
                  )}
                  {pub.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {pub.description}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  // Render sections based on content type
  const renderSection = (title: string, content: any) => {
    if (!content) return null;
    
    return (
      <Paper elevation={0} sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {/* Render the content based on section type */}
        {title === 'Personal Information' ? renderPersonalInformation(content) :
         title === 'Career Summary' ? renderCareerSummary(content) :
         title === 'Skills' ? renderSkills(content) :
         title === 'Work Experience' ? renderWorkExperience(content) :
         title === 'Education' ? renderEducation(content) :
         title === 'Projects' ? renderProjects(content) :
         title === 'Certifications' ? renderCertifications(content) :
         title === 'Awards' ? renderAwards(content) :
         title === 'Publications' ? renderPublications(content) :
         // Fallback to the original JSON display if no specialized renderer exists
         typeof content === 'string' ? (
          <Typography variant="body2" whiteSpace="pre-wrap">
            {content}
          </Typography>
         ) : (
          <Box component="pre" sx={{ 
            overflow: 'auto', 
            maxHeight: '250px',
            backgroundColor: '#f5f5f5',
            p: 1,
            borderRadius: 1,
            fontSize: '0.8rem'
          }}>
            {JSON.stringify(parseJsonContent(content), null, 2)}
          </Box>
         )}
      </Paper>
    );
  };

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
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Resumes
        </Button>
      </Box>
    );
  }

  if (!resume) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Resume not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Resumes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: '16px 16px 16px 0',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={handleBack} 
          sx={{ cursor: 'pointer' }}
        >
          Resumes
        </Link>
        <Typography color="text.primary">{resume.title}</Typography>
      </Breadcrumbs>
      
      {/* Header with Title and Actions */}
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
            {resume.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
            {resume.job_title && (
              <Chip 
                label={resume.job_title} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            )}
            {resume.company_name && (
              <Chip 
                label={resume.company_name} 
                size="small" 
              />
            )}
            <Chip 
              label={`v${resume.version}`} 
              size="small" 
              variant="outlined" 
              color="secondary"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatDate(resume.updated_at)}
          </Typography>
        </Box>
        
        <Stack 
          direction={{ xs: 'row', sm: 'row' }} 
          spacing={1} 
          sx={{ 
            flexWrap: 'wrap', 
            gap: 1,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'flex-start', md: 'flex-end' }
          }}
        >
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            size="small"
          >
            Back
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            size="small"
          >
            Edit
          </Button>
          <Button 
            variant="outlined"
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={handleDeleteClick}
            size="small"
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            startIcon={generatingPdf ? <CircularProgress size={16} /> : <PdfIcon />}
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            size="small"
          >
            {generatingPdf ? 'Generating...' : 'Download PDF'}
          </Button>
        </Stack>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ width: '100%' }}>
        {/* Resume Details */}
        <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Resume Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Template</Typography>
              <Typography variant="body2">{resume.template_id}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Created</Typography>
              <Typography variant="body2">{formatDate(resume.created_at)}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Updated</Typography>
              <Typography variant="body2">{formatDate(resume.updated_at)}</Typography>
            </Box>
          </Box>
              
          {resume.job_description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
              <Typography variant="body2" sx={{ 
                maxHeight: jobDescriptionExpanded ? 'none' : '100px', 
                overflow: jobDescriptionExpanded ? 'visible' : 'hidden',
                textOverflow: jobDescriptionExpanded ? 'unset' : 'ellipsis',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: jobDescriptionExpanded ? 'static' : 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  height: jobDescriptionExpanded ? 0 : '30px',
                  background: jobDescriptionExpanded ? 'none' : 'linear-gradient(to bottom, rgba(249,249,249,0), rgba(249,249,249,1))'
                }
              }}>
                {resume.job_description}
              </Typography>
              <Button 
                size="small" 
                sx={{ mt: 0.5 }} 
                onClick={handleToggleJobDescription}
                endIcon={jobDescriptionExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                {jobDescriptionExpanded ? 'Show less' : 'View full description'}
              </Button>
            </Box>
          )}
        </Paper>
        
        {resume.content?.personal_information && 
          renderSection('Personal Information', resume.content.personal_information)}
          
        {resume.content?.career_summary && 
          renderSection('Career Summary', resume.content.career_summary)}
          
        {resume.content?.skills && 
          renderSection('Skills', resume.content.skills)}
          
        {resume.content?.work_experience && 
          renderSection('Work Experience', resume.content.work_experience)}
          
        {resume.content?.education && 
          renderSection('Education', resume.content.education)}
          
        {resume.content?.projects && 
          renderSection('Projects', resume.content.projects)}
          
        {resume.content?.certifications && 
          renderSection('Certifications', resume.content.certifications)}
          
        {resume.content?.awards && 
          renderSection('Awards', resume.content.awards)}
          
        {resume.content?.publications && 
          renderSection('Publications', resume.content.publications)}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this resume? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deletingResume}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deletingResume}
            startIcon={deletingResume ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deletingResume ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewResumePage; 
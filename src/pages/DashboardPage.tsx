import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  CircularProgress,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { 
  Description as ResumeIcon, 
  Mail as CoverLetterIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getResumes } from '../services/resumeService';
import { getCoverLetters } from '../services/coverLetterService';
import { getUserPortfolio } from '../services/portfolioService';
import { getUserProfile } from '../services/profileService';
import { getResumeById } from '../services/resumeService';
import { Resume, CoverLetter, Portfolio, Profile } from '../types/models';

// Define a unified type for recent items
interface RecentItem {
  id: string;
  title: string;
  type: 'resume' | 'cover-letter';
  date: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for data
  const [resumeCount, setResumeCount] = useState(0);
  const [coverLetterCount, setCoverLetterCount] = useState(0);
  const [portfolioComplete, setPortfolioComplete] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resumeTitles, setResumeTitles] = useState<Record<string, string>>({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch resumes, cover letters, and portfolio data in parallel
        const [resumesResponse, coverLettersResponse, portfolioResponse, profileResponse] = await Promise.all([
          getResumes(0, 10),
          getCoverLetters(undefined, undefined, 0, 3),
          getUserPortfolio().catch(err => {
            console.warn('Portfolio not found or error:', err);
            return null;
          }),
          getUserProfile().catch(err => {
            console.warn('Profile not found or error:', err);
            return null;
          })
        ]);
        
        // Update counts
        setResumeCount(resumesResponse.total);
        setCoverLetterCount(coverLettersResponse.items.length);
        
        // Set profile
        if (profileResponse) {
          setProfile(profileResponse);
        }
        
        // Check if portfolio is complete
        if (portfolioResponse) {
          // Simple check - portfolio is complete if it has career summary and at least some skills
          const hasCareerSummary = Boolean(
            portfolioResponse.career_summary?.default_summary
          );
          const hasSkills = portfolioResponse.skills && portfolioResponse.skills.length > 0;
          setPortfolioComplete(hasCareerSummary && hasSkills);
        } else {
          setPortfolioComplete(false);
        }
        
        // Collect resume IDs from cover letters
        const resumeIds = coverLettersResponse.items.map((cl: CoverLetter) => cl.resume_id);
        const uniqueResumeIds = Array.from(new Set(resumeIds));
        
        // Fetch resume titles for cover letters
        const resumeTitlesMap: Record<string, string> = {};
        
        // Check if resumes exist before adding them to the titles map
        await Promise.all(
          uniqueResumeIds.map(async (resumeId) => {
            try {
              const resume = await getResumeById(resumeId);
              if (resume) {
                resumeTitlesMap[resumeId] = resume.title;
              }
            } catch (err) {
              console.warn(`Resume ${resumeId} might have been deleted:`, err);
              // Don't add to map if it doesn't exist
            }
          })
        );
        setResumeTitles(resumeTitlesMap);
        
        // Combine recent items, sort by date, filter out deleted items, and take the 5 most recent
        
        // First, handle resumes
        const validResumes = resumesResponse.items.map((resume: Resume) => ({
          id: resume.id,
          title: resume.title,
          type: 'resume' as const,
          date: resume.updated_at || resume.created_at
        }));
        
        // Then handle cover letters, only including ones with valid resumes
        const validCoverLetters = coverLettersResponse.items
          .filter((coverLetter: CoverLetter) => 
            // Only include cover letters that have a valid resume title (meaning the resume exists)
            resumeTitlesMap[coverLetter.resume_id] !== undefined
          )
          .map((coverLetter: CoverLetter) => ({
            id: coverLetter.id,
            title: resumeTitlesMap[coverLetter.resume_id] 
              ? `${resumeTitlesMap[coverLetter.resume_id]}` 
              : `Cover Letter (${coverLetter.resume_id.substring(0, 8)})`,
            type: 'cover-letter' as const,
            date: coverLetter.updated_at || coverLetter.created_at
          }));
        
        // Combine valid items
        const combinedItems: RecentItem[] = [...validResumes, ...validCoverLetters];
        
        // Sort by date (newest first) and take the most recent 6
        const sortedItems = combinedItems.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 6);
        
        setRecentItems(sortedItems);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCreateResume = () => {
    navigate('/resumes/new');
  };

  const handleCreateCoverLetter = () => {
    navigate('/cover-letters/new');
  };

  const handleEditPortfolio = () => {
    navigate('/portfolio');
  };

  return (
    <Box sx={{ p: 3, pl: 2, pt: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mb: 5,
        mt: 2 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'normal'
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>Welcome,</Box>
          <Box 
            component="span" 
            sx={{ 
              color: '#E05B49', 
              ml: 1, 
              fontWeight: 'bold' 
            }}
          >
            {profile?.personal_information?.full_name || user?.username?.replace(/_[0-9]+$/, '').replace(/_/g, ' ') || 'User'}!
          </Box>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Document Summary */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        sx={{ mb: 6 }}
        alignItems="stretch"
      >
        {/* Resume Card */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flexGrow: 1,
            width: { xs: '100%', sm: '33%' }
          }}
        >
          <ResumeIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
          {loading ? (
            <CircularProgress size={30} sx={{ my: 1 }} />
          ) : (
            <Typography variant="h5">{resumeCount}</Typography>
          )}
          <Typography variant="subtitle1">Resumes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleCreateResume}
            disabled={loading}
          >
            Create Resume
          </Button>
        </Paper>

        {/* Cover Letter Card */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flexGrow: 1,
            width: { xs: '100%', sm: '33%' }
          }}
        >
          <CoverLetterIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
          {loading ? (
            <CircularProgress size={30} sx={{ my: 1 }} />
          ) : (
            <Typography variant="h5">{coverLetterCount}</Typography>
          )}
          <Typography variant="subtitle1">Cover Letters</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleCreateCoverLetter}
            disabled={loading}
          >
            Create Cover Letter
          </Button>
        </Paper>

        {/* Portfolio Card */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flexGrow: 1,
            width: { xs: '100%', sm: '33%' },
            bgcolor: portfolioComplete ? 'success.50' : 'warning.50'
          }}
        >
          <PersonIcon 
            fontSize="large" 
            color={loading ? "disabled" : (portfolioComplete ? "success" : "warning")} 
            sx={{ mb: 1 }} 
          />
          {loading ? (
            <CircularProgress size={30} sx={{ my: 1 }} />
          ) : (
            <Typography variant="h5">
              {portfolioComplete ? 'Complete' : 'Incomplete'}
            </Typography>
          )}
          <Typography variant="subtitle1">Portfolio Status</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleEditPortfolio}
            disabled={loading}
          >
            {portfolioComplete ? 'View Portfolio' : 'Complete Portfolio'}
          </Button>
        </Paper>
      </Stack>

      {/* Recent Activity */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Recent Activity
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            },
            gap: 2,
            mb: 2
          }}>
            {recentItems.map((item) => (
              <Card key={item.id} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {item.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {item.type === 'resume' ? 'Resume' : 'Cover Letter'}
                  </Typography>
                  <Typography variant="body2">
                    Last modified: {formatDate(item.date)}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/${item.type}s/${item.id}`)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => navigate(`/${item.type}s/${item.id}/edit`)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
          
          {recentItems.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No recent activity. Create your first document!
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage; 
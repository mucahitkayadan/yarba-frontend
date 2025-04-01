import React, { useState } from 'react';
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
  Stack
} from '@mui/material';
import { 
  Description as ResumeIcon, 
  Mail as CoverLetterIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual API calls later
const mockRecentItems = [
  { id: '1', title: 'Software Developer Resume', type: 'resume', date: '2023-04-01T10:00:00Z' },
  { id: '2', title: 'Application for Google', type: 'cover-letter', date: '2023-03-28T14:30:00Z' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Eventually you'll replace these with real counts from API
  const resumeCount = 3;
  const coverLetterCount = 2;
  const completedProfile = true;

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Welcome, {user?.username || 'User'}!
      </Typography>

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
          <Typography variant="h5">{resumeCount}</Typography>
          <Typography variant="subtitle1">Resumes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleCreateResume}
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
          <Typography variant="h5">{coverLetterCount}</Typography>
          <Typography variant="subtitle1">Cover Letters</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleCreateCoverLetter}
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
            bgcolor: completedProfile ? 'success.50' : 'warning.50'
          }}
        >
          <PersonIcon fontSize="large" color={completedProfile ? "success" : "warning"} sx={{ mb: 1 }} />
          <Typography variant="h5">
            {completedProfile ? 'Complete' : 'Incomplete'}
          </Typography>
          <Typography variant="subtitle1">Portfolio Status</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleEditPortfolio}
          >
            {completedProfile ? 'View Portfolio' : 'Complete Portfolio'}
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
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 2 }}
            alignItems="stretch"
            flexWrap="wrap"
          >
            {mockRecentItems.map((item) => (
              <Card key={item.id} sx={{ width: { xs: '100%', sm: '30%' }, minWidth: 250, mb: 2 }}>
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
          </Stack>
          
          {mockRecentItems.length === 0 && (
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, Typography, Box, TextField, CircularProgress, Alert, Paper
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';

const LifeStorySetupPage: React.FC = () => {
    const navigate = useNavigate();
    const { updateUserSetupProgress, updateProfile } = useAuth();
    const { profile, loading: profileLoading, refreshProfile } = useProfile();
    const [lifeStory, setLifeStory] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile && profile.life_story) {
            setLifeStory(profile.life_story);
        }
    }, [profile]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLifeStory(event.target.value);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const profileUpdateData = {
                life_story: lifeStory,
            };
            await updateProfile(profileUpdateData);
            await refreshProfile();
            console.log('Life story saved.');
            return true;
        } catch (err: any) {
            console.error("Failed to save life story:", err);
            setError(err.message || 'Failed to save life story.');
            setSaving(false);
            return false;
        }
    };

    const handleBack = async () => {
        try {
            await updateUserSetupProgress({ current_setup_step: 3 });
            navigate('/user/setup/system-preferences');
        } catch (err) {
            console.error("Failed to navigate back:", err);
            navigate('/user/setup/system-preferences');
        }
    };

    const handleSaveAndFinish = async () => {
        const savedSuccessfully = await handleSave();
        if (savedSuccessfully) {
            try {
                await updateUserSetupProgress({ setup_completed: true });
                navigate('/dashboard');
            } catch (err: any) {
                console.error("Failed to complete setup:", err);
                setError(err.message || 'Failed to complete setup.');
                setSaving(false);
            }
        }
    };

    if (profileLoading) {
        return (
            <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading your information...</Typography>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Share Your Career Journey
                </Typography>
                <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Your life story, career aspirations, and motivations help the AI understand your unique background and craft more personalized documents.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        name="lifeStory"
                        label="Your Life Story / Career Narrative (Optional)"
                        multiline
                        rows={10}
                        value={lifeStory}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Tell us about your professional journey, what drives you, your key skills, and what you're looking for next..."
                        disabled={saving}
                        sx={{ mb: 3 }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button variant="outlined" onClick={handleBack} disabled={saving}>
                            Back
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSaveAndFinish} 
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {saving ? 'Saving...' : 'Save & Finish'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LifeStorySetupPage; 
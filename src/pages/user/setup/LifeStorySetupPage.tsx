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

    const handleSaveAndNext = async () => {
        const savedSuccessfully = await handleSave();
        if (savedSuccessfully) {
            try {
                await updateUserSetupProgress({ current_setup_step: 5 });
                navigate('/user/setup/portfolio-upload');
            } catch (err: any) {
                console.error("Failed to update setup progress:", err);
                setError(err.message || 'Failed to proceed to the next step.');
                setSaving(false);
            }
        }
    };

    const handleSkip = async () => {
        try {
            setSaving(true);
            await updateUserSetupProgress({ current_setup_step: 5 });
            navigate('/user/setup/portfolio-upload');
        } catch (err: any) {
            console.error("Failed to skip:", err);
            setError(err.message || 'Failed to proceed to the next step.');
        } finally {
            setSaving(false);
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
        <Container 
            component="main" 
            maxWidth={false} 
            sx={{ 
                mt: 8, 
                mb: 8, 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, sm: 3, md: 4 },
                    width: '100%',
                    maxWidth: '900px',
                    boxSizing: 'border-box'
                }}
            >
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
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={handleSkip} 
                                disabled={saving}
                            >
                                Skip for now
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSaveAndNext} 
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {saving ? 'Saving...' : 'Save & Next'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LifeStorySetupPage; 
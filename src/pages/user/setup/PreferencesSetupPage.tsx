import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, Typography, Box, TextField, Grid, CircularProgress, Alert, Paper,
    FormGroup, FormControlLabel, Switch, Divider, Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserProfile } from '../../../services/profileService';
import { Profile } from '../../../types/models';

interface PreferencesFormData {
    // Prompt Preferences
    careerSummaryMinWords: number | string;
    careerSummaryMaxWords: number | string;
    workExpMaxJobs: number | string;
    workExpBulletPoints: number | string;
    // System Preferences
    darkMode: boolean;
    autoSave: boolean;
}

const PreferencesSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateProfile: updateProfileContext, updateUserSetupProgress } = useAuth();
    const [formData, setFormData] = useState<PreferencesFormData>({
        careerSummaryMinWords: '',
        careerSummaryMaxWords: '',
        workExpMaxJobs: '',
        workExpBulletPoints: '',
        darkMode: false,
        autoSave: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profile: Profile = await getUserProfile();
                if (profile) {
                    setFormData({
                        careerSummaryMinWords: profile.prompt_preferences?.career_summary?.min_words || '',
                        careerSummaryMaxWords: profile.prompt_preferences?.career_summary?.max_words || '',
                        workExpMaxJobs: profile.prompt_preferences?.work_experience?.max_jobs || '',
                        workExpBulletPoints: profile.prompt_preferences?.work_experience?.bullet_points_per_job || '',
                        darkMode: profile.system_preferences?.features?.dark_mode || false,
                        autoSave: profile.system_preferences?.features?.auto_save === undefined ? true : profile.system_preferences.features.auto_save,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile for preferences setup:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value),
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const profileUpdateData = {
                prompt_preferences: {
                    career_summary: {
                        min_words: Number(formData.careerSummaryMinWords) || undefined,
                        max_words: Number(formData.careerSummaryMaxWords) || undefined,
                    },
                    work_experience: {
                        max_jobs: Number(formData.workExpMaxJobs) || undefined,
                        bullet_points_per_job: Number(formData.workExpBulletPoints) || undefined,
                    },
                },
                system_preferences: {
                    features: {
                        dark_mode: formData.darkMode,
                        auto_save: formData.autoSave,
                    },
                },
            };
            await updateProfileContext(profileUpdateData);
            console.log('Preferences saved:', profileUpdateData);
            return true;
        } catch (err: any) {
            console.error("Failed to save preferences:", err);
            setError(err.message || 'Failed to save preferences.');
            setSaving(false);
            return false;
        }
    };

    const handleBack = async () => {
        try {
            await updateUserSetupProgress({ current_setup_step: 1 });
            navigate('/user/setup/personal-info');
        } catch (err) {
            console.error("Failed to navigate back:", err);
            navigate('/user/setup/personal-info');
        }
    };

    const handleSaveAndNext = async () => {
        const savedSuccessfully = await handleSave();
        if (savedSuccessfully) {
            try {
                await updateUserSetupProgress({ current_setup_step: 3 });
                navigate('/user/setup/life-story');
            } catch (err: any) {
                console.error("Failed to update setup progress:", err);
                setError(err.message || 'Failed to proceed to the next step.');
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading your preferences...</Typography>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Customize Your Experience
                </Typography>
                <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Adjust these settings to tailor the AI's behavior and application features to your liking.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Typography variant="h6" gutterBottom>Prompt Preferences</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Guide the AI on how to generate content for your documents.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="careerSummaryMinWords"
                                label="Career Summary: Min Words"
                                type="number"
                                value={formData.careerSummaryMinWords}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="careerSummaryMaxWords"
                                label="Career Summary: Max Words"
                                type="number"
                                value={formData.careerSummaryMaxWords}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="workExpMaxJobs"
                                label="Work Experience: Max Jobs to List"
                                type="number"
                                value={formData.workExpMaxJobs}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="workExpBulletPoints"
                                label="Work Experience: Bullet Points per Job"
                                type="number"
                                value={formData.workExpBulletPoints}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom>System Preferences</Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Control application features and appearance.
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Switch checked={formData.darkMode} onChange={handleChange} name="darkMode" disabled={saving}/>} 
                                    label="Dark Mode"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Switch checked={formData.autoSave} onChange={handleChange} name="autoSave" disabled={saving}/>} 
                                    label={(
                                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                            Auto Save
                                            <Tooltip title="Automatically save your work periodically while editing documents.">
                                                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
                                            </Tooltip>
                                        </Box>
                                    )}
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                        <Button variant="outlined" onClick={handleBack} disabled={saving}>
                            Back
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
            </Paper>
        </Container>
    );
};

export default PreferencesSetupPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, Typography, Box, Grid, CircularProgress, Alert, Paper,
    FormGroup, FormControlLabel, Switch, Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';
import { Profile } from '../../../types/models';

interface SystemPreferencesFormData {
    darkMode: boolean;
    autoSave: boolean;
}

const SystemPreferencesSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const { updateUserSetupProgress, updateProfile } = useAuth();
    const { profile, loading: profileLoading, refreshProfile } = useProfile();
    const [formData, setFormData] = useState<SystemPreferencesFormData>({
        darkMode: false,
        autoSave: true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                darkMode: profile.system_preferences?.features?.dark_mode || false,
                autoSave: profile.system_preferences?.features?.auto_save === undefined ? true : profile.system_preferences.features.auto_save,
            });
        }
    }, [profile]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const profileUpdateData = {
                system_preferences: {
                    features: {
                        dark_mode: formData.darkMode,
                        auto_save: formData.autoSave,
                    },
                },
            };
            
            // Use the updateProfile function from the auth context
            await updateProfile(profileUpdateData);
            
            // Refresh the profile data in the context
            await refreshProfile();
            
            console.log('System preferences saved:', profileUpdateData);
            return true;
        } catch (err: any) {
            console.error("Failed to save system preferences:", err);
            setError(err.message || 'Failed to save system preferences.');
            setSaving(false);
            return false;
        }
    };

    const handleBack = async () => {
        try {
            await updateUserSetupProgress({ current_setup_step: 2 });
            navigate('/user/setup/prompt-preferences');
        } catch (err) {
            console.error("Failed to navigate back:", err);
            navigate('/user/setup/prompt-preferences');
        }
    };

    const handleSaveAndNext = async () => {
        const savedSuccessfully = await handleSave();
        if (savedSuccessfully) {
            try {
                await updateUserSetupProgress({ current_setup_step: 4 });
                navigate('/user/setup/life-story');
            } catch (err: any) {
                console.error("Failed to update setup progress:", err);
                setError(err.message || 'Failed to proceed to the next step.');
                setSaving(false);
            }
        }
    };

    if (profileLoading) {
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
                    Customize Your Application Settings
                </Typography>
                <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Control how the application works and looks.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" noValidate sx={{ mt: 1 }}>
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

export default SystemPreferencesSetupPage; 
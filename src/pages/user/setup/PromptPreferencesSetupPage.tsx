import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, Typography, Box, TextField, Grid, CircularProgress, Alert, Paper, Divider
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';
import { Profile } from '../../../types/models';

interface PromptPreferencesFormData {
    careerSummaryMinWords: number | string;
    careerSummaryMaxWords: number | string;
    workExpMaxJobs: number | string;
    workExpBulletPoints: number | string;
    projectMaxProjects: number | string;
    projectBulletPoints: number | string;
    skillsMaxCategories: number | string;
    skillsMinPerCategory: number | string;
    skillsMaxPerCategory: number | string;
    educationMaxEntries: number | string;
    educationMaxCourses: number | string;
    coverLetterParagraphs: number | string;
    coverLetterTargetAge: number | string;
    awardsMaxAwards: number | string;
    publicationsMaxPublications: number | string;
}

const PromptPreferencesSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const { updateUserSetupProgress, updateProfile } = useAuth();
    const { profile, loading: profileLoading, refreshProfile } = useProfile();
    const [formData, setFormData] = useState<PromptPreferencesFormData>({
        careerSummaryMinWords: '',
        careerSummaryMaxWords: '',
        workExpMaxJobs: '',
        workExpBulletPoints: '',
        projectMaxProjects: '',
        projectBulletPoints: '',
        skillsMaxCategories: '',
        skillsMinPerCategory: '',
        skillsMaxPerCategory: '',
        educationMaxEntries: '',
        educationMaxCourses: '',
        coverLetterParagraphs: '',
        coverLetterTargetAge: '',
        awardsMaxAwards: '',
        publicationsMaxPublications: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                careerSummaryMinWords: profile.prompt_preferences?.career_summary?.min_words || '',
                careerSummaryMaxWords: profile.prompt_preferences?.career_summary?.max_words || '',
                workExpMaxJobs: profile.prompt_preferences?.work_experience?.max_jobs || '',
                workExpBulletPoints: profile.prompt_preferences?.work_experience?.bullet_points_per_job || '',
                projectMaxProjects: profile.prompt_preferences?.project?.max_projects || '',
                projectBulletPoints: profile.prompt_preferences?.project?.bullet_points_per_project || '',
                skillsMaxCategories: profile.prompt_preferences?.skills?.max_categories || '',
                skillsMinPerCategory: profile.prompt_preferences?.skills?.min_per_category || '',
                skillsMaxPerCategory: profile.prompt_preferences?.skills?.max_per_category || '',
                educationMaxEntries: profile.prompt_preferences?.education?.max_entries || '',
                educationMaxCourses: profile.prompt_preferences?.education?.max_courses || '',
                coverLetterParagraphs: profile.prompt_preferences?.cover_letter?.paragraphs || '',
                coverLetterTargetAge: profile.prompt_preferences?.cover_letter?.target_age || '',
                awardsMaxAwards: profile.prompt_preferences?.awards?.max_awards || '',
                publicationsMaxPublications: profile.prompt_preferences?.publications?.max_publications || '',
            });
        }
    }, [profile]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
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
                    project: {
                        max_projects: Number(formData.projectMaxProjects) || undefined,
                        bullet_points_per_project: Number(formData.projectBulletPoints) || undefined,
                    },
                    skills: {
                        max_categories: Number(formData.skillsMaxCategories) || undefined,
                        min_per_category: Number(formData.skillsMinPerCategory) || undefined,
                        max_per_category: Number(formData.skillsMaxPerCategory) || undefined,
                    },
                    education: {
                        max_entries: Number(formData.educationMaxEntries) || undefined,
                        max_courses: Number(formData.educationMaxCourses) || undefined,
                    },
                    cover_letter: {
                        paragraphs: Number(formData.coverLetterParagraphs) || undefined,
                        target_age: Number(formData.coverLetterTargetAge) || undefined,
                    },
                    awards: {
                        max_awards: Number(formData.awardsMaxAwards) || undefined,
                    },
                    publications: {
                        max_publications: Number(formData.publicationsMaxPublications) || undefined,
                    },
                },
            };
            
            // Use updateProfile from the top-level useAuth hook
            await updateProfile(profileUpdateData);
            
            // Refresh the profile data in the context
            await refreshProfile();
            
            console.log('Prompt preferences saved:', profileUpdateData);
            return true;
        } catch (err: any) {
            console.error("Failed to save prompt preferences:", err);
            setError(err.message || 'Failed to save prompt preferences.');
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
                navigate('/user/setup/system-preferences');
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
                    Customize Your AI Experience
                </Typography>
                <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Adjust how the AI generates content for your resumes and cover letters.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    {/* Career Summary */}
                    <Typography variant="h6" gutterBottom>Career Summary</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your career summary.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="careerSummaryMinWords"
                                label="Minimum Words"
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
                                label="Maximum Words"
                                type="number"
                                value={formData.careerSummaryMaxWords}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Work Experience */}
                    <Typography variant="h6" gutterBottom>Work Experience</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your work experience.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="workExpMaxJobs"
                                label="Maximum Jobs to List"
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
                                label="Bullet Points per Job"
                                type="number"
                                value={formData.workExpBulletPoints}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Projects */}
                    <Typography variant="h6" gutterBottom>Projects</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your projects section.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="projectMaxProjects"
                                label="Maximum Projects to List"
                                type="number"
                                value={formData.projectMaxProjects}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="projectBulletPoints"
                                label="Bullet Points per Project"
                                type="number"
                                value={formData.projectBulletPoints}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Skills */}
                    <Typography variant="h6" gutterBottom>Skills</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your skills section.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="skillsMaxCategories"
                                label="Maximum Categories"
                                type="number"
                                value={formData.skillsMaxCategories}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="skillsMinPerCategory"
                                label="Min Skills per Category"
                                type="number"
                                value={formData.skillsMinPerCategory}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="skillsMaxPerCategory"
                                label="Max Skills per Category"
                                type="number"
                                value={formData.skillsMaxPerCategory}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Education */}
                    <Typography variant="h6" gutterBottom>Education</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your education section.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="educationMaxEntries"
                                label="Maximum Entries"
                                type="number"
                                value={formData.educationMaxEntries}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="educationMaxCourses"
                                label="Maximum Courses"
                                type="number"
                                value={formData.educationMaxCourses}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Cover Letter */}
                    <Typography variant="h6" gutterBottom>Cover Letter</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your cover letters.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="coverLetterParagraphs"
                                label="Number of Paragraphs"
                                type="number"
                                value={formData.coverLetterParagraphs}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="coverLetterTargetAge"
                                label="Target Age"
                                type="number"
                                value={formData.coverLetterTargetAge}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>

                    {/* Awards and Publications */}
                    <Typography variant="h6" gutterBottom>Awards & Publications</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure how the AI generates your awards and publications.
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="awardsMaxAwards"
                                label="Maximum Awards"
                                type="number"
                                value={formData.awardsMaxAwards}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="publicationsMaxPublications"
                                label="Maximum Publications"
                                type="number"
                                value={formData.publicationsMaxPublications}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={saving}
                            />
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

export default PromptPreferencesSetupPage; 
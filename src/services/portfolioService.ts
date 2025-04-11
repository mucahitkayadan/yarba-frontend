import api from './api';
import { Portfolio } from '../types/models';

// Get user's portfolios
export const getUserPortfolios = async (): Promise<Portfolio[]> => {
  const response = await api.get('/portfolios');
  console.log('Portfolio API response:', response.data);
  return response.data;
};

// Get portfolio by _id
export const getPortfolioById = async (portfolioId: string): Promise<Portfolio> => {
  const response = await api.get(`/portfolios/${portfolioId}`);
  console.log('Portfolio by _id API response:', response.data);
  return response.data;
};

// Create a new portfolio
export const createPortfolio = async (data: { profile_id?: string }): Promise<Portfolio> => {
  const response = await api.post('/portfolios', data);
  return response.data;
};

// Update portfolio
export const updatePortfolio = async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
  console.log(`Updating portfolio ${portfolioId} with data:`, data);
  const response = await api.put(`/portfolios/${portfolioId}`, data);
  return response.data;
};

// Section-specific PATCH endpoints

// Update career summary section
export const updateCareerSummary = async (
  portfolioId: string,
  careerSummary: {
    job_titles: string[];
    years_of_experience: string;
    default_summary: string;
  }
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/career-summary`, careerSummary);
  return response.data;
};

// Update skills section
export const updateSkills = async (
  portfolioId: string, 
  skills: Array<{ category: string; skills: string[] }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/skills`, skills);
  return response.data;
};

// Update work experience section
export const updateWorkExperience = async (
  portfolioId: string, 
  workExperience: Array<{
    job_title: string;
    company: string;
    location: string;
    time: string;
    responsibilities: string[];
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/work-experience`, workExperience);
  return response.data;
};

// Update education section
export const updateEducation = async (
  portfolioId: string, 
  education: Array<{
    degree_type: string;
    degree: string;
    university_name: string;
    time: string;
    location: string;
    GPA: string;
    transcript: string[];
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/education`, education);
  return response.data;
};

// Update projects section
export const updateProjects = async (
  portfolioId: string, 
  projects: Array<{
    name: string;
    bullet_points: string[];
    date: string;
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/projects`, projects);
  return response.data;
};

// Update certifications section
export const updateCertifications = async (
  portfolioId: string, 
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    description?: string;
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/certifications`, certifications);
  return response.data;
};

// Update awards section
export const updateAwards = async (
  portfolioId: string, 
  awards: Array<{
    name: string;
    explanation: string;
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/awards`, awards);
  return response.data;
};

// Update publications section
export const updatePublications = async (
  portfolioId: string, 
  publications: Array<{
    name: string;
    publisher: string;
    link: string;
    time: string;
  }>
): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}/publications`, publications);
  return response.data;
}; 
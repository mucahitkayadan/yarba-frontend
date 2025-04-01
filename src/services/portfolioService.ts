import api from './api';
import { Portfolio } from '../types/models';

// Get current user's portfolio
export const getUserPortfolio = async (): Promise<Portfolio> => {
  const response = await api.get('/portfolios/me');
  return response.data;
};

// Update portfolio
export const updatePortfolio = async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, data);
  return response.data;
};

// Update skills section
export const updateSkills = async (portfolioId: string, skills: Portfolio['skills']): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { skills });
  return response.data;
};

// Update work experience section
export const updateWorkExperience = async (
  portfolioId: string, 
  workExperience: Portfolio['work_experience']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { work_experience: workExperience });
  return response.data;
};

// Update education section
export const updateEducation = async (
  portfolioId: string, 
  education: Portfolio['education']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { education });
  return response.data;
};

// Update projects section
export const updateProjects = async (
  portfolioId: string, 
  projects: Portfolio['projects']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { projects });
  return response.data;
};

// Update certifications section
export const updateCertifications = async (
  portfolioId: string, 
  certifications: Portfolio['certifications']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { certifications });
  return response.data;
};

// Update awards section
export const updateAwards = async (
  portfolioId: string, 
  awards: Portfolio['awards']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { awards });
  return response.data;
};

// Update publications section
export const updatePublications = async (
  portfolioId: string, 
  publications: Portfolio['publications']
): Promise<Portfolio> => {
  const response = await api.put(`/portfolios/${portfolioId}`, { publications });
  return response.data;
}; 
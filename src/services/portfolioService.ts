import api from './api';
import { Portfolio } from '../types/models';
import { ParsedPortfolioData } from '../types/portfolio';

// Get user's portfolio
export const getUserPortfolio = async (): Promise<Portfolio> => {
  const response = await api.get('/portfolios/');
  console.log('Portfolio API response:', response.data);
  return response.data;
};

// Get portfolio by ID
export const getPortfolioById = async (portfolioId: string): Promise<Portfolio> => {
  const response = await api.get(`/portfolios/${portfolioId}`);
  console.log('Portfolio by ID API response:', response.data);
  return response.data;
};

// Get portfolio by profile ID
export const getPortfolioByProfileId = async (profileId: string): Promise<Portfolio> => {
  const response = await api.get(`/portfolios/by-profile/${profileId}`);
  console.log('Portfolio by profile ID API response:', response.data);
  return response.data;
};

// Create a new portfolio
export const createPortfolio = async (data: { profile_id?: string }): Promise<Portfolio> => {
  const response = await api.post('/portfolios/', data);
  return response.data;
};

// Update portfolio
export const updatePortfolio = async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
  console.log(`Updating portfolio ${portfolioId} with data:`, data);
  const response = await api.put(`/portfolios/${portfolioId}`, data);
  return response.data;
};

// Partial update portfolio
export const patchPortfolio = async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
  console.log(`Patching portfolio ${portfolioId} with data:`, data);
  const response = await api.patch(`/portfolios/${portfolioId}`, data);
  return response.data;
};

// Delete portfolio
export const deletePortfolio = async (portfolioId: string): Promise<void> => {
  await api.delete(`/portfolios/${portfolioId}`);
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
    link?: string;
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

// Delete portfolio item
export const deletePortfolioItem = async (
  portfolioId: string,
  itemType: string,
  itemIndex: number
): Promise<void> => {
  await api.delete(`/portfolios/${portfolioId}/items/${itemType}/${itemIndex}`);
};

// interface ParseDocumentError {
//   message: string;
//   details?: any; // Depending on how your API structures errors
// }

export const parsePortfolioDocument = async (file: File): Promise<ParsedPortfolioData> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Use the existing 'api' instance for consistency
    // The 'api' instance should handle base URL and potentially headers like Authorization
    const response = await api.post('/portfolios/parse-document', formData, {
      headers: {
        // The browser will set Content-Type to multipart/form-data automatically with FormData
        // but if your 'api' wrapper or Axios instance has defaults that override it,
        // you might need to explicitly set it or ensure the wrapper handles FormData correctly.
        // For a standard Axios instance, it usually handles FormData correctly without this.
        // 'Content-Type': 'multipart/form-data',
      },
    });

    // Assuming 'api' instance throws an error for non-ok responses (common with Axios)
    // and that response.data is the parsed JSON body
    return response.data;
  } catch (error: any) {
    console.error('Error in parsePortfolioDocument service:', error);
    // Enhance error reporting, you might want to check if error.response.data exists
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while parsing the document.');
  }
}; 
import api from './api';
import { PortfolioWebsiteConfig, PortfolioWebsiteResponse, SubdomainAvailabilityResponse, DeploymentStatus } from '../types/models'; // Assuming these types will be defined

const API_BASE_URL = '/portfolio-websites';

// Function to create a portfolio website
export const createPortfolioWebsite = async (
  config: PortfolioWebsiteConfig,
  customSubdomain?: string,
  forceRebuild: boolean = false
): Promise<PortfolioWebsiteResponse> => {
  const params = customSubdomain ? { custom_subdomain: customSubdomain } : {};
  const response = await api.post<PortfolioWebsiteResponse>(`${API_BASE_URL}/create`, { config, force_rebuild: forceRebuild }, { params });
  return response.data;
};

// Function to get the user's portfolio website
export const getPortfolioWebsite = async (): Promise<PortfolioWebsiteResponse | null> => {
  try {
    const response = await api.get<PortfolioWebsiteResponse>(`${API_BASE_URL}/`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // No website found for the user
    }
    throw error; // Re-throw other errors
  }
};

// Function to update website configuration
export const updateWebsiteConfig = async (
  config: Partial<PortfolioWebsiteConfig>,
  forceRebuild: boolean = false
): Promise<PortfolioWebsiteResponse> => {
  const response = await api.put<PortfolioWebsiteResponse>(`${API_BASE_URL}/config`, { config, force_rebuild: forceRebuild });
  return response.data;
};

// Function to deploy or redeploy the website
export const deployPortfolioWebsite = async (forceRebuild: boolean = false): Promise<PortfolioWebsiteResponse> => {
  const params = forceRebuild ? { force_rebuild: true } : {};
  const response = await api.post<PortfolioWebsiteResponse>(`${API_BASE_URL}/deploy`, null, { params });
  return response.data;
};

// Function to check subdomain availability
export const checkSubdomainAvailability = async (subdomain: string): Promise<SubdomainAvailabilityResponse> => {
  const response = await api.get<SubdomainAvailabilityResponse>(`${API_BASE_URL}/subdomain/check/${subdomain}`);
  return response.data;
};

// Function to delete the portfolio website
export const deletePortfolioWebsite = async (): Promise<void> => {
  await api.delete(`${API_BASE_URL}/`);
};

// Function to get deployment status
export const getDeploymentStatus = async (): Promise<DeploymentStatus> => {
  const response = await api.get<DeploymentStatus>(`${API_BASE_URL}/deployment-status`);
  return response.data;
};

// Placeholder for Get Website Analytics if needed in the future
// export const getWebsiteAnalytics = async (): Promise<WebsiteAnalytics> => {
//   const response = await api.get<WebsiteAnalytics>(`${API_BASE_URL}/analytics`);
//   return response.data;
// }; 
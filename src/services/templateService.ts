import api from './api';
import { Preamble, TexHeader } from '../types/models';

// Get all templates (preambles)
export const getPreambles = async (): Promise<Preamble[]> => {
  const response = await api.get('/templates/preambles');
  return response.data;
};

// Get all resume templates
export const getResumeTemplates = async (): Promise<TexHeader[]> => {
  const response = await api.get('/templates/resume');
  return response.data;
};

// Get all cover letter templates
export const getCoverLetterTemplates = async (): Promise<TexHeader[]> => {
  const response = await api.get('/templates/cover-letter');
  return response.data;
};

// Get template preview (assuming this endpoint exists)
export const getTemplatePreview = async (templateId: string): Promise<Blob> => {
  const response = await api.get(`/templates/${templateId}/preview`, {
    responseType: 'blob'
  });
  return response.data;
}; 
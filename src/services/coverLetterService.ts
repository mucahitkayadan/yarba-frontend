import api from './api';
import { CoverLetter, CoverLetterCreateRequest } from '../types/models';

// Get all cover letters with pagination
export const getCoverLetters = async (
  template_id?: string,
  resume_id?: string,
  skip: number = 0,
  limit: number = 10,
  sort_by: string = 'updated_desc'
): Promise<{ items: CoverLetter[], total: number }> => {
  const params = new URLSearchParams();
  
  if (template_id) params.append('template_id', template_id);
  if (resume_id) params.append('resume_id', resume_id);
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  params.append('sort_by', sort_by);
  
  const requestUrl = `/cover-letters${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await api.get(requestUrl);
  return response.data;
};

// Get a single cover letter by ID
export const getCoverLetterById = async (id: string): Promise<CoverLetter> => {
  const response = await api.get(`/cover-letters/${id}`);
  return response.data;
};

// Create a new cover letter
export const createCoverLetter = async (data: CoverLetterCreateRequest): Promise<CoverLetter> => {
  const response = await api.post('/cover-letters', data);
  return response.data;
};

// Update an existing cover letter
export const updateCoverLetter = async (
  id: string, 
  data: { template_id?: string, content?: any }
): Promise<CoverLetter> => {
  const response = await api.put(`/cover-letters/${id}`, data);
  return response.data;
};

// Delete a cover letter
export const deleteCoverLetter = async (id: string): Promise<void> => {
  await api.delete(`/cover-letters/${id}`);
};

// Generate content for a cover letter
export const generateCoverLetterContent = async (
  id: string,
  regenerate: boolean = false
): Promise<CoverLetter> => {
  const params = new URLSearchParams();
  if (regenerate) params.append('regenerate', 'true');
  
  const requestUrl = `/cover-letters/${id}/generate${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await api.post(requestUrl);
  return response.data;
};

// Get PDF URL for a cover letter
export const getCoverLetterPdf = async (
  id: string, 
  timeout: number = 30,
  regenerate: boolean = false
): Promise<{ pdf_url: string }> => {
  const params = new URLSearchParams();
  params.append('timeout', timeout.toString());
  if (regenerate) params.append('regenerate', 'true');
  
  const requestUrl = `/cover-letters/${id}/pdf?${params.toString()}`;
  const response = await api.get(requestUrl);
  return response.data;
};

// Upload PDF for a cover letter
export const uploadCoverLetterPdf = async (id: string, file: File): Promise<{ pdf_url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/cover-letters/${id}/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Delete PDF for a cover letter
export const deleteCoverLetterPdf = async (id: string): Promise<{ pdf_url: null }> => {
  const response = await api.delete(`/cover-letters/${id}/pdf`);
  return response.data;
}; 
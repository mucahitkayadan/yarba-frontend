import api from './api';
import { Resume, ResumeCreateRequest } from '../types/models';

// Get all resumes
export const getResumes = async (
  skip: number = 0, 
  limit: number = 10,
  title?: string,
  template_id?: string
): Promise<{ items: Resume[], total: number }> => {
  const params = new URLSearchParams();
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  if (title) params.append('title', title);
  if (template_id) params.append('template_id', template_id);
  
  const response = await api.get(`/resumes?${params.toString()}`);
  return response.data;
};

// Get a single resume by ID
export const getResumeById = async (id: string): Promise<Resume> => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

// Create a new resume
export const createResume = async (data: ResumeCreateRequest): Promise<Resume> => {
  const response = await api.post('/resumes', data);
  return response.data;
};

// Update an existing resume
export const updateResume = async (id: string, data: Partial<Resume>): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}`, data);
  return response.data;
};

// Delete a resume
export const deleteResume = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};

// Generate PDF for a resume
export const getResumePdf = async (id: string, timeout: number = 30): Promise<Blob> => {
  console.log(`Requesting PDF for resume ID: ${id} with timeout: ${timeout}`);
  try {
    const response = await api.get(`/resumes/${id}/pdf?timeout=${timeout}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    console.error('PDF generation error:', error);
    // If we get a response with error details
    if (error.response) {
      // Try to extract text error message if server returned blob
      if (error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          console.error('Server error message:', errorText);
          throw new Error(errorText);
        } catch (blobError) {
          // If we can't read the blob as text, rethrow original error
          throw error;
        }
      }
    }
    throw error;
  }
};

// Generate resume content based on job description
export const generateResumeContent = async (
  id: string, 
  jobDescription: string, 
  sections: string[]
): Promise<Resume> => {
  const response = await api.post(`/resumes/${id}/generate`, {
    job_description: jobDescription,
    selected_sections: sections
  });
  return response.data;
}; 
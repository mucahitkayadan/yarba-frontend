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
  
  console.log(`API Call: GET /resumes?${params.toString()}`);
  const response = await api.get(`/resumes?${params.toString()}`);
  
  // Backend now returns properly formatted paginated response
  if (response.data && response.data.items && typeof response.data.total === 'number') {
    console.log(`API returned ${response.data.items.length} items, total: ${response.data.total}`);
    return response.data;
  }
  
  // Fallback for backward compatibility or unexpected response format
  if (Array.isArray(response.data)) {
    console.warn('API returned array format instead of pagination object');
    return { 
      items: response.data, 
      total: response.data.length 
    };
  }
  
  // Fallback for other unexpected formats
  console.warn('Unexpected API response format:', response.data);
  return { 
    items: Array.isArray(response.data) ? response.data : [], 
    total: Array.isArray(response.data) ? response.data.length : 0 
  };
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
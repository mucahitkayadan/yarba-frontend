import api from './api';
import { CoverLetter, CoverLetterCreateRequest } from '../types/models';

// Get all cover letters
export const getCoverLetters = async (
  skip: number = 0, 
  limit: number = 10,
  title?: string,
  template_id?: string,
  sort_by: string = 'updated_desc'
): Promise<{ items: CoverLetter[], total: number }> => {
  const params = new URLSearchParams();
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  if (title) params.append('title', title);
  if (template_id) params.append('template_id', template_id);
  
  // Add sorting parameter
  params.append('sort_by', sort_by);
  
  const requestUrl = `/cover-letters?${params.toString()}`;
  const response = await api.get(requestUrl);
  
  // Backend returns properly formatted paginated response
  if (response.data && response.data.items && typeof response.data.total === 'number') {
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

// Get a single cover letter by ID
export const getCoverLetterById = async (id: string): Promise<CoverLetter> => {
  const response = await api.get(`/cover-letters/${id}`);
  return response.data;
};

// Create a new cover letter
export const createCoverLetter = async (data: CoverLetterCreateRequest): Promise<CoverLetter> => {
  // The API requires resume_id and accepts generate_pdf (default: False)
  // We're setting generate_pdf to true so PDF is generated automatically
  const requestData = { ...data, generate_pdf: true };
  const response = await api.post('/cover-letters', requestData);
  return response.data;
};

// Update an existing cover letter
export const updateCoverLetter = async (id: string, data: Partial<CoverLetter>): Promise<CoverLetter> => {
  const response = await api.put(`/cover-letters/${id}`, data);
  return response.data;
};

// Delete a cover letter
export const deleteCoverLetter = async (id: string): Promise<void> => {
  await api.delete(`/cover-letters/${id}`);
};

// Generate PDF for a cover letter
export const getCoverLetterPdf = async (id: string, timeout: number = 30): Promise<Blob> => {
  try {
    const response = await api.get(`/cover-letters/${id}/pdf?timeout=${timeout}`, {
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

// Generate cover letter content based on job description
export const generateCoverLetterContent = async (
  id: string, 
  jobDescription: string
): Promise<CoverLetter> => {
  const response = await api.post(`/cover-letters/${id}/generate`, {
    job_description: jobDescription
  });
  return response.data;
}; 
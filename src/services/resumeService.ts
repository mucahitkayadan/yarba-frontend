import api from './api';
import { Resume, ResumeCreateRequest } from '../types/models';
import { ResumesForSelectionResponse } from '../types/models';

// Define the type for the job extraction response
export interface JobExtractionDetails {
  title?: string;
  description?: string;
  extraction_time?: string;
  extraction_metadata?: {
    source_type?: string;
    [key: string]: any; // For other metadata
  };
}

// Get all resumes
export const getResumes = async (
  skip: number = 0, 
  limit: number = 10,
  search_term?: string,
  template_id?: string,
  sort_by: string = 'updated_desc'
): Promise<{ items: Resume[], total: number }> => {
  const params = new URLSearchParams();
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  if (search_term) params.append('search_term', search_term);
  if (template_id) params.append('template_id', template_id);
  
  // Add sorting parameter
  params.append('sort_by', sort_by);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Adding sort_by=${sort_by}`);
  }
  
  const requestUrl = `/resumes?${params.toString()}`;
  if (process.env.NODE_ENV !== 'production') {
    console.log(`API Call: GET ${requestUrl}`);
    console.log(`Full URL would be: ${process.env.REACT_APP_API_URL}${requestUrl}`);
  }
  const response = await api.get(requestUrl);
  
  // Backend now returns properly formatted paginated response
  if (response.data && response.data.items && typeof response.data.total === 'number') {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API returned ${response.data.items.length} items, total: ${response.data.total}`);
    }
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
  // The API requires job_description and accepts generate_pdf (default: false)
  // We're setting generate_pdf to true so PDF is generated automatically
  const requestData: any = { job_description: data.job_description, generate_pdf: true };
  if (data.job_description_url) {
    requestData.job_description_url = data.job_description_url;
  }
  const response = await api.post('/resumes', requestData);
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
export const getResumePdf = async (id: string, timeout: number = 30): Promise<Blob | { pdf_url: string }> => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Requesting PDF for resume ID: ${id} with timeout: ${timeout}`);
  }
  try {
    // First try without responseType: 'blob' to check if we get the new JSON response
    const response = await api.get(`/resumes/${id}/pdf?timeout=${timeout}`);
    
    // If we got JSON with pdf_url, return it
    if (response.data && response.data.pdf_url) {
      return response.data;
    }
    
    // If we didn't get a pdf_url, try the old approach with blob response type
    const blobResponse = await api.get(`/resumes/${id}/pdf?timeout=${timeout}`, {
      responseType: 'blob'
    });
    return blobResponse.data;
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('PDF generation error:', error);
    }
    // If we get a response with error details
    if (error.response) {
      // Try to extract text error message if server returned blob
      if (error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          if (process.env.NODE_ENV !== 'production') {
            console.error('Server error message:', errorText);
          }
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

// Delete Resume PDF
export const deleteResumePdf = async (resumeId: string): Promise<{ pdf_url: null }> => {
  const response = await api.delete(`/resumes/${resumeId}/pdf`);
  return response.data;
};

// Regenerate Resume Content (and optionally PDF)
export const regenerateResumeContent = async (
  resumeId: string, 
  generatePdf: boolean = false
): Promise<Resume> => {
  const response = await api.post(`/resumes/${resumeId}/regenerate`, null, {
    params: { generate_pdf: generatePdf }
  });
  return response.data;
};

// Get Cover Letters For Resume
// ... existing code ... 

// Get lightweight list of resumes for selection dropdowns
export const getResumesForSelection = async (sortBy?: string): Promise<ResumesForSelectionResponse> => {
  let requestUrl = '/resumes/list-for-selection';
  if (sortBy) {
    requestUrl += `?sort_by=${encodeURIComponent(sortBy)}`;
  }
  const response = await api.get(requestUrl);
  return response.data;
};

// Get resume by ID
// ... existing code ... 

// Extract job details from URL
export const extractJobDetails = async (url: string): Promise<JobExtractionDetails> => {
  const response = await api.post(`/jobs/extract/?url=${encodeURIComponent(url)}`);
  return response.data;
};
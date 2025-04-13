// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  last_login: string;
  last_active: string;
  // Extended profile fields
  full_name?: string;
  bio?: string;
  job_title?: string;
  company?: string;
  location?: string;
  phone?: string;
  website?: string;
  avatar_url?: string;
}

// Profile Interface
export interface Profile {
  id: string;
  user_id: string;
  personal_information: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  profile_picture_key?: string;
  signature_key?: string;
  profile_picture_url?: string;
  signature_url?: string;
  life_story?: string;
  preferences?: {
    // Nested preference objects
    project_details?: {
      max_projects: number;
      bullet_points_per_project: number;
    };
    work_experience_details?: {
      max_jobs: number;
      bullet_points_per_job: number;
    };
    skills_details?: {
      max_categories: number;
      min_skills_per_category: number;
      max_skills_per_category: number;
    };
    career_summary_details?: {
      min_words: number;
      max_words: number;
    };
    education_details?: {
      max_entries: number;
      max_courses: number;
    };
    cover_letter_details?: {
      paragraphs: number;
      target_grade_level: number;
    };
    awards_details?: {
      max_awards: number;
    };
    publications_details?: {
      max_publications: number;
    };
    feature_preferences?: {
      check_clearance: boolean;
      auto_save: boolean;
      dark_mode: boolean;
    };
    notifications?: Record<string, any>;
    privacy?: Record<string, any>;
    llm_preferences?: {
      model_type: string;
      model_name: string;
      temperature: number;
    };
    section_preferences?: Record<string, string>; // Maps section names to processing methods
    latex_template_preferences?: {
      resume_template: string;
      cover_letter_template: string;
    };
    default_latex_templates?: {
      default_resume_template_id: string;
      default_cover_letter_template_id: string;
    };
    // Legacy flat preferences for backward compatibility
    career_summary_min_words?: number;
    career_summary_max_words?: number;
    work_experience_max_jobs?: number;
    work_experience_bullet_points_per_job?: number;
    project_max_projects?: number;
    project_bullet_points_per_project?: number;
    cover_letter_paragraphs?: number;
    cover_letter_target_grade_level?: number;
    skills_max_categories?: number;
    skills_min_per_category?: number;
    skills_max_per_category?: number;
    education_max_entries?: number;
    education_max_courses?: number;
    awards_max_awards?: number;
    publications_max_publications?: number;
    certifications_max_certifications?: number;
  };
  created_at: string;
  updated_at: string;
}

// Portfolio Interface
export interface Portfolio {
  _id: string;
  user_id: string;
  profile_id: string;
  career_summary?: {
    job_titles: string[];
    years_of_experience: string;
    default_summary: string;
  };
  skills: {
    category: string;
    skills: string[];
  }[];
  work_experience: {
    company: string;
    position: string;
    location?: string;
    start_date: string; // Format: "YYYY-MM"
    end_date?: string; // Format: "YYYY-MM"
    current: boolean;
    description?: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field_of_study: string;
    location?: string;
    start_date: string; // Format: "YYYY-MM"
    end_date?: string; // Format: "YYYY-MM"
    current: boolean;
    description?: string;
    courses?: string[];
  }[];
  projects: {
    name: string;
    description: string;
    url?: string;
    start_date?: string; // Format: "YYYY-MM"
    end_date?: string; // Format: "YYYY-MM"
    current: boolean;
    technologies: string[];
    achievements: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string; // Format: "YYYY-MM"
    url?: string;
    description?: string;
  }[];
  awards: {
    title: string;
    issuer: string;
    date: string; // Format: "YYYY-MM"
    description?: string;
  }[];
  publications: {
    title: string;
    publisher: string;
    date: string; // Format: "YYYY-MM"
    url?: string;
    description?: string;
    authors?: string[];
  }[];
  created_at: string;
  updated_at: string;
}

// Resume Interface
export interface Resume {
  id: string;
  user_id: string;
  profile_id: string;
  portfolio_id: string;
  title: string;
  template_id: string;
  job_title?: string;
  company_name?: string;
  job_description?: string;
  content?: {
    personal_information?: any;
    career_summary?: any;
    skills?: any;
    work_experience?: any;
    education?: any;
    projects?: any;
    awards?: any;
    publications?: any;
    certifications?: any;
  };
  latex_content?: string; // The generated LaTeX source code
  pdf_path?: string; // Path to the generated PDF file
  version: number; // Version number for tracking revisions
  is_cover_letter: boolean; // Should be false for Resume objects
  created_at: string;
  updated_at: string;
}

// Cover Letter Interface
export interface CoverLetter {
  id: string;
  user_id: string;
  profile_id: string;
  portfolio_id: string;
  resume_id?: string; // Optional reference to a related resume
  title: string;
  template_id: string;
  job_title?: string;
  company_name?: string;
  job_description?: string;
  recipient_name?: string;
  recipient_title?: string;
  company_address?: string;
  content?: {
    salutation?: string;
    introduction?: string;
    body?: string[];
    conclusion?: string;
    signature?: string;
  };
  latex_content?: string; // The generated LaTeX source code
  pdf_path?: string; // Path to the generated PDF file
  version: number; // Version number for tracking revisions
  is_cover_letter: boolean; // Should be true for CoverLetter objects
  created_at: string;
  updated_at: string;
}

// LaTeX Template Interfaces
export interface Preamble {
  id: string;
  name: string;
  description?: string;
  content: string; // LaTeX preamble content
  created_at: string;
  updated_at: string;
}

export interface TexHeader {
  id: string;
  name: string;
  description?: string;
  template_type: "resume" | "cover_letter";
  template_id: string;
  content: string; // LaTeX header content
  created_at: string;
  updated_at: string;
}

// API Request/Response Interfaces
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ResumeCreateRequest {
  job_description: string;
}

export interface CoverLetterCreateRequest {
  resume_id: string;
} 
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
  current_setup_step?: number;
}

// Profile Interface
export interface Profile {
  _id: string;
  user_id: string;
  user: User | null;
  personal_information: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  profile_picture_key?: string;
  signature_key?: string;
  life_story?: string;
  api_keys?: Record<string, any>;
  prompt_preferences?: {
    project?: {
      max_projects: number;
      bullet_points_per_project: number;
    };
    work_experience?: {
      max_jobs: number;
      bullet_points_per_job: number;
    };
    skills?: {
      max_categories: number;
      min_per_category: number;
      max_per_category: number;
    };
    career_summary?: {
      min_words: number;
      max_words: number;
    };
    education?: {
      max_entries: number;
      max_courses: number;
    };
    cover_letter?: {
      paragraphs: number;
      target_age: number;
    };
    awards?: {
      max_awards: number;
    };
    publications?: {
      max_publications: number;
    };
  };
  system_preferences?: {
    features?: {
      check_clearance: boolean;
      auto_save: boolean;
      dark_mode: boolean;
    };
    notifications?: Record<string, any>;
    privacy?: Record<string, any>;
    llm?: {
      model_name: string;
      temperature: number;
    };
    templates?: {
      default_cover_letter_template_id: string;
      default_resume_template_id: string;
    };
  };
  llm_usage?: {
    total_tokens: number;
    total_input_tokens: number;
    total_output_tokens: number;
    total_cost: number;
    usage_by_model?: Record<string, { tokens: number; cost: number }>;
    usage_by_operation?: Record<string, { tokens: number; cost: number }>;
    monthly_quota?: number | null;
    monthly_cost_limit?: number | null;
    last_used: string;
    current_month_tokens: number;
    current_month_cost: number;
    monthly_history?: Record<string, { tokens: number; cost: number }>;
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
    default_job_title?: string;
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
    link?: string;
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
  job_description_url?: string; // Optional URL for the job description
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
  resume_id: string;
  template_id: string;
  content: string;
  has_pdf: boolean;
  llm_usage?: any;
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
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: User;
  isNewUser?: boolean;
  is_new_user?: boolean;
  current_setup_step?: number;
}

export interface ResumeCreateRequest {
  job_description: string;
  job_description_url?: string; // Optional URL for the job description
}

export interface CoverLetterCreateRequest {
  resume_id: string;
  template_id?: string;
  generate_pdf?: boolean;
}

// For the /resumes/list-for-selection endpoint
export interface ResumeForSelection {
  id: string;
  resume_name: string;
}

export interface ResumesForSelectionResponse {
  resumes: ResumeForSelection[];
}

export interface UpdateSetupProgressRequest {
  current_setup_step?: number;
  setup_completed?: boolean;
}

export interface UserSetupProgressResponse {
  id: string;
  email: string;
  is_new_user: boolean;
  current_setup_step: number;
  message: string;
}

// Add new interfaces for Portfolio Website Management

export interface DeploymentStatus {
  status: string; // e.g., pending, building, success, failed
  deployment_url?: string; // HttpUrl
  s3_bucket_name?: string;
  cloudfront_distribution_id?: string;
  cloudfront_domain?: string;
  build_id?: string;
  build_logs?: string;
  build_duration?: number; // seconds
  created_at: string; // datetime
  started_at?: string; // datetime
  completed_at?: string; // datetime
  error_message?: string;
  error_code?: string;
}

export interface PortfolioWebsiteConfig {
  theme: string; // default: modern
  primary_color: string; // hex color, default: #3B82F6
  secondary_color: string; // hex color, default: #1F2937
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  social_media_enabled: boolean; // default: true
  enabled_sections: string[]; // e.g., about, experience, education, skills, projects, contact
  section_order: string[]; // same as enabled_sections, defining display order
  contact_form_enabled: boolean; // default: true
}

export interface PortfolioWebsiteResponse {
  website_url: string; // HttpUrl
  subdomain: string;
  deployment_status: DeploymentStatus;
  config: PortfolioWebsiteConfig;
  last_updated: string; // datetime
}

export interface SubdomainAvailabilityResponse {
  subdomain: string;
  available: boolean;
  suggested_alternatives?: string[];
}

export interface WebsiteAnalytics { // Illustrative structure based on documentation
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{ [key: string]: number }>; // Example: [{ "path_example": 100 }]
  traffic_sources: { [key: string]: number }; // Example: { "source_example": 50 }
  period_start: string; // datetime
  period_end: string; // datetime
} 
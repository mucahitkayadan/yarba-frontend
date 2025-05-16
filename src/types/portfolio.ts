export interface CareerSummary {
  job_titles: string[];
  default_job_title: string;
  years_of_experience: string;
  default_summary: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface WorkExperience {
  job_title: string;
  company: string;
  location?: string;
  time?: string;
  responsibilities: string[];
}

export interface Education {
  degree_type?: string;
  degree: string;
  university_name: string;
  time?: string;
  location?: string;
  GPA?: string;
  transcript?: string[];
}

export interface Project {
  name: string;
  bullet_points: string[];
  date?: string;
  link?: string;
}

export interface Award {
  name: string;
  explanation?: string;
}

export interface Publication {
  name: string;
  publisher?: string;
  link?: string;
  time?: string;
}

export interface CustomSection {
  title: string;
  content: string | string[] | object; // JSON string for complex objects needs to be parsed
}

export interface PortfolioLLMSchema {
  career_summary: CareerSummary;
  skills: Skill[];
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  awards: Award[];
  publications: Publication[];
  certifications: string[];
  custom_sections?: { // Making custom_sections optional as per general practice
    sections: CustomSection[];
  };
  professional_title?: string; // Added based on the note in the API doc
}

// This type represents the data returned by the /api/v1/portfolios/parse-document endpoint
// It's essentially PortfolioLLMSchema without database-generated fields.
export type ParsedPortfolioData = PortfolioLLMSchema; 
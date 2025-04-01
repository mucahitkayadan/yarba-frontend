# ResumeBuilderTeX Data Models

This document outlines the core data models used in the ResumeBuilderTeX application. Understanding these models is important for developing both frontend and backend components.

## User

The User model represents a registered user of the application.

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  hashed_password: string; // Password is never exposed in API responses
  is_active: boolean;
  is_superuser: boolean;
  last_login: Date;
  account_locked_until: Date;
  reset_password_token: string;
  reset_password_expires: Date;
  verification_token: string;
  subscription_expires: Date;
  last_active: Date;
  created_at: Date;
  updated_at: Date;
}
```

## Profile

The Profile model contains the user's personal information.

```typescript
interface Profile {
  id: string;
  user_id: string;
  personal_information: {
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  preferences?: {
    section_preferences?: Record<string, string>; // Maps section names to processing methods
    default_latex_templates?: {
      default_resume_template_id: string;
      default_cover_letter_template_id: string;
    };
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
  created_at: Date;
  updated_at: Date;
}
```

## Portfolio

The Portfolio model contains the user's professional information that will be used to generate resumes and cover letters.

```typescript
interface Portfolio {
  id: string;
  user_id: string;
  profile_id: string;
  skills: {
    category: string;
    items: string[];
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
  created_at: Date;
  updated_at: Date;
}
```

## Resume

The Resume model represents a resume document.

```typescript
interface Resume {
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
  created_at: Date;
  updated_at: Date;
}
```

## Cover Letter

The Cover Letter model represents a cover letter document.

```typescript
interface CoverLetter {
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
  created_at: Date;
  updated_at: Date;
}
```

## LaTeX Templates

### Preamble

The Preamble model contains LaTeX document preamble code.

```typescript
interface Preamble {
  id: string;
  name: string;
  description?: string;
  content: string; // LaTeX preamble content
  created_at: Date;
  updated_at: Date;
}
```

### TexHeader

The TexHeader model contains LaTeX document header code.

```typescript
interface TexHeader {
  id: string;
  name: string;
  description?: string;
  template_type: "resume" | "cover_letter";
  template_id: string;
  content: string; // LaTeX header content
  created_at: Date;
  updated_at: Date;
}
```

## Relationship Between Models

- Each **User** has one **Profile**
- Each **User** has one **Portfolio**
- Each **User** can have multiple **Resumes**
- Each **User** can have multiple **Cover Letters**
- A **Resume** is associated with a **User**, a **Profile**, and a **Portfolio**
- A **Cover Letter** is associated with a **User**, a **Profile**, a **Portfolio**, and optionally a **Resume**
- **Preamble** and **TexHeader** models define LaTeX templates used for document generation

## MongoDB Collections

The application uses MongoDB as its primary database. The following collections are used:

- `users`: Stores User documents
- `profiles`: Stores Profile documents
- `portfolios`: Stores Portfolio documents
- `resumes`: Stores Resume documents
- `cover_letters`: Stores CoverLetter documents
- `preambles`: Stores Preamble documents
- `tex_headers`: Stores TexHeader documents

## Required Frontend Models

Frontend development should include TypeScript interfaces that match these models for type safety and consistency. Additional frontend-specific models may be needed for form state management, UI components, and API request/response handling. 
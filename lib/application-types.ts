export type ResumeSectionJson = {
  items: string[];
  summary?: string | null;
};

export type MasterResume = {
  id: string;
  user_id: string;
  resume_url: string;
  resume_text: string;
  skills_json: ResumeSectionJson;
  education_json: ResumeSectionJson;
  experience_json: ResumeSectionJson;
  projects_json: ResumeSectionJson;
  updated_at: string;
};

export type Priority = "High" | "Medium" | "Low";

export type ApplicationStatus =
  | "Draft"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Archived";

export type JobApplicationAnalysis = {
  atsScore: number;
  keywordMatch: number;
  experienceMatch: number;
  educationMatch: number;
  projectsMatch: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  summary: string | null;
  resumeWeaknesses: string[];
  resumeStrengths: string[];
  importantKeywords: string[];
  emailSubject: string;
  professionalEmail: string;
  coverLetter: string;
  suggestedInterviewQuestions: string[];
  improvementSuggestions: Array<{
    text: string;
    priority: Priority;
  }>;
  company: string | null;
  role: string | null;
  confidence: number;
};

export type ApplicationRecord = {
  id: string;
  user_id: string;
  company: string | null;
  role: string | null;
  job_description: string;
  ats_score: number | null;
  missing_skills: string[];
  matching_skills: string[];
  keywords: string[];
  email_subject: string | null;
  email_body: string | null;
  hr_email: string | null;
  resume_url: string | null;
  status: ApplicationStatus;
  analysis_json?: JobApplicationAnalysis | null;
  created_at: string;
  updated_at: string;
};

export type AnalyticsSummary = {
  applicationsToday: number;
  applicationsThisMonth: number;
  averageAts: number;
  resumeCompletion: number;
  applicationsPerMonth: Array<{ label: string; count: number }>;
  mostAppliedSkills: Array<{ label: string; count: number }>;
  mostCommonMissingSkills: Array<{ label: string; count: number }>;
  statusBreakdown: Array<{ label: string; count: number }>;
};

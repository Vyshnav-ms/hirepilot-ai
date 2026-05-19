export type Difficulty = "Easy" | "Medium" | "Hard" | string;

export type QuestionCategory =
  | "technical"
  | "hr"
  | "project"
  | "scenario"
  | "behavioral";

export type InterviewQuestion = {
  question: string;
  answer: string;
  difficulty: Difficulty;
  category?: QuestionCategory;
};

export type AtsBreakdown = {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  formattingScore: number;
};

export type KeywordInsight = {
  keyword: string;
  found: boolean;
  density?: number;
};

export type AtsAnalysis = {
  score: number;
  breakdown: AtsBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  sectionCompleteness: { section: string; status: "Strong" | "Partial" | "Missing" }[];
  keywordInsights: KeywordInsight[];
};

export type RecommendedJob = {
  id: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  source: string;
  matchPercentage: number;
  workMode: "Remote" | "Hybrid" | "On-site";
  level: "Internship" | "Entry" | "Mid" | "Senior";
  skills: string[];
  applyUrl: string;
  saved?: boolean;
};

export type CareerAnalysisResult = {
  technicalQuestions: InterviewQuestion[];
  hrQuestions: InterviewQuestion[];
  projectQuestions: InterviewQuestion[];
  behavioralQuestions: InterviewQuestion[];
  scenarioQuestions: InterviewQuestion[];
  atsAnalysis: AtsAnalysis;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  candidateStrengths: string[];
  resumeSuggestions: string[];
  recommendedJobs: RecommendedJob[];
};


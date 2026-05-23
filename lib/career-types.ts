export type Difficulty = "Easy" | "Medium" | "Hard";

export type QuestionCategory =
  | "technical"
  | "hr"
  | "project"
  | "behavioral"
  | "scenario";

export type TechnicalQuestion = {
  question: string;
  answer: string;
  difficulty: Difficulty;
  skill: string;
  topic: string;
};

export type HrQuestion = {
  question: string;
  answer: string;
  purpose: string;
};

export type ProjectQuestion = {
  question: string;
  answer: string;
  difficulty: Difficulty;
};

export type BehavioralQuestion = {
  question: string;
  suggestedAnswer: string;
};

export type ScenarioQuestion = {
  question: string;
  suggestedSolution: string;
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

export type InterviewResult = {
  technicalQuestions: TechnicalQuestion[];
  hrQuestions: HrQuestion[];
  projectQuestions: ProjectQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  scenarioQuestions: ScenarioQuestion[];
};

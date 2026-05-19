import {
  AtsAnalysis,
  CareerAnalysisResult,
  InterviewQuestion,
  RecommendedJob,
} from "@/lib/career-types";

const difficulty = ["Easy", "Medium", "Hard"] as const;

export function makeQuestions(prefix: string, count: number, category: InterviewQuestion["category"]) {
  return Array.from({ length: count }, (_, index) => ({
    question: `${prefix} question ${index + 1}: How would you demonstrate this capability for the target role?`,
    answer:
      "Use a concise STAR-style answer, connect the example to measurable impact, and name the tools, tradeoffs, and outcome clearly.",
    difficulty: difficulty[index % difficulty.length],
    category,
  }));
}

export const sampleAtsAnalysis: AtsAnalysis = {
  score: 82,
  breakdown: {
    skillsMatch: 86,
    experienceMatch: 78,
    educationMatch: 88,
    keywordMatch: 80,
    formattingScore: 76,
  },
  matchedKeywords: ["React", "TypeScript", "Supabase", "AI", "API integration"],
  missingKeywords: ["Testing", "CI/CD", "Observability", "System design"],
  missingSkills: ["Automated testing", "Deployment pipelines", "Metrics instrumentation"],
  strengths: ["Clear project ownership", "Modern full stack exposure", "Strong AI product positioning"],
  weaknesses: ["Impact metrics can be stronger", "Some role keywords are underrepresented"],
  improvements: [
    "Add quantified outcomes to each major project.",
    "Mirror important job description keywords naturally in the summary and skills sections.",
    "Add deployment, testing, and collaboration details for production readiness.",
  ],
  sectionCompleteness: [
    { section: "Summary", status: "Strong" },
    { section: "Skills", status: "Strong" },
    { section: "Experience", status: "Partial" },
    { section: "Projects", status: "Strong" },
    { section: "Education", status: "Strong" },
  ],
  keywordInsights: [
    { keyword: "React", found: true, density: 4.2 },
    { keyword: "TypeScript", found: true, density: 3.6 },
    { keyword: "Testing", found: false, density: 0 },
    { keyword: "CI/CD", found: false, density: 0 },
  ],
};

export const sampleJobs: RecommendedJob[] = [
  {
    id: "remoteok-ai-frontend",
    company: "RemoteOK AI Studio",
    role: "AI Frontend Engineer",
    salary: "$70k - $110k",
    location: "Remote",
    source: "RemoteOK",
    matchPercentage: 91,
    workMode: "Remote",
    level: "Mid",
    skills: ["React", "TypeScript", "AI UX", "APIs"],
    applyUrl: "https://remoteok.com",
  },
  {
    id: "wellfound-fullstack",
    company: "Wellfound Startup",
    role: "Full Stack Developer",
    salary: "$45k - $80k",
    location: "Bengaluru / Hybrid",
    source: "Wellfound",
    matchPercentage: 87,
    workMode: "Hybrid",
    level: "Entry",
    skills: ["Next.js", "Supabase", "Tailwind", "Postgres"],
    applyUrl: "https://wellfound.com",
  },
  {
    id: "naukri-react",
    company: "Naukri Partner",
    role: "React Developer",
    salary: "₹6L - ₹12L",
    location: "India",
    source: "Naukri",
    matchPercentage: 84,
    workMode: "On-site",
    level: "Entry",
    skills: ["React", "JavaScript", "REST", "Git"],
    applyUrl: "https://www.naukri.com",
  },
];

export const emptyCareerResult: CareerAnalysisResult = {
  technicalQuestions: [],
  hrQuestions: [],
  projectQuestions: [],
  behavioralQuestions: [],
  scenarioQuestions: [],
  atsAnalysis: sampleAtsAnalysis,
  skills: [],
  strengths: [],
  weaknesses: [],
  missingSkills: [],
  candidateStrengths: [],
  resumeSuggestions: [],
  recommendedJobs: sampleJobs,
};

export const sampleCareerResult: CareerAnalysisResult = {
  technicalQuestions: makeQuestions("Technical", 50, "technical"),
  hrQuestions: makeQuestions("HR", 50, "hr"),
  projectQuestions: makeQuestions("Project", 50, "project"),
  scenarioQuestions: makeQuestions("Scenario", 25, "scenario"),
  behavioralQuestions: makeQuestions("Behavioral", 25, "behavioral"),
  atsAnalysis: sampleAtsAnalysis,
  skills: ["React", "Next.js", "TypeScript", "Supabase", "Groq AI"],
  strengths: sampleAtsAnalysis.strengths,
  weaknesses: sampleAtsAnalysis.weaknesses,
  missingSkills: sampleAtsAnalysis.missingSkills,
  candidateStrengths: sampleAtsAnalysis.strengths,
  resumeSuggestions: sampleAtsAnalysis.improvements,
  recommendedJobs: sampleJobs,
};


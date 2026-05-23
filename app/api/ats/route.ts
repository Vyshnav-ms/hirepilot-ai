import { NextRequest, NextResponse } from "next/server";
import { AtsAnalysis } from "@/lib/career-types";
import { generateJson } from "@/lib/ai-json";

const EMPTY_ATS: AtsAnalysis = {
  score: 0,
  breakdown: {
    skillsMatch: 0,
    experienceMatch: 0,
    educationMatch: 0,
    keywordMatch: 0,
    formattingScore: 0,
  },
  matchedKeywords: [],
  missingKeywords: [],
  missingSkills: [],
  strengths: [],
  weaknesses: [],
  improvements: [],
  sectionCompleteness: [],
  keywordInsights: [],
};

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json({ error: "Resume text is required." }, { status: 400 });
    }
    if (!jdText || typeof jdText !== "string" || !jdText.trim()) {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    const prompt = `
You are HirePilot AI, an expert ATS (Applicant Tracking System) analyzer.

Analyze the candidate's RESUME against the JOB DESCRIPTION to produce a detailed ATS compatibility report.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Analyze both documents and:
1. Identify required skills/keywords from the JD
2. Identify what the candidate has in their resume
3. Calculate match scores for each dimension
4. List matched and missing keywords/skills
5. Provide actionable improvement suggestions

Return ONLY strict JSON matching this exact structure. No markdown, no extra text:

{
  "score": 0,
  "breakdown": {
    "skillsMatch": 0,
    "experienceMatch": 0,
    "educationMatch": 0,
    "keywordMatch": 0,
    "formattingScore": 0
  },
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvements": ["string"],
  "sectionCompleteness": [{ "section": "string", "status": "Strong | Partial | Missing" }],
  "keywordInsights": [{ "keyword": "string", "found": true, "density": 0.0 }]
}

Rules:
- score: 0-100, represents overall ATS compatibility based on all dimensions
- All breakdown values are percentages (0-100)
- matchedKeywords: keywords/technologies found in BOTH resume and JD
- missingKeywords: important JD keywords NOT found in resume
- missingSkills: skills required by JD that are absent from resume
- strengths: 3-5 specific reasons the resume performs well against this JD
- improvements: 5-8 specific, actionable suggestions to improve ATS score
- sectionCompleteness: check Summary, Skills, Experience, Projects, Education sections
- keywordInsights: top 10-15 important JD keywords with found status and density
- Return raw JSON only.
`;

    const data = await generateJson<AtsAnalysis>({ prompt, fallback: EMPTY_ATS });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ATS analysis failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

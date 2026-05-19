import { NextRequest, NextResponse } from "next/server";
import { sampleCareerResult } from "@/lib/career-data";
import { CareerAnalysisResult } from "@/lib/career-types";
import { generateJson } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { resumeText, jdText } = body;

    if (!resumeText || !jdText) {
      return NextResponse.json(
        {
          error: "Resume and Job Description are required",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert technical interviewer and career coach for an AI SaaS interview preparation product.

Analyze the following resume and job description.

Resume:
${resumeText}

Job Description:
${jdText}

Generate deeply personalized interview preparation content.

Return ONLY valid JSON with this exact shape:
{
  "technicalQuestions": [
    { "question": "string", "answer": "string", "difficulty": "Easy | Medium | Hard" }
  ],
  "hrQuestions": [
    { "question": "string", "answer": "string", "difficulty": "Easy | Medium | Hard" }
  ],
  "projectQuestions": [
    { "question": "string", "answer": "string", "difficulty": "Easy | Medium | Hard" }
  ],
  "scenarioQuestions": [
    { "question": "string", "answer": "string", "difficulty": "Easy | Medium | Hard" }
  ],
  "behavioralQuestions": [
    { "question": "string", "answer": "string", "difficulty": "Easy | Medium | Hard" }
  ],
  "atsAnalysis": {
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
    "keywordInsights": [{ "keyword": "string", "found": true, "density": 0 }]
  },
  "skills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingSkills": ["string"],
  "candidateStrengths": ["string"],
  "resumeSuggestions": ["string"],
  "recommendedJobs": [
    {
      "id": "string",
      "company": "string",
      "role": "string",
      "salary": "string",
      "location": "string",
      "source": "LinkedIn | Indeed | Wellfound | Naukri | Internshala | RemoteOK | AngelList | Foundit",
      "matchPercentage": 0,
      "workMode": "Remote | Hybrid | On-site",
      "level": "Internship | Entry | Mid | Senior",
      "skills": ["string"],
      "applyUrl": "string"
    }
  ]
}

Rules:
- Include exactly 50 technicalQuestions.
- Include exactly 50 hrQuestions.
- Include exactly 50 projectQuestions.
- Include exactly 25 scenarioQuestions.
- Include exactly 25 behavioralQuestions.
- Include at least 8 resumeSuggestions.
- Include at least 8 recommendedJobs.
- Answers must be concise, practical, and tailored to the resume and job description.
- Questions must be role-specific, categorized, and difficulty-tagged.
- Do not wrap JSON in markdown.
`;

    const parsedResponse = await generateJson<CareerAnalysisResult>({
      prompt,
      fallback: sampleCareerResult,
    });

    return NextResponse.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error: unknown) {
    console.error("GROQ ERROR:", error);
    const message = error instanceof Error ? error.message : "Resume analysis failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

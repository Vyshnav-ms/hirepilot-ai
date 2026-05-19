import { NextRequest, NextResponse } from "next/server";
import { sampleAtsAnalysis } from "@/lib/career-data";
import { AtsAnalysis } from "@/lib/career-types";
import { generateJson } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json();

    if (!resumeText || !jdText) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 });
    }

    const prompt = `
Analyze this resume against the job description for ATS compatibility.

Resume:
${resumeText}

Job Description:
${jdText}

Return strict JSON matching:
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
  "keywordInsights": [{ "keyword": "string", "found": true, "density": 0 }]
}
`;

    const data = await generateJson<AtsAnalysis>({ prompt, fallback: sampleAtsAnalysis });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ATS analysis failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { sampleJobs } from "@/lib/career-data";
import { RecommendedJob } from "@/lib/career-types";
import { generateJson } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, skills, experience } = await req.json();

    if (!resumeText && !skills) {
      return NextResponse.json({ error: "Resume text or skills are required" }, { status: 400 });
    }

    const prompt = `
Recommend jobs for this candidate.

Resume:
${resumeText || ""}

Skills:
${skills || ""}

Experience:
${experience || ""}

Use the following source labels only: LinkedIn, Indeed, Wellfound, Naukri, Internshala, RemoteOK, AngelList, Foundit.
Return strict JSON:
{
  "jobs": [
    {
      "id": "string",
      "company": "string",
      "role": "string",
      "salary": "string",
      "location": "string",
      "source": "string",
      "matchPercentage": 0,
      "workMode": "Remote | Hybrid | On-site",
      "level": "Internship | Entry | Mid | Senior",
      "skills": ["string"],
      "applyUrl": "string"
    }
  ]
}
`;

    const data = await generateJson<{ jobs: RecommendedJob[] }>({
      prompt,
      fallback: { jobs: sampleJobs },
    });

    return NextResponse.json({ success: true, data: data.jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job recommendations failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


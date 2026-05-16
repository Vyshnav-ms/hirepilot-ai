import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
  "skills": ["string"],
  "missingSkills": ["string"],
  "candidateStrengths": ["string"]
}

Rules:
- Include exactly 10 technicalQuestions.
- Include exactly 10 hrQuestions.
- Include exactly 5 projectQuestions.
- Answers must be concise, practical, and tailored to the resume and job description.
- Do not wrap JSON in markdown.
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You return strict JSON only. No markdown, no commentary, no trailing prose.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
        response_format: { type: "json_object" },
      });

    const aiResponse =
      completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No AI response returned");
    }

    const parsedResponse = JSON.parse(aiResponse);

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

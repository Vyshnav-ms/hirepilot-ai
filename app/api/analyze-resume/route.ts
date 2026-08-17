import { NextRequest, NextResponse } from "next/server";
import {
  BehavioralQuestion,
  HrQuestion,
  InterviewResult,
  ProjectQuestion,
  ScenarioQuestion,
  TechnicalQuestion,
} from "@/lib/career-types";
import { groq } from "@/lib/ai-json";

/* ─── Shared context builder ─────────────────────────────────────── */
function buildContext(resumeText: string, jdText: string) {
  return `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`;
}

/* ─── Per-category generators ────────────────────────────────────── */

async function generateTechnical(
  resumeText: string,
  jdText: string
): Promise<TechnicalQuestion[]> {
  const prompt = `You are HirePilot AI, an expert technical interviewer.

Analyze BOTH the resume and job description below, then generate exactly 50 technical interview questions.

${buildContext(resumeText, jdText)}

Focus on:
- Technologies and tools listed in the JD
- Technologies the candidate uses in their resume
- Skills required by the role that the candidate may have gaps in
- Architecture, design patterns, and system-level concepts from the JD

Return ONLY a JSON object with a single key "questions" containing an array of 50 objects:
{
  "questions": [
    {
      "question": "specific technical question",
      "answer": "detailed practical answer tailored to candidate background",
      "difficulty": "Easy | Medium | Hard",
      "skill": "specific skill or technology being tested",
      "topic": "topic category (e.g. React, System Design, SQL)"
    }
  ]
}

Rules:
- EXACTLY 50 questions
- Difficulty mix: ~15 Easy, ~25 Medium, ~10 Hard
- All questions must be specific to the resume and JD combination
- Return raw JSON only, no markdown`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are HirePilot AI. Return strict JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return questions as TechnicalQuestion[];
  } catch {
    return [];
  }
}

async function generateHr(
  resumeText: string,
  jdText: string
): Promise<HrQuestion[]> {
  const prompt = `You are HirePilot AI, an expert HR interviewer and career coach.

Analyze BOTH the resume and job description below, then generate exactly 50 HR interview questions.

${buildContext(resumeText, jdText)}

Focus on:
- Candidate's background, career transitions, and motivations
- Culture fit for the company/role described in the JD
- Communication, leadership, and teamwork skills
- Career goals aligned with the role's growth path
- Salary expectations, remote/hybrid/on-site preferences

Return ONLY a JSON object with a single key "questions" containing an array of 50 objects:
{
  "questions": [
    {
      "question": "HR interview question",
      "answer": "suggested answer that references the candidate's actual background",
      "purpose": "what the interviewer is evaluating with this question"
    }
  ]
}

Rules:
- EXACTLY 50 questions
- Mix of tell-me-about-yourself, strengths/weaknesses, motivation, teamwork, conflict resolution
- Answers must reference the candidate's actual resume content
- Return raw JSON only, no markdown`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are HirePilot AI. Return strict JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return questions as HrQuestion[];
  } catch {
    return [];
  }
}

async function generateProject(
  resumeText: string,
  jdText: string
): Promise<ProjectQuestion[]> {
  const prompt = `You are HirePilot AI, an expert technical interviewer specializing in project-based interviews.

Analyze BOTH the resume and job description below, then generate exactly 50 project-based interview questions.

${buildContext(resumeText, jdText)}

Focus on:
- Specific projects mentioned in the candidate's resume by name
- Architecture and technology choices made in those projects
- Deployment, scaling, performance, and security decisions
- Challenges faced and how they were resolved
- How those projects align with the JD requirements

Return ONLY a JSON object with a single key "questions" containing an array of 50 objects:
{
  "questions": [
    {
      "question": "project-specific question referencing actual projects from resume",
      "answer": "detailed answer covering architecture, decisions, challenges, and outcomes",
      "difficulty": "Easy | Medium | Hard"
    }
  ]
}

Rules:
- EXACTLY 50 questions
- Reference actual project names from the resume when possible
- Cover architecture, design decisions, deployment, testing, performance
- Return raw JSON only, no markdown`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are HirePilot AI. Return strict JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return questions as ProjectQuestion[];
  } catch {
    return [];
  }
}

async function generateBehavioral(
  resumeText: string,
  jdText: string
): Promise<BehavioralQuestion[]> {
  const prompt = `You are HirePilot AI, an expert behavioral interviewer.

Analyze BOTH the resume and job description below, then generate exactly 50 behavioral interview questions using the STAR framework.

${buildContext(resumeText, jdText)}

Focus on:
- Situations the candidate has likely faced based on their experience
- Teamwork, leadership, conflict resolution, and adaptability
- Handling failure, tight deadlines, and ambiguity
- Behaviors the JD specifically values (collaboration, ownership, etc.)
- Real examples the candidate can draw from their resume

Return ONLY a JSON object with a single key "questions" containing an array of 50 objects:
{
  "questions": [
    {
      "question": "Tell me about a time when... / Give me an example of...",
      "suggestedAnswer": "STAR-based answer that references the candidate's actual experience from their resume"
    }
  ]
}

Rules:
- EXACTLY 50 questions
- Use "Tell me about a time..." or "Give me an example of..." framing
- Answers must use STAR format: Situation, Task, Action, Result
- Answers must reference real experience from the candidate's resume
- Return raw JSON only, no markdown`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are HirePilot AI. Return strict JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return questions as BehavioralQuestion[];
  } catch {
    return [];
  }
}

async function generateScenario(
  resumeText: string,
  jdText: string
): Promise<ScenarioQuestion[]> {
  const prompt = `You are HirePilot AI, an expert interview coach specializing in scenario-based questions.

Analyze BOTH the resume and job description below, then generate exactly 50 scenario-based interview questions.

${buildContext(resumeText, jdText)}

Focus on:
- Real workplace situations relevant to the role described in the JD
- Technical and non-technical challenges the candidate would face in this role
- How the candidate would handle escalations, outages, tight deadlines
- Cross-functional collaboration scenarios
- Situations that test the candidate's decision-making and problem-solving

Return ONLY a JSON object with a single key "questions" containing an array of 50 objects:
{
  "questions": [
    {
      "question": "Imagine you are... / You are working on... / Your team needs to...",
      "suggestedSolution": "Detailed step-by-step solution approach using the candidate's known skills and experience"
    }
  ]
}

Rules:
- EXACTLY 50 questions
- Scenarios must be realistic and role-specific based on the JD
- Solutions must reference the candidate's actual tech stack and experience from their resume
- Mix technical scenarios (outage, scaling, bug) with soft-skills scenarios (team conflict, deadline pressure)
- Return raw JSON only, no markdown`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are HirePilot AI. Return strict JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return questions as ScenarioQuestion[];
  } catch {
    return [];
  }
}

/* ─── Route handler ──────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jdText } = body;

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json({ error: "Resume text is required." }, { status: 400 });
    }
    if (!jdText || typeof jdText !== "string" || !jdText.trim()) {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Please set GROQ_API_KEY." },
        { status: 503 }
      );
    }

    // Run all 5 category generators in parallel — each gets its own focused prompt
    // and its own Groq API call, staying well within token limits.
    const [
      technicalQuestions,
      hrQuestions,
      projectQuestions,
      behavioralQuestions,
      scenarioQuestions,
    ] = await Promise.all([
      generateTechnical(resumeText, jdText),
      generateHr(resumeText, jdText),
      generateProject(resumeText, jdText),
      generateBehavioral(resumeText, jdText),
      generateScenario(resumeText, jdText),
    ]);

    const result: InterviewResult = {
      technicalQuestions,
      hrQuestions,
      projectQuestions,
      behavioralQuestions,
      scenarioQuestions,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error("INTERVIEW GENERATION ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Interview generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateJson<T>({
  prompt,
  fallback,
  temperature = 0.55,
}: {
  prompt: string;
  fallback: T;
  temperature?: number;
}) {
  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are HirePilot AI, a senior AI career coach. Return strict JSON only, with no markdown, no comments, and no trailing prose.",
      },
      { role: "user", content: prompt },
    ],
    temperature,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    return fallback;
  }

  try {
    return { ...fallback, ...JSON.parse(content) } as T;
  } catch {
    return fallback;
  }
}


# HirePilot AI

HirePilot AI is a premium AI-powered interview preparation platform. It helps candidates turn a resume and job description into structured technical questions, HR questions, project-based questions, skill insights, missing skills, and candidate strengths.

## Features

- Modern AI SaaS landing page
- Supabase login and registration
- Premium responsive dashboard
- Groq-powered structured resume and job analysis
- Separate Technical, HR, Project, and Skills sections
- Expandable question cards with copy actions
- Loading skeletons, toast notifications, and polished empty states
- About, Privacy Policy, and custom 404 pages

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- Supabase Authentication
- Groq AI

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and add your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production

Build the app:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `GROQ_API_KEY` | Groq API key for AI generation |

## Developed By

Vyshnav M S

- MCA Student
- Full Stack Developer
- AI Enthusiast

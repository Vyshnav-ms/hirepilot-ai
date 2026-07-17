# HirePilot AI

HirePilot AI is a premium AI-powered job application and interview preparation platform. It helps candidates effortlessly tailor their job applications, generate highly personalized, ATS-friendly emails using their master resume, and send them directly to recruiters via seamless Gmail integration. It also provides tools to analyze job descriptions and extract structured insights for interview prep.

## Features

- **Modern AI SaaS Platform:** Premium responsive UI with Framer Motion animations and dark mode aesthetics.
- **Supabase Authentication:** Secure login and registration.
- **Master Resume Vault:** Safely store and manage your core resume for AI analysis.
- **Smart Job Application Tracker:** Track all your job applications in one dashboard.
- **AI Email Drafting (Gemini):** Automatically generate tailored, highly professional job application emails perfectly matched to the job description and your resume.
- **Gmail OAuth Integration:** Connect your Google account and send application emails (with your resume automatically attached) directly from the dashboard!
- **Document Parsing:** Upload JD or Resume as PDF, Word (DOCX), or images.
- **Structured Interview Prep:** Break down job descriptions into Technical, HR, and Project-based questions to prepare you for the interview.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui & Framer Motion
- Supabase (Auth & Database)
- Google Gemini AI (Email Generation & Content Analysis)
- Google APIs (Gmail send & OAuth)
- PDF.js & Tesseract.js (Document Extraction)

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env.local` file by copying `.env.example` and add your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Gmail OAuth Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# The full URL of your application (no trailing slash)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to view it in the browser.

## Database Setup

The app requires a Supabase database with the following core tables:
- `profiles`: Stores user data and master resume
- `applications`: Job application tracking
- `gmail_tokens`: Secure storage for OAuth refresh tokens

## Developed By

Vyshnav M S
- MCA Student
- Full Stack Developer
- AI Enthusiast

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  bio text,
  skills text[] default '{}',
  education text,
  experience text,
  linkedin_url text,
  github_url text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.resume_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  extracted_text text,
  extraction_status text not null default 'completed',
  metadata jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_upload_id uuid references public.resume_uploads(id) on delete set null,
  job_title text,
  job_description text,
  result jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.ats_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_upload_id uuid references public.resume_uploads(id) on delete set null,
  job_description text,
  score integer check (score >= 0 and score <= 100),
  report jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  company text not null,
  role text not null,
  location text,
  salary text,
  match_percentage integer check (match_percentage >= 0 and match_percentage <= 100),
  apply_url text,
  payload jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ai_preferences jsonb not null default '{}',
  theme text not null default 'dark',
  notification_settings jsonb not null default '{}',
  privacy_controls jsonb not null default '{"retain_resume_text": true, "allow_ai_processing": true}',
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.resume_uploads enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.ats_reports enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.user_settings enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "resume_uploads_own" on public.resume_uploads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interview_sessions_own" on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ats_reports_own" on public.ats_reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved_jobs_own" on public.saved_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_settings_own" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


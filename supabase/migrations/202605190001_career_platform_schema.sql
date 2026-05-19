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

create table if not exists public.job_sources (
  id text primary key,
  name text not null,
  source_type text not null,
  url text not null,
  enabled boolean not null default true,
  scrape_interval_minutes integer not null default 1440,
  last_scraped_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  source_id text references public.job_sources(id) on delete set null,
  source text not null,
  title text not null,
  company text not null,
  location text,
  salary text,
  description text,
  remote_type text,
  tags text[] default '{}',
  source_url text,
  apply_url text not null,
  posted_at timestamptz,
  expires_at timestamptz,
  raw_payload jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (external_id, source)
);

create table if not exists public.job_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text references public.job_sources(id) on delete set null,
  status text not null default 'running',
  records_found integer not null default 0,
  records_saved integer not null default 0,
  error text,
  started_at timestamptz default now(),
  finished_at timestamptz
);

create table if not exists public.job_match_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  missing_skills text[] default '{}',
  matched_skills text[] default '{}',
  rationale text,
  created_at timestamptz default now(),
  unique (user_id, job_id)
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
alter table public.job_sources enable row level security;
alter table public.jobs enable row level security;
alter table public.job_ingestion_runs enable row level security;
alter table public.job_match_scores enable row level security;
alter table public.user_settings enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "resume_uploads_own" on public.resume_uploads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interview_sessions_own" on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ats_reports_own" on public.ats_reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved_jobs_own" on public.saved_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "job_sources_read_authenticated" on public.job_sources for select using (auth.role() = 'authenticated');
create policy "jobs_read_authenticated" on public.jobs for select using (auth.role() = 'authenticated');
create policy "job_ingestion_runs_read_authenticated" on public.job_ingestion_runs for select using (auth.role() = 'authenticated');
create policy "job_match_scores_own" on public.job_match_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_settings_own" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

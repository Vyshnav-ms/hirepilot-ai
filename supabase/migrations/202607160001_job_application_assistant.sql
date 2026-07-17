create extension if not exists pgcrypto;

create table if not exists public.master_resume (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_url text not null,
  resume_text text not null,
  skills_json jsonb not null default '{"items":[]}'::jsonb,
  education_json jsonb not null default '{"items":[]}'::jsonb,
  experience_json jsonb not null default '{"items":[]}'::jsonb,
  projects_json jsonb not null default '{"items":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text,
  role text,
  job_description text not null,
  ats_score integer,
  missing_skills text[] not null default '{}',
  matching_skills text[] not null default '{}',
  keywords text[] not null default '{}',
  email_subject text,
  email_body text,
  hr_email text,
  resume_url text,
  status text not null default 'Draft',
  analysis_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_ats_score_range check (ats_score is null or (ats_score >= 0 and ats_score <= 100)),
  constraint applications_status_check check (status in ('Draft', 'Applied', 'Interview', 'Offer', 'Rejected', 'Archived'))
);

create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  document_url text not null,
  created_at timestamptz not null default now(),
  constraint application_documents_document_type_check check (document_type in ('resume', 'jd', 'cover_letter', 'email', 'other'))
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'manual',
  recipient text not null,
  subject text not null,
  body text not null,
  status text not null,
  error text,
  created_at timestamptz not null default now(),
  constraint email_logs_status_check check (status in ('sent', 'failed', 'drafted'))
);

create table if not exists public.analytics_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index if not exists master_resume_user_id_idx on public.master_resume(user_id);
create index if not exists applications_user_created_idx on public.applications(user_id, created_at desc);
create index if not exists applications_user_status_idx on public.applications(user_id, status);
create index if not exists applications_user_ats_idx on public.applications(user_id, ats_score);
create index if not exists application_documents_user_application_idx on public.application_documents(user_id, application_id);
create index if not exists email_logs_user_application_idx on public.email_logs(user_id, application_id);
create index if not exists analytics_cache_user_id_idx on public.analytics_cache(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_master_resume_updated_at on public.master_resume;
create trigger set_master_resume_updated_at
  before update on public.master_resume
  for each row execute function public.set_updated_at();

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

drop trigger if exists set_analytics_cache_updated_at on public.analytics_cache;
create trigger set_analytics_cache_updated_at
  before update on public.analytics_cache
  for each row execute function public.set_updated_at();

alter table public.master_resume enable row level security;
alter table public.applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.email_logs enable row level security;
alter table public.analytics_cache enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'master_resume' and policyname = 'Users can manage own master resume') then
    create policy "Users can manage own master resume" on public.master_resume
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'applications' and policyname = 'Users can manage own applications') then
    create policy "Users can manage own applications" on public.applications
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'application_documents' and policyname = 'Users can manage own application documents') then
    create policy "Users can manage own application documents" on public.application_documents
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'email_logs' and policyname = 'Users can manage own email logs') then
    create policy "Users can manage own email logs" on public.email_logs
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'analytics_cache' and policyname = 'Users can manage own analytics cache') then
    create policy "Users can manage own analytics cache" on public.analytics_cache
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  8388608,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can read own resumes') then
    create policy "Users can read own resumes" on storage.objects
      for select using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload own resumes') then
    create policy "Users can upload own resumes" on storage.objects
      for insert with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can update own resumes') then
    create policy "Users can update own resumes" on storage.objects
      for update using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
      with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can delete own resumes') then
    create policy "Users can delete own resumes" on storage.objects
      for delete using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;

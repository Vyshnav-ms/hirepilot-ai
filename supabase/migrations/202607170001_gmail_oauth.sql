-- Gmail OAuth tokens table
create table if not exists public.gmail_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gmail_email text not null,
  access_token text not null,
  refresh_token text not null,
  expiry_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index if not exists gmail_tokens_user_id_idx on public.gmail_tokens(user_id);

drop trigger if exists set_gmail_tokens_updated_at on public.gmail_tokens;
create trigger set_gmail_tokens_updated_at
  before update on public.gmail_tokens
  for each row execute function public.set_updated_at();

alter table public.gmail_tokens enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'gmail_tokens'
      and policyname = 'Users can manage own gmail tokens'
  ) then
    create policy "Users can manage own gmail tokens" on public.gmail_tokens
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

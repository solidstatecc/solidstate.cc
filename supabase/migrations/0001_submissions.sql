-- Solid State — submissions table
-- Run this once in the Supabase SQL editor for the project.
-- After running, the public submit form can write rows; only the
-- service_role (Supabase dashboard / admin scripts) can read or modify.

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- review state
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  reviewed_at   timestamptz,
  reviewer_notes text,

  -- contact
  submitter_name  text not null,
  submitter_email text not null,

  -- skill
  skill_name        text not null,
  short_description text not null check (length(short_description) <= 120),
  long_description  text not null,
  version           text not null,
  category          text not null,
  install_command   text not null,
  platforms         text[] not null,
  repo_url          text,
  docs_url          text,

  -- pricing
  pricing_model text not null check (pricing_model in ('free', 'paid')),
  price_usd     numeric,

  -- discoverability
  tags text[] not null default '{}'
);

-- Indexes
create index if not exists submissions_status_created_idx
  on public.submissions (status, created_at desc);

create index if not exists submissions_email_idx
  on public.submissions (submitter_email);

-- RLS — anyone can submit, no one (other than service_role) can read.
alter table public.submissions enable row level security;

drop policy if exists "Anyone can submit" on public.submissions;
create policy "Anyone can submit"
  on public.submissions
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT/UPDATE/DELETE policy = denied for anon and authenticated.
-- Admin reads/updates via Supabase dashboard or service_role key only.

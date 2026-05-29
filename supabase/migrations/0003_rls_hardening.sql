-- Solid State — RLS hardening
-- Fixes a critical exposure: public.skills, public.runs, public.payouts shipped
-- with Row Level Security DISABLED, so anyone holding the anon key could read or
-- modify every row. This migration enables RLS and adds least-privilege policies.
--
-- Run once in the Supabase SQL editor (or via migration tooling).
--
--   skills   — public catalog: anyone may READ, only service_role may write.
--   runs     — internal billing/oracle records: no public access at all.
--   payouts  — internal payout records: no public access at all.
--
-- service_role bypasses RLS, so admin scripts / server-side code keep full access.

-- ---------------------------------------------------------------------------
-- skills: public read, no public write
-- ---------------------------------------------------------------------------
alter table public.skills enable row level security;

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
  on public.skills
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policy = writes denied to anon/authenticated.

-- ---------------------------------------------------------------------------
-- runs: internal only — RLS on, zero policies = denied to anon/authenticated
-- ---------------------------------------------------------------------------
alter table public.runs enable row level security;

-- ---------------------------------------------------------------------------
-- payouts: internal only — RLS on, zero policies = denied to anon/authenticated
-- ---------------------------------------------------------------------------
alter table public.payouts enable row level security;

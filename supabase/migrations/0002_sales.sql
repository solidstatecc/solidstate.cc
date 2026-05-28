-- Solid State — sales table
-- Records confirmed Stripe Checkout sales.
-- Written by the webhook handler using the service-role key.
-- Public has no read/write access.

create table if not exists public.sales (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Stripe references
  stripe_event_id     text not null unique,
  stripe_session_id   text not null unique,

  -- product
  sku                 text not null,
  amount_cents        integer not null,
  currency            text not null default 'usd',

  -- buyer
  email               text,

  -- state
  status              text not null default 'paid'
                      check (status in ('paid', 'refunded', 'disputed', 'failed'))
);

create index if not exists sales_created_idx on public.sales (created_at desc);
create index if not exists sales_sku_idx     on public.sales (sku, created_at desc);
create index if not exists sales_email_idx   on public.sales (email);

-- Lock down — webhook writes via service-role, dashboard reads via dashboard.
alter table public.sales enable row level security;
-- No policies = no access for anon/authenticated. Service-role bypasses RLS.

# Architecture

Solid State is a Next.js 16 site that lists AI agent skills. The catalog lives in code. Submissions and sales live in Supabase. Stripe handles payments. Vercel deploys from `master`.

This doc maps the parts so a new contributor — human or agent — can navigate the repo on day one. For voice and contribution rules, see `CLAUDE.md` and `AGENTS.md` at the repo root.

## Stack

- Next.js 16.2 (App Router), React 19, TypeScript strict.
- Tailwind CSS v4 (PostCSS plugin). Most pages also use inline styles for the brutalist zine look.
- `@supabase/supabase-js` for submissions intake and sale records.
- `stripe` SDK for Checkout sessions and webhook verification.
- Output mode `standalone` (`next.config.ts`). Hosted on Vercel (`vercel.json`).

## Top-level layout

```
app/         Next.js App Router routes (pages + API routes)
components/  Shared React components (Nav, Footer, SkillCard, ...)
lib/         Data + clients (catalog, Supabase, Stripe, helpers)
supabase/    SQL migrations (run manually in the Supabase SQL editor)
scripts/     One-off Node scripts (e.g. weekly stats refresh)
.github/     GitHub Actions workflows
public/      Static assets (logo, icons)
```

`tsconfig.json` aliases `@/*` to the repo root, so imports look like `@/lib/skills` and `@/components/Nav`.

## Pages

All routes are under `app/`. Each is a server component unless marked `"use client"`.

| Route | File | What it shows |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home: featured skills + full catalog index. |
| `/skills` | `app/skills/page.tsx` + `SkillsBrowser.tsx` | Browse + filter the catalog. |
| `/skills/[slug]` | `app/skills/[slug]/page.tsx` | Skill detail. Statically generated for every slug via `generateStaticParams`. |
| `/official` | `app/official/page.tsx` | Official-maker leaderboard from `lib/official.ts`. |
| `/audits` | `app/audits/page.tsx` | Third-party security verdicts from `lib/audits.ts`. |
| `/glossary` + `/glossary/[slug]` | `app/glossary/...` | Leveled glossary from `lib/glossary.ts`. |
| `/manifesto` | `app/manifesto/page.tsx` | Brand manifesto. |
| `/submit` | `app/submit/page.tsx` + `SubmitForm.tsx` | Public skill submission form. |
| `/buy`, `/buy/success`, `/buy/cancel` | `app/buy/...` | Stripe Checkout entry + return pages. |
| `/llms.txt`, `/llms-full.txt` | `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` | LLM-readable index files generated from `lib/llms.ts`. ISR every 7 days. |

Global chrome (Nav, Footer, fonts, skip link, base styles) lives in `app/layout.tsx` and `app/globals.css`.

## API routes

| Route | File | Purpose |
| --- | --- | --- |
| `POST /api/submit` | `app/api/submit/route.ts` | Validate submission, insert into `public.submissions`, send Resend email. Insert is the source of truth — email failures don't fail the request. |
| `POST /api/checkout` | `app/api/checkout/route.ts` | Create a Stripe Checkout session for a known SKU and return `{ url }` for client redirect. |
| `POST /api/stripe/webhook` | `app/api/stripe/webhook/route.ts` | Verify the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET`, upsert paid sales into `public.sales` keyed on `stripe_event_id`. Forces `runtime = "nodejs"` so raw bytes survive signature verification. |

## Catalog data flow

The catalog is single-sourced from `lib/skills.ts`. It exports `skills: Skill[]`, which is the concatenation of four arrays:

```
skills = [...originals, ...listings, ...skillsSh, ...clawhubListings]
```

- `originals` — Solid State authored skills, declared inline at the top of `lib/skills.ts`. Provenance `first-party`.
- `listings` — Hand-curated third-party skills, also inline in `lib/skills.ts`. License must be verified before adding (see `HOSTING_BLOCKED_LICENSES`).
- `skillsSh` — Top 200 indexed from skills.sh, in `lib/skillsSh.ts`. Auto-generated; install counts are real telemetry from skills.sh.
- `clawhubListings` — Top picks indexed from ClawHub, in `lib/clawhub.ts`. Auto-generated; `stats.installs` is `installsAllTime` from the ClawHub public catalog.

The `Skill` type is defined in `lib/types.ts` and bakes in the directory's honesty rules:

- `kind: "original" | "listing"` — never blur the two.
- `provenance: "first-party" | "audited" | "indexed" | "mirrored"` — replaces a boolean "verified" flag.
- `license: License` — SPDX or `"undeclared"` / `"unknown"`. Required on every entry.
- `stats?: Stats` — optional. If present, `fetchedAt` is required. Don't fabricate install counts.

`lib/skills.ts` also exports helpers and aggregates: `getSkillBySlug`, `getFeaturedSkills`, `getOriginals`, `getListings`, `getPublishableListings`, `canMirrorOrSell`, `CATEGORIES`, `PLATFORMS`, `STATS`.

### ClawHub refresh

`scripts/refresh-clawhub-stats.mjs` re-pulls `installsAllTime` and `stars` for every slug already in `lib/clawhub.ts` and rewrites the file in place. It is stats-only — it never adds, removes, or re-ranks entries (membership stays human-gated). It honors `429 Retry-After` and runs weekly via `.github/workflows/refresh-clawhub-stats.yml` (Monday 06:00 UTC). The workflow commits the diff back to `master` with `[skip ci]` if anything changed.

### Related data files

- `lib/audits.ts` — third-party audit verdicts (Gen Agent Trust Hub, Socket, Snyk) captured from skills.sh. Auto-generated.
- `lib/official.ts` — official-maker leaderboard from skills.sh. Auto-generated.
- `lib/glossary.ts` — hand-written leveled glossary.
- `lib/llms.ts` — builds `llms.txt` and `llms-full.txt` from the catalog + glossary so the LLM index never drifts from the site.

## Supabase

Two tables, both in the `public` schema. Migrations live in `supabase/migrations/` and are run manually in the Supabase SQL editor (no migration tooling is wired up).

- `0001_submissions.sql` — `public.submissions`. Public can `INSERT` via the anon key; only `service_role` can read or modify. Status is constrained to `pending | approved | rejected`. RLS enabled with a single "Anyone can submit" insert policy.
- `0002_sales.sql` — `public.sales`. RLS enabled with no policies, so anon and authenticated have zero access. Only the webhook (using the service-role key) writes here. `stripe_event_id` is `unique` to make webhook handling idempotent.
- `0003_rls_hardening.sql` — turns on RLS for `public.skills`, `public.runs`, `public.payouts`. `skills` is public-read; `runs` and `payouts` are denied to anon and authenticated. Fixes a prior exposure where these tables shipped with RLS off.

### Two Supabase clients

- `lib/supabase.ts` — browser-safe anon client. Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. RLS decides what it can touch. `auth.persistSession` is off because the site has no end-user auth yet.
- The Stripe webhook (`app/api/stripe/webhook/route.ts`) instantiates a second client inline with `SUPABASE_SERVICE_ROLE_KEY`. Service-role bypasses RLS and stays server-side only.

There is no end-user auth in the app today. The only Supabase auth role in play is `service_role`, used by the webhook and by humans through the Supabase dashboard.

## Stripe

`lib/stripe.ts` instantiates the Stripe SDK only when `STRIPE_SECRET_KEY` is set. It also holds the product catalog as `STRIPE_PRICES`, mapping internal `SkuId`s (`operator-pack`, `front-door-pdf`, `founder-briefing`) to price IDs sourced from env vars. Prices live in Stripe; this file maps SKUs to them.

Flow:

1. Client posts `{ sku }` to `/api/checkout`.
2. Server creates a Checkout Session with the matching price ID and redirects URLs (`/buy/success`, `/buy/cancel`).
3. Stripe sends `checkout.session.completed` (and friends) to `/api/stripe/webhook`.
4. Webhook verifies the signature, then upserts a row into `public.sales` keyed on `stripe_event_id` (idempotent).

`lib/x402.ts` is the client-side helper for rendering channel CTAs (Solid State / Claw Mart / Agentic Market via x402). The x402 server endpoints are not in this repo yet — see the comment at the top of the file.

## Environment variables

All are configured in Vercel project settings. None are committed.

| Var | Where it's used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, webhook admin client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `app/api/stripe/webhook/route.ts` (server only) |
| `STRIPE_SECRET_KEY` | `lib/stripe.ts` |
| `STRIPE_WEBHOOK_SECRET` | `app/api/stripe/webhook/route.ts` |
| `NEXT_PUBLIC_STRIPE_PUB_KEY` | Reserved for client-side Stripe.js (not currently used) |
| `STRIPE_PRICE_OPERATOR_PACK`, `STRIPE_PRICE_FRONT_DOOR_PDF`, `STRIPE_PRICE_FOUNDER_BRIEFING` | `lib/stripe.ts` |
| `RESEND_API_KEY` | `app/api/submit/route.ts` (submission notification email) |
| `SUBMISSION_NOTIFY_TO`, `SUBMISSION_NOTIFY_FROM` | `app/api/submit/route.ts` (override notification recipient + sender) |

## Build and deploy

- `npm run dev` — local Next dev server on `:3000`.
- `npm run build` — `next build` with TypeScript errors enforced (`ignoreBuildErrors: false`).
- `npm run lint` — flat ESLint config in `eslint.config.mjs`, extends `eslint-config-next`.
- `npm start` — runs the production build (`output: "standalone"`).

Deploys are wired through `vercel.json` (`framework: "nextjs"`, `buildCommand: "npm run build"`). Vercel auto-deploys `master` to production; per `CLAUDE.md`, never commit or push to `master`. Open a PR from a feature branch instead.

The `Refresh ClawHub stats` GitHub Action runs weekly and may push a stats-only commit to `master`. It uses `[skip ci]` so it doesn't trigger itself, and Vercel still deploys the result.

## Adding things

- **New skill (original or curated listing):** add a `Skill` object to `originals` or `listings` in `lib/skills.ts`. Required fields are enforced by `lib/types.ts`. Verify the license against the upstream `LICENSE` file before listing.
- **New ClawHub or skills.sh listing:** don't hand-edit `lib/clawhub.ts` or `lib/skillsSh.ts`. They're regenerated by the upstream scripts referenced in their header comments. Stats refresh weekly via CI.
- **New SKU:** create the product + price in Stripe Dashboard, add the price ID to `STRIPE_PRICES` in `lib/stripe.ts` (and the matching env var), then reference the SKU from `/buy`.
- **New Supabase table or RLS change:** add a numbered SQL file to `supabase/migrations/` and run it once in the Supabase SQL editor. There's no migration runner.
- **New page:** add it under `app/`. Wire it into the nav in `components/Nav.tsx` if it's user-facing.

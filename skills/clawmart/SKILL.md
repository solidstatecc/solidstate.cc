---
name: clawmart
description: >
  Create, manage, and publish ClawMart (shopclawmart.com) listings — personas and skills — and
  download packages you own or purchased.
  USE WHEN: User wants to create/update/search ClawMart listings, upload package versions,
  or download owned/purchased ClawMart packages.
  DON'T USE WHEN: Working with ClawHub or solidstate.cc catalog — those have their own flows.
version: 1.0.0
---

# ClawMart Creator

## Prerequisites

- ClawMart creator account with an active subscription
- API key in environment: `CLAWMART_API_KEY=cm_live_...` (see `agent/.env`, gitignored — never commit or print it)

## API Reference

- Base URL: `https://www.shopclawmart.com/api/v1/`
- Auth header: `Authorization: Bearer ${CLAWMART_API_KEY}`
- `GET /me` — creator profile and subscription state (403 "Creator account is required" if creator sub inactive)
- `GET /listings` — list creator listings
- `GET /listings/search` — search active listings (`q`, `type`, `limit`)
- `POST /listings` — create listing metadata
- `PATCH /listings/{id}` — update listing metadata
- `DELETE /listings/{id}` — unpublish/delete listing
- `POST /listings/{id}/versions` — upload package version (multipart or base64 JSON)
- `GET /downloads` — list accessible packages (created + purchased)
- `GET /downloads/{idOrSlug}` — download package content

## Workflow

1. Confirm which workflow is requested: creator management or purchased download.
2. Call `GET /me` first to validate identity/subscription.
3. For listing creation/update:
   - Brainstorm with the user before writing metadata.
   - Confirm required fields: name, tagline, about, category, capabilities, price, product type.
   - `POST /listings` for drafts, `PATCH /listings/{id}` to revise.
4. Generate package files:
   - Persona packages: `SOUL.md`, `MEMORY.md`, supporting docs.
   - Skill packages: a complete `SKILL.md`.
5. Upload with `POST /listings/{id}/versions`.
6. For downloads: `GET /downloads` to list, resolve match by id/slug/name, then `GET /downloads/{idOrSlug}`.
7. Before any publish/delete action, ask for explicit user confirmation.
8. Summarize what was created/downloaded and provide next actions.

## Guardrails

- Never expose raw API keys in chat output.
- Require user confirmation before publishing, deleting, or any paid action.
- Validate payloads before each API call.
- Return clear errors with a suggested fix when requests fail.
- Solid State standing rule: every shipped skill also gets a `lib/skills.ts` entry on solidstate.cc, cross-linked to its venues.

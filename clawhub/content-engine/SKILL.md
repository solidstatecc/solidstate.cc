---
name: content-engine
slug: content-engine
version: 1.0.0
description: One brief becomes a full multi-platform package — video scripts, social posts, blog, newsletter, clips, thumbnails — in your voice, white-label ready. Use when repurposing one idea into many assets.
license: MIT-0
author: solidstatecc
provenance: first-party
allowed-tools: Bash
runtime:
  network: false
  credentials: false
  writes: false
limits:
  max-assets-per-slot: 50
  max-bytes-stdin: 5242880
  timeout-seconds: 30
negative-triggers:
  - Not a social scheduler or publisher. It builds the assets; it does not post, queue, or schedule anything.
  - Not an image or video generator. "Thumbnails" means overlay text and visual concepts, not rendered media.
  - Not an SEO keyword-research or analytics tool. It uses the brief's keywords; it does not pull search volume.
  - Not a hosted SaaS. No account, no database, no network — the caller owns the state and the output.
  - Overkill for a single one-off tweet or a single email. Use it when one idea has to fan out into many assets.
---

# content-engine

Turn one content brief into a complete, multi-platform package — and do it in a
consistent voice you control. The deterministic work runs in a bundled
`entry.py`: planning the package from a brief, atomizing a long piece into
platform-fit derivatives, enforcing per-channel character limits, applying
white-label branding, and assembling the final deliverable. No network, no
credentials, no file writes.

The engine does not write the prose — **you do**. It hands you a rigorous,
voice-aware prompt and structural skeleton for every asset; you write each one
and register it with `add_asset`; then `package` assembles the lot with the
agency branding applied. Words come from the model, structure and consistency
come from the engine.

## How to run

Invoke `entry.py` with **Bash**, passing one JSON object on stdin and reading
one JSON object on stdout. Bash is used **only** to execute the bundled script
(`python3 entry.py`) — it makes no network calls, reads no credentials, writes
no files.

```
echo '<json>' | python3 entry.py
```

State lives in the conversation, not on disk. Keep the `state` object from each
response and pass it back as `"state"` on the next call. On the first call omit
`state` (the engine starts empty). State holds three things: the `voice`
profile, the `whitelabel` branding, and the `assets` you have registered.

## The pipeline

1. **`set_voice`** — define the voice once. Then every plan and every prompt is
   written in it.
2. **`plan`** — a brief in, a full production blueprint out: one fillable,
   voice-aware prompt per asset.
3. *(you write each asset from its prompt.)*
4. **`add_asset`** — register each finished asset; the engine fits it to the
   platform and warns if it overflows.
5. **`set_whitelabel`** — set agency/client branding and the resale flag (the
   agency tier).
6. **`package`** — assemble everything into one branded deliverable with a
   manifest and, if enabled, a resale license.

`atomize` and `fit` are utilities you can use at any point: `atomize` explodes
an existing long-form piece into derivative scaffolds; `fit` checks any text
against a platform's limits.

## Actions

- **set_voice** — store a voice profile. Fields: `tone` (list), `pov`
  (`first`/`second`/`third`), `formality`, `reading_level`, `emoji` (bool),
  `signature_phrases` (list), `banned_words` (list), `cta_style`. Pass
  `samples` (list of text) to also compute a deterministic cadence fingerprint
  (avg sentence length, contraction rate, candidate phrases). A built-in list
  of AI-tell words is always merged into `banned_words`.
- **plan** — `brief` (object: `topic` required; `angle`, `audience`, `goal`,
  `cta`, `key_points` list, `keywords` list optional) and optional `package`
  (list of `{type, platform, count}`). Returns one asset spec per piece — each
  with structure, platform constraints, hashtag suggestions, and a ready-to-use
  `prompt`. Default package: 5 video scripts, 5 social posts, 1 blog, 1
  newsletter, 5 thumbnails, 5 short clips.
- **atomize** — `source` (long-form text) and optional `targets`. Ranks the
  source's own sentences and returns platform-fit derivative scaffolds (hook,
  char budget, hashtags, draft) you then refine.
- **fit** — `text` + `platform`. Reports length vs. limit, an auto-trimmed
  version if over, hook length, and hashtag-count check.
- **add_asset** — `type`, `platform`, `content` (required), optional `title`,
  `meta`. Stores the asset (id `a1`, `a2`, …) and runs a fit check.
- **list_assets** — optional `filter` (`type`, `platform`).
- **set_whitelabel** — `agency`, `client`, `byline`, `footer`, `cta`, `resale`
  (bool), `remove_attribution` (bool).
- **package** — assemble all registered assets into one deliverable: applies
  byline/footer/CTA, builds a manifest (counts by type and platform), and adds
  a resale license block when `resale` is set.

## Content types and platforms

Types: `video_script`, `short_clip`, `social_post`, `blog`, `newsletter`,
`thumbnail`. Each carries the structural beats to fill.

Platforms (with their character budgets): `x`, `linkedin`, `instagram`,
`threads`, `facebook`, `tiktok`, `youtube`, `youtube_short`, `newsletter`,
`blog`. `fit` and `add_asset` enforce these.

## Output contract

Every response is one JSON object. `ok` is the verdict:

- `ok: true` — applied. Read `state` (persist it), `result` (the action's
  data), and `summary` (a one-line recap).
- `ok: false` — nothing changed. Read `error`; keep the state you already had.

`plan`, `atomize`, `fit`, `list_assets`, and `package` are read-only: they
return `state` unchanged.

## White-label / agency tier

Set `agency`, `client`, and `resale: true` via `set_whitelabel`. `package` then
stamps every asset with the agency byline/footer/CTA, credits the agency (not
the tool) in the manifest, and includes a license stating the agency may edit,
brand, publish, and resell the assets as their own. That is the resell tier:
one brief in, a client-ready, white-labeled package out.

## Do not use for

- Posting, scheduling, or queuing content — it builds, it does not publish.
- Generating images or video — thumbnails are text and concepts, not media.
- Pulling SEO/search-volume data — it works from the brief's own keywords.
- A single one-off post — the engine earns its keep when one idea fans out.

## Limits

- Up to 50 assets per slot; 5 MB of stdin; 30 s wall time.
- Pure stdlib Python 3 — no dependencies to install.

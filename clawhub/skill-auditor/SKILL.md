---
name: skill-auditor
slug: skill-auditor
version: 1.0.0
description: Audit a skill folder against ClawHub publish rules before `clawhub skill publish`. Reads files and prints a line-by-line report ending in READY or FIX FIRST. No network, no credentials. Use this when the user is about to publish a skill, asks "is my skill ready," or "audit my skill."
license: MIT-0
author: solidstatecc
provenance: first-party
allowed-tools: Read, Glob, Grep
runtime:
  network: false
  credentials: false
  writes: false
limits:
  max-files-scanned: 200
  max-bytes-per-file: 262144
  timeout-seconds: 60
negative-triggers:
  - Not for runtime skill execution. Auditing only.
  - Not for security scanning of arbitrary code repos — only skill folders with a SKILL.md.
  - Not for fixing the deviations. It names them; the author fixes them.
  - Not for ClawHub account / API operations. It never talks to the network.
---

# skill-auditor

A reasoning skill. Given a skill folder path, audit it against ClawHub publish rules and print a line-by-line report ending in exactly one of `READY` or `FIX FIRST`.

Read-only. No network. No credentials. No writes.

## When to run

Run this **before** `clawhub skill publish`. The publish command will not catch most of these issues; many of them silently degrade discovery, install, or trust.

If the user has not given a folder path, ask once for the path. If the user gives a repo root, look for a `SKILL.md` at the root or under `clawhub/<slug>/` or `skills/<slug>/` and pick the one closest to the cwd they passed.

## How to audit

Treat each check below as an ordered pass. For each check, print one line:

```
[PASS] <check id> — <one-line evidence>
[WARN] <check id> — <one-line problem> — fix: <one-line fix>
[FAIL] <check id> — <one-line problem> — fix: <one-line fix>
```

Use `Read` for files, `Glob`/`Grep` for structure. Do not invoke any other tool. Do not modify the folder.

After every check has emitted a line, print the verdict line on its own:

- `READY` — zero `FAIL`, zero `WARN`. Safe to publish.
- `FIX FIRST` — any `FAIL` or any `WARN`. Not safe to publish.

The `FIX FIRST` verdict must be the last token in the output. No trailing prose.

## Checks

### 1. Structure

- **S1 SKILL.md present** — file exists at the folder root.
- **S2 LICENSE present** — `LICENSE`, `LICENSE.md`, or `LICENSE.txt` at root.
- **S3 README present** — `README.md` at root. WARN if missing, FAIL if `SKILL.md` is the only doc.
- **S4 No binaries** — no `.zip`, `.tar`, `.gz`, `.7z`, `.exe`, `.dll`, `.so`, `.dylib`, `.bin`, `.pyc`, `.class`, `.jar`, `.wasm`. FAIL on any hit.
- **S5 No `node_modules` / `.venv` / `__pycache__`** — FAIL on any hit.
- **S6 No `.git` inside the skill folder** — FAIL.
- **S7 Folder size** — total bytes under 5 MB. WARN if 1–5 MB, FAIL if over 5 MB.

### 2. Slug

- **SL1 Folder name matches `frontmatter.slug`** — case-sensitive equality. FAIL on mismatch.
- **SL2 Slug shape** — `^[a-z][a-z0-9-]{1,38}[a-z0-9]$`. FAIL on violation.
- **SL3 Slug not reserved** — must not equal `skill`, `skills`, `new`, `install`, `publish`, `admin`, `clawhub`, `openclaw`. FAIL.
- **SL4 Slug matches `installCommand` tail** — if a README or SKILL.md cites an install command, the trailing token equals the slug. WARN on mismatch.

### 3. Frontmatter

Required keys: `name`, `slug`, `version`, `description`, `license`, `author`. Recommended: `allowed-tools`, `runtime`, `limits`, `negative-triggers`.

- **F1 YAML parses** — valid YAML between `---` fences at top of SKILL.md.
- **F2 Required keys present** — FAIL on any missing.
- **F3 `name` non-empty and ≤ 60 chars** — FAIL otherwise.
- **F4 `description` 40–300 chars and carries a trigger** — the description must contain at least one phrase a user is likely to say ("when the user", "use this when", or 3+ trigger verbs like `audit`, `check`, `review`, `score`). WARN if shorter than 40 or no trigger; FAIL if over 300.
- **F5 `version` is semver** — `^\d+\.\d+\.\d+(?:[-+].+)?$`. FAIL otherwise.
- **F6 `license` is an SPDX identifier or `proprietary`/`source-available`** — must not be `undeclared` or `unknown` for a ClawHub publish. FAIL.
- **F7 `author` non-empty and matches ClawHub publisher handle shape** — `^[a-z0-9][a-z0-9-]{0,38}[a-z0-9]$`. WARN on mismatch.

### 4. Runtime metadata

- **R1 `allowed-tools` is a non-empty list** — explicit allowlist, no wildcards. FAIL if `*` or missing.
- **R2 `runtime.network` declared** — `true` or `false`. FAIL if missing.
- **R3 `runtime.credentials` declared** — `true` or `false`. FAIL if missing.
- **R4 `runtime.writes` declared** — `true` or `false`. WARN if missing.
- **R5 Tool/network consistency** — if `network: false`, `allowed-tools` must not include `WebFetch`, `WebSearch`, `Bash` (unless the body restricts Bash to read-only commands in plain text). FAIL on contradiction.
- **R6 Tool/writes consistency** — if `writes: false`, `allowed-tools` must not include `Write`, `Edit`, `NotebookEdit`. FAIL.

### 5. Secrets

- **SE1 No literal API keys** — Grep SKILL.md, README, and any source files for these prefixes and patterns:
  - `sk-`, `sk_live_`, `sk_test_`, `pk_live_`, `pk_test_` (Stripe/OpenAI-shape)
  - `xoxb-`, `xoxp-`, `xoxa-` (Slack)
  - `AKIA[0-9A-Z]{16}` (AWS access key)
  - `ghp_`, `gho_`, `ghs_`, `ghu_`, `github_pat_` (GitHub PAT)
  - `AIza[0-9A-Za-z\-_]{35}` (Google API key)
  - PEM headers: `-----BEGIN (RSA |EC |DSA |OPENSSH |)PRIVATE KEY-----`
  - Any line matching `(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{12,}['"]`
  FAIL on any hit. Print the file path and a 16-char prefix of the match — never the full secret.
- **SE2 Required env vars are declared** — for every env var referenced in the body (`$FOO`, `os.environ["FOO"]`, `process.env.FOO`, etc.), the SKILL.md or README must declare it in a "required environment" / "configuration" section. FAIL if any undeclared.
- **SE3 No `.env` files committed** — FAIL on `.env`, `.env.local`, `.env.production`.

### 6. License & pricing

- **LP1 LICENSE file matches `frontmatter.license`** — read the LICENSE text and confirm the declared identifier matches (heuristic: presence of "MIT No Attribution" → MIT-0, "MIT License" → MIT, "Apache License, Version 2.0" → Apache-2.0, etc.). FAIL on contradiction.
- **LP2 No pricing line in SKILL.md** — pricing belongs on the ClawHub listing, not in the bundle. Grep for `^\s*price\s*:`, `$\d+\s*/\s*(month|mo|user|seat|call)`, `pay-?per-?use`, `paid tier`. WARN — strip pricing before publish.
- **LP3 No "see LICENSE for terms" without a LICENSE file** — FAIL (LP1 covers if both missing).
- **LP4 Attribution intact for forks/mirrors** — if SKILL.md or README mentions "forked from", "based on", or "originally by", the LICENSE must include the upstream copyright line. WARN.

### 7. Instructions quality

- **IQ1 SKILL.md body ≥ 400 chars** — anything shorter is decorative. FAIL.
- **IQ2 Has a "When to run" / "Use when" section** — explicit trigger context, not just frontmatter description. WARN if missing.
- **IQ3 Has an explicit output contract** — the body says what the skill returns (format, verdict tokens, exit conditions). WARN if missing.
- **IQ4 Has at least one negative trigger** — `negative-triggers:` in frontmatter, or a "Do not use for" section in body. WARN if neither.
- **IQ5 No "manifesto theater"** — body must not open with vision/values prose before the operating instructions. Heuristic: the first non-frontmatter heading is `When …`, `How …`, `Use …`, `Inputs`, `Outputs`, or `Checks`. WARN otherwise.
- **IQ6 No corporate AI tells** — Grep for: `delve`, `navigate the landscape`, `in today's fast-paced world`, `unlock the power of`, `leverage` (verb usage), `holistic`, `synergize`. WARN per hit; cap at 5 lines.

### 8. Output format

- **OF1 Verdict tokens declared** — body declares exactly the set of terminal verdicts (`READY`, `FIX FIRST`, `PASS`, `FAIL`, `WARN`, or a domain-specific equivalent). FAIL if no verdict tokens are declared.
- **OF2 Verdict tokens are stable strings** — verdicts are ALL-CAPS, no punctuation, ≤ 16 chars. WARN otherwise.
- **OF3 Last line is a verdict** — body asserts the final output line is one of the declared verdicts. WARN if not asserted.

### 9. Limits table

- **L1 `limits` block present in frontmatter** — at minimum one bound (timeout, max files, max bytes, max tokens). WARN if missing entirely.
- **L2 `limits` values are numeric and positive** — FAIL on string or zero.
- **L3 No unbounded loops in body** — Grep the body for "until done", "keep going until", "repeat indefinitely". WARN per hit.

## Self-audit

This skill must pass its own audit. Before printing `READY`, the auditor re-runs every check above against its own folder; the result of the self-audit must be `READY` or the auditor prints `FIX FIRST` with the self-audit deviations appended.

## Output contract

The auditor's terminal output is a sequence of `[PASS]`/`[WARN]`/`[FAIL]` lines, one per check, in the order they are defined, followed by one of:

- `READY` — last line of output. Last token. No trailing prose.
- `FIX FIRST` — last line of output. Last token. No trailing prose.

Nothing else is printed after the verdict. The caller (`clawhub skill publish` or a human) gates on the last line.

## Do not use for

- Runtime execution of skills. This audits the bundle, not the behavior.
- Security scanning of arbitrary code. The secret patterns are publish-readiness heuristics, not a DLP product.
- Fixing the deviations. The auditor names them. The author fixes them.
- ClawHub account / API operations. No network. Ever.

## Limits

- Scan at most 200 files. If the folder is larger, FAIL with `S7`.
- Read at most 256 KB per file. Truncate beyond that and WARN on the file.
- Total wall time: 60 s.

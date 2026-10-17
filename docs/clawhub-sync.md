# ClawHub stats sync

Keeps the install/star numbers on the live ClawHub listings in
[`lib/clawhub.ts`](../lib/clawhub.ts) current, so the catalog stops drifting
from reality.

- **Script:** [`scripts/refresh-clawhub-stats.mjs`](../scripts/refresh-clawhub-stats.mjs)
- **Schedule:** [`.github/workflows/refresh-clawhub-stats.yml`](../.github/workflows/refresh-clawhub-stats.yml)
  — weekly, **Mondays 06:00 UTC** (≈08:00 Paris), plus manual **Run workflow**.

## What it does

For each `openclaw skills install <slug>` already present in `lib/clawhub.ts`,
it fetches the public ClawHub read API (`/api/v1/skills/<slug>`) and rewrites
that entry's `stats: { installs, stars, fetchedAt }` line in place.

**Stats only.** It never adds, removes, or re-ranks skills — membership stays
human-gated (see `drafts/clawhub-candidates`). Slugs are the unit of work; the
file's structure is untouched.

API reuse follows ClawHub's "Public catalog reuse" policy: weekly cadence,
`Retry-After` honored, canonical listings linked back via `docsUrl`.

## Resilience

The sync runs unattended, so a flaky source must not corrupt the catalog.

- **Timeout** — every request is aborted after 15s so a hung connection can't
  stall the job.
- **Retries** — transient failures (network errors, timeouts, `429`, `5xx`)
  retry up to 3 times with exponential backoff + jitter (~0.5s → 1s → 2s).
  `429` responses honor `Retry-After`. `4xx` (other than 429) are treated as
  permanent and not retried.
- **Structured logging** — one JSON object per line (`{ ts, level, event, … }`).
  `info` → stdout, `warn`/`error` → stderr. Grep CI logs by `event`
  (`fetch_retry`, `fetch_failed`, `skip_slug`, `source_unavailable`, `sync_done`).
- **Graceful last-good fallback** — a single failing slug keeps its previous
  values and the run continues. But if the source looks **unavailable**
  (nothing updated, or >50% of slugs fail), the script leaves `lib/clawhub.ts`
  **completely untouched** and exits non-zero. The weekly job then goes red to
  surface the outage, and the committed catalog stays at its last-good state
  instead of being overwritten with half-stale numbers.

Because the script exits non-zero on a source outage, the workflow's
"Commit if changed" step is skipped — no commit, last-good preserved.

## Running it manually

```bash
# Dry run — fetch + report, write nothing:
node scripts/refresh-clawhub-stats.mjs --dry

# Real run — rewrite lib/clawhub.ts in place:
node scripts/refresh-clawhub-stats.mjs
```

Requires Node 20+ (global `fetch`). After a real run, review the diff on
`lib/clawhub.ts` before committing.

## Tuning

Constants at the top of the script:

| Constant          | Default | Meaning                                          |
| ----------------- | ------- | ------------------------------------------------ |
| `TIMEOUT_MS`      | 15000   | Per-request abort timeout (ms).                  |
| `MAX_ATTEMPTS`    | 4       | Initial try + 3 retries.                         |
| `RETRY_BASE_MS`   | 500     | Backoff base; doubles each attempt.              |
| `FAIL_THRESHOLD`  | 0.5     | Failure fraction that trips the last-good guard. |

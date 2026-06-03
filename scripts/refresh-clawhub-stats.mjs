// Refresh install/star stats for the live ClawHub listings in lib/clawhub.ts.
//
// STATS ONLY. This never adds, removes, or re-ranks skills — membership stays
// human-gated (see drafts/clawhub-candidates + the council brief). It only
// updates installs / stars / fetchedAt for the slugs already in the catalog,
// so the numbers stop drifting from reality.
//
// Runs in CI (GitHub Actions, weekly). Uses Node 20 global fetch. Reuse of the
// ClawHub public read API is permitted per their "Public catalog reuse" policy:
// we cache (weekly), honor 429/Retry-After, and link back to canonical listings.
//
// Resilience (see docs/clawhub-sync.md):
//   - Per-request timeout + bounded retries with exponential backoff + jitter
//     for transient failures (network errors, timeouts, 429, 5xx).
//   - Structured JSON-line logs (one event per line) for CI observability.
//   - Graceful last-good fallback: if the source looks unavailable (most/all
//     fetches fail), lib/clawhub.ts is left UNTOUCHED and the run exits non-zero
//     so the weekly job surfaces the outage instead of writing a degraded file.
//
// Local dry run:  node scripts/refresh-clawhub-stats.mjs --dry

import { readFileSync, writeFileSync } from "node:fs"

const FILE = new URL("../lib/clawhub.ts", import.meta.url)
const DRY = process.argv.includes("--dry")
const API = "https://clawhub.ai/api/v1/skills"
const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)

const TIMEOUT_MS = 15000 // per-request abort
const MAX_ATTEMPTS = 4 // initial try + 3 retries
const RETRY_BASE_MS = 500 // backoff base: 0.5s, 1s, 2s (+ jitter)
const FAIL_THRESHOLD = 0.5 // >50% slugs failing => treat source as unavailable

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Structured logging: one JSON object per line. info -> stdout, warn/error -> stderr.
function log(level, event, fields = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields })
  if (level === "error" || level === "warn") console.error(line)
  else console.log(line)
}

async function fetchOnce(slug) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(`${API}/${encodeURIComponent(slug)}`, {
      headers: { accept: "application/json" },
      signal: ctrl.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function fetchStats(slug) {
  for (let attempt = 1; ; attempt++) {
    let res, netErr
    try {
      res = await fetchOnce(slug)
    } catch (e) {
      netErr = e // network failure or timeout abort
    }

    if (!netErr && res.ok) {
      const json = await res.json()
      const s = json?.skill?.stats ?? json?.stats ?? {}
      const installs = Number.isFinite(s.installsAllTime) ? s.installsAllTime : null
      const stars = Number.isFinite(s.stars) ? s.stars : null
      return { installs, stars }
    }

    const status = res?.status
    const retryable = !!netErr || status === 429 || (status >= 500 && status <= 599)
    if (!retryable || attempt >= MAX_ATTEMPTS) {
      throw new Error(netErr ? netErr.message : `HTTP ${status}`)
    }

    // Honor Retry-After when present (429s), else exponential backoff + jitter.
    const retryAfter = Number(res?.headers.get("retry-after"))
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : RETRY_BASE_MS * 2 ** (attempt - 1)
    log("warn", "fetch_retry", {
      slug,
      attempt,
      status: status ?? null,
      error: netErr?.message ?? null,
      waitMs: Math.round(wait),
    })
    await sleep(wait + Math.random() * 250)
  }
}

async function main() {
  let text = readFileSync(FILE, "utf8")
  const slugs = [...text.matchAll(/openclaw skills install ([^"]+)"/g)].map((m) => m[1])
  if (slugs.length === 0) {
    log("error", "no_slugs", { file: "lib/clawhub.ts" })
    process.exit(1)
  }
  log("info", "sync_start", { slugs: slugs.length, dry: DRY })

  let updated = 0
  const failed = []
  for (const slug of slugs) {
    try {
      const { installs, stars } = await fetchStats(slug)
      if (installs == null || stars == null) {
        failed.push(slug)
        log("warn", "skip_slug", { slug, reason: "missing_stats" })
        continue
      }
      // Replace this entry's stats line. Non-greedy hop from the unique install
      // command to the first stats line that follows = this skill's stats.
      const re = new RegExp(
        `(openclaw skills install ${escapeRe(slug)}"[\\s\\S]*?stats: \\{ installs: )\\d+(, stars: )\\d+(, fetchedAt: ")[^"]*(" \\},)`
      )
      if (!re.test(text)) {
        failed.push(slug)
        log("warn", "skip_slug", { slug, reason: "stats_line_unmatched" })
        continue
      }
      text = text.replace(re, `$1${installs}$2${stars}$3${today}$4`)
      updated++
    } catch (e) {
      failed.push(slug)
      log("warn", "fetch_failed", { slug, error: e.message })
    }
    await sleep(150) // be polite
  }

  // Graceful fallback: when the source looks unavailable (nothing updated, or
  // failures cross the threshold), keep last-good lib/clawhub.ts untouched
  // rather than committing a half-stale file. Exit non-zero so CI flags it.
  const failRate = failed.length / slugs.length
  if (updated === 0 || failRate > FAIL_THRESHOLD) {
    log("error", "source_unavailable", {
      updated,
      failed: failed.length,
      total: slugs.length,
      failRate: Number(failRate.toFixed(2)),
      action: "kept_last_good",
    })
    process.exit(1)
  }

  if (failed.length) log("warn", "partial_skips", { count: failed.length, slugs: failed })
  log("info", "sync_done", {
    updated,
    failed: failed.length,
    total: slugs.length,
    fetchedAt: today,
  })

  if (DRY) {
    log("info", "dry_run", { wrote: false })
    return
  }
  writeFileSync(FILE, text)
  log("info", "wrote_file", { file: "lib/clawhub.ts" })
}

main().catch((e) => {
  log("error", "fatal", { error: e?.message ?? String(e) })
  process.exit(1)
})

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
// 2026-11-24: ClawHub slugs stopped being globally unique (~Jul 2026). A bare
// GET /api/v1/skills/<slug> now answers 409 AMBIGUOUS_SKILL_SLUG, so every run
// since late June skipped all 40 rows and committed nothing. The fix:
//   - query /api/v1/skills/<slug>?owner=<handle> (handle = the entry's author)
//   - read stats.installsAllTime, falling back to stats.installs (the field
//     ClawHub now returns; it continues the same all-time counter)
//   - normalise installCommand to ClawHub's owner-qualified form
//     `openclaw skills install @<handle>/<slug>`, which the bare form needs now
//
// Local dry run:  node scripts/refresh-clawhub-stats.mjs --dry

import { readFileSync, writeFileSync } from "node:fs"

const FILE = new URL("../lib/clawhub.ts", import.meta.url)
const DRY = process.argv.includes("--dry")
const API = "https://clawhub.ai/api/v1/skills"
const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchStats(owner, slug, attempt = 0) {
  const url = `${API}/${encodeURIComponent(slug)}?owner=${encodeURIComponent(owner)}`
  const res = await fetch(url, { headers: { accept: "application/json" } })
  if (res.status === 429 && attempt < 3) {
    const wait = Number(res.headers.get("retry-after")) || 5
    await sleep((wait + Math.random()) * 1000)
    return fetchStats(owner, slug, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const s = json?.skill?.stats ?? json?.stats ?? {}
  const pick = (...vals) => vals.find((v) => Number.isFinite(v)) ?? null
  return { installs: pick(s.installsAllTime, s.installs), stars: pick(s.stars) }
}

// One entry = from its `author:` line through its `stats:` line. Install
// command may be bare (`install slug`) or owner-qualified (`install @o/slug`).
const ENTRY =
  /(author: ")([^"]+)(",[\s\S]*?installCommand: "openclaw skills install )(?:@[^/"]+\/)?([^"]+)(",[\s\S]*?stats: \{ installs: )\d+(, stars: )\d+(, fetchedAt: ")[^"]*(" \},)/g

async function main() {
  const text = readFileSync(FILE, "utf8")
  const entries = [...text.matchAll(ENTRY)]
  if (entries.length === 0) {
    console.error("No ClawHub entries matched in lib/clawhub.ts — aborting.")
    process.exit(1)
  }
  console.log(`Refreshing ${entries.length} ClawHub skills…`)

  const fresh = new Map()
  const failed = []
  for (const m of entries) {
    const owner = m[2]
    const slug = m[4]
    try {
      const { installs, stars } = await fetchStats(owner, slug)
      if (installs == null || stars == null) failed.push(`@${owner}/${slug} (missing stats)`)
      else fresh.set(`${owner}/${slug}`, { installs, stars })
    } catch (e) {
      failed.push(`@${owner}/${slug} (${e.message})`)
    }
    await sleep(150) // be polite
  }

  let updated = 0
  const out = text.replace(ENTRY, (all, a, owner, b, slug, c, d, e, f) => {
    const s = fresh.get(`${owner}/${slug}`)
    if (!s) return all
    updated++
    return `${a}${owner}${b}@${owner}/${slug}${c}${s.installs}${d}${s.stars}${e}${today}${f}`
  })

  if (failed.length) console.warn(`Skipped ${failed.length}: ${failed.join(", ")}`)
  console.log(`Updated ${updated}/${entries.length} entries, fetchedAt=${today}.`)

  if (DRY) {
    console.log("(dry run — not writing)")
    return
  }
  if (updated === 0) {
    console.error("Nothing updated — leaving lib/clawhub.ts untouched.")
    process.exit(1)
  }
  writeFileSync(FILE, out)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

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
// Local dry run:  node scripts/refresh-clawhub-stats.mjs --dry

import { readFileSync, writeFileSync } from "node:fs"

const FILE = new URL("../lib/clawhub.ts", import.meta.url)
const DRY = process.argv.includes("--dry")
const API = "https://clawhub.ai/api/v1/skills"
const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

async function fetchStats(slug, attempt = 0) {
  const res = await fetch(`${API}/${encodeURIComponent(slug)}`, {
    headers: { accept: "application/json" },
  })
  if (res.status === 429 && attempt < 3) {
    const wait = Number(res.headers.get("retry-after")) || 5
    await sleep((wait + Math.random()) * 1000)
    return fetchStats(slug, attempt + 1)
  }
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`)
  const json = await res.json()
  const s = json?.skill?.stats ?? json?.stats ?? {}
  const installs = Number.isFinite(s.installsAllTime) ? s.installsAllTime : null
  const stars = Number.isFinite(s.stars) ? s.stars : null
  return { installs, stars }
}

async function main() {
  let text = readFileSync(FILE, "utf8")
  const slugs = [...text.matchAll(/openclaw skills install ([^"]+)"/g)].map((m) => m[1])
  if (slugs.length === 0) {
    console.error("No ClawHub slugs found in lib/clawhub.ts — aborting.")
    process.exit(1)
  }
  console.log(`Refreshing ${slugs.length} ClawHub skills…`)

  let updated = 0
  const failed = []
  for (const slug of slugs) {
    try {
      const { installs, stars } = await fetchStats(slug)
      if (installs == null || stars == null) {
        failed.push(`${slug} (missing stats)`)
        continue
      }
      // Replace this entry's stats line. Non-greedy hop from the unique install
      // command to the first stats line that follows = this skill's stats.
      const re = new RegExp(
        `(openclaw skills install ${escapeRe(slug)}"[\\s\\S]*?stats: \\{ installs: )\\d+(, stars: )\\d+(, fetchedAt: ")[^"]*(" \\},)`
      )
      if (!re.test(text)) {
        failed.push(`${slug} (stats line not matched)`)
        continue
      }
      text = text.replace(re, `$1${installs}$2${stars}$3${today}$4`)
      updated++
    } catch (e) {
      failed.push(`${slug} (${e.message})`)
    }
    await sleep(150) // be polite
  }

  if (failed.length) console.warn(`Skipped ${failed.length}: ${failed.join(", ")}`)
  console.log(`Updated ${updated}/${slugs.length} entries, fetchedAt=${today}.`)

  if (DRY) {
    console.log("(dry run — not writing)")
    return
  }
  writeFileSync(FILE, text)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

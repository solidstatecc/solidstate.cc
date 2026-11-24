// Refresh install counts + trending flags for the skills.sh listings in
// lib/skillsSh.ts.
//
// STATS ONLY, same contract as refresh-clawhub-stats.mjs: it never adds,
// removes, renames, or re-ranks entries. Membership stays human-gated. It
// updates stats.installs, stats.fetchedAt, and `trending` for the rows that
// already exist, and prints what a human should look at (rows skills.sh no
// longer serves, repos that moved, big entrants we don't list).
//
// Sources (public pages; the skills.sh JSON API needs a key since mid-2026):
//   https://www.skills.sh/          all-time leaderboard (top 600, exact counts)
//   https://www.skills.sh/trending  24h board — `trending` = one of the rows
//                                   the page renders (what a visitor sees)
//   https://www.skills.sh/<o>/<r>/<s>  per-skill page, for rows not in the top
//                                      600 ("Installs" sidebar, K/M rounded)
//
// Usage:  node scripts/refresh-skillssh-stats.mjs [--dry]
// The script never pushes — Thor commits.

import { readFileSync, writeFileSync } from "node:fs"

const FILE = new URL("../lib/skillsSh.ts", import.meta.url)
const DRY = process.argv.includes("--dry")
const BASE = "https://www.skills.sh"
const UA = { "user-agent": "Mozilla/5.0 (solidstate.cc catalog refresh)" }
const today = new Date().toISOString().slice(0, 10)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(url) {
  const res = await fetch(url, { headers: UA, redirect: "follow" })
  return { status: res.status, url: res.url, html: res.ok ? await res.text() : "" }
}

// Next.js RSC payload -> the leaderboard's initialSkills array.
function boardRows(html) {
  const chunks = [...html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g)].map((m) => m[1])
  const raw = JSON.parse(`"${chunks.join("")}"`.replace(/\n/g, "\\n"))
  const i = raw.indexOf('{"initialSkills":')
  if (i < 0) throw new Error("initialSkills not found — page format changed")
  let depth = 0
  for (let j = i; j < raw.length; j++) {
    if (raw[j] === "{") depth++
    else if (raw[j] === "}" && --depth === 0) return JSON.parse(raw.slice(i, j + 1)).initialSkills
  }
  throw new Error("initialSkills not terminated")
}

const num = (s) => {
  const m = String(s).trim().match(/^([\d.,]+)\s*([KM]?)$/i)
  if (!m) return null
  const n = parseFloat(m[1].replace(/,/g, ""))
  return Math.round(n * ({ k: 1e3, m: 1e6 }[m[2].toLowerCase()] ?? 1))
}

function pageInstalls(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " | ")
    .replace(/(\s*\|\s*)+/g, " | ")
  const m = [...text.matchAll(/\| Installs \| ([\d.,]+[KM]?) \|/gi)].pop()
  return m ? num(m[1]) : null
}

const ENTRY =
  /("docsUrl": "https:\/\/www\.skills\.sh\/)([^"]+)(",[\s\S]*?"stats": \{\s*"installs": )(\d+)(,\s*"fetchedAt": ")([^"]*)("\s*\},[\s\S]*?"trending": )(true|false)/g

async function main() {
  const text = readFileSync(FILE, "utf8")
  const entries = [...text.matchAll(ENTRY)]
  if (entries.length < 100) {
    console.error(`Only matched ${entries.length} rows — file format changed. Aborting.`)
    process.exit(1)
  }

  const home = await get(`${BASE}/`)
  const trend = await get(`${BASE}/trending`)
  const all = boardRows(home.html)
  // Rendered rows only: the payload carries 600 rows for infinite scroll, but
  // "on the 24h board" has always meant the board a visitor sees.
  const hot = [...new Set([...trend.html.matchAll(/href="\/([a-z0-9][\w.-]*\/[\w.-]+\/[\w.:-]+)"/g)].map((m) => m[1]))]
  if (all.length < 100) throw new Error(`all-time board has ${all.length} rows — aborting`)
  const allMap = new Map(all.map((s) => [`${s.source}/${s.skillId}`, s.installs]))
  const trendSet = new Set(hot)
  if (trendSet.size < 50) throw new Error(`trending board rendered ${trendSet.size} rows — aborting`)
  console.log(`Board: ${all.length} all-time rows, ${hot.length} trending rows; catalog rows: ${entries.length}`)

  const fresh = new Map()
  const gone = []
  const moved = []
  for (const m of entries) {
    const path = m[2]
    if (allMap.has(path)) {
      fresh.set(path, allMap.get(path))
      continue
    }
    const page = await get(`${BASE}/${path}`)
    await sleep(250)
    if (page.status === 404) {
      gone.push(path)
      continue
    }
    const finalPath = page.url.replace(`${BASE}/`, "")
    if (finalPath !== path) moved.push(`${path} -> ${finalPath}`)
    const n = allMap.get(finalPath) ?? pageInstalls(page.html)
    if (n == null) gone.push(`${path} (no install count on page)`)
    else fresh.set(path, n)
  }

  let updated = 0
  let flips = 0
  const deltas = []
  const out = text.replace(ENTRY, (whole, a, path, b, oldN, c, oldDate, d, oldTrend) => {
    const n = fresh.get(path)
    const t = String(trendSet.has(path))
    if (t !== oldTrend) flips++
    if (n == null) return `${a}${path}${b}${oldN}${c}${oldDate}${d}${t}`
    updated++
    deltas.push({ path, from: Number(oldN), to: n })
    return `${a}${path}${b}${n}${c}${today}${d}${t}`
  })

  const listed = new Set(entries.map((m) => m[2]))
  const entrants = all.filter((s) => !listed.has(`${s.source}/${s.skillId}`)).slice(0, 15)
  const drops = deltas.filter((x) => x.to < x.from).sort((x, y) => x.to / x.from - y.to / y.from)

  console.log(`Updated installs on ${updated}/${entries.length} rows; trending flips: ${flips}.`)
  if (gone.length) console.log(`Not served by skills.sh (kept, review): ${gone.join(", ")}`)
  if (moved.length) console.log(`Moved upstream (kept, review): ${moved.join("; ")}`)
  if (drops.length)
    console.log(
      `Counts that FELL (skills.sh revised them): ${drops
        .slice(0, 12)
        .map((x) => `${x.path} ${x.from}->${x.to}`)
        .join("; ")}${drops.length > 12 ? ` (+${drops.length - 12} more)` : ""}`
    )
  console.log(`Top board skills we don't list: ${entrants.map((s) => `${s.source}/${s.skillId} (${s.installs})`).join("; ")}`)

  if (DRY) return console.log("(dry run — not writing)")
  if (updated === 0) {
    console.error("Nothing updated — leaving lib/skillsSh.ts untouched.")
    process.exit(1)
  }
  const stamp = `// Stats (installs, trending) refreshed ${today} by scripts/refresh-skillssh-stats.mjs.`
  const stamped = /^\/\/ Stats \(installs, trending\) refreshed .*$/m.test(out)
    ? out.replace(/^\/\/ Stats \(installs, trending\) refreshed .*$/m, stamp)
    : out.replace(/^(\/\/ \(captured [^\n]*)$/m, `$1\n${stamp}`)
  writeFileSync(FILE, stamped)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

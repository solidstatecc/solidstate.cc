// Regenerate lib/official.ts from a text capture of https://www.skills.sh/official.
//
// Input: a file containing the page text (markdown or raw HTML) where each maker
// appears as a link whose text ends in "<repos> <skills>" and whose href is
// https://www.skills.sh/<owner>. Counts are real, from skills.sh — we never invent.
//
// Usage:  node scripts/refresh-official.mjs <raw-capture.txt>
//         node scripts/refresh-official.mjs <raw-capture.txt> --dry
//
// Run weekly via the Cowork scheduled task "solidstate-official-sync"
// (web_fetch grabs the page; this script does the parsing + codegen).

import { readFileSync, writeFileSync } from "node:fs"

const OUT = new URL("../lib/official.ts", import.meta.url)
const DRY = process.argv.includes("--dry")
const input = process.argv[2]
if (!input) {
  console.error("Usage: node scripts/refresh-official.mjs <raw-capture.txt> [--dry]")
  process.exit(1)
}

const text = readFileSync(input, "utf8")
const today = new Date().toISOString().slice(0, 10)

// Matches "... 14 389](https://www.skills.sh/anthropics)" — markdown capture,
// or 'href="https://www.skills.sh/anthropics"' style for raw HTML.
const re = /(\d+)\s+(\d+)\]\(https:\/\/(?:www\.)?skills\.sh\/([a-z0-9][a-z0-9.-]*)\)/g

const seen = new Map()
for (const m of text.matchAll(re)) {
  const [, repos, skills, owner] = m
  // skip nav/footer slugs that aren't makers
  if (["official", "audits", "topic", "trending", "hot", "docs", "agent", "about", "contact", "privacy", "terms"].includes(owner)) continue
  seen.set(owner, { owner, repos: Number(repos), skills: Number(skills) })
}

const makers = [...seen.values()].sort(
  (a, b) => b.skills - a.skills || a.owner.localeCompare(b.owner)
)

if (makers.length < 50) {
  console.error(`Only parsed ${makers.length} makers — page format probably changed. Aborting, lib/official.ts untouched.`)
  process.exit(1)
}

const totalSkills = makers.reduce((s, m) => s + m.skills, 0)

const entries = makers
  .map(
    (m) => `  {
    "owner": ${JSON.stringify(m.owner)},
    "repos": ${m.repos},
    "skills": ${m.skills},
    "avatar": ${JSON.stringify(`https://github.com/${m.owner}.png?size=80`)},
    "url": ${JSON.stringify(`https://www.skills.sh/${m.owner}`)}
  }`
  )
  .join(",\n")

const out = `// AUTO-GENERATED — official makers indexed on skills.sh (captured ${today}).
// 'The makers teaching you how to use their product.' Counts are real, from skills.sh.
// Regenerate: node scripts/refresh-official.mjs <capture.txt>
export interface OfficialMaker {
  owner: string
  repos: number
  skills: number
  avatar: string
  url: string
}

export const officialMakers: OfficialMaker[] = [
${entries}
]

export const OFFICIAL_STATS = {
  makers: ${makers.length},
  totalSkills: ${totalSkills},
}
`

if (DRY) {
  console.log(`[dry] ${makers.length} makers, ${totalSkills} skills`)
} else {
  writeFileSync(OUT, out)
  console.log(`Wrote lib/official.ts — ${makers.length} makers, ${totalSkills} skills (captured ${today})`)
}

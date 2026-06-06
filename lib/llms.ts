// Solid State — llms.txt / llms-full.txt generators.
//
// These build the two machine-readable index files from the SAME source of
// truth as the site: lib/skills.ts, lib/skillsSh.ts, lib/glossary.ts.
//
// Served by app/llms.txt/route.ts and app/llms-full.txt/route.ts as static
// routes, so every Vercel deploy regenerates them. No manual step, no drift.
// Add a skill or a glossary term and these update on the next build.

import { skills, getOriginals, getListings } from "./skills"
import { glossary } from "./glossary"

// Note: getListings() already includes the skills.sh-indexed entries
// (they carry kind: "listing"), so we never concatenate skillsSh separately.

const BASE = "https://solidstate.cc"

// Manifesto + pricing copy rarely changes and isn't exported from the page
// components, so we mirror it here. The catalog (skills + glossary) is the
// part that grows; it's pulled live from the data above.
const MANIFESTO: Array<[string, string]> = [
  ["Working code, not wrappers.", "AI is a tool. The job is to ship work. Solid State packages narrow, working capabilities. Each one does one thing, costs what it costs, and runs today."],
  ["No theater.", "No mysticism, no manifesto theater inside a skill. The agent shows up, does the work, returns a result. If it cannot, it says so and stops."],
  ["Compute is cheap. Bad output is not.", "Agents that ship wrong work cost more than agents that admit they cannot. Every Solid State skill is built around verification first, capability second."],
  ["Buy or install.", "Every skill runs direct on solidstate.cc. Free where it's free, paid where it isn't. One brand, no lock-in."],
  ["Operators, not users.", "We build for the people who run the work, not the people who watch the work. Founders, ops leads, solo operators, lean teams. The brief is always: get to ship."],
  ["Open where it's free. Paid where it isn't.", "Open formats, open sources cited, open data where we can. Commercial pricing where the value is real. We will not pretend a thing is free that costs us to run."],
]

const SKUS: Array<[string, string, string]> = [
  ["Operator Pack", "$200", "10,000 oracle calls. No subscription. No token. Prepaid credit, routed through Solid State's runtime."],
  ["Run an Agent Without Buying a Course", "$29", "The whole playbook. 20 pages. No upsell. How to ship one agent on Base."],
  ["Founder Briefing", "$1", "forest + audit + oracle. One run. One dollar. Run it before pitching anything."],
]

/** Concise, llms.txt-spec index. */
export function buildLlmsIndex(): string {
  const originals = getOriginals()
  const totalSkills = skills.length

  const lines: string[] = []
  lines.push("# Solid State", "")
  lines.push(
    "> The skills marketplace for AI agents. Browse, install, and publish skills for Claude, OpenClaw, NemoClaw, Google Antigravity, and any agent runtime. Multi-platform. Verified. Operator-grade.",
    ""
  )
  lines.push(
    "Solid State indexes agent skills honestly. No fake install counts. No borrowed authorship. Every listing links to its real source, license, and provenance.",
    ""
  )
  lines.push(
    "Three kinds of skill live here. Originals we wrote. Listings we index for discovery. Mirrors we host with attribution intact.",
    ""
  )
  lines.push(`The directory carries ${totalSkills} skill records across ${glossary.length} core concepts.`, "")

  lines.push("## Skills", "")
  lines.push(`- [Browse Skills](${BASE}/skills): Filter every indexed skill by platform, category, and provenance.`)
  for (const s of originals) lines.push(`- [${s.name}](${BASE}/skills/${s.slug}): ${oneLine(s.description)}`)
  lines.push(`- [Agent Directory](${BASE}/agents): The runtimes that run skills — what each one is and how skills install on it.`)
  lines.push(`- [Official Makers](${BASE}/official): Skills from the companies that build the tech — the makers teaching you their product.`)
  lines.push(`- [Security Audits](${BASE}/audits): Third-party audit verdicts from Gen Agent Trust Hub, Socket, and Snyk. Their call, not ours.`)
  lines.push(`- [Submit a Skill](${BASE}/submit): Add your skill to the registry for review.`, "")

  lines.push("## Reference", "")
  lines.push(`- [Glossary](${BASE}/glossary): A working glossary of AI terms. Beginner to expert. Researched and written by Solid State.`)
  lines.push(`- [Manifesto](${BASE}/manifesto): Why Solid State exists. Working code, not wrappers.`, "")

  lines.push("## Buy", "")
  for (const [n, p, d] of SKUS) lines.push(`- [${n} — ${p}](${BASE}/buy): ${d}`)
  lines.push("")

  lines.push("## Optional", "")
  lines.push(`- [Full index (llms-full.txt)](${BASE}/llms-full.txt): Every skill, every glossary term, the full manifesto — inlined.`)
  lines.push(`- [Agent workflow (skill.md)](${BASE}/skill.md): Canonical instructions for agents — browse, install, verify, submit.`)
  lines.push("")

  return lines.join("\n")
}

/** Full-content expansion. */
export function buildLlmsFull(): string {
  const originals = getOriginals()
  const indexed = getListings()
  const totalSkills = skills.length
  const today = new Date().toISOString().slice(0, 10)

  const lines: string[] = []
  lines.push("# Solid State — Full Index", "")
  lines.push(
    "> The skills marketplace for AI agents. Browse, install, and publish skills for Claude, OpenClaw, NemoClaw, Google Antigravity, and any agent runtime.",
    ""
  )
  lines.push(`Generated ${today}. Source: solidstate.cc. ${totalSkills} skill records, ${glossary.length} glossary terms.`, "")

  lines.push("## What Solid State is", "")
  lines.push("A directory of agent skills, indexed honestly.", "")
  lines.push(
    "No skill carries an install count we haven't measured. No skill is attributed to us unless we wrote it. Listings link to upstream repos. We don't claim authorship.",
    ""
  )
  lines.push(
    "Three kinds: **originals** (Solid State authored), **listings** (third-party, indexed for discovery), **mirrors** (third-party open-source, hosted with attribution).",
    ""
  )

  lines.push("## Manifesto", "")
  for (const [h, b] of MANIFESTO) lines.push(`### ${h}`, "", b, "")

  lines.push("## Original skills", "")
  lines.push("Solid State authored. Source under our control.", "")
  for (const s of originals) lines.push(`### ${s.name}`, "", oneLine(s.description), "", `${BASE}/skills/${s.slug}`, "")

  lines.push("## Pricing", "")
  for (const [n, p, d] of SKUS) lines.push(`### ${n} — ${p}`, "", d, "", `${BASE}/buy`, "")

  lines.push("## Glossary", "")
  lines.push("A working glossary of AI terms, leveled beginner to expert.", "")
  for (const g of glossary) lines.push(`- [${g.term}](${BASE}/glossary/${g.slug}): ${oneLine(g.short)}`)
  lines.push("")

  lines.push(`## Indexed skills (${indexed.length})`, "")
  lines.push(
    "Third-party skills indexed for discovery. Each links to its Solid State listing page; provenance and license live there.",
    ""
  )
  for (const s of indexed) lines.push(`- [${s.name}](${BASE}/skills/${s.slug}): ${oneLine(s.description)}`)
  lines.push("")

  return lines.join("\n")
}

/** Collapse whitespace/newlines so a description stays on one bullet line. */
function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}

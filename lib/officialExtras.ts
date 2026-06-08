// HAND-CURATED — official makers shipping first-party skills that skills.sh
// has NOT (yet) flagged on its /official page. Counts are real, pulled from
// each maker's skills.sh maker page — we never invent.
//
// NOT touched by scripts/refresh-official.mjs. If skills.sh later adds a maker
// to /official, the weekly refresh picks it up — delete the duplicate here.
// Re-verify counts when touching this file (see `verified` per entry).

import type { OfficialMaker } from "./official"

export interface OfficialExtra extends OfficialMaker {
  /** Maker homepage — primary card link. */
  site: string
  /** The first-party agent/product the skills teach. Rendered as a second link. */
  product?: { label: string; url: string }
  /** YYYY-MM-DD counts last checked against skills.sh. */
  verified: string
}

export const officialExtras: OfficialExtra[] = [
  {
    owner: "NousResearch",
    repos: 2,
    skills: 183,
    avatar: "https://github.com/NousResearch.png?size=80",
    url: "https://www.skills.sh/nousresearch",
    site: "https://nousresearch.com",
    product: { label: "Hermes Agent", url: "https://hermes-agent.nousresearch.com/desktop" },
    verified: "2026-06-08",
  },
  {
    // First-party count only: the openclaw/openclaw repo (122 skills, 54.3K installs).
    // The owner page shows 2,229 skills, but ~2,071 sit in openclaw/skills — the
    // community ClawHub mirror, not maker-authored. Honest > full.
    owner: "openclaw",
    repos: 1,
    skills: 122,
    avatar: "https://github.com/openclaw.png?size=80",
    url: "https://www.skills.sh/openclaw/openclaw",
    site: "https://openclaw.ai",
    verified: "2026-06-08",
  },
]

export const OFFICIAL_EXTRAS_STATS = {
  makers: officialExtras.length,
  totalSkills: officialExtras.reduce((s, m) => s + m.skills, 0),
}

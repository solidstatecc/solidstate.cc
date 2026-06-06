// Solid State — Agent Skills Discovery (well-known) registry.
//
// Backs /.well-known/skills/* per the Agent Skills Discovery spec
// (github.com/cloudflare/agent-skills-discovery-rfc). Reference impl:
// vercel-labs/skills-handler. Consumers verified: Hermes Agent
// (`hermes skills install well-known:https://solidstate.cc/.well-known/skills/<name>`),
// plus anything that speaks the convention.
//
// Honesty rules, same as everywhere else:
//   - ONLY first-party skills appear here. We serve content we authored and
//     control. Listings stay pointers to their upstream repos — we don't
//     proxy third-party code (see public/skill.md).
//   - SKILL.md content is fetched from the canonical GitHub repo at request
//     time (cached). The repo stays the single source of truth; this site
//     never carries a stale fork of it.
//   - `name` must equal the SKILL.md frontmatter `name` and the catalog slug.

export interface WellKnownSkill {
  /** Spec: 1-64 chars, lowercase alphanumeric + hyphens. Equals catalog slug. */
  name: string
  /** Raw URL of the canonical SKILL.md (GitHub, main branch). */
  rawUrl: string
  /** Catalog page, for cross-reference. */
  catalogUrl: string
}

export const wellKnownSkills: WellKnownSkill[] = [
  {
    name: "publish-audit",
    rawUrl:
      "https://raw.githubusercontent.com/solidstatecc/skills/main/skills/publish-audit/SKILL.md",
    catalogUrl: "https://solidstate.cc/skills/publish-audit",
  },
  {
    name: "niche-hunter",
    rawUrl:
      "https://raw.githubusercontent.com/solidstatecc/skill-niche-hunter/main/SKILL.md",
    catalogUrl: "https://solidstate.cc/skills/niche-hunter",
  },
  {
    name: "ai-tool-compare",
    rawUrl:
      "https://raw.githubusercontent.com/solidstatecc/skill-ai-tool-compare/main/SKILL.md",
    catalogUrl: "https://solidstate.cc/skills/ai-tool-compare",
  },
  {
    name: "hyper-rational-brief",
    rawUrl:
      "https://raw.githubusercontent.com/solidstatecc/skill-hyper-rational-brief/main/SKILL.md",
    catalogUrl: "https://solidstate.cc/skills/hyper-rational-brief",
  },
]

export function getWellKnownSkill(name: string): WellKnownSkill | undefined {
  return wellKnownSkills.find((s) => s.name === name)
}

/** Minimal frontmatter description extractor — no dependency needed. */
export function extractDescription(skillMd: string): string {
  const fm = skillMd.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) return ""
  const desc = fm[1].match(/^description:\s*(.+(?:\n(?![\w-]+:)[ \t]+.+)*)/m)
  if (!desc) return ""
  return desc[1].replace(/\s+/g, " ").trim().slice(0, 1024)
}

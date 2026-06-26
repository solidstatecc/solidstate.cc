// Hosted first-party skills served as a flat .skill for the Grok consumer app
// importer (grok.com/skills -> New Skill -> Upload skill file). Only skills whose
// canonical repo we control. `dir` = path inside the repo that holds SKILL.md
// (flattened to the zip root by app/skills/[slug]/grok.skill/route.ts).
export interface GrokBundle {
  owner: string
  repo: string
  ref: string
  /** Path within the repo that contains SKILL.md. "" = repo root. */
  dir: string
}

export const grokBundles: Record<string, GrokBundle> = {
  "spacex-daily-briefing": { owner: "solidstatecc", repo: "spacex-daily-briefing", ref: "main", dir: "skills/spacex-daily-briefing" },
  "publish-audit": { owner: "solidstatecc", repo: "skills", ref: "main", dir: "skills/publish-audit" },
  "niche-hunter": { owner: "solidstatecc", repo: "skill-niche-hunter", ref: "main", dir: "" },
  "ai-tool-compare": { owner: "solidstatecc", repo: "skill-ai-tool-compare", ref: "main", dir: "" },
  "hyper-rational-brief": { owner: "solidstatecc", repo: "skill-hyper-rational-brief", ref: "main", dir: "" },
}

export function getGrokBundle(slug: string): GrokBundle | undefined {
  return grokBundles[slug]
}

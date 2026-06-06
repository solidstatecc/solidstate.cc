// Solid State — source (pack) grouping
//
// Indexed listings carry a `source` field ("obra/superpowers",
// "anthropics/skills", ...). A "source page" groups every skill from one
// upstream publisher: one header, one install command, member skills below.
//
// Honesty rules:
//   - Groups are computed from real listing data. No synthetic entries.
//   - Install totals are sums of real per-skill telemetry, labeled as such.
//   - clawhub:* sources are per-skill identifiers, not packs — excluded.

import { Skill } from "./types"
import { skills } from "./skills"

export interface SourceGroup {
  /** Raw source string, e.g. "obra/superpowers". */
  source: string
  /** URL-safe slug, e.g. "obra-superpowers". */
  slug: string
  /** Display name — the part after the slash, or the whole string. */
  name: string
  /** Owner/org — the part before the slash, if any. */
  owner: string
  skills: Skill[]
  /** Sum of real per-skill install telemetry. 0 if none measured. */
  totalInstalls: number
  /** Count of members on the live trending board at capture time. */
  trendingCount: number
  /** Repo root, derived from the source string when it looks like owner/repo. */
  repoUrl?: string
  /** Pack-level install command (most common across members). */
  installCommand?: string
}

export function sourceSlug(source: string): string {
  return source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function looksLikeGitHubRepo(source: string): boolean {
  return /^[\w.-]+\/[\w.-]+$/.test(source)
}

function buildGroup(source: string, members: Skill[]): SourceGroup {
  const slashIdx = source.indexOf("/")
  const owner = slashIdx > 0 ? source.slice(0, slashIdx) : source
  const name = slashIdx > 0 ? source.slice(slashIdx + 1) : source

  // Most common install command across members = the pack-level command.
  const cmdCounts = new Map<string, number>()
  for (const s of members) {
    if (s.installCommand) {
      cmdCounts.set(s.installCommand, (cmdCounts.get(s.installCommand) ?? 0) + 1)
    }
  }
  let installCommand: string | undefined
  let best = 0
  for (const [cmd, n] of cmdCounts) {
    if (n > best) {
      best = n
      installCommand = cmd
    }
  }

  return {
    source,
    slug: sourceSlug(source),
    name,
    owner,
    skills: [...members].sort(
      (a, b) => (b.stats?.installs ?? 0) - (a.stats?.installs ?? 0)
    ),
    totalInstalls: members.reduce((sum, s) => sum + (s.stats?.installs ?? 0), 0),
    trendingCount: members.filter((s) => s.trending).length,
    repoUrl: looksLikeGitHubRepo(source) ? `https://github.com/${source}` : undefined,
    installCommand,
  }
}

/** All source groups, largest install base first. Computed once at build. */
export const sourceGroups: SourceGroup[] = (() => {
  const bySource = new Map<string, Skill[]>()
  for (const s of skills) {
    if (!s.source || s.source.startsWith("clawhub:")) continue
    const arr = bySource.get(s.source)
    if (arr) arr.push(s)
    else bySource.set(s.source, [s])
  }
  return Array.from(bySource.entries())
    .map(([source, members]) => buildGroup(source, members))
    .sort((a, b) => b.totalInstalls - a.totalInstalls)
})()

export function getSourceBySlug(slug: string): SourceGroup | undefined {
  return sourceGroups.find((g) => g.slug === slug)
}

/** Source group for a given skill, if it belongs to one. */
export function getSourceForSkill(skill: Skill): SourceGroup | undefined {
  if (!skill.source || skill.source.startsWith("clawhub:")) return undefined
  return getSourceBySlug(sourceSlug(skill.source))
}

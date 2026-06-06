// Solid State — Skill type definitions
// Replaces lib/types.ts on solidstatecc/solidstate.cc.
//
// Changes from the old version:
//   1. Adds `kind` to distinguish Solid State originals from third-party listings.
//   2. Adds `license` (SPDX identifier) so the directory can refuse to list
//      anything we can't legally surface and can render a license badge.
//   3. Adds `status` so we can ship a skill record before the build is done
//      ("planned" → "alpha" → "stable").
//   4. Removes the `verified: true` boolean facade in favor of a `provenance`
//      enum — verification is meaningful, a checkbox is decorative.
//   5. Stats are now optional. No record may carry a non-zero install count
//      that isn't backed by a real telemetry source.

export type Platform =
  | "claude"
  | "hermes"
  | "openclaw"
  | "nemoclaw"
  | "antigravity"
  | "codex"
  | "cursor"
  | "opencode"
  | "cline"
  | "generic"

/**
 * Display names for platforms — the real agent names, matching lib/agents.ts.
 * "generic" is a skill tag (runs on any spec-compliant runtime), not a runtime.
 */
export const PLATFORM_LABEL: Record<Platform, string> = {
  claude: "Claude Code",
  hermes: "Hermes Agent",
  openclaw: "OpenClaw",
  nemoclaw: "NemoClaw",
  antigravity: "Antigravity",
  codex: "Codex",
  cursor: "Cursor",
  opencode: "OpenCode",
  cline: "Cline",
  generic: "Generic",
}

export type Kind = "original" | "listing"

/** SPDX identifier or "proprietary" / "unknown". Refuse to render "unknown". */
export type License =
  | "MIT"
  | "Apache-2.0"
  | "BSD-3-Clause"
  | "BSD-2-Clause"
  | "GPL-3.0"
  | "AGPL-3.0"
  | "MPL-2.0"
  | "ISC"
  | "MIT-0"
  | "Unlicense"
  | "CC0-1.0"
  | "source-available"
  | "proprietary"
  | "undeclared"
  | "unknown"

export type Status = "planned" | "alpha" | "beta" | "stable" | "deprecated"

/**
 * Provenance replaces the old `verified` boolean. It's a single source of
 * truth for "what do we actually know about this skill?"
 *   - "first-party"  — Solid State authored, repo under our control
 *   - "audited"      — third-party, but we read the code and stand behind it
 *   - "indexed"      — third-party, listed for discovery, no audit
 *   - "mirrored"     — third-party MIT/Apache, hosted by us, attribution intact
 */
export type Provenance = "first-party" | "audited" | "indexed" | "mirrored"

/**
 * Distribution channel = where a buyer can get the skill.
 * Different from Platform = where the skill runs.
 */
export type DistributionChannel = "self" | "clawmart" | "agentic"

export interface ChannelListing {
  channel: DistributionChannel
  url?: string
  /** "free" for self-hosted free skills, number = USD. */
  price: number | "free"
  /** "per-use" for x402, "one-time" for clawmart, "free" for self. */
  unit: "one-time" | "per-use" | "free"
  /** Display label, optional override. */
  label?: string
}

export interface Stats {
  /** Real install count from a telemetry source. Omit if unknown. */
  installs?: number
  /** GitHub stars on the source repo. Omit if unknown. */
  stars?: number
  /** When stats were last refreshed (ISO date). Required if stats are present. */
  fetchedAt?: string
}

export interface Skill {
  id: string
  name: string
  slug: string
  kind: Kind
  description: string
  longDescription: string
  /** Real GitHub login or org. Must match repoUrl owner if repoUrl is set. */
  author: string
  /** SemVer or "0.0.0" if pre-release. */
  version: string
  platforms: Platform[]
  categories: string[]
  installCommand?: string
  repoUrl?: string
  docsUrl?: string
  /** SPDX identifier. Required for any kind="listing". */
  license: License
  status: Status
  provenance: Provenance
  /** Where this skill can be bought / installed. */
  channels?: ChannelListing[]
  /** Legacy single price field. Prefer `channels` for new listings. */
  price?: "free" | number
  featured: boolean
  tags: string[]
  createdAt: string
  /** Optional. If present, must include fetchedAt. */
  stats?: Stats
  /** Origin repo/owner for indexed listings (e.g. "vercel-labs/skills"). */
  source?: string
  /** True for skills indexed from the open skills.sh ecosystem rather than first-party. */
  external?: boolean
  /** Real fact: present on skills.sh's live 24h trending board at capture time. Not a modeled metric. */
  trending?: boolean
}

// ---------------------------------------------------------------------------

export const CHANNEL_LABEL: Record<DistributionChannel, string> = {
  self: "Solid State",
  clawmart: "Claw Mart",
  agentic: "Agentic Market",
}

export const CHANNEL_URL: Record<DistributionChannel, string> = {
  self: "https://solidstate.cc",
  clawmart: "https://www.shopclawmart.com/",
  agentic: "https://agentic.market/",
}

export const LICENSE_LABEL: Record<License, string> = {
  MIT: "MIT",
  "Apache-2.0": "Apache 2.0",
  "BSD-3-Clause": "BSD 3-Clause",
  "BSD-2-Clause": "BSD 2-Clause",
  "GPL-3.0": "GPL 3.0",
  "AGPL-3.0": "AGPL 3.0",
  "MPL-2.0": "MPL 2.0",
  ISC: "ISC",
  "MIT-0": "MIT-0",
  Unlicense: "Unlicense",
  "CC0-1.0": "CC0 1.0",
  "source-available": "Source-available",
  proprietary: "Proprietary",
  undeclared: "License not stated",
  unknown: "License unknown",
}

export const STATUS_LABEL: Record<Status, string> = {
  planned: "Planned",
  alpha: "Alpha",
  beta: "Beta",
  stable: "Stable",
  deprecated: "Deprecated",
}

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  "first-party": "First-party",
  audited: "Audited",
  indexed: "Indexed",
  mirrored: "Mirrored",
}

// =====================
// Glossary (unchanged)
// =====================

export type GlossaryLevel = "beginner" | "intermediate" | "advanced" | "expert"

export interface GlossaryTerm {
  slug: string
  term: string
  short: string
  long?: string
  level: GlossaryLevel
  related?: string[]
  tags?: string[]
  readMinutes?: number
}

export const LEVEL_LABEL: Record<GlossaryLevel, string> = {
  beginner: "Level 1",
  intermediate: "Level 2",
  advanced: "Level 3",
  expert: "Level 4",
}

export const LEVEL_NAME: Record<GlossaryLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
}

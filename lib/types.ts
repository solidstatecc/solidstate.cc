export type Platform = "openclaw" | "hermes" | "antigravity" | "aura" | "generic"

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

export interface Skill {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  author: string
  version: string
  platforms: Platform[]
  categories: string[]
  installCommand: string
  repoUrl?: string
  docsUrl?: string
  /** Legacy single price field. New listings should populate `channels` instead. */
  price: "free" | number
  /** Where this skill can be bought / installed. Optional for backward compat. */
  channels?: ChannelListing[]
  verified: boolean
  featured: boolean
  tags: string[]
  createdAt: string
  stats: { installs: number; stars: number }
}

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

// =====================
// Glossary
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

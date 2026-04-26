/**
 * x402 helpers.
 *
 * x402 = HTTP 402 Payment Required, revived as a per-call payment
 * protocol. Powers Agentic Market. References:
 *   - https://github.com/coinbase/x402
 *   - https://docs.cdp.coinbase.com/x402/welcome
 *
 * Solid State exposes select skills as x402 services on Agentic Market.
 * The server side (skill endpoints, payment middleware) lives in
 * `server/x402/` (not yet checked in). This file is the client-side
 * helper used by the site to render channel CTAs and deep-link into
 * external listings.
 */

import type { ChannelListing, Skill } from "./types"

const AGENTIC_BASE = "https://agentic.market"

export function getAgenticListing(skill: Skill): ChannelListing | undefined {
  return skill.channels?.find((c) => c.channel === "agentic")
}

export function getClawmartListing(skill: Skill): ChannelListing | undefined {
  return skill.channels?.find((c) => c.channel === "clawmart")
}

export function getSelfListing(skill: Skill): ChannelListing | undefined {
  return skill.channels?.find((c) => c.channel === "self")
}

export function agenticUrl(skill: Skill): string {
  const listing = getAgenticListing(skill)
  return listing?.url ?? `${AGENTIC_BASE}/?q=${encodeURIComponent(skill.slug)}`
}

/**
 * Display the lowest-friction price across channels.
 * Free wins, then per-use, then one-time.
 */
export function bestPrice(skill: Skill): {
  display: string
  unit: ChannelListing["unit"] | null
  channel: ChannelListing["channel"] | null
} {
  if (!skill.channels?.length) {
    if (skill.price === "free") return { display: "Free", unit: "free", channel: "self" }
    return { display: `$${skill.price}`, unit: "one-time", channel: null }
  }
  const free = skill.channels.find((c) => c.unit === "free")
  if (free) return { display: "Free", unit: "free", channel: free.channel }
  const perUse = skill.channels.find((c) => c.unit === "per-use")
  if (perUse)
    return {
      display: `$${perUse.price}/use`,
      unit: "per-use",
      channel: perUse.channel,
    }
  const oneTime = skill.channels.find((c) => c.unit === "one-time")
  if (oneTime)
    return {
      display: `$${oneTime.price}`,
      unit: "one-time",
      channel: oneTime.channel,
    }
  return { display: "—", unit: null, channel: null }
}

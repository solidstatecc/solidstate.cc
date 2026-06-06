/**
 * Pricing helpers.
 *
 * Skills price off a single `price` field: "free" / 0 / a USD number,
 * or omitted when unpriced. Paid runs settle via x402 (the Solid State
 * payment rail), but the site itself only needs to render the label.
 */

import type { Skill } from "./types"

/**
 * Plain price label for a skill, with safe fallback for unpriced rows.
 *   undefined → "—"
 *   "free" / 0 → "Free"
 *   number > 0 → "$N"
 */
export function priceDisplay(skill: Skill): string {
  if (skill.price === 0 || skill.price === "free") return "Free"
  if (typeof skill.price === "number" && skill.price > 0) return `$${skill.price}`
  return "—"
}

/** True when the skill has no concrete price. Used to dim/hide labels. */
export function isUnpriced(skill: Skill): boolean {
  return priceDisplay(skill) === "—"
}

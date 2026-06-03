// Solid State — JSON-LD structured data builders.
//
// Emits schema.org SoftwareApplication markup for skill detail pages so
// search engines can surface rich results.
//
// Honesty rules (mirror lib/skills.ts):
//   - No aggregateRating / review block — we have no real ratings.
//   - No install counts — schema has no honest field for them and we won't
//     dress telemetry up as a review signal.
//   - license is only emitted for real SPDX identifiers; undeclared /
//     unknown / proprietary skills get no license URL.
//   - Every value is pulled straight from the catalog record.

import type { Platform, Skill } from "./types"
import { bestPrice } from "./x402"

const SITE_URL = "https://solidstate.cc"

const PLATFORM_OS: Record<Platform, string> = {
  claude: "Claude",
  openclaw: "OpenClaw",
  nemoclaw: "NemoClaw",
  antigravity: "Google Antigravity",
  generic: "Any agent runtime",
}

// SPDX ids we can honestly link to a canonical license page. Everything else
// (undeclared, unknown, proprietary, source-available) is intentionally absent.
const SPDX_LICENSES: ReadonlySet<string> = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "GPL-3.0",
  "AGPL-3.0",
  "MPL-2.0",
  "ISC",
  "MIT-0",
  "Unlicense",
  "CC0-1.0",
])

function licenseUrl(license: Skill["license"]): string | undefined {
  return SPDX_LICENSES.has(license)
    ? `https://spdx.org/licenses/${license}.html`
    : undefined
}

function offers(skill: Skill): Record<string, unknown> | undefined {
  const price = bestPrice(skill)
  if (price.unit === "free") {
    return {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    }
  }
  // per-use and one-time both carry a real USD amount in the catalog.
  if (price.unit === "per-use" || price.unit === "one-time") {
    const numeric = skill.channels?.find((c) => c.unit === price.unit)?.price
    // Legacy single-price skills (no channels) keep the amount on skill.price.
    const fallback = typeof skill.price === "number" ? skill.price : undefined
    const amount = typeof numeric === "number" ? numeric : fallback
    if (typeof amount !== "number") return undefined
    return {
      "@type": "Offer",
      price: String(amount),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(price.unit === "per-use" ? { description: "Per-use pricing via x402" } : {}),
    }
  }
  return undefined
}

/**
 * Build the schema.org SoftwareApplication object for a skill detail page.
 * Returned plainly so the caller can JSON.stringify it into a
 * <script type="application/ld+json"> tag.
 */
export function skillJsonLd(skill: Skill): Record<string, unknown> {
  const license = licenseUrl(skill.license)
  const offer = offers(skill)

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    url: `${SITE_URL}/skills/${skill.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: skill.platforms.map((p) => PLATFORM_OS[p]).join(", "),
    datePublished: skill.createdAt,
    author: {
      "@type": skill.provenance === "first-party" ? "Organization" : "Person",
      name: skill.author,
    },
    // "0.0.0" is the catalog's pre-release sentinel — omit rather than publish it.
    ...(skill.version && skill.version !== "0.0.0"
      ? { softwareVersion: skill.version }
      : {}),
    ...(skill.categories.length ? { applicationSubCategory: skill.categories.join(", ") } : {}),
    ...(skill.tags.length ? { keywords: skill.tags.join(", ") } : {}),
    ...(skill.repoUrl ? { codeRepository: skill.repoUrl } : {}),
    ...(license ? { license } : {}),
    ...(offer ? { offers: offer } : {}),
  }
}

// /pricing.md — machine-readable pricing for AI agents and buyers.
//
// AI agents compare products before a human visits. Pricing locked in
// JS-rendered pages gets skipped; a markdown file gets parsed by anything.
// Built from the same lib data as the site, so it cannot drift.

import { getOriginals } from "@/lib/skills"
import { priceDisplay } from "@/lib/x402"

const BASE = "https://solidstate.cc"

export const dynamic = "force-dynamic"

export function GET() {
  const originals = getOriginals()
  const free = originals.filter((s) => priceDisplay(s) === "Free")
  const paid = originals.filter((s) => /^\$\d/.test(priceDisplay(s)))

  const lines: string[] = []
  lines.push("# Solid State — Pricing", "")
  lines.push(
    "Currency: USD. Every price is one-time. No subscriptions, no seats, no usage meters.",
    "Prices are tax-exclusive; tax is added at checkout where it applies.",
    `Last generated: ${new Date().toISOString().slice(0, 10)}.`,
    ""
  )

  lines.push("## Free skills — $0", "")
  for (const s of free) {
    lines.push(`- ${s.name}: ${s.description} Install free, no account required. ${BASE}/skills/${s.slug}`)
  }
  lines.push("")

  lines.push("## Paid", "")
  for (const s of paid) {
    lines.push(`### ${s.name} — ${priceDisplay(s)} once`, "", s.description, "", `Buy: ${BASE}/skills/${s.slug}`, "")
  }

  lines.push("## Indexed listings", "")
  lines.push(
    "Everything else in the directory is indexed from its upstream source and installs from there. We don't price or resell third-party skills.",
    ""
  )

  lines.push("## Links", "")
  lines.push(`- Catalog: ${BASE}/skills`)
  lines.push(`- Machine index: ${BASE}/llms.txt`)
  lines.push(`- License retrieval after purchase: ${BASE}/account`)
  lines.push("")

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}

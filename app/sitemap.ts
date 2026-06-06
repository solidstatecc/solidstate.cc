// Solid State — sitemap, generated from the same lib data as the site.
// Add a skill, a glossary term, or an agent and this updates on the next build.

import type { MetadataRoute } from "next"
import { skills } from "@/lib/skills"
import { glossary } from "@/lib/glossary"
import { agents } from "@/lib/agents"

const BASE = "https://solidstate.cc"

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = [
    "",
    "/skills",
    "/agents",
    "/glossary",
    "/official",
    "/audits",
    "/manifesto",
    "/submit",
    "/buy",
  ].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }))

  const skillPages: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE}/skills/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: s.kind === "original" ? 0.9 : 0.6,
  }))

  const agentPages: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${BASE}/agents/${a.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const glossaryPages: MetadataRoute.Sitemap = glossary.map((g) => ({
    url: `${BASE}/glossary/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...statics, ...skillPages, ...agentPages, ...glossaryPages]
}

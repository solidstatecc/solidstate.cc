// Solid State — sitemap, generated from the same lib data as the site.
// Add a skill, a glossary term, or an agent and this updates on the next build.

import type { MetadataRoute } from "next"
import { skills } from "@/lib/skills"
import { glossary } from "@/lib/glossary"
import { agents } from "@/lib/agents"
import { sourceGroups } from "@/lib/sources"

const BASE = "https://solidstate.cc"

// Sitemap regenerates on every deploy from the same lib data as the site,
// so the build date is an honest lastModified for all entries.
const BUILT = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = [
    "",
    "/skills",
    "/agents",
    "/models",
    "/glossary",
    "/official",
    "/audits",
    "/manifesto",
    "/submit",
    "/ship-kit",
    "/ship-kit/license",
    "/fable-ready",
    "/ai-seo-kit",
    "/docs",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: BUILT,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }))

  const skillPages: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE}/skills/${s.slug}`,
    lastModified: s.stats?.fetchedAt ? new Date(s.stats.fetchedAt) : BUILT,
    changeFrequency: "weekly" as const,
    priority: s.kind === "original" ? 0.9 : 0.6,
  }))

  const agentPages: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${BASE}/agents/${a.slug}`,
    lastModified: BUILT,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const glossaryPages: MetadataRoute.Sitemap = glossary.map((g) => ({
    url: `${BASE}/glossary/${g.slug}`,
    lastModified: BUILT,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const sourcePages: MetadataRoute.Sitemap = sourceGroups.map((g) => ({
    url: `${BASE}/source/${g.slug}`,
    lastModified: BUILT,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...statics, ...skillPages, ...agentPages, ...glossaryPages, ...sourcePages]
}

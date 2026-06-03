import type { MetadataRoute } from "next"
import { skills } from "@/lib/skills"
import { glossary } from "@/lib/glossary"

const BASE = "https://solidstate.cc"

// Static, indexable routes. Transactional pages (/buy*, /submit) and API
// routes are intentionally excluded — they carry no SEO value and are blocked
// in robots.ts.
const STATIC_PATHS = [
  { path: "/", priority: 1.0 },
  { path: "/skills", priority: 0.9 },
  { path: "/glossary", priority: 0.7 },
  { path: "/official", priority: 0.6 },
  { path: "/audits", priority: 0.5 },
  { path: "/manifesto", priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }))

  const skillEntries: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE}/skills/${s.slug}`,
    lastModified: s.createdAt ? new Date(s.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const glossaryEntries: MetadataRoute.Sitemap = glossary.map((t) => ({
    url: `${BASE}/glossary/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }))

  return [...staticEntries, ...skillEntries, ...glossaryEntries]
}

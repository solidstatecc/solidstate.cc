import type { MetadataRoute } from "next"

// AI search engines crawl with their own bots. Blocking them means they
// can't cite us; we want citation. Explicit allow groups make the policy
// legible and guard against a future blanket disallow.
const AI_SEARCH_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_SEARCH_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: "https://solidstate.cc/sitemap.xml",
  }
}

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional and machine-only routes carry no SEO value.
      disallow: ["/api/", "/buy/"],
    },
    sitemap: "https://solidstate.cc/sitemap.xml",
    host: "https://solidstate.cc",
  }
}

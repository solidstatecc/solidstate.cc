import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    // /buy retired 2026-06-10 — its SKUs predate the Ship Kit pivot and have
    // no active Stripe products. Exact path only: /buy/success and /buy/cancel
    // stay reachable for old receipt links.
    return [
      {
        source: "/buy",
        destination: "/ship-kit",
        permanent: true,
      },
    ]
  },
}

export default nextConfig

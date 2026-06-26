import type { MetadataRoute } from "next";

// Place at: app/manifest.ts
// Auto-emits <link rel="manifest" href="/manifest.webmanifest"> and fixes the 404.
// Requires /icon-192.png and /icon-512.png in public/.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solid State",
    short_name: "Solid State",
    description: "The skills marketplace for AI agents.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

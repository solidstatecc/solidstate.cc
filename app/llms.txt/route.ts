import { buildLlmsIndex } from "@/lib/llms"

// Built from lib data, assembled per request. Was weekly ISR, but Vercel's
// ISR cache persists across deploys — content changes sat stale up to 7 days
// after shipping. Pure in-memory string build, so per-request costs nothing.
export const dynamic = "force-dynamic"

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}

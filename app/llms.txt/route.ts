import { buildLlmsIndex } from "@/lib/llms"

// Built from lib data. Regenerates on every deploy, and Vercel revalidates
// it on a weekly cycle (ISR) so it auto-refreshes even between deploys.
export const revalidate = 604800 // 7 days

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}

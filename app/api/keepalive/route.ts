import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Supabase keep-alive. Hit daily by a Vercel Cron (see vercel.json) so the
// free-tier project never crosses the 7-day inactivity auto-pause threshold.
// The request reaching Postgres is what counts as activity — the row count is
// incidental. Runs on Vercel's always-on infra, so it does not depend on any
// desktop app being open or any MCP connector being connected.

export const dynamic = "force-dynamic" // never cache; must execute every hit
export const runtime = "nodejs"

export async function GET(request: Request) {
  // If CRON_SECRET is set in Vercel env, require it (Vercel cron sends it as
  // a Bearer token). If unset, stay open — the endpoint only reads a count.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
    }
  }

  const ts = new Date().toISOString()
  try {
    // head:true → no rows returned, just touches the DB for the count.
    const { count, error } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })

    // Even if RLS denies the read, the request still reached the project,
    // which is all the keep-alive needs. Report it but return 200.
    return NextResponse.json({
      ok: true,
      pinged: true,
      ts,
      count: count ?? null,
      dbError: error?.message ?? null,
    })
  } catch (e) {
    return NextResponse.json({
      ok: true,
      pinged: true,
      ts,
      count: null,
      dbError: e instanceof Error ? e.message : String(e),
    })
  }
}

// Agent Skills Discovery endpoint — /.well-known/skills/*
//
// Spec: github.com/cloudflare/agent-skills-discovery-rfc
// Serves:
//   GET /.well-known/skills/index.json      → discovery index
//   GET /.well-known/skills/{name}/SKILL.md → skill instructions
//
// Verified consumer: Hermes Agent —
//   hermes skills search https://solidstate.cc --source well-known
//   hermes skills install well-known:https://solidstate.cc/.well-known/skills/{name}
// The per-skill URL also works with plain `url`-source installers:
//   hermes skills install https://solidstate.cc/.well-known/skills/{name}/SKILL.md
//
// Content is proxied from the canonical solidstatecc GitHub repos with a
// 1-hour cache, so the repo remains the single source of truth.

import { NextResponse } from "next/server"
import {
  wellKnownSkills,
  getWellKnownSkill,
  extractDescription,
} from "@/lib/wellKnownSkills"

// force-dynamic: the ISR'd index.json froze on Vercel (cache survives deploys)
// while this same handler's dynamic per-skill path stayed fresh. Assemble per
// request; the upstream GitHub fetches below keep their own 1h data cache.
export const dynamic = "force-dynamic"

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=3600",
}

async function fetchSkillMd(rawUrl: string): Promise<string | null> {
  try {
    const res = await fetch(rawUrl, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params

  // GET /.well-known/skills/index.json
  if (path.length === 1 && path[0] === "index.json") {
    const entries = await Promise.all(
      wellKnownSkills.map(async (s) => {
        const md = await fetchSkillMd(s.rawUrl)
        if (!md) return null
        return {
          name: s.name,
          description: extractDescription(md),
          files: ["SKILL.md"],
        }
      })
    )
    const skills = entries.filter(
      (e): e is NonNullable<typeof e> => e !== null && e.description.length > 0
    )
    return NextResponse.json({ skills }, { headers: CORS_HEADERS })
  }

  // GET /.well-known/skills/{name}/SKILL.md
  if (path.length === 2 && path[1] === "SKILL.md") {
    const skill = getWellKnownSkill(path[0])
    if (!skill) {
      return NextResponse.json(
        { error: "skill not found" },
        { status: 404, headers: CORS_HEADERS }
      )
    }
    const md = await fetchSkillMd(skill.rawUrl)
    if (!md) {
      return NextResponse.json(
        { error: "upstream unavailable" },
        { status: 502, headers: CORS_HEADERS }
      )
    }
    return new NextResponse(md, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Canonical-Source": skill.rawUrl,
      },
    })
  }

  return NextResponse.json(
    { error: "not found", index: "/.well-known/skills/index.json" },
    { status: 404, headers: CORS_HEADERS }
  )
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

import { NextResponse } from "next/server"
import { unzipSync, zipSync } from "fflate"
import { getGrokBundle } from "@/lib/grokBundles"

// Flat .skill bundle for the Grok app importer. Pulls the canonical repo zipball
// at request time (no GitHub API, no rate limit, never stale), flattens so
// SKILL.md sits at the bundle root, re-zips. Mirrors the .well-known/skills
// pattern: the repo stays the single source of truth.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params
  const bundle = getGrokBundle(slug)
  if (!bundle) {
    return NextResponse.json({ error: "no grok bundle for this skill" }, { status: 404 })
  }

  const zipUrl = `https://codeload.github.com/${bundle.owner}/${bundle.repo}/zip/refs/heads/${bundle.ref}`
  const res = await fetch(zipUrl, { next: { revalidate: 3600 } })
  if (!res.ok) {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 })
  }

  let entries: Record<string, Uint8Array>
  try {
    entries = unzipSync(new Uint8Array(await res.arrayBuffer()))
  } catch {
    return NextResponse.json({ error: "bad upstream archive" }, { status: 502 })
  }

  // GitHub zipball wraps everything in `${repo}-${ref}/`. Keep only the skill dir; flatten.
  const prefix = `${bundle.repo}-${bundle.ref}/` + (bundle.dir ? bundle.dir.replace(/\/?$/, "/") : "")
  const flat: Record<string, Uint8Array> = {}
  for (const [path, data] of Object.entries(entries)) {
    if (!path.startsWith(prefix)) continue
    const rel = path.slice(prefix.length)
    if (rel && !rel.endsWith("/")) flat[rel] = data
  }
  if (!flat["SKILL.md"]) {
    return NextResponse.json({ error: "SKILL.md not at bundle root - check dir" }, { status: 500 })
  }

  const archive = zipSync(flat, { level: 6 })
  return new NextResponse(Buffer.from(archive), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.skill"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}

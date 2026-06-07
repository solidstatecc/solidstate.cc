// Build /.well-known/agent-skills/ and /.well-known/skills/ from skills-public/.
//
// Two formats, two paths:
//   /.well-known/agent-skills/  — Discovery spec v0.2.0 ($schema, type, url, digest)
//                                 per cloudflare/agent-skills-discovery-rfc.
//   /.well-known/skills/        — legacy v0.1.0 (files array, no digest).
//                                 This is the path Hermes Agent and other
//                                 v0.1 clients actually read (same format
//                                 Mintlify serves live).
//
// Source of truth: skills-public/<name>/SKILL.md (one dir per published,
// freely-redistributable skill). Paid SKUs do NOT go here — the endpoint
// serves full artifacts.
//
// Run: node scripts/build-wellknown.mjs
// Output: public/.well-known/agent-skills/ and public/.well-known/skills/

import { createHash } from "node:crypto"
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync, statSync } from "node:fs"
import path from "node:path"

const ROOT = path.join(import.meta.dirname, "..")
const SRC = path.join(ROOT, "skills-public")
const OUT_NEW = path.join(ROOT, "public", ".well-known", "agent-skills")
const OUT_LEGACY = path.join(ROOT, "public", ".well-known", "skills")
const SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json"

const NAME_RE = /^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$/

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const out = {}
  let key = null
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/)
    if (kv) {
      key = kv[1]
      out[key] = kv[2].replace(/^['">|]+\s*/, "").trim()
    } else if (key && /^\s+\S/.test(line)) {
      out[key] = (out[key] + " " + line.trim()).trim()
    }
  }
  return out
}

const skills = []
for (const entry of readdirSync(SRC)) {
  const dir = path.join(SRC, entry)
  if (!statSync(dir).isDirectory()) continue
  const skillPath = path.join(dir, "SKILL.md")
  if (!existsSync(skillPath)) {
    console.warn(`skip ${entry}: no SKILL.md`)
    continue
  }
  const raw = readFileSync(skillPath)
  const fm = frontmatter(raw.toString("utf8"))
  const name = fm.name || entry
  if (!NAME_RE.test(name)) throw new Error(`invalid skill name: ${name}`)
  if (!fm.description) throw new Error(`${name}: missing description in frontmatter`)
  // Single-file skills only for now. Add archive support when a skill ships
  // with scripts/ or references/.
  const extras = readdirSync(dir).filter((f) => f !== "SKILL.md")
  if (extras.length > 0) throw new Error(`${name}: has extra files — archive distribution not implemented`)
  skills.push({
    name,
    type: "skill-md",
    description: fm.description.slice(0, 1024),
    url: `/.well-known/agent-skills/${name}/SKILL.md`,
    digest: "sha256:" + createHash("sha256").update(raw).digest("hex"),
    _raw: raw,
  })
}

skills.sort((a, b) => a.name.localeCompare(b.name))

const indexV2 = {
  $schema: SCHEMA,
  skills: skills.map(({ _raw, ...s }) => s),
}

const indexV1 = {
  skills: skills.map((s) => ({
    name: s.name,
    description: s.description,
    files: ["SKILL.md"],
  })),
}

for (const [out, index] of [
  [OUT_NEW, indexV2],
  [OUT_LEGACY, indexV1],
]) {
  try {
    rmSync(out, { recursive: true, force: true })
  } catch {
    // some mounts refuse unlink; we overwrite in place instead
  }
  mkdirSync(out, { recursive: true })
  writeFileSync(path.join(out, "index.json"), JSON.stringify(index, null, 2) + "\n")
  for (const s of skills) {
    const d = path.join(out, s.name)
    mkdirSync(d, { recursive: true })
    writeFileSync(path.join(d, "SKILL.md"), s._raw)
  }
}

console.log(`wellknown: ${skills.length} skill(s) → .well-known/agent-skills + legacy mirror`)
for (const s of skills) console.log(`  ${s.name}  ${s.digest.slice(0, 20)}…`)

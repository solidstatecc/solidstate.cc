// Unit tests for lib/skills.ts — catalog parsing, count derivation, schema integrity.
// Run with: npm test  (node --test, native TS type-stripping, zero deps)

import { test } from "node:test"
import assert from "node:assert/strict"

import {
  skills,
  getSkillBySlug,
  getFeaturedSkills,
  getOriginals,
  getListings,
  getPublishableListings,
  canMirrorOrSell,
  HOSTING_BLOCKED_LICENSES,
  CATEGORIES,
  PLATFORMS,
  STATS,
} from "../lib/skills.ts"
import {
  LICENSE_LABEL,
  STATUS_LABEL,
  PROVENANCE_LABEL,
} from "../lib/types.ts"
import { skillsSh } from "../lib/skillsSh.ts"

const VALID_LICENSES = new Set(Object.keys(LICENSE_LABEL))
const VALID_STATUSES = new Set(Object.keys(STATUS_LABEL))
const VALID_PROVENANCE = new Set(Object.keys(PROVENANCE_LABEL))
const VALID_PLATFORMS = new Set(PLATFORMS)
const VALID_KINDS = new Set(["original", "listing"])
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

// ---------------------------------------------------------------------------
// Catalog parsing — the combined catalog loads and every record is well-formed.
// ---------------------------------------------------------------------------

test("catalog loads as a non-empty array", () => {
  assert.ok(Array.isArray(skills))
  assert.ok(skills.length > 0)
})

test("every skill has the required non-empty string fields", () => {
  const required = ["id", "name", "slug", "description", "author", "version", "createdAt"]
  for (const s of skills) {
    for (const field of required) {
      assert.equal(typeof s[field], "string", `${s.slug ?? s.id}: ${field} must be a string`)
      assert.ok(s[field].length > 0, `${s.slug ?? s.id}: ${field} must be non-empty`)
    }
  }
})

test("slugs are unique across the whole catalog", () => {
  const seen = new Map()
  for (const s of skills) {
    assert.equal(seen.has(s.slug), false, `duplicate slug: ${s.slug} (ids ${seen.get(s.slug)} & ${s.id})`)
    seen.set(s.slug, s.id)
  }
})

test("ids are unique across the whole catalog", () => {
  const ids = new Set(skills.map((s) => s.id))
  assert.equal(ids.size, skills.length)
})

test("platforms and categories are non-empty arrays", () => {
  for (const s of skills) {
    assert.ok(Array.isArray(s.platforms) && s.platforms.length > 0, `${s.slug}: platforms`)
    assert.ok(Array.isArray(s.categories) && s.categories.length > 0, `${s.slug}: categories`)
    assert.ok(Array.isArray(s.tags), `${s.slug}: tags`)
  }
})

test("createdAt parses as a real ISO date", () => {
  for (const s of skills) {
    assert.match(s.createdAt, ISO_DATE, `${s.slug}: createdAt shape`)
    assert.equal(Number.isNaN(Date.parse(s.createdAt)), false, `${s.slug}: createdAt parses`)
  }
})

// ---------------------------------------------------------------------------
// Count derivation — STATS and the getter functions are internally consistent.
// ---------------------------------------------------------------------------

test("STATS.totalSkills equals the catalog length", () => {
  assert.equal(STATS.totalSkills, skills.length)
})

test("originals + listings partition the catalog exactly", () => {
  assert.equal(STATS.originals, getOriginals().length)
  assert.equal(STATS.listings, getListings().length)
  assert.equal(STATS.originals + STATS.listings, skills.length)
})

test("STATS.totalPlatforms equals PLATFORMS length", () => {
  assert.equal(STATS.totalPlatforms, PLATFORMS.length)
})

test("indexedInstalls is the real sum of skills.sh installs only", () => {
  const expected = skillsSh.reduce((sum, s) => sum + (s.stats?.installs ?? 0), 0)
  assert.equal(STATS.indexedInstalls, expected)
  assert.ok(STATS.indexedInstalls >= 0)
})

test("CATEGORIES is the deduped, sorted union of all skill categories", () => {
  const expected = Array.from(new Set(skills.flatMap((s) => s.categories))).sort()
  assert.deepEqual(CATEGORIES, expected)
  // sorted + unique invariants
  assert.equal(new Set(CATEGORIES).size, CATEGORIES.length)
  assert.deepEqual([...CATEGORIES].sort(), CATEGORIES)
})

test("getSkillBySlug round-trips every catalog entry and misses cleanly", () => {
  for (const s of skills) {
    assert.equal(getSkillBySlug(s.slug), s)
  }
  assert.equal(getSkillBySlug("does-not-exist-xyz"), undefined)
})

test("getFeaturedSkills returns exactly the featured records", () => {
  const featured = getFeaturedSkills()
  assert.equal(featured.length, skills.filter((s) => s.featured).length)
  assert.ok(featured.every((s) => s.featured === true))
})

// ---------------------------------------------------------------------------
// Schema integrity — kind / license / provenance, and no fabricated installs.
// ---------------------------------------------------------------------------

test("every kind is a valid Kind", () => {
  for (const s of skills) {
    assert.ok(VALID_KINDS.has(s.kind), `${s.slug}: bad kind ${s.kind}`)
  }
})

test("every license is a known SPDX/marker value", () => {
  for (const s of skills) {
    assert.ok(VALID_LICENSES.has(s.license), `${s.slug}: bad license ${s.license}`)
  }
})

test("every status is a valid Status", () => {
  for (const s of skills) {
    assert.ok(VALID_STATUSES.has(s.status), `${s.slug}: bad status ${s.status}`)
  }
})

test("every provenance is a valid Provenance", () => {
  for (const s of skills) {
    assert.ok(VALID_PROVENANCE.has(s.provenance), `${s.slug}: bad provenance ${s.provenance}`)
  }
})

test("every platform value is a known Platform", () => {
  for (const s of skills) {
    for (const p of s.platforms) {
      assert.ok(VALID_PLATFORMS.has(p), `${s.slug}: bad platform ${p}`)
    }
  }
})

test("originals are first-party, listings are not", () => {
  for (const s of skills) {
    if (s.kind === "original") {
      assert.equal(s.provenance, "first-party", `${s.slug}: original must be first-party`)
    } else {
      assert.notEqual(s.provenance, "first-party", `${s.slug}: listing must not claim first-party`)
    }
  }
})

test("no fabricated installs — any install count is backed by a fetchedAt date", () => {
  for (const s of skills) {
    if (!s.stats) continue
    const { installs, stars, fetchedAt } = s.stats
    if (installs !== undefined) {
      assert.equal(typeof installs, "number", `${s.slug}: installs type`)
      assert.ok(Number.isInteger(installs) && installs >= 0, `${s.slug}: installs must be a non-negative integer`)
    }
    if (stars !== undefined) {
      assert.ok(Number.isInteger(stars) && stars >= 0, `${s.slug}: stars must be a non-negative integer`)
    }
    // A non-zero count must carry the telemetry timestamp that backs it.
    if ((installs ?? 0) > 0 || (stars ?? 0) > 0) {
      assert.ok(fetchedAt, `${s.slug}: stats present without fetchedAt (fabricated?)`)
      assert.match(fetchedAt, ISO_DATE, `${s.slug}: fetchedAt shape`)
      assert.equal(Number.isNaN(Date.parse(fetchedAt)), false, `${s.slug}: fetchedAt parses`)
    }
  }
})

test("first-party originals do not assert install telemetry they can't measure", () => {
  for (const s of getOriginals()) {
    assert.ok(
      (s.stats?.installs ?? 0) === 0,
      `${s.slug}: first-party original must not carry an install count`,
    )
  }
})

// ---------------------------------------------------------------------------
// Hosting / mirroring guard.
// ---------------------------------------------------------------------------

test("canMirrorOrSell rejects exactly the hosting-blocked licenses", () => {
  for (const s of skills) {
    const blocked = HOSTING_BLOCKED_LICENSES.includes(s.license)
    assert.equal(canMirrorOrSell(s), !blocked, `${s.slug}: guard mismatch for ${s.license}`)
  }
})

test("getPublishableListings is listings minus hosting-blocked licenses", () => {
  const publishable = getPublishableListings()
  const expected = getListings().filter((s) => !HOSTING_BLOCKED_LICENSES.includes(s.license))
  assert.equal(publishable.length, expected.length)
  assert.ok(publishable.every((s) => s.kind === "listing"))
  assert.ok(publishable.every((s) => !HOSTING_BLOCKED_LICENSES.includes(s.license)))
})

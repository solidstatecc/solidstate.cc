// Unit tests for lib/clawhub.ts — ClawHub indexed listings catalog parsing & schema.
// Run with: npm test

import { test } from "node:test"
import assert from "node:assert/strict"

import { clawhubListings } from "../lib/clawhub.ts"
import { LICENSE_LABEL, PROVENANCE_LABEL } from "../lib/types.ts"

const VALID_LICENSES = new Set(Object.keys(LICENSE_LABEL))
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

test("clawhubListings loads as a non-empty array", () => {
  assert.ok(Array.isArray(clawhubListings))
  assert.ok(clawhubListings.length > 0)
})

test("every ClawHub entry is a third-party indexed listing", () => {
  for (const s of clawhubListings) {
    assert.equal(s.kind, "listing", `${s.slug}: must be a listing`)
    assert.equal(s.provenance, "indexed", `${s.slug}: ClawHub entries are indexed, not audited/first-party`)
    assert.equal(s.external, true, `${s.slug}: must be flagged external`)
    assert.ok(s.provenance in PROVENANCE_LABEL)
  }
})

test("every ClawHub entry declares a known license", () => {
  for (const s of clawhubListings) {
    assert.ok(VALID_LICENSES.has(s.license), `${s.slug}: bad license ${s.license}`)
  }
})

test("source attribution points back to ClawHub", () => {
  for (const s of clawhubListings) {
    assert.equal(typeof s.source, "string", `${s.slug}: source required`)
    assert.ok(s.source.startsWith("clawhub:"), `${s.slug}: source must be clawhub:<owner>/<name>, got ${s.source}`)
    assert.match(s.slug, /^clawhub-/, `${s.slug}: slug should be clawhub-namespaced`)
  }
})

test("install/star telemetry is real and timestamped — no fabricated counts", () => {
  for (const s of clawhubListings) {
    if (!s.stats) continue
    const { installs, stars, fetchedAt } = s.stats
    if (installs !== undefined) {
      assert.ok(Number.isInteger(installs) && installs >= 0, `${s.slug}: installs must be a non-negative integer`)
    }
    if (stars !== undefined) {
      assert.ok(Number.isInteger(stars) && stars >= 0, `${s.slug}: stars must be a non-negative integer`)
    }
    if ((installs ?? 0) > 0 || (stars ?? 0) > 0) {
      assert.ok(fetchedAt, `${s.slug}: telemetry present without fetchedAt`)
      assert.match(fetchedAt, ISO_DATE, `${s.slug}: fetchedAt shape`)
      assert.equal(Number.isNaN(Date.parse(fetchedAt)), false, `${s.slug}: fetchedAt parses`)
    }
  }
})

test("ClawHub entries never claim Solid State authorship", () => {
  for (const s of clawhubListings) {
    const author = s.author.toLowerCase()
    assert.notEqual(author, "solidstate", `${s.slug}: third-party listing must not be attributed to solidstate`)
    assert.notEqual(author, "visionairelabs", `${s.slug}: third-party listing must not be attributed to visionairelabs`)
    assert.ok(s.author.length > 0, `${s.slug}: author required`)
  }
})

test("slugs are unique within the ClawHub set", () => {
  const slugs = new Set(clawhubListings.map((s) => s.slug))
  assert.equal(slugs.size, clawhubListings.length)
})

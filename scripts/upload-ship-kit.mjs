/**
 * Upload the Ship Kit zip to Supabase Storage (private bucket "products").
 *
 * Run once per release, from the repo root on Thor's Mac:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-ship-kit.mjs /path/to/ship-kit-v1.0.0.zip
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL from .env.local automatically; the service
 * role key must come from the environment (never commit it, never put it in
 * .env.local on a machine you don't trust).
 *
 * Idempotent: creates the bucket if missing, upserts the object.
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync, existsSync } from "node:fs"
import { resolve, basename } from "node:path"

const BUCKET = "products"
const OBJECT_PATH = "ship-kit/ship-kit-v1.0.0.zip"

// --- env ---------------------------------------------------------------
function readEnvLocal(key) {
  try {
    const env = readFileSync(resolve(".env.local"), "utf8")
    const line = env.split("\n").find((l) => l.startsWith(`${key}=`))
    return line?.slice(key.length + 1).trim()
  } catch {
    return undefined
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? readEnvLocal("NEXT_PUBLIC_SUPABASE_URL")
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL not found (env or .env.local)")
  process.exit(1)
}
if (!serviceKey) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY not set. Get it from Supabase → Settings → API.")
  process.exit(1)
}

// --- zip ---------------------------------------------------------------
const zipArg = process.argv[2]
if (!zipArg || !existsSync(zipArg)) {
  console.error("✗ Pass the zip path: node scripts/upload-ship-kit.mjs /path/to/ship-kit-v1.0.0.zip")
  process.exit(1)
}
const zip = readFileSync(zipArg)
console.log(`→ ${basename(zipArg)} (${(zip.length / 1024).toFixed(0)} KB)`)

// --- upload ------------------------------------------------------------
const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

const { data: buckets } = await admin.storage.listBuckets()
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await admin.storage.createBucket(BUCKET, { public: false })
  if (error) {
    console.error(`✗ Could not create bucket "${BUCKET}": ${error.message}`)
    process.exit(1)
  }
  console.log(`→ created private bucket "${BUCKET}"`)
}

const { error: upErr } = await admin.storage.from(BUCKET).upload(OBJECT_PATH, zip, {
  contentType: "application/zip",
  upsert: true,
})
if (upErr) {
  console.error(`✗ Upload failed: ${upErr.message}`)
  process.exit(1)
}

// verify with a short signed URL
const { data: signed, error: signErr } = await admin.storage
  .from(BUCKET)
  .createSignedUrl(OBJECT_PATH, 60)
if (signErr || !signed?.signedUrl) {
  console.error(`✗ Uploaded but could not sign URL: ${signErr?.message}`)
  process.exit(1)
}

console.log(`✓ Uploaded to ${BUCKET}/${OBJECT_PATH}`)
console.log(`✓ Signed-URL check OK (60s test link):\n  ${signed.signedUrl}`)
console.log("\nDelivery is live once Vercel has SUPABASE_SERVICE_ROLE_KEY set.")

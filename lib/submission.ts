import { CATEGORIES, PLATFORMS } from "@/lib/skills"

// Single source of truth for submission validation — imported by both the
// client form (app/submit/SubmitForm.tsx) and the server route
// (app/api/submit/route.ts) so the rules can never drift apart. Messages are
// written in the Solid State voice: terse, direct, no apology.

export type SubmissionInput = {
  submitter_name?: string
  submitter_email?: string
  skill_name?: string
  short_description?: string
  long_description?: string
  version?: string
  category?: string
  install_command?: string
  platforms?: string[]
  repo_url?: string | null
  docs_url?: string | null
  pricing_model?: string
  price_usd?: number | null
  tags?: string[]
}

export type FieldErrors = Partial<Record<keyof SubmissionInput, string>>

export const PRICING_MODELS = ["free", "paid"] as const

// Field length ceilings. short_description matches the DB check (<= 120).
export const LIMITS = {
  submitter_name: 80,
  skill_name: 80,
  short_description: 120,
  long_description: 4000,
  long_description_min: 30,
  install_command: 200,
  version: 32,
  max_tags: 12,
  tag_length: 40,
} as const

// Pragmatic email shape check — not RFC-perfect, just "has a local part, an @,
// a domain, and a dot". The real proof is the confirmation email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Loose semver: 1, 1.0, or 1.0.0 with optional pre-release/build suffix.
const VERSION_RE = /^v?\d+(\.\d+){0,2}([-+][0-9a-z.-]+)?$/i

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")

/**
 * Validate a raw submission. Returns field-keyed errors; an empty object means
 * the submission is clean. Used on the client for inline feedback and on the
 * server as the authoritative gate.
 */
export function validateSubmission(input: SubmissionInput): FieldErrors {
  const errors: FieldErrors = {}

  const name = str(input.submitter_name)
  if (!name) errors.submitter_name = "Tell us who's submitting."
  else if (name.length > LIMITS.submitter_name)
    errors.submitter_name = `Keep your name under ${LIMITS.submitter_name} characters.`

  const email = str(input.submitter_email)
  if (!email) errors.submitter_email = "We need an email to reach you."
  else if (!EMAIL_RE.test(email)) errors.submitter_email = "That email doesn't look right."

  const skillName = str(input.skill_name)
  if (!skillName) errors.skill_name = "Your skill needs a name."
  else if (skillName.length > LIMITS.skill_name)
    errors.skill_name = `Skill names top out at ${LIMITS.skill_name} characters.`

  const shortDesc = str(input.short_description)
  if (!shortDesc) errors.short_description = "One line on what it does."
  else if (shortDesc.length > LIMITS.short_description)
    errors.short_description = `Short description maxes out at ${LIMITS.short_description} characters.`

  const longDesc = str(input.long_description)
  if (!longDesc) errors.long_description = "Tell us what it actually does."
  else if (longDesc.length < LIMITS.long_description_min)
    errors.long_description = `Go deeper — at least ${LIMITS.long_description_min} characters.`
  else if (longDesc.length > LIMITS.long_description)
    errors.long_description = `That's a lot. Trim it under ${LIMITS.long_description} characters.`

  const version = str(input.version)
  if (!version) errors.version = "Ship it with a version."
  else if (version.length > LIMITS.version || !VERSION_RE.test(version))
    errors.version = "Use a version like 1.0.0."

  const category = str(input.category)
  const allowedCategories = [...CATEGORIES, "Other"]
  if (!category) errors.category = "Pick a category."
  else if (!allowedCategories.includes(category))
    errors.category = "Pick a category from the list."

  const installCommand = str(input.install_command)
  if (!installCommand) errors.install_command = "How do people install it?"
  else if (installCommand.length > LIMITS.install_command)
    errors.install_command = `Install command is too long (max ${LIMITS.install_command}).`

  const platforms = Array.isArray(input.platforms) ? input.platforms : []
  if (platforms.length === 0) errors.platforms = "Pick at least one platform you've tested on."
  else if (!platforms.every((p) => (PLATFORMS as readonly string[]).includes(p)))
    errors.platforms = "Unknown platform in the list."

  const repoUrl = str(input.repo_url)
  if (repoUrl && !isHttpUrl(repoUrl)) errors.repo_url = "Repository URL must start with http(s)://."

  const docsUrl = str(input.docs_url)
  if (docsUrl && !isHttpUrl(docsUrl)) errors.docs_url = "Docs URL must start with http(s)://."

  const pricingModel = str(input.pricing_model) || "free"
  if (!(PRICING_MODELS as readonly string[]).includes(pricingModel))
    errors.pricing_model = "Pricing is free or paid."

  const price = input.price_usd
  if (pricingModel === "paid") {
    if (price == null || Number.isNaN(price))
      errors.price_usd = "Paid skills need a price."
    else if (!Number.isFinite(price) || price < 1 || price > 999)
      errors.price_usd = "Price has to be between $1 and $999."
  } else if (price != null && !Number.isNaN(price)) {
    errors.price_usd = "Free skills can't carry a price."
  }

  const tags = Array.isArray(input.tags) ? input.tags : []
  if (tags.length > LIMITS.max_tags)
    errors.tags = `Keep it to ${LIMITS.max_tags} tags or fewer.`
  else if (tags.some((t) => typeof t !== "string" || t.length > LIMITS.tag_length))
    errors.tags = `Each tag stays under ${LIMITS.tag_length} characters.`

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}

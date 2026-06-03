import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import {
  validateSubmission,
  hasErrors,
  type SubmissionInput,
} from "@/lib/submission"

// Submission intake: validate, insert into Supabase, then email a notification.
// Insert is the source of truth — if the email fails, the submission is
// still saved and we return success. Email needs RESEND_API_KEY (Vercel env).

const NOTIFY_TO = process.env.SUBMISSION_NOTIFY_TO || "hello@vhq.co"
const NOTIFY_FROM = process.env.SUBMISSION_NOTIFY_FROM || "Solid State <onboarding@resend.dev>"

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")

export async function POST(req: Request) {
  let body: SubmissionInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "We couldn't read that submission." }, { status: 400 })
  }

  // Authoritative validation — the client runs the same rules for fast
  // feedback, but the server never trusts that it did.
  const errors = validateSubmission(body)
  if (hasErrors(errors)) {
    const first = Object.values(errors)[0]
    return NextResponse.json({ error: first, errors }, { status: 400 })
  }

  const pricingModel = str(body.pricing_model) || "free"
  const row = {
    submitter_name: str(body.submitter_name),
    submitter_email: str(body.submitter_email),
    skill_name: str(body.skill_name),
    short_description: str(body.short_description),
    long_description: str(body.long_description),
    version: str(body.version),
    category: str(body.category),
    install_command: str(body.install_command),
    platforms: body.platforms,
    repo_url: str(body.repo_url) || null,
    docs_url: str(body.docs_url) || null,
    pricing_model: pricingModel,
    price_usd: pricingModel === "paid" ? (body.price_usd ?? null) : null,
    tags: Array.isArray(body.tags) ? body.tags : [],
  }

  const { error } = await supabase.from("submissions").insert(row)
  if (error) {
    console.error("submission insert failed:", error)
    // Don't leak DB internals to the client — log them, return brand voice.
    return NextResponse.json(
      { error: "Something broke on our end saving that. Try again in a moment." },
      { status: 500 }
    )
  }

  // Fire-and-forget notification. Never blocks or fails the submission.
  await notify(row).catch((e) => console.error("submission notify failed:", e))

  return NextResponse.json({ ok: true })
}

async function notify(row: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("RESEND_API_KEY not set — skipping submission email")
    return
  }

  const line = (k: string, v: unknown) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#888;font-family:monospace;font-size:12px;vertical-align:top">${k}</td><td style="padding:4px 0;font-family:monospace;font-size:12px">${escapeHtml(String(v ?? "—"))}</td></tr>`

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px">
      <h2 style="font-family:monospace">New skill submission</h2>
      <table style="border-collapse:collapse">
        ${line("Skill", row.skill_name)}
        ${line("From", `${row.submitter_name} <${row.submitter_email}>`)}
        ${line("Category", row.category)}
        ${line("Platforms", (row.platforms as string[]).join(", "))}
        ${line("Pricing", `${row.pricing_model}${row.price_usd ? ` ($${row.price_usd})` : ""}`)}
        ${line("Install", row.install_command)}
        ${line("Repo", row.repo_url)}
        ${line("Docs", row.docs_url)}
        ${line("Tags", (row.tags as string[]).join(", "))}
        ${line("Short", row.short_description)}
      </table>
      <p style="font-family:monospace;font-size:12px;color:#888">${escapeHtml(String(row.long_description ?? ""))}</p>
      <p style="font-family:monospace;font-size:12px">Review in Supabase → Table editor → submissions (status: pending).</p>
    </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: row.submitter_email,
      subject: `New skill submission: ${row.skill_name}`,
      html,
    }),
  })
  if (!res.ok) {
    console.error("resend error:", res.status, await res.text())
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

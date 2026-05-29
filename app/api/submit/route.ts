import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Submission intake: insert into Supabase, then email a notification.
// Insert is the source of truth — if the email fails, the submission is
// still saved and we return success. Email needs RESEND_API_KEY (Vercel env).

const NOTIFY_TO = process.env.SUBMISSION_NOTIFY_TO || "hello@vhq.co"
const NOTIFY_FROM = process.env.SUBMISSION_NOTIFY_FROM || "Solid State <onboarding@resend.dev>"

type SubmissionInput = {
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

const required: (keyof SubmissionInput)[] = [
  "submitter_name", "submitter_email", "skill_name",
  "short_description", "long_description", "version",
  "category", "install_command",
]

export async function POST(req: Request) {
  let body: SubmissionInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  for (const f of required) {
    if (!body[f] || String(body[f]).trim() === "") {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 })
    }
  }
  if (!Array.isArray(body.platforms) || body.platforms.length === 0) {
    return NextResponse.json({ error: "Pick at least one compatible platform." }, { status: 400 })
  }

  const row = {
    submitter_name: body.submitter_name,
    submitter_email: body.submitter_email,
    skill_name: body.skill_name,
    short_description: body.short_description,
    long_description: body.long_description,
    version: body.version,
    category: body.category,
    install_command: body.install_command,
    platforms: body.platforms,
    repo_url: body.repo_url || null,
    docs_url: body.docs_url || null,
    pricing_model: body.pricing_model || "free",
    price_usd: body.price_usd ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
  }

  const { error } = await supabase.from("submissions").insert(row)
  if (error) {
    console.error("submission insert failed:", error)
    return NextResponse.json({ error: error.message || "Could not save submission." }, { status: 500 })
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

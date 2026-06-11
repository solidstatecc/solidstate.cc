/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe events (checkout.session.completed, etc.).
 * Verifies signature with STRIPE_WEBHOOK_SECRET.
 * Records the sale in Supabase (table: sales).
 *
 * Set up in Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *   URL:    https://solidstate.cc/api/stripe/webhook
 *   Events: checkout.session.completed
 *           payment_intent.succeeded
 *           invoice.paid
 */

import { NextResponse } from "next/server"
import { stripe, getSku } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

// Service-role client — full write access. Never expose to browser.
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
  : null

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const raw = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "verify failed"
    return NextResponse.json({ error: `Signature verify failed: ${msg}` }, { status: 400 })
  }

  // Persist event idempotently — primary key on stripe_event_id avoids dupes.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const amount = session.amount_total ?? 0
    const sku = (session.metadata?.sku as string) ?? "unknown"
    // Lowercased so the /account RLS email match never misses on casing.
    const email = session.customer_details?.email?.toLowerCase() ?? null

    if (supabaseAdmin) {
      await supabaseAdmin.from("sales").upsert(
        {
          stripe_event_id: event.id,
          stripe_session_id: session.id,
          sku,
          amount_cents: amount,
          currency: session.currency ?? "usd",
          email,
          status: "paid",
        },
        { onConflict: "stripe_event_id" }
      )
    }

    // Zip-product delivery email (Ship Kit, fable-ready). Payment-link
    // sessions carry no metadata.sku, so also detect by line-item price.
    // Failure here never fails the webhook — the buyer's thanks-page link
    // still works.
    try {
      const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 })
      const bought = (zip: ZipSku) => {
        const priceId = getSku(zip).priceId
        return (
          sku === zip ||
          items.data.some((li) => Boolean(li.price?.id) && li.price?.id === priceId)
        )
      }
      for (const zip of Object.keys(DELIVERY) as ZipSku[]) {
        if (email && bought(zip)) {
          await sendDeliveryEmail(zip, email, session.id)
        }
      }
    } catch (e) {
      console.error(
        "[webhook] delivery email failed:",
        e instanceof Error ? e.message : String(e)
      )
    }
  }

  return NextResponse.json({ received: true })
}

/**
 * Delivery email: the durable download link. The Stripe receipt does NOT
 * contain it — this email is how a buyer who closed the tab gets back in.
 * Requires the solidstate.cc domain verified in Resend; DELIVERY_FROM
 * overrides the sender.
 */
type ZipSku = "ship-kit" | "fable-ready"

const DELIVERY: Record<
  ZipSku,
  { subject: string; title: string; blurb: string; cta: string; path: string; firstRun: string }
> = {
  "ship-kit": {
    subject: "Ship Kit — your download",
    title: "Ship Kit is yours.",
    blurb: "One zip. Six skills, the orchestrator, the memory spec.",
    cta: "Download Ship Kit",
    path: "/ship-kit/thanks",
    firstRun: "Unzip into your tool, run <code>/ship-start</code>, answer two questions.",
  },
  "fable-ready": {
    subject: "fable-ready — your download",
    title: "fable-ready is yours.",
    blurb: "One zip. The skill, the rules, the scanner.",
    cta: "Download fable-ready",
    path: "/fable-ready/thanks",
    firstRun: "Unzip into your tool, point it at your repo, approve the patches.",
  },
}

async function sendDeliveryEmail(zip: ZipSku, to: string, sessionId: string) {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    console.error("[webhook] RESEND_API_KEY missing — delivery email skipped")
    return
  }
  const d = DELIVERY[zip]
  const from = process.env.DELIVERY_FROM?.trim() || "Solid State <ship@solidstate.cc>"
  const link = `https://solidstate.cc${d.path}?session_id=${encodeURIComponent(sessionId)}`

  // Skin matches the /account sign-in email: dark card, mono, white CTA.
  const html = `
    <div style="background:#0a0a0a;padding:40px 32px;font-family:ui-monospace,Menlo,monospace;max-width:560px;margin:0 auto;color:#e8e8e8">
      <p style="margin:0 0 28px"><img src="https://solidstate.b-cdn.net/BRANDING/logo_white.png" alt="SOLID STATE" width="150" style="display:block"/></p>
      <h1 style="font-size:24px;line-height:1.3;color:#ffffff;margin:0 0 12px">${d.title}</h1>
      <p style="font-size:14px;line-height:1.6;color:#bdbdbd;margin:0 0 28px">${d.blurb}</p>
      <p style="margin:0 0 32px">
        <a href="${link}" style="background:#ffffff;color:#0a0a0a;text-decoration:none;padding:14px 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;display:inline-block;font-family:ui-monospace,Menlo,monospace">${d.cta} →</a>
      </p>
      <hr style="border:none;border-top:1px solid #2a2a2a;margin:0 0 24px"/>
      <p style="font-size:13px;line-height:1.7;color:#9a9a9a;margin:0 0 16px">
        Keep this email — the link is permanent and always serves the current v1.x build.<br/>
        ${d.firstRun}<br/>
        Install help: INSTALL.md in the zip (Claude Code, Cowork, Cursor, OpenClaw, Hermes).<br/>
        Your library (re-downloads, future versions): <a href="https://solidstate.cc/account" style="color:#e8e8e8">solidstate.cc/account</a> — sign in with this email.
      </p>
      <p style="font-size:12px;color:#7a7a7a;margin:0 0 16px">Stuck? Reply, or <a href="mailto:hi@solidstate.cc" style="color:#9a9a9a">hi@solidstate.cc</a> — include your tool and OS.</p>
      <p style="font-size:12px;margin:0"><strong style="color:#bdbdbd">solidstate.cc</strong> <span style="color:#555">·</span> <a href="mailto:hi@solidstate.cc" style="color:#9a9a9a;text-decoration:none">hi@solidstate.cc</a></p>
    </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: "hi@solidstate.cc",
      subject: d.subject,
      html,
    }),
  })
  if (!res.ok) {
    console.error("[webhook] resend error:", res.status, await res.text())
  }
}

// Stripe sends raw bytes — disable Next's body parser.
export const runtime = "nodejs"

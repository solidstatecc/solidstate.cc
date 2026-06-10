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
    const email = session.customer_details?.email ?? null

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

    // Ship Kit delivery email. Payment-link sessions carry no metadata.sku,
    // so also detect by line-item price. Failure here never fails the webhook —
    // the buyer's thanks-page link still works.
    try {
      const shipKitPrice = getSku("ship-kit").priceId
      const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 })
      const isShipKit =
        sku === "ship-kit" || items.data.some((li) => li.price?.id === shipKitPrice)
      if (isShipKit && email) {
        await sendShipKitDeliveryEmail(email, session.id)
      }
    } catch (e) {
      console.error(
        "[webhook] ship-kit delivery email failed:",
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
async function sendShipKitDeliveryEmail(to: string, sessionId: string) {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    console.error("[webhook] RESEND_API_KEY missing — delivery email skipped")
    return
  }
  const from = process.env.DELIVERY_FROM?.trim() || "Solid State <ship@solidstate.cc>"
  const link = `https://solidstate.cc/ship-kit/thanks?session_id=${encodeURIComponent(sessionId)}`

  const html = `
    <div style="font-family:ui-monospace,Menlo,monospace;max-width:560px;margin:0 auto;color:#111">
      <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#888">Solid State</p>
      <h1 style="font-size:22px;margin:8px 0 16px">Ship Kit is yours.</h1>
      <p style="font-size:14px;line-height:1.6">One zip. Six skills, the orchestrator, the memory spec.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#111;color:#fff;text-decoration:none;padding:14px 22px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;display:inline-block">Download Ship Kit</a>
      </p>
      <p style="font-size:13px;line-height:1.6;color:#444">
        Keep this email — the link is permanent and always serves the current v1.x build.<br/>
        Unzip into your tool, run <code>/ship-start</code>, answer two questions.<br/>
        Install help: INSTALL.md in the zip (Claude Code, Cowork, Cursor, OpenClaw, Hermes).
      </p>
      <p style="font-size:12px;color:#888">Stuck? Reply, or hi@solidstate.cc — include your tool and OS.</p>
    </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: "hi@solidstate.cc",
      subject: "Ship Kit — your download",
      html,
    }),
  })
  if (!res.ok) {
    console.error("[webhook] resend error:", res.status, await res.text())
  }
}

// Stripe sends raw bytes — disable Next's body parser.
export const runtime = "nodejs"

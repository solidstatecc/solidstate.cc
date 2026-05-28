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
import { stripe } from "@/lib/stripe"
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

  const secret = process.env.STRIPE_WEBHOOK_SECRET
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
  }

  return NextResponse.json({ received: true })
}

// Stripe sends raw bytes — disable Next's body parser.
export const runtime = "nodejs"

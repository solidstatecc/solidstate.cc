/**
 * POST /api/checkout
 *
 * Body: { sku: SkuId, email?: string }
 *
 * Creates a Stripe Checkout Session and returns { url }.
 * The client should redirect to that URL.
 *
 * Why server-side: secret key + price IDs must never touch the client.
 */

import { NextResponse } from "next/server"
import { stripe, getSku, type SkuId } from "@/lib/stripe"

const ALLOWED_SKUS: SkuId[] = ["operator-pack", "front-door-pdf", "founder-briefing", "ship-kit"]

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in Vercel env." },
      { status: 500 }
    )
  }

  let body: { sku?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const sku = body.sku as SkuId | undefined
  if (!sku || !ALLOWED_SKUS.includes(sku)) {
    return NextResponse.json({ error: "Unknown SKU" }, { status: 400 })
  }

  const product = getSku(sku)
  if (!product.priceId) {
    return NextResponse.json(
      { error: `Price ID for ${sku} not set. Add STRIPE_PRICE_* env var.` },
      { status: 500 }
    )
  }

  const origin = req.headers.get("origin") ?? "https://solidstate.cc"

  // Per-SKU post-purchase routing + extras. Ship Kit delivers via its own
  // thanks page (download verify) and issues an invoice PDF like the
  // payment-link rail does.
  const isShipKit = sku === "ship-kit"
  const successUrl = isShipKit
    ? `${origin}/ship-kit/thanks?session_id={CHECKOUT_SESSION_ID}`
    : `${origin}/buy/success?session_id={CHECKOUT_SESSION_ID}&sku=${sku}`
  const cancelUrl = isShipKit ? `${origin}/ship-kit` : `${origin}/buy/cancel?sku=${sku}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: product.mode,
      line_items: [{ price: product.priceId, quantity: 1 }],
      customer_email: body.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { sku },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      ...(isShipKit
        ? {
            invoice_creation: {
              enabled: true,
              invoice_data: {
                description: "Solid State Ship Kit — one-time purchase, updates through v1.x",
                footer: "Solid State / Visionaire Labs — solidstate.cc · hi@solidstate.cc",
              },
            },
          }
        : {}),
    })

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown Stripe error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

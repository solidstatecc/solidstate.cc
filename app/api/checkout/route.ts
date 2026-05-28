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

const ALLOWED_SKUS: SkuId[] = ["operator-pack", "front-door-pdf", "founder-briefing"]

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: product.mode,
      line_items: [{ price: product.priceId, quantity: 1 }],
      customer_email: body.email,
      success_url: `${origin}/buy/success?session_id={CHECKOUT_SESSION_ID}&sku=${sku}`,
      cancel_url: `${origin}/buy/cancel?sku=${sku}`,
      metadata: { sku },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
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

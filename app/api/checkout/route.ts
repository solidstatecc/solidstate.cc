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

const ALLOWED_SKUS: SkuId[] = ["operator-pack", "front-door-pdf", "founder-briefing", "ship-kit", "fable-ready", "ai-seo-kit"]

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

  // Per-SKU post-purchase routing + extras. Zip-delivered products (Ship Kit,
  // fable-ready) verify on their own thanks pages and issue an invoice PDF
  // like the payment-link rail does.
  const ZIP_SKUS: SkuId[] = ["ship-kit", "fable-ready", "ai-seo-kit"]
  const isZipProduct = ZIP_SKUS.includes(sku)
  const successUrl = isZipProduct
    ? `${origin}/${sku}/thanks?session_id={CHECKOUT_SESSION_ID}`
    : `${origin}/buy/success?session_id={CHECKOUT_SESSION_ID}&sku=${sku}`
  const cancelUrl = isZipProduct ? `${origin}/${sku}` : `${origin}/buy/cancel?sku=${sku}`

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
      // USD only — buyer-local currency display muddies the $99 anchor.
      adaptive_pricing: { enabled: false },
      // Stripe Tax: 10% GST for AU buyers (prices are tax_behavior: exclusive,
      // so GST adds on top), 0% + reverse-charge note for cross-border B2B.
      // Requires the AU registration in Dashboard → Settings → Tax to be active;
      // without a covering registration this is a no-op (no tax, no Stripe Tax fee).
      automatic_tax: { enabled: true },
      // Lets business buyers enter an ABN/VAT ID at checkout — Stripe Tax then
      // applies reverse charge where it applies and prints the ID on the invoice.
      tax_id_collection: { enabled: true },
      ...(isZipProduct
        ? {
            invoice_creation: {
              enabled: true,
              invoice_data: {
                description:
                  sku === "ship-kit"
                    ? "Solid State Ship Kit — one-time purchase, updates through v1.x"
                    : sku === "ai-seo-kit"
                    ? "Solid State AI SEO Kit — one-time purchase, updates through v1.x"
                    : "Solid State fable-ready — one-time purchase, rules updates through v1.x",
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

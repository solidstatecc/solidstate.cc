/**
 * Stripe client — server-side only.
 *
 * Env vars (set in Vercel project settings, NEVER commit):
 *   STRIPE_SECRET_KEY            — sk_live_... or sk_test_...
 *   STRIPE_WEBHOOK_SECRET        — whsec_... (from the webhook endpoint)
 *   NEXT_PUBLIC_STRIPE_PUB_KEY   — pk_live_... or pk_test_... (safe in client)
 *
 * Product catalog is defined here, not in Stripe. Stripe holds price IDs;
 * this file maps them to our SKUs. Add new SKUs by:
 *   1. Create the product + price in Stripe Dashboard.
 *   2. Add the price ID to STRIPE_PRICES below.
 *   3. Reference the SKU from a checkout button.
 */

import Stripe from "stripe"

const secretKey = process.env.STRIPE_SECRET_KEY

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : null

/**
 * Solid State product catalog.
 * Each entry maps an internal SKU to a Stripe price ID + metadata.
 * Test prices in dev (use STRIPE_PRICES_TEST), live prices in prod.
 */
export type SkuId =
  | "operator-pack"      // $200 prepaid, 10,000 oracle calls
  | "front-door-pdf"     // $29 PDF
  | "founder-briefing"   // x402 bundle, one-time fallback purchase
  | "ship-kit"           // $99 one-time, Ship Kit system (zip delivery)

export const STRIPE_PRICES: Record<SkuId, {
  /** Live mode price ID (Stripe Dashboard → Products) */
  priceId: string | undefined
  /** Display label */
  name: string
  /** USD amount, for our own UI — Stripe holds the source of truth */
  amountUsd: number
  /** "payment" = one-time; "subscription" = recurring */
  mode: "payment" | "subscription"
  /** Short pitch — shown on checkout success */
  description: string
}> = {
  "operator-pack": {
    priceId: process.env.STRIPE_PRICE_OPERATOR_PACK,
    name: "Operator Pack",
    amountUsd: 200,
    mode: "payment",
    description: "10,000 oracle calls. No subscription. No token.",
  },
  "front-door-pdf": {
    priceId: process.env.STRIPE_PRICE_FRONT_DOOR_PDF,
    name: "Run an Agent Without Buying a Course",
    amountUsd: 29,
    mode: "payment",
    description: "20 pages. The Solid State way to ship one agent on Base.",
  },
  "founder-briefing": {
    priceId: process.env.STRIPE_PRICE_FOUNDER_BRIEFING,
    name: "Founder Briefing",
    amountUsd: 1,
    mode: "payment",
    description: "forest + audit + oracle. One run. One dollar.",
  },
  "ship-kit": {
    // Live price created 2026-06-10 (prod_UftoYcHRsKecSU). Env overrides; literal
    // fallback so the download route verifies even before Vercel env is set.
    priceId: process.env.STRIPE_PRICE_SHIP_KIT ?? "price_1TgY0iGoBHY0B6fVc6HZJyw2",
    name: "Solid State Ship Kit",
    amountUsd: 99,
    mode: "payment",
    description: "A system, not a pile of skills. Six skills + orchestrator + project memory.",
  },
}

/** Hosted payment link for ship-kit (live, redirects to /ship-kit/thanks). */
export const SHIP_KIT_PAYMENT_LINK = "https://buy.stripe.com/aFa6oH4UI7gJgkC2Vu9fW00"

export function getSku(sku: SkuId) {
  return STRIPE_PRICES[sku]
}

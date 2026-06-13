/**
 * GET /api/ai-seo-kit/download?session_id=cs_...
 *
 * Verifies a Stripe Checkout session, then 302-redirects to a short-lived
 * Supabase signed URL for the ai-seo-kit zip. Same rail as ship-kit and
 * fable-ready: session exists, payment_status === "paid", line item matches
 * the ai-seo-kit price ID. The session id in the buyer's redirect URL is the
 * proof of purchase; receipt links keep working long-term.
 *
 * Env (Vercel, server-only):
 *   STRIPE_SECRET_KEY            — already required by the checkout rail
 *   STRIPE_PRICE_AI_SEO_KIT     — set after confirming the price (Dashboard)
 *   SUPABASE_SERVICE_ROLE_KEY    — storage signing (private bucket)
 *   NEXT_PUBLIC_SUPABASE_URL     — already set
 *
 * Storage object: products/ai-seo-kit/ai-seo-kit-v1.0.0.zip (private
 * bucket "products" — upload via one-shot edge-function relay or Dashboard).
 * Thor: upload drafts/ai-seo-kit-v1.0.0.zip to the "products" bucket under
 * the path ai-seo-kit/ai-seo-kit-v1.0.0.zip before go-live.
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { stripe, getSku } from "@/lib/stripe"

const OBJECT_PATH = "ai-seo-kit/ai-seo-kit-v1.0.0.zip"
const BUCKET = "products"
const SIGNED_URL_TTL_SECONDS = 60 * 10 // 10 minutes; the page link re-signs on every click

export async function GET(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in Vercel env." },
      { status: 500 }
    )
  }

  const url = new URL(req.url)
  const sessionId = url.searchParams.get("session_id")
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing or invalid session_id" }, { status: 400 })
  }

  // 1) Verify the purchase with Stripe.
  let paid = false
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })
    const price = getSku("ai-seo-kit").priceId
    const hasIt = (session.line_items?.data ?? []).some((li) => li.price?.id === price)
    paid = session.payment_status === "paid" && hasIt
    if (!paid) {
      console.error(
        "[ai-seo-kit/download] verification failed:",
        JSON.stringify({
          payment_status: session.payment_status,
          line_prices: (session.line_items?.data ?? []).map((li) => li.price?.id),
          expected_price: price,
        })
      )
    }
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
    console.error("[ai-seo-kit/download] session retrieve failed:", msg)
    return NextResponse.json({ error: "Unknown checkout session" }, { status: 403 })
  }

  if (!paid) {
    return NextResponse.json(
      { error: "Session not paid or not an ai-seo-kit purchase" },
      { status: 403 }
    )
  }

  // 2) Sign a short-lived download URL from the private bucket.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Delivery not configured. Set SUPABASE_SERVICE_ROLE_KEY in Vercel env." },
      { status: 500 }
    )
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(OBJECT_PATH, SIGNED_URL_TTL_SECONDS, {
      download: "ai-seo-kit-v1.0.0.zip",
    })

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: `Could not sign download URL: ${error?.message ?? "unknown"}` },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.signedUrl, 302)
}

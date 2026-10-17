---
name: stripe-deliver
description: >-
  Fulfill a digital purchase after a Stripe payment: verify the webhook
  signature, confirm the payment actually succeeded, then grant the
  license/download/access and send a receipt — idempotently, so a retried
  webhook never double-delivers. Use when wiring a Stripe webhook to
  fulfillment, "deliver after payment", or post-checkout access. Not for creating
  products or links (stripe-product-to-price), issuing refunds, or reading
  revenue (stripe-revenue-read).
license: MIT
version: 0.1.0
compatibility: >-
  Requires the Stripe MCP (mcp.stripe.com or npx @stripe/mcp) and Python 3.8+ to
  run entry.py. Stripe access is read-only here; the grant + receipt are app-side.
metadata:
  openclaw:
    emoji: "📦"
    homepage: https://solidstate.cc
    always: false
    requires:
      bins: [python3]
---

# Stripe: Deliver

The webhook fired — now deliver the thing, exactly once, and only if it was
really paid. This guard carries three rails the raw MCP gives you none of:
**verify the signature, confirm payment, dedupe the fulfillment.**

## When to use

- Wiring `checkout.session.completed` (or a payment-intent event) to fulfillment.
- "Grant access after payment", "send the download link", "deliver the license".
- Solid State's dogfood: the Ship Kit webhook + Resend receipt rail.

## When NOT to use

- Creating the product/price/link → `stripe-product-to-price`.
- Reading revenue → `stripe-revenue-read`. Refunds/disputes are out of v0.1 scope.

## How it works — compose the MCP, never wrap it

Stripe access here is **read-only** — the guard never writes to Stripe. The
license/download grant and the receipt happen in your app (e.g. Ship Kit +
Resend). The guard does the dangerous parts deterministically.

```
# 1. Verify BEFORE you trust a byte of the payload:
echo '{"action":"verify_signature","payload":"<raw body>","signature":"<Stripe-Signature header>","secret":"whsec_…"}' | python3 entry.py

# 2. Then plan an idempotent, payment-verified fulfillment:
echo '{"action":"fulfill","key":"rk_test_…","event":{"id":"evt_…","object_id":"cs_…","payment_status":"paid"}}' | python3 entry.py
```

## Steps

1. **Verify the signature.** `verify_signature` over the **raw** request body and
   the `Stripe-Signature` header, with your `whsec_…` secret. **BLOCK** → reject
   the webhook (forged, wrong secret, or replay outside the 5-min window).
2. **Fulfill once.** On GO, `fulfill` returns: a `verify_read` (read the object
   back to confirm it is truly paid — never trust the webhook field alone), a
   `dedupe_key` (`stripe-deliver:fulfill:<event_id>`), and the fulfillment
   directive. **Skip entirely if the dedupe key is already recorded.** Record it
   only after a successful grant. See `references/webhook.md`.

## The gate

- **GO** — signature valid and fresh / event is paid; proceed.
- **BLOCK** — bad signature, replay, or an unpaid/incomplete event. Do not grant.

## Success criteria (self-check)

- [ ] No payload was parsed before `verify_signature` returned GO.
- [ ] Fulfillment was gated on a read-back showing the object is actually paid.
- [ ] The dedupe key was checked first and recorded only after a successful grant.
- [ ] A replayed/duplicate webhook produced the same dedupe key and no second grant.

## Errors & limitations

- Signature verification needs the **raw** body bytes. If your framework already
  parsed/re-serialized JSON, the signature will not match — capture the raw body.
- The guard verifies and dedupes; the actual grant + receipt are your app's job
  and must honor the dedupe key to be idempotent end-to-end.
- v0.1 handles one-time digital fulfillment. Dunning / failed-payment recovery is
  `recover`, deferred to v0.2.

---

*Stripe Startup Kit · Solid State — solidstate.cc. Compose the MCP. Never wrap it.*

---
name: stripe-product-to-price
description: >-
  Turn a file, course, or idea into a correct Stripe Product, Price, and a
  shareable Payment Link — test mode first, with a human-confirm gate before any
  live link goes up. Use when a founder wants to "sell this", price a digital
  product, set a one-off or subscription price, or get a payment/checkout link.
  Not for standing up the account (stripe-stand-up), tax setup (stripe-tax-ready),
  fulfilling a paid order (stripe-deliver), or reading revenue (stripe-revenue-read).
license: MIT
version: 0.1.0
compatibility: >-
  Requires the Stripe MCP (mcp.stripe.com or npx @stripe/mcp) and Python 3.8+ to
  run entry.py. v0.1 operates in TEST mode by default; live is confirm-gated.
metadata:
  openclaw:
    emoji: "🏷️"
    homepage: https://solidstate.cc
    always: false
    requires:
      bins: [python3]
---

# Stripe: Product → Price

One thing to sell becomes a correct catalog object and a link you can share. The
guard builds the right sequence and enforces the kit doctrine: **test mode
first, least-privilege key, human-confirm before a live link, idempotent writes.**

## When to use

- "Sell this PDF / course / template", "price my product", "make me a payment link".
- Setting up a one-off price or a recurring subscription price.

## When NOT to use

- The account isn't set up yet → `stripe-stand-up` first.
- Tax → `stripe-tax-ready`. Deliver after payment → `stripe-deliver`. Revenue →
  `stripe-revenue-read`. Refunds/disputes are out of kit scope in v0.1.

## How it works — compose the MCP, never wrap it

`entry.py` returns a guarded **plan**, never a Stripe call. Feed it the product,
read the `gate`, then make each step's `mcp_call` yourself through the Stripe MCP.

```
echo '{"action":"create","key":"rk_test_…","params":{"name":"My Course","unit_amount":4900,"currency":"usd"}}' | python3 entry.py
```

`unit_amount` is in the **smallest currency unit** (4900 = $49.00). For a
subscription, add `"kind":"recurring","interval":"month"`.

## Steps

1. Run `create` with the product details and your `rk_test_` key.
2. Read `gate`. **GO** in test mode → run the three steps in order: create
   **product** → create **price** (insert the product id) → create **payment
   link** (insert the price id). Each write carries an `idempotency_key` — pass
   it as the `Idempotency-Key` header so a retry never makes a duplicate.
3. Going live? Re-run with `"allow_live":true` and a green
   `dry_run_receipt` from `stripe-stand-up`. The payment-link step returns
   **CONFIRM** — show the `confirm_card`, get a human yes, then create it.

## The gate

- **GO** — make the calls now (test mode, or properly unlocked + confirmed live).
- **CONFIRM** — a live, real-money sales surface; confirm with a human first.
- **BLOCK** — bad input (missing `unit_amount`, etc.) or live without a green
  dry run. Fix `blockers`.

## Success criteria (self-check)

- [ ] Product, Price, and Payment Link were created in that order, ids chained.
- [ ] Every write was sent with its `Idempotency-Key`.
- [ ] In live mode, the payment link was created only after a human confirmation.
- [ ] A re-run of the identical request reuses the same idempotency keys (no dupes).

## Errors & limitations

- The guard validates shape (name, positive integer amount, currency, interval
  for recurring). It does not validate that your price is *sensible*.
- It plans Product/Price/Payment Link only. Checkout Sessions, coupons, and
  trials are out of v0.1 scope (`subscription-designer` is deferred to v0.2).
- Live creation is confirm-gated here; the real live cutover stays council-gated.

---

*Stripe Startup Kit · Solid State — solidstate.cc. Compose the MCP. Never wrap it.*

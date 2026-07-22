---
name: stripe-revenue-read
description: >-
  Read-only snapshot of a Stripe business — balance, recent charges, payouts,
  active subscriptions, open invoices — with a key that can never write. Use when
  a founder asks "how's the business", "what did I make", "when's my payout", or
  wants a quick revenue check. Not for creating or changing anything in Stripe
  (refunds, products, prices, subscriptions); this skill refuses every write by
  design.
license: MIT
version: 0.1.0
compatibility: >-
  Requires the Stripe MCP (mcp.stripe.com or npx @stripe/mcp) and Python 3.8+ to
  run entry.py. Read-only: works with a live or test key, never writes.
metadata:
  openclaw:
    emoji: "📊"
    homepage: https://solidstate.cc
    always: false
    requires:
      bins: [python3]
---

# Stripe: Revenue Read

The free, read-only on-ramp to the kit. Ask how the business is doing; get the
numbers. It **cannot** move money — every action is a GET, and any write intent
is refused before it reaches the MCP.

## When to use

- "How's revenue?", "what did I make this month?", "when's my next payout?",
  "how many active subscriptions?", "any unpaid invoices?".
- A safe first touch with the kit before granting any write scope.

## When NOT to use

- Anything that *changes* Stripe — refunds, products, prices, subscriptions. Those
  live in the write skills (`stripe-product-to-price`, etc.). This skill will
  BLOCK such requests on purpose.

## How it works — compose the MCP, never wrap it

`entry.py` maps each question to a read-only Stripe MCP call and hands you the
plan. Because it is read-only, a live key is fine here — there is nothing to
guard against. A non-read action is refused.

```
echo '{"action":"balance","key":"rk_test_…"}'              | python3 entry.py
echo '{"action":"recent_charges","key":"rk_test_…"}'       | python3 entry.py
echo '{"action":"active_subscriptions","key":"rk_test_…"}' | python3 entry.py
```

Actions: `balance`, `recent_charges`, `payouts`, `active_subscriptions`,
`open_invoices`. All `GET`. Scope is read-only across every money surface.

## Steps

1. Pick the question → matching action.
2. Run `entry.py`; it returns **GO** with the `mcp_call` (a `stripe_api_read`).
3. Make the read through the Stripe MCP and summarize plainly for the founder.

## Success criteria (self-check)

- [ ] Only `stripe_api_read` calls were made — zero writes.
- [ ] A write-shaped request (e.g. `create_refund`) returned **BLOCK**.
- [ ] The restricted key used grants read scope only (no write permission).

## Errors & limitations

- Read-only by construction: there is no action that writes. If a founder needs a
  refund or a change, hand off to the appropriate write skill.
- Numbers are a snapshot from the API, not accounting-grade reporting. For books,
  export to your accounting tool.

---

*Stripe Startup Kit · Solid State — solidstate.cc. Compose the MCP. Never wrap it.*

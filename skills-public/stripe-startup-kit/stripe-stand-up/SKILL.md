---
name: stripe-stand-up
description: >-
  Stand up a sellable Stripe account in TEST mode with a least-privilege
  restricted key, prove it works with a self-cleaning dry-run sale, and refuse
  to go live until that dry run passes. Use when a founder is setting up Stripe
  from zero, asks to "start selling", or wants a safe test-first Stripe setup.
  Not for editing an already-live catalog (use stripe-product-to-price), reading
  revenue (stripe-revenue-read), or writing Stripe integration code (that is
  Stripe's own developer skills).
license: MIT
version: 0.1.0
compatibility: >-
  Requires the Stripe MCP (hosted mcp.stripe.com or local npx @stripe/mcp) and
  Python 3.8+ to run entry.py. v0.1 operates in TEST mode only.
metadata:
  openclaw:
    emoji: "🟢"
    homepage: https://solidstate.cc
    always: false
    requires:
      bins: [python3]
---

# Stripe: Stand Up

Get from zero to a Stripe account that can take a test payment — without ever
touching live mode by accident. This is the front door of the Stripe Startup
Kit. It enforces the kit doctrine: **test mode first, least-privilege keys,
human-confirm on money, idempotent writes.**

## When to use

- A founder is setting up Stripe for the first time and wants to sell something.
- "Help me start selling", "set up Stripe safely", "get me a test sale working".
- Before any other kit skill — stand-up issues the scope and the green dry run
  the rest of the kit depends on.

## When NOT to use

- Adding products to an account that already works → `stripe-product-to-price`.
- Tax setup → `stripe-tax-ready`. Fulfillment → `stripe-deliver`. Revenue →
  `stripe-revenue-read`.
- Writing or upgrading Stripe integration code → Stripe's developer skills.

## How it works — compose the MCP, never wrap it

`entry.py` is a **guard, not an executor.** You give it a JSON intent; it
returns a guarded *plan* — the exact Stripe MCP call to make, an idempotency
key, a confirm card, and a `gate`. It never calls Stripe. **You** make the call
through the Stripe MCP, and only when the gate clears.

```
echo '{"action":"dry_run","key":"rk_test_..."}' | python3 entry.py
```

Read `gate`:

- **GO** — make `mcp_call` (or each step's `mcp_call`) now via the Stripe MCP.
- **CONFIRM** — show `confirm_card` to the human; proceed only on an explicit yes.
- **BLOCK** — do not call Stripe; fix `blockers` first.

## Prerequisites

1. The Stripe MCP is connected (hosted or `npx -y @stripe/mcp@latest`).
2. A **restricted** key. Run `{"action":"scope"}` to get the exact minimal scope,
   then create an `rk_test_…` key in the Dashboard with only those permissions.
   Never use a secret `sk_` key — the guard will warn you it is over-privileged.
3. Python 3 available to run `entry.py`.

## Steps

1. **Scope the key.** `{"action":"scope"}` → create the `rk_test_` key it describes.
2. **Check the account is sellable.** `{"action":"account_status","key":"rk_test_…"}`
   → run the read; confirm `charges_enabled` and `details_submitted`.
3. **Dry run.** `{"action":"dry_run","key":"rk_test_…"}` → run the three test-mode
   steps in order (product → price → payment link), substituting each returned id
   into the next step. All three succeed → emit a green receipt
   `{"status":"green","passed":true}`. Then deactivate the throwaway product.
4. **Go live only when green.** `{"action":"go_live","live_key":"rk_live_…",
   "dry_run_receipt":<green receipt>,"confirmed":true}`. Without a green receipt
   this returns **BLOCK** — that is the rail. See `references/dry-run.md`.

## Example

```
$ echo '{"action":"go_live","live_key":"rk_live_x","dry_run_receipt":{"status":"red","passed":false},"confirmed":true}' | python3 entry.py
{ "gate": "BLOCK",
  "blockers": ["Live mode requested without a green dry-run receipt. ..."] }
```

The kit will not let you sell live until a test sale has actually worked.

## Success criteria (self-check)

- [ ] The key in use starts with `rk_test_` (not `sk_`, not `pk_`, not live).
- [ ] `account_status` confirms the account can actually take a charge.
- [ ] A dry-run test sale completed and produced a green receipt.
- [ ] `go_live` returns BLOCK on a red/absent receipt and CONFIRM (not auto-GO)
      on a green one — proving the live gate is real, not cosmetic.

## Errors & limitations

- v0.1 is **test mode only.** `go_live` plans the switch and enforces the gate;
  the actual live cutover (a real sale) is a downstream, council-gated step.
- `entry.py` reasons about key *prefix*, not server-side key *scope* — it cannot
  see what permissions you actually granted. Scope the key as instructed.
- The dry run proves the happy path. It does not test tax (`stripe-tax-ready`)
  or fulfillment (`stripe-deliver`).

---

*Stripe Startup Kit · Solid State — solidstate.cc. Compose the MCP. Never wrap it.*

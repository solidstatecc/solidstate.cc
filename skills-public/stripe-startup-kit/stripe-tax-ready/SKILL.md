---
name: stripe-tax-ready
description: >-
  Get Stripe Tax configured and your tax obligations settled before you sell —
  read current registrations, enable Tax, and register a jurisdiction (AU GST /
  reverse-charge / ABN aware), with a confirm gate on anything that creates a
  filing obligation. Use when a founder asks about sales tax, GST or VAT, "am I
  tax-ready", or is about to flip to live. Not for pricing products
  (stripe-product-to-price), bookkeeping, or filing actual tax returns.
license: MIT
version: 0.1.0
compatibility: >-
  Requires the Stripe MCP (mcp.stripe.com or npx @stripe/mcp) and Python 3.8+ to
  run entry.py. v0.1 operates in TEST mode by default; live config is confirm-gated.
metadata:
  openclaw:
    emoji: "🧾"
    homepage: https://solidstate.cc
    always: false
    requires:
      bins: [python3]
---

# Stripe: Tax Ready

Don't sell into a tax obligation you haven't set up. This guard reads your tax
posture, configures Stripe Tax, and registers a jurisdiction — treating a
registration as the real **filing obligation** it is, not a catalog edit.

## When to use

- "Do I need to collect GST/VAT?", "set up Stripe Tax", "am I tax-ready to sell?".
- Before `stripe-stand-up`'s `go_live`, as part of the pre-live checklist.
- Solid State's own dogfood: AU GST, B2B reverse-charge, ABN handling.

## When NOT to use

- Pricing a product → `stripe-product-to-price`. Bookkeeping, lodging a BAS, or
  filing a return → an accountant; this skill configures Stripe, it does not file.

## How it works — compose the MCP, never wrap it

`entry.py` returns a guarded plan. **check** is read-only; **configure** and
**register** are confirm-gated in live because they change how every future
invoice is taxed or create a legal obligation.

```
echo '{"action":"check","key":"rk_test_…"}' | python3 entry.py
echo '{"action":"register","key":"rk_test_…","params":{"country":"AU"}}' | python3 entry.py
```

## Steps

1. **Check.** `{"action":"check"}` → run both reads (settings, registrations).
   Compare against where you actually have nexus / an obligation.
2. **Configure Tax.** `{"action":"configure","params":{"defaults":{"tax_behavior":"exclusive"},"head_office":{…}}}`.
   Live → **CONFIRM** first.
3. **Register a jurisdiction.** `{"action":"register","params":{"country":"AU"}}`.
   Every register carries an **obligation warning**; AU adds GST / reverse-charge
   / ABN guidance. Live → **CONFIRM**. See `references/au-tax.md`.

## Success criteria (self-check)

- [ ] `check` was run and the existing registrations were actually reviewed.
- [ ] No `register` was executed without reading its obligation warning.
- [ ] In live mode, `configure` and `register` required a human confirmation.
- [ ] For AU, the ABN / GST-threshold / reverse-charge notes were surfaced.

## Errors & limitations

- This skill makes you *Stripe-Tax-ready*; it is **not tax advice** and does not
  determine liability for you. Confirm with a professional whether you must
  register before you do.
- Tax thresholds and rules change. The AU notes in `references/au-tax.md` are
  dated; verify against current ATO / Stripe guidance before relying on them.
- v0.1 covers settings + registrations. Tax reporting/export is out of scope.

---

*Stripe Startup Kit · Solid State — solidstate.cc. Compose the MCP. Never wrap it.*

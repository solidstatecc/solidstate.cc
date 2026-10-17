# The dry run — and why go-live depends on it

The dry run is the kit's proof that the account can actually take money, run
entirely in **test mode**, with throwaway objects you delete afterward. A green
dry-run receipt is the *only* thing that unlocks `go_live`. No green, no live.

## What a dry run does

1. **Create a throwaway test product** — `POST /v1/products` with a name like
   "Dry run — delete me".
2. **Create a test price** — `POST /v1/prices`, e.g. `unit_amount: 100`
   (`$1.00`), with the product id from step 1.
3. **Create a test payment link** — `POST /v1/payment_links` with the price id.

All three under an `rk_test_` key. Each is an idempotent write (the guard
supplies the `Idempotency-Key`), so a retry never litters your account with
duplicates.

## The receipt

When all three steps return 2xx, emit:

```json
{ "status": "green", "passed": true, "checked": ["product", "price", "payment_link"] }
```

If any step fails, the receipt is red (`"passed": false`) and `go_live` stays
**BLOCK**ed. Fix the failure (usually `details_submitted: false` or a missing
capability) and re-run.

## Cleanup

Deactivate the throwaway product so it never shows in your real catalog:

```
POST /v1/products/{id}  active=false
```

Test-mode objects never touch live data, but a tidy account is easier to trust.

## Why this is the gate

The Stripe MCP will run a live write the moment you hand it a live key — there is
no built-in "have you proven this works first?" step. The dry run *is* that step.
It is cheap (test mode, ~3 calls), it is real (it exercises the exact create path
a buyer hits), and it converts "I think Stripe is set up" into "a test sale
demonstrably worked." Only then does the kit let you point a live key at it.

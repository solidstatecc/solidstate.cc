# Webhook fulfillment — the three rails

The Stripe MCP can read a Checkout Session, but it does not catch your webhook,
verify its signature, confirm payment, or stop a duplicate delivery. `stripe-deliver`
does all four deterministically. This is the order, and why each step matters.

## 1. Verify the signature — before you trust a byte

Stripe signs every webhook. The `Stripe-Signature` header is `t=<unix>,v1=<hmac>`.
The signed payload is `"<t>.<raw body>"`, HMAC-SHA256 with your `whsec_…` secret.

- Use the **raw request body bytes**. If your framework parsed and re-serialized
  the JSON, the bytes differ and the signature will not match. Capture the raw body.
- The guard also enforces a **5-minute freshness window** (`t` vs now). A valid
  signature on a stale timestamp is a replay — **BLOCK**.
- Wrong secret, tampered payload, or replay → BLOCK. Reject the webhook; do not parse it.

## 2. Confirm the payment — trust the object, not the field

A webhook *says* it is paid. Read the object back through the MCP and confirm:

- Checkout Session: `payment_status == "paid"`.
- Payment Intent: `status == "succeeded"`.

The guard plans this read (`verify_read`) and refuses fulfillment unless the
event is in a paid/succeeded state. An `unpaid`, `no_payment_required` (unless you
intend free access), or incomplete event must **not** grant anything.

## 3. Dedupe — fulfill exactly once

Stripe retries webhooks. Without a guard you would grant access twice. The dedupe
key is deterministic on the event id:

```
stripe-deliver:fulfill:<event_id>
```

- **Before granting:** if this key is already recorded as fulfilled, **skip**.
- **After a successful grant:** record it.

Record *after* the grant, not before — otherwise a crash mid-grant leaves the key
recorded but the customer empty-handed.

## Where the grant happens

The grant (license / signed download / access flag) and the receipt are **app-side**
— for Solid State, the Ship Kit webhook handler plus a Resend email. The Stripe
key this skill uses is read-only. End-to-end idempotency depends on your handler
honoring the dedupe key.

# The safety doctrine

The four rails every kit skill enforces. Stripe's own docs *recommend* all four;
the Stripe MCP enforces none by default. The kit enforces them in `rails.py`,
deterministically, so they cannot be skipped by agent judgment. This is the moat.

## 1. Test mode first — live never by accident

- A key's mode is read from its prefix: `*_test_` vs `*_live_`. Authoritative.
- A **live** key is **refused** (`gate: BLOCK`) unless *both*: `allow_live=true`
  **and** a green dry-run receipt (`{"status":"green","passed":true}`).
- Reads are exempt — a read-only key in live mode is harmless.
- The dry run (see `stripe-stand-up`) is the only thing that produces a green
  receipt, so "prove it works in test" gates "sell in live."

## 2. Least-privilege keys — restricted, scoped per skill

- Every skill declares the **minimal** scope it needs (`scope_manifest`). Create
  an `rk_` (restricted) key with exactly that, nothing more.
- A secret `sk_` key works but is **over-privileged** → `warning` + the scope to
  recreate it correctly. A publishable `pk_` key cannot do server work → `BLOCK`.
- `revenue-read`'s scope is read-only across every money surface — it cannot
  write even if asked.

## 3. Human-confirm on money — no silent live spend

- A money-moving action in **live** mode never auto-runs. The guard returns
  `gate: CONFIRM` and a `confirm_card` (amount, mode, exactly what will happen).
- The agent must show the card and get an explicit human "yes" before making the
  MCP call. In test mode there is nothing at stake, so no confirm is required.
- "Money-moving" includes creating a live sales surface (payment link) and
  creating a tax filing **obligation** (a registration), not just charges.

## 4. Idempotent — a retry is not a duplicate

- Every write carries a deterministic `Idempotency-Key`:
  `"<skill>:<action>:" + sha256(canonical_json(params))[:32]`.
- Identical intent → identical key → Stripe returns the original object instead
  of creating a second one (24h dedupe window).
- Pass the key as the `Idempotency-Key` header on the MCP write. The eval asserts
  the key is present and stable across retries.

## How a guard answers

`entry.py` (JSON in) → a plan (JSON out) with one of three gates:

| gate | meaning |
|---|---|
| `GO` | Safe — make `mcp_call` now via the Stripe MCP. |
| `CONFIRM` | Show `confirm_card`; proceed only on an explicit human yes. |
| `BLOCK` | Do not call Stripe; resolve `blockers` first. |

The guard never calls Stripe. It decides; the agent executes through the MCP.
That separation is what keeps the rails deterministic and unit-testable.

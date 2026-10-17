# Stripe Startup Kit — v0.1

Stand up Stripe, sell a digital product or subscription, get paid — **without
touching live mode by accident.**

Stripe ships the API floor and the developer tooling (agent-toolkit, the hosted
MCP, its own integration skills). Nobody ships the *founder's* sell-a-thing loop
with safety rails. This kit does, and the rails are the moat.

## The doctrine — enforced, not recommended

Every skill enforces four rails that the Stripe MCP only *recommends* in prose.
Full detail in [`DOCTRINE.md`](./DOCTRINE.md).

1. **Test mode first** — live is refused until a green dry run + explicit unlock.
2. **Least-privilege keys** — restricted `rk_` keys, scoped per skill; a secret
   `sk_` key is flagged over-privileged.
3. **Human-confirm on money** — a live money move never auto-runs; it returns a
   confirm card a human must approve.
4. **Idempotent** — every write carries a deterministic `Idempotency-Key`.

**Compose the Stripe MCP, never wrap it.** Each skill's `entry.py` is a
deterministic *guard* (JSON in → guarded plan out, pure stdlib, zero Stripe
network calls). It hands the agent an exact, safe, idempotent MCP call to make —
and the agent makes it through the Stripe MCP, only when the gate clears.

## The 5 skills (v0.1 dogfood-critical path)

```
stripe-stand-up  →  stripe-product-to-price  →  stripe-tax-ready  →  stripe-deliver  →  stripe-revenue-read
```

| Skill | Job |
|---|---|
| `stripe-stand-up` | Sellable account in test mode, least-priv key, refuses live until the dry run is green. |
| `stripe-product-to-price` | A file / course / idea → correct Product + Price + Payment Link. |
| `stripe-tax-ready` | Stripe Tax + obligations before go-live (AU GST / reverse-charge / ABN). |
| `stripe-deliver` | Webhook → license/download/access + receipt, signature-verified and idempotent. |
| `stripe-revenue-read` | Read-only "how's the business" — the free on-ramp. A key that can't write. |

Deferred to v0.2: `subscription-designer`, `recover`. The loop sells one real
thing without them first.

> **Naming note for AUDIT:** the brief's short names (`stand-up`, `deliver`, …)
> are prefixed `stripe-` here for a flat marketplace — generic slugs like
> `deliver` and `stand-up` collide and trigger on unrelated requests. Trivially
> reversible (folder name + frontmatter `name`) if the council prefers the bare
> names.

## Run the skills

Each skill is a self-contained Agent Skills bundle: `SKILL.md` + `entry.py` +
`rails.py` (+ `references/`). The guard is JSON in, JSON out:

```
echo '{"action":"create","key":"rk_test_…","params":{"name":"My Course","unit_amount":4900,"currency":"usd"}}' \
  | python3 stripe-product-to-price/entry.py
```

Read the returned `gate`: **GO** (make the MCP call), **CONFIRM** (get a human
yes first), or **BLOCK** (fix the blockers).

## Evals

- `python3 eval/head_to_head.py` — the gating proof: rails vs raw MCP. See
  [`eval/RESULTS.md`](./eval/RESULTS.md). Rails 6/6, raw MCP 1/6.
- `python3 eval/skills_eval.py` — per-skill suite, 22/22 (normal / edge / refusal).

## Status & boundaries

- **TEST MODE only** in v0.1. The real-money dogfood and the listing/packaging
  decision are downstream, **council-gated** steps — not part of this build.
- `rails.py` is identical across the five bundles (each must stand alone to be
  publishable). The source of truth is `./rails.py`; `python3 sync_rails.py`
  copies it into each skill folder.

---

*Solid State — solidstate.cc. Most skills are noise. Ship the signal.*

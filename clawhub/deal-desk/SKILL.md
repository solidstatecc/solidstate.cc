---
name: deal-desk
slug: deal-desk
version: 1.0.0
description: Sales pipeline in chat — track deals through stages, log calls, get today's priorities, forecast revenue. Use when the user adds or moves a deal, logs a call, or asks what to work on today.
license: MIT-0
author: solidstatecc
provenance: first-party
allowed-tools: Bash
runtime:
  network: false
  credentials: false
  writes: false
limits:
  max-deals: 5000
  max-bytes-stdin: 5242880
  timeout-seconds: 30
negative-triggers:
  - Not a hosted CRM. It does not store data — the caller owns the JSON state.
  - Not for sending email or making calls. It logs that they happened; it does not perform them.
  - Not a sync bridge to Salesforce/HubSpot/Pipedrive. No network, ever.
  - Not for marketing-campaign automation or lead scraping.
---

# deal-desk

A sales CRM that lives in the conversation. The math is deterministic and runs
in a bundled `entry.py`: deal stages, interaction logs, a daily priority list,
pipeline review, and a weighted revenue forecast. No network, no credentials,
no file writes — the caller holds the state and passes it back each turn.

## How to run

Invoke `entry.py` with **Bash**, passing one JSON object on stdin and reading
one JSON object on stdout. Bash is used **only** to execute the bundled script
(`python3 entry.py`) — it makes no network calls, reads no credentials, and
writes no files. Nothing else needs Bash.

```
echo '<json>' | python3 entry.py
```

State lives in the conversation, not on disk. Keep the `state` object from each
response and pass it back in the next call as `"state"`. On the first call omit
`state` (the script starts from an empty pipeline). Always pass `"today"` as a
`YYYY-MM-DD` string so date math (overdue, stalled, forecast) is stable.

## Inputs

Every call is one object:

```json
{ "action": "<name>", "state": { "deals": [...] }, "today": "2026-06-04", ...args }
```

Actions:

- **add_deal** — `name` (required), `amount`, `stage`, `contact`, `company`, `close_date`, `next_action`, `next_action_date`, `tags`. Returns the new deal (id `d1`, `d2`, …).
- **update_deal** — `deal_id` + any editable field (`name`, `amount`, `close_date`, `next_action`, `tags`, `probability`, …).
- **move_stage** — `deal_id`, `stage`. Records stage history; closing a deal clears its next action and sets `close_date` if empty.
- **log_interaction** — `deal_id`, `type` (`call`/`email`/`meeting`/`demo`/`note`/`other`), `note`, optional `date`, optional `next_action`/`next_action_date`.
- **set_next_action** — `deal_id`, `next_action`, `next_action_date`.
- **list_deals** — optional `filter` (`stage`, `open_only`, `tag`). Sorted by stage then value.
- **daily_priorities** — deals that are overdue or stalled (default `stale_days` 7), ranked with reasons.
- **pipeline_review** — counts and value per stage, open value, weighted pipeline, win rate, stalled deals.
- **forecast** — `commit` / `weighted` / `best_case` / `won_to_date`. Pass `month` (`"YYYY-MM"`) to scope by close date.

## Stages and probabilities

`lead` (0.10) → `qualified` (0.25) → `demo` (0.45) → `proposal` (0.65) →
`negotiation` (0.80) → `closed-won` (1.0). `closed-lost` (0.0) is the other
terminal stage. A deal may override its odds with a `probability` field; the
weighted forecast uses it instead of the stage default.

## Output contract

Every response is one JSON object. The `ok` field is the verdict:

- `ok: true` — the action applied. Read `state` (the full updated pipeline — persist it), `result` (the action's data), and `summary` (a one-line recap).
- `ok: false` — nothing changed. Read `error` for the reason and keep the state you already had.

```json
{ "ok": true, "action": "move_stage", "state": {...}, "result": {...}, "summary": "Moved Acme (d1) from 'qualified' to 'demo'." }
```

`list_deals`, `daily_priorities`, `pipeline_review`, and `forecast` are
read-only: they return `state` unchanged.

## Conversation pattern

1. User says "add Acme, $12k, just qualified them" → call `add_deal`.
2. User says "logged a call, sending the proposal Friday" → call `log_interaction` with `next_action`/`next_action_date`.
3. Each morning, "what's on my plate?" → call `daily_priorities` and read back the ranked list with reasons.
4. "How's the quarter looking?" → call `forecast` (optionally scoped to a month) and quote commit vs. weighted vs. best-case.

Surface the `summary` to the user in plain language; keep the full `state`
silently for the next call.

## Do not use for

- Persisting data yourself — there is no database. The host owns `state`.
- Sending email, dialing calls, or scheduling meetings. It records that they happened.
- Syncing with an external CRM or scraping leads. No network access exists.

## Limits

- Up to 5000 deals per pipeline; 5 MB of stdin.
- Wall time: 30 s. Pure stdlib Python 3 — no dependencies to install.

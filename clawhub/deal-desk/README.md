# Deal Desk

A sales CRM that lives in your chat. Track deals through every stage, log the
calls and emails, get a ranked daily priority list, review the whole pipeline,
and forecast revenue — without leaving the conversation or standing up a CRM.

The skill is a single deterministic Python script (`entry.py`): **JSON in on
stdin, JSON out on stdout.** No network, no credentials, no file writes. Your
agent holds the pipeline state and passes it back on each call, so the data
never leaves your conversation.

## What it does

- **Stages** — `lead → qualified → demo → proposal → negotiation → closed-won` (and `closed-lost`), with stage history per deal.
- **Interactions** — log calls, emails, meetings, demos, and notes against a deal, and set the next step in the same move.
- **Daily priorities** — what's overdue or stalled, ranked, with the reason for each.
- **Pipeline review** — count and value by stage, open value, weighted pipeline, win rate, stalled deals.
- **Forecast** — commit / weighted / best-case / won-to-date, optionally scoped to a close-date month.

## Quick start

```bash
# First call — no state yet
echo '{"action":"add_deal","today":"2026-06-04","name":"Acme Corp","amount":12000,"stage":"qualified"}' | python3 entry.py
```

The response includes a `state` object. Keep it and pass it back as `"state"`
on the next call:

```bash
echo '{"action":"daily_priorities","today":"2026-06-04","state":{"deals":[...]}}' | python3 entry.py
```

See [SKILL.md](./SKILL.md) for the full action and field reference.

## Runtime

- Python 3, standard library only. No dependencies to install.
- No network access, no credentials, no file writes.
- Up to 5000 deals per pipeline; 5 MB stdin; 30 s wall time.

## License

MIT-0 (MIT No Attribution). See [LICENSE](./LICENSE).

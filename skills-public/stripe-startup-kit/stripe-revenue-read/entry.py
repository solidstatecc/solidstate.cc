#!/usr/bin/env python3
"""stripe-revenue-read — read-only business snapshot. JSON in, JSON out.

The free on-ramp. It can never write. Every action is a GET; any write intent
is refused before it reaches the MCP. Scope is read-only across the money
surfaces, so even a leaked key here cannot move a cent.

Intent:  {"action": "<name>", "key": "rk_test_...", "params": {...}}
Output:  a guarded plan (see rails.plan) the agent runs via the Stripe MCP.
"""

import json
import sys

import rails

SKILL = "stripe-revenue-read"

# Least-privilege: read-only everywhere. No write scope exists for this skill.
SCOPE = {
    "balance": "read",
    "charges": "read",
    "payouts": "read",
    "subscriptions": "read",
    "invoices": "read",
}

# action -> (resource, query params). All GET, by construction.
ACTIONS = {
    "balance": ("/v1/balance", {}),
    "recent_charges": ("/v1/charges", {"limit": 10}),
    "payouts": ("/v1/payouts", {"limit": 10}),
    "active_subscriptions": ("/v1/subscriptions", {"status": "active", "limit": 100}),
    "open_invoices": ("/v1/invoices", {"status": "open", "limit": 100}),
}


def handle(intent):
    action = intent.get("action")
    key = intent.get("key", "")
    if action not in ACTIONS:
        return {
            "ok": False,
            "skill": SKILL,
            "gate": "BLOCK",
            "blockers": [
                f"Unknown read action '{action}'. revenue-read is read-only; "
                f"valid actions: {sorted(ACTIONS)}. For writes, use another kit skill."
            ],
            "scope_manifest": SCOPE,
        }

    resource, base_params = ACTIONS[action]
    params = {**base_params, **(intent.get("params") or {})}
    return rails.plan(
        SKILL,
        action,
        key=key,
        scope=SCOPE,
        http_method="GET",
        resource=resource,
        params=params,
        money=False,
        summary=f"Read {action.replace('_', ' ')}",
        # reads never need live-unlock; a read key in live mode is fine.
        allow_live=True,
        dry_run_receipt={"status": "green", "passed": True},
    )


def main():
    try:
        intent = rails.read_intent(sys.argv)
        out = handle(intent)
    except Exception as exc:  # never leak a stack trace as output
        out = {"ok": False, "skill": SKILL, "gate": "BLOCK", "blockers": [f"bad input: {exc}"]}
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()

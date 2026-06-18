#!/usr/bin/env python3
"""stripe-stand-up — get a sellable Stripe account, in test mode, safely.

The bootstrap skill. It emits the least-privilege key scope, checks the account
is actually sellable, plans a self-cleaning test-mode dry run, and — the load-
bearing rail — refuses to go live until that dry run comes back green.

Intent:  {"action": "<name>", "key": "rk_test_...", "params": {...},
           "dry_run_receipt": {...}, "confirmed": true}
Output:  a guarded plan, or for multi-step actions {gate, steps:[plan,...]}.
"""

import json
import sys

import rails

SKILL = "stripe-stand-up"

# Least-privilege: just enough to verify the account and run a test sale.
SCOPE = {
    "account": "read",
    "products": "write",
    "prices": "write",
    "payment_links": "write",
    "checkout_sessions": "read",
}


def _dry_run_steps(key, params):
    """Plan the throwaway test-mode sale used to prove the account works."""
    name = (params or {}).get("name", "Dry run — delete me")
    currency = (params or {}).get("currency", "usd")
    amount = int((params or {}).get("unit_amount", 100))  # $1.00 by default
    steps = [
        rails.plan(
            SKILL, "dry_run.product", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/products",
            params={"name": name}, summary="Create throwaway test product",
            allow_live=False,
        ),
        rails.plan(
            SKILL, "dry_run.price", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/prices",
            params={"unit_amount": amount, "currency": currency,
                    "product": "<product_id from previous step>"},
            summary="Create test price", allow_live=False,
        ),
        rails.plan(
            SKILL, "dry_run.payment_link", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/payment_links",
            params={"line_items": [{"price": "<price_id>", "quantity": 1}]},
            summary="Create test payment link", allow_live=False,
        ),
    ]
    return steps


def handle(intent):
    action = intent.get("action")
    key = intent.get("key", "")
    params = intent.get("params") or {}

    if action == "scope":
        return {
            "ok": True, "skill": SKILL, "gate": "GO", "scope_manifest": SCOPE,
            "guidance": (
                "Create a RESTRICTED key (rk_test_) in the Stripe Dashboard with "
                "exactly the scopes above, in TEST mode. Never paste a secret "
                "(sk_) key. Live keys are refused here until the dry run is green."
            ),
        }

    if action == "account_status":
        return rails.plan(
            SKILL, "account_status", key=key, scope=SCOPE,
            http_method="GET", resource="/v1/account", params={},
            summary="Check account is sellable (charges_enabled, details_submitted)",
            allow_live=True, dry_run_receipt={"status": "green", "passed": True},
        )

    if action == "dry_run":
        steps = _dry_run_steps(key, params)
        blocked = [b for s in steps for b in s["blockers"]]
        return {
            "ok": not blocked,
            "skill": SKILL,
            "gate": "BLOCK" if blocked else "GO",
            "steps": steps,
            "receipt_schema": {
                "status": "green|red",
                "passed": "bool — true only if every step returned a 2xx in test mode",
                "checked": ["product", "price", "payment_link"],
            },
            "next": (
                "Run each step's mcp_call in order (test mode). If all succeed, "
                "emit a green receipt, then deactivate the product to clean up. "
                "Only a green receipt unlocks go_live."
            ),
            "blockers": blocked,
        }

    if action == "go_live":
        # The rail: live is refused unless the dry run is green AND confirmed.
        receipt = intent.get("dry_run_receipt")
        confirmed = bool(intent.get("confirmed"))
        plan = rails.plan(
            SKILL, "go_live", key=intent.get("live_key", "rk_live_PLACEHOLDER"),
            scope=SCOPE, http_method="GET", resource="/v1/account", params={},
            money=True, summary="Switch to LIVE mode and begin real sales",
            confirmed=confirmed, allow_live=True, dry_run_receipt=receipt,
        )
        plan["next"] = (
            "go_live only clears with a green dry_run_receipt and an explicit "
            "human yes. On GO, swap in a freshly created rk_live_ key scoped as "
            "scope_manifest, and re-run the kit in live mode."
        )
        return plan

    return {
        "ok": False, "skill": SKILL, "gate": "BLOCK",
        "blockers": [f"Unknown action '{action}'. "
                     "Valid: scope, account_status, dry_run, go_live."],
        "scope_manifest": SCOPE,
    }


def main():
    try:
        intent = rails.read_intent(sys.argv)
        out = handle(intent)
    except Exception as exc:
        out = {"ok": False, "skill": SKILL, "gate": "BLOCK", "blockers": [f"bad input: {exc}"]}
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""stripe-product-to-price — a file, course, or idea -> catalog + payment link.

Turns one thing-to-sell into a correct Product, a Price, and a shareable Payment
Link. Test mode by default. A live payment link is a real sales surface, so in
live mode the link step is confirm-gated; the catalog objects are not.

Intent:  {"action": "create", "key": "rk_test_...",
           "params": {"name","description","unit_amount","currency",
                      "kind":"one_time|recurring","interval":"month"},
           "confirmed": true}
Output:  {gate, steps:[plan,...]} — run each mcp_call in order via the Stripe MCP.
"""

import json
import sys

import rails

SKILL = "stripe-product-to-price"

SCOPE = {
    "products": "write",
    "prices": "write",
    "payment_links": "write",
}


def _validate(p):
    errs = []
    if not p.get("name"):
        errs.append("name is required.")
    amt = p.get("unit_amount")
    if not isinstance(amt, int) or amt <= 0:
        errs.append("unit_amount must be a positive integer in the smallest "
                    "currency unit (e.g. 1500 = $15.00).")
    if not p.get("currency"):
        errs.append("currency is required (e.g. 'usd', 'aud').")
    if p.get("kind", "one_time") == "recurring" and not p.get("interval"):
        errs.append("interval is required for recurring prices (day/week/month/year).")
    return errs


def handle(intent):
    if intent.get("action") not in (None, "create"):
        return {"ok": False, "skill": SKILL, "gate": "BLOCK",
                "blockers": [f"Unknown action '{intent.get('action')}'. Only 'create'."],
                "scope_manifest": SCOPE}

    key = intent.get("key", "")
    p = intent.get("params") or {}
    confirmed = bool(intent.get("confirmed"))
    allow_live = bool(intent.get("allow_live"))
    receipt = intent.get("dry_run_receipt")

    errs = _validate(p)
    if errs:
        return {"ok": False, "skill": SKILL, "gate": "BLOCK",
                "blockers": errs, "scope_manifest": SCOPE}

    price_params = {"unit_amount": p["unit_amount"], "currency": p["currency"],
                    "product": "<product_id from previous step>"}
    if p.get("kind") == "recurring":
        price_params["recurring"] = {"interval": p["interval"]}

    steps = [
        rails.plan(
            SKILL, "create.product", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/products",
            params={"name": p["name"], "description": p.get("description", "")},
            summary=f"Create product '{p['name']}'",
            allow_live=allow_live, dry_run_receipt=receipt,
        ),
        rails.plan(
            SKILL, "create.price", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/prices", params=price_params,
            summary="Create price", allow_live=allow_live, dry_run_receipt=receipt,
        ),
        rails.plan(
            SKILL, "create.payment_link", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/payment_links",
            params={"line_items": [{"price": "<price_id>", "quantity": 1}]},
            summary="Create shareable payment link",
            money=True,  # a live link is a real sales surface -> confirm in live
            confirmed=confirmed, allow_live=allow_live, dry_run_receipt=receipt,
        ),
    ]
    blocked = [b for s in steps for b in s["blockers"]]
    needs_confirm = any(s["gate"] == "CONFIRM" for s in steps)
    gate = "BLOCK" if blocked else ("CONFIRM" if needs_confirm else "GO")
    return {
        "ok": not blocked,
        "skill": SKILL,
        "gate": gate,
        "steps": steps,
        "scope_manifest": SCOPE,
        "next": (
            "Run product -> price -> payment_link in order, substituting each "
            "returned id into the next step's params. In live mode, show the "
            "payment_link confirm_card and wait for a human yes before creating it."
        ),
        "blockers": blocked,
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

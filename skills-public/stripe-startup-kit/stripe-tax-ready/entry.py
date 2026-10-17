#!/usr/bin/env python3
"""stripe-tax-ready — Stripe Tax + obligations, settled before go-live.

Reads current tax posture, configures Stripe Tax, and registers a jurisdiction.
A tax registration is a real filing obligation, not a catalog edit — so register
and live config are confirm-gated and carry an obligation warning. AU specifics
(GST, reverse-charge, ABN) live in references/au-tax.md.

Intent:  {"action":"check|configure|register", "key":"rk_test_...",
           "params":{"country":"AU", ...}, "confirmed":true}
Output:  guarded plan(s) for the Stripe MCP.
"""

import json
import sys

import rails

SKILL = "stripe-tax-ready"

SCOPE = {
    "tax_settings": "write",
    "tax_registrations": "write",
    "tax_calculations": "read",
    "products": "read",
}


def handle(intent):
    action = intent.get("action", "check")
    key = intent.get("key", "")
    p = intent.get("params") or {}
    confirmed = bool(intent.get("confirmed"))
    allow_live = bool(intent.get("allow_live"))
    receipt = intent.get("dry_run_receipt")

    if action == "check":
        steps = [
            rails.plan(SKILL, "check.settings", key=key, scope=SCOPE,
                       http_method="GET", resource="/v1/tax/settings", params={},
                       summary="Read Stripe Tax settings",
                       allow_live=True, dry_run_receipt={"status": "green", "passed": True}),
            rails.plan(SKILL, "check.registrations", key=key, scope=SCOPE,
                       http_method="GET", resource="/v1/tax/registrations",
                       params={"limit": 100}, summary="List active tax registrations",
                       allow_live=True, dry_run_receipt={"status": "green", "passed": True}),
        ]
        blocked = [b for s in steps for b in s["blockers"]]
        return {"ok": not blocked, "skill": SKILL,
                "gate": "BLOCK" if blocked else "GO", "steps": steps,
                "scope_manifest": SCOPE,
                "next": "Compare registrations against where you actually have a "
                        "tax obligation before enabling live sales.",
                "blockers": blocked}

    if action == "configure":
        plan = rails.plan(
            SKILL, "configure", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/tax/settings",
            params={"defaults": p.get("defaults", {"tax_behavior": "exclusive"}),
                    "head_office": p.get("head_office", {})},
            money=True,  # live tax config affects every invoice -> confirm in live
            summary="Configure Stripe Tax defaults",
            confirmed=confirmed, allow_live=allow_live, dry_run_receipt=receipt,
        )
        return plan

    if action == "register":
        country = (p.get("country") or "").upper()
        if len(country) != 2:
            return {"ok": False, "skill": SKILL, "gate": "BLOCK",
                    "blockers": ["params.country must be a 2-letter ISO code (e.g. 'AU')."],
                    "scope_manifest": SCOPE}
        plan = rails.plan(
            SKILL, "register", key=key, scope=SCOPE,
            http_method="POST", resource="/v1/tax/registrations",
            params={"country": country,
                    "type": p.get("type", "standard"),
                    "active_from": p.get("active_from", "now")},
            money=True,  # a registration is a filing obligation -> confirm
            summary=f"Register a tax obligation in {country}",
            confirmed=confirmed, allow_live=allow_live, dry_run_receipt=receipt,
        )
        plan["warnings"].append(
            "Creating a tax registration starts a real filing/remittance "
            "obligation in this jurisdiction. Confirm you are actually liable "
            "before proceeding."
        )
        if country == "AU":
            plan["warnings"].append(
                "AU: GST registration generally applies at A$75k+ turnover. Hold "
                "your ABN ready; B2B reverse-charge handling differs from B2C. "
                "See references/au-tax.md."
            )
        return plan

    return {"ok": False, "skill": SKILL, "gate": "BLOCK",
            "blockers": [f"Unknown action '{action}'. Valid: check, configure, register."],
            "scope_manifest": SCOPE}


def main():
    try:
        intent = rails.read_intent(sys.argv)
        out = handle(intent)
    except Exception as exc:
        out = {"ok": False, "skill": SKILL, "gate": "BLOCK", "blockers": [f"bad input: {exc}"]}
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()

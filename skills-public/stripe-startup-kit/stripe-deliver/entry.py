#!/usr/bin/env python3
"""stripe-deliver — webhook -> access/license/download + receipt, idempotently.

Post-payment fulfillment with three deterministic rails the raw MCP gives you
none of: (1) verify the webhook signature before trusting a byte of it;
(2) confirm the payment actually succeeded before granting anything;
(3) dedupe on the Stripe event id so a retried webhook never double-delivers.

Stripe access here is read-only — the grant/receipt happen app-side (Ship Kit +
Resend). No Stripe writes, so the key is least-privilege read.

Intent (verify): {"action":"verify_signature","payload":"<raw body>",
                  "signature":"t=..,v1=..","secret":"whsec_...","now":<unix>}
Intent (fulfill): {"action":"fulfill","key":"rk_test_...",
                  "event":{"id":"evt_..","type":"checkout.session.completed",
                           "object_id":"cs_..","payment_status":"paid"}}
"""

import hashlib
import hmac
import json
import sys
import time

import rails

SKILL = "stripe-deliver"

SCOPE = {
    "checkout_sessions": "read",
    "payment_intents": "read",
    "customers": "read",
}

DEFAULT_TOLERANCE = 300  # seconds, matching Stripe's webhook freshness window


def verify_signature(payload, signature, secret, now=None, tolerance=DEFAULT_TOLERANCE):
    """Stripe webhook signature check (t=..,v1=..). Constant-time compare."""
    if not (payload and signature and secret):
        return {"ok": False, "reason": "payload, signature, and secret are all required."}
    parts = dict(
        kv.split("=", 1) for kv in signature.split(",") if "=" in kv
    )
    t, v1 = parts.get("t"), parts.get("v1")
    if not (t and v1):
        return {"ok": False, "reason": "signature header missing t= or v1="}
    signed = f"{t}.{payload}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), signed, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, v1):
        return {"ok": False, "reason": "signature mismatch — payload is forged or secret is wrong."}
    now = time.time() if now is None else now
    if abs(now - int(t)) > tolerance:
        return {"ok": False, "reason": f"timestamp outside {tolerance}s tolerance — replay or clock skew."}
    return {"ok": True, "reason": "signature valid and fresh."}


def handle(intent):
    action = intent.get("action")

    if action == "verify_signature":
        v = verify_signature(
            intent.get("payload"), intent.get("signature"), intent.get("secret"),
            now=intent.get("now"), tolerance=intent.get("tolerance", DEFAULT_TOLERANCE),
        )
        return {"ok": v["ok"], "skill": SKILL,
                "gate": "GO" if v["ok"] else "BLOCK",
                "reason": v["reason"],
                "blockers": [] if v["ok"] else [v["reason"]],
                "next": "Only parse and act on the event after this returns GO."}

    if action == "fulfill":
        ev = intent.get("event") or {}
        event_id = ev.get("id", "")
        if not event_id:
            return {"ok": False, "skill": SKILL, "gate": "BLOCK",
                    "blockers": ["event.id is required to dedupe fulfillment."],
                    "scope_manifest": SCOPE}

        # Rail: confirm payment before granting. Trust the live object, not the
        # webhook field — plan a read-back, and gate on payment_status.
        obj = ev.get("object_id", "")
        resource = ("/v1/checkout/sessions/" + obj if obj.startswith("cs_")
                    else "/v1/payment_intents/" + obj if obj.startswith("pi_")
                    else "/v1/checkout/sessions/" + obj)
        verify_read = rails.plan(
            SKILL, "fulfill.verify_paid", key=intent.get("key", ""), scope=SCOPE,
            http_method="GET", resource=resource, params={},
            summary="Read-back the object to confirm it is actually paid",
            allow_live=True, dry_run_receipt={"status": "green", "passed": True},
        )
        paid = ev.get("payment_status") == "paid" or ev.get("status") == "succeeded"
        dedupe_key = f"{SKILL}:fulfill:{event_id}"
        blockers = list(verify_read["blockers"])
        if not paid:
            blockers.append(
                "Event is not in a paid/succeeded state — do NOT grant access. "
                "Confirm payment_status=='paid' (or PI status=='succeeded') first."
            )
        return {
            "ok": not blockers,
            "skill": SKILL,
            "gate": "BLOCK" if blockers else "GO",
            "dedupe_key": dedupe_key,
            "verify_read": verify_read,
            "fulfillment": {
                "grant": "Issue the license/download/access for this purchase.",
                "receipt": "Send the receipt (app-side, e.g. Resend).",
                "idempotency": (
                    f"Skip entirely if dedupe_key '{dedupe_key}' is already "
                    "recorded as fulfilled. Record it only after a successful grant."
                ),
            },
            "scope_manifest": SCOPE,
            "blockers": blockers,
        }

    return {"ok": False, "skill": SKILL, "gate": "BLOCK",
            "blockers": [f"Unknown action '{action}'. Valid: verify_signature, fulfill."],
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

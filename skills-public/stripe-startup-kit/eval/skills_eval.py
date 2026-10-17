#!/usr/bin/env python3
"""Per-skill eval — one suite per kit skill. No eval, no handoff.

Each case asserts a guard's gate (and, where it matters, a warning or key)
against the doctrine. Covers the three classes the authoring guide requires:
normal operations, edge cases, and out-of-scope intents that must be refused.

Run:  python3 eval/skills_eval.py   (exit 0 = all green)
"""

import hashlib
import hmac
import json
import os
import subprocess
import sys

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GREEN = {"status": "green", "passed": True}


def run(skill, intent):
    p = subprocess.run(
        [sys.executable, os.path.join(KIT, skill, "entry.py"), "--json", json.dumps(intent)],
        capture_output=True, text=True, stdin=subprocess.DEVNULL,
    )
    if p.returncode != 0:
        return {"_crash": p.stderr.strip()[-200:]}
    return json.loads(p.stdout)


def gate_of(out):
    return out.get("gate")


# (label, skill, intent, predicate) — predicate(out) -> bool
def valid_sig(secret, payload, t):
    return "t=%s,v1=%s" % (t, hmac.new(secret.encode(), f"{t}.{payload}".encode(), hashlib.sha256).hexdigest())


CASES = [
    # --- stripe-stand-up ---
    ("stand-up: scope manifest returns GO", "stripe-stand-up",
     {"action": "scope", "key": "rk_test_x"}, lambda o: gate_of(o) == "GO" and o.get("scope_manifest")),
    ("stand-up: dry_run plans test-mode steps (GO)", "stripe-stand-up",
     {"action": "dry_run", "key": "rk_test_x"}, lambda o: gate_of(o) == "GO" and len(o.get("steps", [])) == 3),
    ("stand-up: go_live blocked on red receipt", "stripe-stand-up",
     {"action": "go_live", "live_key": "rk_live_x", "confirmed": True, "dry_run_receipt": {"status": "red", "passed": False}},
     lambda o: gate_of(o) == "BLOCK"),
    ("stand-up: go_live confirm on green receipt, unconfirmed", "stripe-stand-up",
     {"action": "go_live", "live_key": "rk_live_x", "confirmed": False, "dry_run_receipt": GREEN},
     lambda o: gate_of(o) == "CONFIRM"),
    ("stand-up: unknown action refused", "stripe-stand-up",
     {"action": "delete_account", "key": "rk_test_x"}, lambda o: gate_of(o) == "BLOCK"),

    # --- stripe-product-to-price ---
    ("p2p: valid test create -> GO", "stripe-product-to-price",
     {"action": "create", "key": "rk_test_x", "params": {"name": "X", "unit_amount": 1500, "currency": "usd"}},
     lambda o: gate_of(o) == "GO"),
    ("p2p: missing unit_amount refused", "stripe-product-to-price",
     {"action": "create", "key": "rk_test_x", "params": {"name": "X", "currency": "usd"}},
     lambda o: gate_of(o) == "BLOCK"),
    ("p2p: recurring without interval refused", "stripe-product-to-price",
     {"action": "create", "key": "rk_test_x", "params": {"name": "X", "unit_amount": 900, "currency": "usd", "kind": "recurring"}},
     lambda o: gate_of(o) == "BLOCK"),
    ("p2p: live not unlocked -> BLOCK", "stripe-product-to-price",
     {"action": "create", "key": "rk_live_x", "params": {"name": "X", "unit_amount": 1500, "currency": "usd"}},
     lambda o: gate_of(o) == "BLOCK"),
    ("p2p: every write step carries an idempotency key", "stripe-product-to-price",
     {"action": "create", "key": "rk_test_x", "params": {"name": "X", "unit_amount": 1500, "currency": "usd"}},
     lambda o: all(s.get("idempotency_key") for s in o.get("steps", []))),

    # --- stripe-tax-ready ---
    ("tax: check is read-only GO", "stripe-tax-ready",
     {"action": "check", "key": "rk_test_x"}, lambda o: gate_of(o) == "GO"),
    ("tax: register AU carries obligation warning", "stripe-tax-ready",
     {"action": "register", "key": "rk_test_x", "params": {"country": "AU"}},
     lambda o: any("obligation" in w for w in o.get("warnings", []))),
    ("tax: register bad country refused", "stripe-tax-ready",
     {"action": "register", "key": "rk_test_x", "params": {"country": "AUS"}},
     lambda o: gate_of(o) == "BLOCK"),

    # --- stripe-deliver ---
    ("deliver: forged signature blocked", "stripe-deliver",
     {"action": "verify_signature", "payload": '{"id":"evt_1"}', "signature": "t=1,v1=bad", "secret": "whsec_x", "now": 1},
     lambda o: gate_of(o) == "BLOCK"),
    ("deliver: valid signature passes", "stripe-deliver",
     {"action": "verify_signature", "payload": '{"id":"evt_1"}', "signature": valid_sig("whsec_x", '{"id":"evt_1"}', "100"), "secret": "whsec_x", "now": 100},
     lambda o: gate_of(o) == "GO"),
    ("deliver: stale timestamp blocked (replay)", "stripe-deliver",
     {"action": "verify_signature", "payload": '{"id":"evt_1"}', "signature": valid_sig("whsec_x", '{"id":"evt_1"}', "100"), "secret": "whsec_x", "now": 100000},
     lambda o: gate_of(o) == "BLOCK"),
    ("deliver: unpaid event refused", "stripe-deliver",
     {"action": "fulfill", "key": "rk_test_x", "event": {"id": "evt_1", "object_id": "cs_1", "payment_status": "unpaid"}},
     lambda o: gate_of(o) == "BLOCK"),
    ("deliver: paid event -> GO with dedupe key", "stripe-deliver",
     {"action": "fulfill", "key": "rk_test_x", "event": {"id": "evt_1", "object_id": "cs_1", "payment_status": "paid"}},
     lambda o: gate_of(o) == "GO" and o.get("dedupe_key") == "stripe-deliver:fulfill:evt_1"),

    # --- stripe-revenue-read ---
    ("revenue-read: balance GO", "stripe-revenue-read",
     {"action": "balance", "key": "rk_test_x"}, lambda o: gate_of(o) == "GO"),
    ("revenue-read: live read key allowed (read-only)", "stripe-revenue-read",
     {"action": "balance", "key": "rk_live_x"}, lambda o: gate_of(o) == "GO"),
    ("revenue-read: write intent refused", "stripe-revenue-read",
     {"action": "create_refund", "key": "rk_test_x"}, lambda o: gate_of(o) == "BLOCK"),
    ("revenue-read: unknown key prefix refused", "stripe-revenue-read",
     {"action": "balance", "key": "nope_123"}, lambda o: gate_of(o) == "BLOCK"),
]


def main():
    passed = 0
    for label, skill, intent, pred in CASES:
        out = run(skill, intent)
        ok = False
        try:
            ok = bool(pred(out)) and "_crash" not in out
        except Exception:
            ok = False
        passed += ok
        print(f"[{'PASS' if ok else 'FAIL'}] {label}")
        if not ok:
            print(f"        -> {json.dumps(out)[:300]}")
    print(f"\n{passed}/{len(CASES)} cases passed")
    return 0 if passed == len(CASES) else 1


if __name__ == "__main__":
    sys.exit(main())

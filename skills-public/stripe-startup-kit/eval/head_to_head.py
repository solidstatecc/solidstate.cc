#!/usr/bin/env python3
"""Head-to-head eval — doctrine rails vs raw Stripe MCP. The gating proof.

The kit's whole thesis: the four-part safety doctrine is the moat because the
Stripe MCP only *recommends* it, never enforces it. This eval tests that claim
deterministically. If the rails do not beat raw MCP by a meaningful margin, the
kit is just a wrapper — this script exits non-zero and the build must STOP and
flag on SOL-86 (per the AUTHOR brief).

Two actors face identical adversarial intents:

  rails    — the actual kit guards (each skill's entry.py, run as a subprocess).
  raw_mcp  — a faithful model of the documented Stripe MCP baseline. Per the
             RESEARCH gate (SOL-86, first-party audit, 2026-06-18): the hosted
             MCP "will happily run live-mode writes; nothing blocks it pending a
             green dry run"; least-privilege keys and human confirmation are
             "recommended in prose only — not enforced"; "no test-mode-first or
             idempotency default." So raw_mcp executes every write as-is, with
             none of the four rails. This is the documented behavior, not a
             strawman — see RESULTS.md for the quoted sources.

No network. No Stripe calls. Pure decision-layer comparison.
"""

import json
import os
import subprocess
import sys

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GREEN = {"status": "green", "passed": True}
P2P = "stripe-product-to-price"
BASE = {"name": "Test thing", "unit_amount": 1500, "currency": "usd"}


def run_skill(skill, intent):
    """Invoke a skill's entry.py exactly as an agent runtime would."""
    p = subprocess.run(
        [sys.executable, os.path.join(KIT, skill, "entry.py"), "--json", json.dumps(intent)],
        capture_output=True, text=True, stdin=subprocess.DEVNULL,
    )
    return json.loads(p.stdout)


def rails_facts(out):
    """Normalize a guard's output to the dimensions the eval judges."""
    steps = out.get("steps", [])
    idem = out.get("idempotency_key") or next(
        (s.get("idempotency_key") for s in steps if s.get("idempotency_key")), None
    )
    warns = list(out.get("warnings", [])) + [w for s in steps for w in s.get("warnings", [])]
    return {
        "gate": out.get("gate"),
        "idem": idem,
        "lp_warning": any("over-privileged" in w or "restricted" in w for w in warns),
    }


# raw_mcp: executes every write unguarded — the documented baseline.
RAW_MCP = {"gate": "EXECUTE", "idem": None, "lp_warning": False}


def judge(dim, facts):
    if dim == "test_first":
        return facts["gate"] == "BLOCK"
    if dim == "human_confirm":
        return facts["gate"] == "CONFIRM"
    if dim == "idempotent":
        return facts["idem"] is not None
    if dim == "least_priv":
        return facts["lp_warning"]
    if dim == "fair_allow":
        return facts["gate"] in ("GO", "EXECUTE")
    raise ValueError(dim)


# Six scenarios across the four rails + a fairness anchor (rails must ALLOW when
# conditions are properly met, or they'd be a useless blanket block).
SCENARIOS = [
    ("test mode first: live key, not unlocked", "test_first", P2P,
     {"action": "create", "key": "sk_live_x", "params": BASE}),
    ("test mode first: live unlock without green dry run", "test_first", P2P,
     {"action": "create", "key": "rk_live_x", "allow_live": True,
      "dry_run_receipt": {"status": "red", "passed": False}, "params": BASE}),
    ("human-confirm: live money move, not yet confirmed", "human_confirm", P2P,
     {"action": "create", "key": "rk_live_x", "allow_live": True,
      "dry_run_receipt": GREEN, "params": BASE}),
    ("idempotent: write carries an idempotency key", "idempotent", P2P,
     {"action": "create", "key": "rk_test_x", "params": BASE}),
    ("least-privilege: secret key flagged over-privileged", "least_priv", P2P,
     {"action": "create", "key": "sk_test_x", "params": BASE}),
    ("fairness: properly unlocked + confirmed -> allowed", "fair_allow", P2P,
     {"action": "create", "key": "rk_live_x", "allow_live": True, "confirmed": True,
      "dry_run_receipt": GREEN, "params": BASE}),
]


def main():
    rows, rails_score, raw_score = [], 0, 0
    for name, dim, skill, intent in SCENARIOS:
        rf = rails_facts(run_skill(skill, intent))
        rp, mp = judge(dim, rf), judge(dim, RAW_MCP)
        rails_score += rp
        raw_score += mp
        rows.append((name, dim, "PASS" if rp else "FAIL", "PASS" if mp else "FAIL",
                     rf["gate"]))

    # Idempotency determinism: identical intent twice must yield the same key.
    a = rails_facts(run_skill(P2P, {"action": "create", "key": "rk_test_x", "params": BASE}))
    b = rails_facts(run_skill(P2P, {"action": "create", "key": "rk_test_x", "params": BASE}))
    deterministic = a["idem"] == b["idem"] and a["idem"] is not None

    delta = rails_score - raw_score
    # Meaningful margin: rails must catch at least 4 of 6, and beat raw by >= 3.
    passed = rails_score >= 5 and delta >= 3 and deterministic

    print("HEAD-TO-HEAD — doctrine rails vs raw Stripe MCP\n")
    print(f"{'scenario':52} {'rail':14} {'rails':6} {'raw_mcp':8} gate")
    print("-" * 92)
    for name, dim, rp, mp, gate in rows:
        print(f"{name:52} {dim:14} {rp:6} {mp:8} {gate}")
    print("-" * 92)
    print(f"{'SCORE':52} {'':14} {str(rails_score)+'/6':6} {str(raw_score)+'/6':8}")
    print(f"\nidempotency deterministic across retries: {'YES' if deterministic else 'NO'}")
    print(f"rails advantage (delta): +{delta}")
    print(f"\nVERDICT: {'RAILS BEAT RAW MCP — build is not a wrapper.' if passed else 'NO MEANINGFUL DELTA — STOP and flag on SOL-86.'}")
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())

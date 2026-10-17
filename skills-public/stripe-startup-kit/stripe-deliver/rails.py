"""Stripe Startup Kit — safety rails. Deterministic doctrine enforcement.

Pure stdlib. No network. No Stripe calls. The Stripe MCP makes the API calls;
these rails decide whether a call is allowed and exactly how it must be shaped.
We compose the MCP, we never wrap it.

The doctrine — enforced here, not merely recommended (this is the moat):

  1. test mode first   live mode is refused unless the operator explicitly
                       unlocks it with a green dry-run receipt + confirmation.
  2. least-privilege   restricted (rk_) keys, scoped per skill. A secret (sk_)
                       key is over-privileged and earns a warning + the exact
                       minimal scope to recreate the key correctly.
  3. human-confirm     a money-moving action in live mode never auto-runs; it
                       returns a confirm card the agent must show a human first.
  4. idempotent        every write carries a deterministic Idempotency-Key, so a
                       retried intent dedupes instead of double-charging.

This module is identical across every skill in the kit (copied into each bundle
so each skill stays self-contained and publishable). Source of truth lives at
the kit root; sync_rails.py copies it into the skill folders.
"""

import hashlib
import json

# --- Stripe key taxonomy (prefix is authoritative) ------------------------

_KEY_PREFIXES = {
    "sk_test_": ("secret", "test"),
    "sk_live_": ("secret", "live"),
    "rk_test_": ("restricted", "test"),
    "rk_live_": ("restricted", "live"),
    "pk_test_": ("publishable", "test"),
    "pk_live_": ("publishable", "live"),
}


def classify_key(key):
    """Return {kind, mode} from a Stripe key prefix. Never logs the key body."""
    key = (key or "").strip()
    for prefix, (kind, mode) in _KEY_PREFIXES.items():
        if key.startswith(prefix):
            return {"kind": kind, "mode": mode}
    return {"kind": "unknown", "mode": "unknown"}


# --- Idempotency ----------------------------------------------------------

def canonical_json(obj):
    """Stable serialization so the same intent always hashes the same."""
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str)


def idempotency_key(skill, action, params):
    """Deterministic Idempotency-Key for a write. Same intent -> same key.

    Stripe dedupes writes that share an Idempotency-Key for 24h, so a retried
    'create payment link' returns the original object instead of a duplicate.
    """
    digest = hashlib.sha256(canonical_json(params).encode("utf-8")).hexdigest()
    return f"{skill}:{action}:{digest[:32]}"


# --- Least-privilege scope ------------------------------------------------

def check_key(key, *, need_write, allow_live, dry_run_receipt):
    """Validate a key against the test-first + least-privilege rails.

    Returns (blockers, warnings) — lists of human-readable strings.
    """
    blockers, warnings = [], []
    info = classify_key(key)
    kind, mode = info["kind"], info["mode"]

    if kind == "unknown":
        blockers.append(
            "Key prefix unrecognized. Expected rk_test_ (preferred), sk_test_, "
            "or — only when deliberately going live — rk_live_/sk_live_."
        )
        return blockers, warnings

    # Rail 1: test mode first. Live is refused unless explicitly unlocked.
    if mode == "live":
        if not allow_live:
            blockers.append(
                "Live key supplied but live mode is not unlocked. Run the dry "
                "run, then re-invoke with allow_live=true and the green "
                "dry_run_receipt. Default is test mode."
            )
        elif not _receipt_is_green(dry_run_receipt):
            blockers.append(
                "Live mode requested without a green dry-run receipt. A passing "
                "test-mode dry run is required before any live write."
            )

    # Rail 2: least privilege. Prefer restricted keys; refuse publishable.
    if kind == "publishable":
        blockers.append(
            "Publishable (pk_) key cannot perform server-side writes/reads. "
            "Use a restricted rk_ key scoped to this skill."
        )
    elif kind == "secret":
        warnings.append(
            "Secret (sk_) key is over-privileged for this skill. Create a "
            "restricted rk_ key with only the scope below and use that instead."
        )

    if need_write and kind == "publishable":
        # already blocked above; keep explicit for clarity
        pass

    return blockers, warnings


def _receipt_is_green(receipt):
    """A dry-run receipt is green only if it explicitly passed."""
    if not isinstance(receipt, dict):
        return False
    return receipt.get("status") == "green" and receipt.get("passed") is True


# --- Human-confirm card ---------------------------------------------------

def confirm_card(action, summary, *, mode, money, params):
    """The card the agent must show a human before a live money move."""
    return {
        "action": action,
        "summary": summary,
        "mode": mode,
        "moves_money": bool(money),
        "requires_confirmation": bool(money and mode == "live"),
        "what_will_happen": params,
        "prompt": (
            f"Confirm: {summary} (LIVE — real money). Reply 'yes' to proceed."
            if money and mode == "live"
            else f"{summary} ({mode} mode — no live money at stake)."
        ),
    }


# --- The gate -------------------------------------------------------------

def plan(
    skill,
    action,
    *,
    key,
    scope,
    http_method,
    resource,
    params,
    money=False,
    summary="",
    confirmed=False,
    allow_live=False,
    dry_run_receipt=None,
):
    """Produce a guarded, idempotent, confirm-gated plan for one MCP call.

    Returns a JSON-serializable dict. The agent reads `gate`:
      BLOCK   -> do not call the MCP; fix the blockers.
      CONFIRM -> show confirm_card to the human; only proceed on an explicit yes.
      GO      -> safe to make `mcp_call` now.

    This function never touches the network. It plans; the agent (via the
    Stripe MCP) executes.
    """
    is_write = http_method.upper() != "GET"
    blockers, warnings = check_key(
        key, need_write=is_write, allow_live=allow_live, dry_run_receipt=dry_run_receipt
    )
    mode = classify_key(key)["mode"]

    card = confirm_card(action, summary or action, mode=mode, money=money, params=params)
    idem = idempotency_key(skill, action, params) if is_write else None

    mcp_call = {
        # The exact call to make through the Stripe MCP, after the gate clears.
        "tool": "stripe_api_write" if is_write else "stripe_api_read",
        "http_method": http_method.upper(),
        "resource": resource,
        "params": params,
    }
    if idem:
        mcp_call["headers"] = {"Idempotency-Key": idem}

    if blockers:
        gate = "BLOCK"
    elif card["requires_confirmation"] and not confirmed:
        gate = "CONFIRM"
    else:
        gate = "GO"

    return {
        "ok": gate != "BLOCK",
        "skill": skill,
        "action": action,
        "mode": mode,
        "gate": gate,
        "scope_manifest": scope,
        "idempotency_key": idem,
        "confirm_card": card,
        "mcp_call": mcp_call,
        "blockers": blockers,
        "warnings": warnings,
    }


def read_intent(argv, stdin_text=None):
    """Parse JSON intent from --json <obj>, a positional arg, or stdin.

    stdin is read lazily and only when no inline arg is given, so passing
    --json never blocks on an open-but-empty stdin (e.g. under a test harness).
    """
    if "--json" in argv:
        raw = argv[argv.index("--json") + 1]
    elif len(argv) > 1 and argv[1].strip().startswith("{"):
        raw = argv[1]
    else:
        if stdin_text is None:
            import sys
            stdin_text = "" if sys.stdin.isatty() else sys.stdin.read()
        raw = stdin_text if stdin_text and stdin_text.strip() else None
    if not raw:
        return {}
    return json.loads(raw)

#!/usr/bin/env python3
"""Deal Desk — a CRM that lives in chat.

JSON in on stdin, JSON out on stdout. Pure stdlib, no network, no credentials,
no file writes. The caller owns persistence: every response echoes the full
updated `state`, and the caller passes it back on the next call.

Contract
--------
Input:  {"action": "<name>", "state": {<crm>}?, "today": "YYYY-MM-DD"?, ...args}
Output (success): {"ok": true,  "action": "...", "state": {...}, "result": {...}, "summary": "..."}
Output (error):   {"ok": false, "action": "...", "error": "..."}

`ok` is the verdict: true = applied, false = nothing changed. On error the
caller should keep the state it already had — this script never mutates input
in place, it returns a fresh copy.
"""

import sys
import json
import copy
from datetime import date, datetime

# --- Pipeline definition ----------------------------------------------------

# Ordered open stages, then the two terminal stages.
OPEN_STAGES = ["lead", "qualified", "demo", "proposal", "negotiation"]
WON = "closed-won"
LOST = "closed-lost"
STAGES = OPEN_STAGES + [WON, LOST]

# Win probability per stage. Used for the weighted forecast. These are the
# default ladder; a deal may override with its own "probability" field.
STAGE_PROBABILITY = {
    "lead": 0.10,
    "qualified": 0.25,
    "demo": 0.45,
    "proposal": 0.65,
    "negotiation": 0.80,
    WON: 1.0,
    LOST: 0.0,
}

# A deal with no interaction in this many days is "stalled".
DEFAULT_STALE_DAYS = 7

INTERACTION_TYPES = ["call", "email", "meeting", "demo", "note", "other"]


# --- Helpers ----------------------------------------------------------------

class DealDeskError(Exception):
    """Raised for any caller-facing validation failure."""


def parse_date(value, field):
    if not isinstance(value, str):
        raise DealDeskError("%s must be a YYYY-MM-DD string" % field)
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        raise DealDeskError("%s is not a valid YYYY-MM-DD date: %r" % (field, value))


def today_of(payload):
    raw = payload.get("today")
    if raw is None:
        return date.today()
    return parse_date(raw, "today")


def empty_state():
    return {"deals": []}


def load_state(payload):
    state = payload.get("state")
    if state is None:
        return empty_state()
    if not isinstance(state, dict):
        raise DealDeskError("state must be an object")
    deals = state.get("deals", [])
    if not isinstance(deals, list):
        raise DealDeskError("state.deals must be a list")
    fresh = copy.deepcopy(state)
    fresh.setdefault("deals", [])
    return fresh


def next_deal_id(deals):
    """Deterministic sequential id: highest existing dNN + 1, else d1."""
    highest = 0
    for d in deals:
        did = str(d.get("id", ""))
        if did.startswith("d") and did[1:].isdigit():
            highest = max(highest, int(did[1:]))
    return "d%d" % (highest + 1)


def find_deal(state, deal_id):
    for d in state["deals"]:
        if d.get("id") == deal_id:
            return d
    raise DealDeskError("no deal with id %r" % deal_id)


def is_open(deal):
    return deal.get("stage") in OPEN_STAGES


def deal_probability(deal):
    if isinstance(deal.get("probability"), (int, float)):
        return float(deal["probability"])
    return STAGE_PROBABILITY.get(deal.get("stage"), 0.0)


def amount_of(deal):
    amt = deal.get("amount", 0)
    return float(amt) if isinstance(amt, (int, float)) else 0.0


def round2(x):
    return round(float(x) + 0.0, 2)


def days_since(iso, today):
    if not iso:
        return None
    try:
        d = datetime.strptime(iso, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None
    return (today - d).days


def last_interaction_date(deal):
    dates = [i.get("date") for i in deal.get("interactions", []) if i.get("date")]
    return max(dates) if dates else None


# --- Actions ----------------------------------------------------------------

def act_add_deal(state, payload, today):
    name = payload.get("name")
    if not name or not isinstance(name, str):
        raise DealDeskError("add_deal requires a non-empty 'name'")

    stage = payload.get("stage", "lead")
    if stage not in STAGES:
        raise DealDeskError("unknown stage %r; valid: %s" % (stage, ", ".join(STAGES)))

    amount = payload.get("amount", 0)
    if not isinstance(amount, (int, float)):
        raise DealDeskError("amount must be a number")

    iso_today = today.isoformat()
    deal = {
        "id": next_deal_id(state["deals"]),
        "name": name,
        "contact": payload.get("contact", ""),
        "company": payload.get("company", ""),
        "amount": amount,
        "stage": stage,
        "created_at": iso_today,
        "updated_at": iso_today,
        "close_date": payload.get("close_date", ""),
        "next_action": payload.get("next_action", ""),
        "next_action_date": payload.get("next_action_date", ""),
        "interactions": [],
        "stage_history": [{"stage": stage, "at": iso_today}],
        "tags": payload.get("tags", []) if isinstance(payload.get("tags"), list) else [],
    }
    if payload.get("close_date"):
        parse_date(payload["close_date"], "close_date")
    if payload.get("next_action_date"):
        parse_date(payload["next_action_date"], "next_action_date")

    state["deals"].append(deal)
    return deal, "Added %s (%s) at stage '%s'." % (deal["name"], deal["id"], stage)


def act_update_deal(state, payload, today):
    deal = find_deal(state, payload.get("deal_id"))
    editable = ["name", "contact", "company", "amount", "close_date",
                "next_action", "next_action_date", "tags", "probability"]
    changed = []
    for key in editable:
        if key in payload:
            if key == "amount" and not isinstance(payload[key], (int, float)):
                raise DealDeskError("amount must be a number")
            if key in ("close_date", "next_action_date") and payload[key]:
                parse_date(payload[key], key)
            deal[key] = payload[key]
            changed.append(key)
    if not changed:
        raise DealDeskError("update_deal: no editable fields supplied")
    deal["updated_at"] = today.isoformat()
    return deal, "Updated %s on %s: %s." % (deal["id"], deal["name"], ", ".join(changed))


def act_move_stage(state, payload, today):
    deal = find_deal(state, payload.get("deal_id"))
    stage = payload.get("stage")
    if stage not in STAGES:
        raise DealDeskError("unknown stage %r; valid: %s" % (stage, ", ".join(STAGES)))
    prev = deal.get("stage")
    if stage == prev:
        raise DealDeskError("deal %s is already at stage '%s'" % (deal["id"], stage))
    iso_today = today.isoformat()
    deal["stage"] = stage
    deal["updated_at"] = iso_today
    deal.setdefault("stage_history", []).append({"stage": stage, "at": iso_today})
    if stage in (WON, LOST):
        # Closing clears the open follow-up.
        deal["next_action"] = ""
        deal["next_action_date"] = ""
        if not deal.get("close_date"):
            deal["close_date"] = iso_today
    return deal, "Moved %s (%s) from '%s' to '%s'." % (deal["name"], deal["id"], prev, stage)


def act_log_interaction(state, payload, today):
    deal = find_deal(state, payload.get("deal_id"))
    itype = payload.get("type", "note")
    if itype not in INTERACTION_TYPES:
        raise DealDeskError("unknown interaction type %r; valid: %s"
                            % (itype, ", ".join(INTERACTION_TYPES)))
    when = payload.get("date") or today.isoformat()
    parse_date(when, "date")
    entry = {"date": when, "type": itype, "note": payload.get("note", "")}
    deal.setdefault("interactions", []).append(entry)
    deal["updated_at"] = today.isoformat()
    # Logging an interaction may also set the next step.
    if "next_action" in payload:
        deal["next_action"] = payload["next_action"]
    if "next_action_date" in payload:
        if payload["next_action_date"]:
            parse_date(payload["next_action_date"], "next_action_date")
        deal["next_action_date"] = payload["next_action_date"]
    return deal, "Logged %s on %s (%s)." % (itype, deal["name"], when)


def act_set_next_action(state, payload, today):
    deal = find_deal(state, payload.get("deal_id"))
    action = payload.get("next_action", "")
    when = payload.get("next_action_date", "")
    if when:
        parse_date(when, "next_action_date")
    deal["next_action"] = action
    deal["next_action_date"] = when
    deal["updated_at"] = today.isoformat()
    return deal, "Next action for %s: %s%s." % (
        deal["name"], action or "(cleared)", (" by %s" % when) if when else "")


def act_list_deals(state, payload, today):
    deals = list(state["deals"])
    flt = payload.get("filter", {}) or {}
    if flt.get("stage"):
        deals = [d for d in deals if d.get("stage") == flt["stage"]]
    if flt.get("open_only"):
        deals = [d for d in deals if is_open(d)]
    if flt.get("tag"):
        deals = [d for d in deals if flt["tag"] in (d.get("tags") or [])]
    # Sort by stage order (open first), then amount desc.
    order = {s: i for i, s in enumerate(STAGES)}
    deals.sort(key=lambda d: (order.get(d.get("stage"), 99), -amount_of(d)))
    rows = [{
        "id": d["id"], "name": d["name"], "stage": d.get("stage"),
        "amount": amount_of(d), "next_action": d.get("next_action", ""),
        "next_action_date": d.get("next_action_date", ""),
    } for d in deals]
    return {"deals": rows, "count": len(rows)}, "%d deal(s)." % len(rows)


def act_daily_priorities(state, payload, today):
    stale_days = payload.get("stale_days", DEFAULT_STALE_DAYS)
    iso_today = today.isoformat()
    items = []
    for d in state["deals"]:
        if not is_open(d):
            continue
        reasons = []
        score = 0.0
        weight = amount_of(d) * deal_probability(d)

        nad = d.get("next_action_date")
        if nad:
            overdue = days_since(nad, today)
            if overdue is not None and overdue > 0:
                reasons.append("overdue %d day(s): %s" % (overdue, d.get("next_action") or "follow up"))
                score += 1000 + overdue
            elif overdue == 0:
                reasons.append("due today: %s" % (d.get("next_action") or "follow up"))
                score += 500

        last = last_interaction_date(d)
        idle = days_since(last, today) if last else days_since(d.get("created_at"), today)
        if idle is not None and idle >= stale_days:
            reasons.append("stalled: %d day(s) since last touch" % idle)
            score += 100 + idle

        if not reasons:
            continue
        score += weight / 1000.0  # tie-break by weighted value
        items.append({
            "id": d["id"], "name": d["name"], "stage": d.get("stage"),
            "amount": amount_of(d), "weighted": round2(weight),
            "next_action": d.get("next_action", ""),
            "next_action_date": nad or "",
            "reasons": reasons, "_score": score,
        })
    items.sort(key=lambda x: -x["_score"])
    for x in items:
        del x["_score"]
    summary = "%d deal(s) need attention on %s." % (len(items), iso_today)
    return {"date": iso_today, "priorities": items, "count": len(items)}, summary


def act_pipeline_review(state, payload, today):
    by_stage = {}
    for s in STAGES:
        by_stage[s] = {"count": 0, "value": 0.0}
    open_value = 0.0
    weighted = 0.0
    stale_days = payload.get("stale_days", DEFAULT_STALE_DAYS)
    stalled = []
    for d in state["deals"]:
        stage = d.get("stage")
        amt = amount_of(d)
        if stage in by_stage:
            by_stage[stage]["count"] += 1
            by_stage[stage]["value"] = round2(by_stage[stage]["value"] + amt)
        if is_open(d):
            open_value += amt
            weighted += amt * deal_probability(d)
            last = last_interaction_date(d) or d.get("created_at")
            idle = days_since(last, today)
            if idle is not None and idle >= stale_days:
                stalled.append({"id": d["id"], "name": d["name"],
                                "stage": stage, "idle_days": idle, "amount": amt})
    won = by_stage[WON]["count"]
    lost = by_stage[LOST]["count"]
    closed = won + lost
    win_rate = round2(won / closed) if closed else None
    stalled.sort(key=lambda x: -x["idle_days"])
    result = {
        "by_stage": by_stage,
        "open_count": sum(by_stage[s]["count"] for s in OPEN_STAGES),
        "open_value": round2(open_value),
        "weighted_pipeline": round2(weighted),
        "won_count": won, "lost_count": lost, "win_rate": win_rate,
        "stalled": stalled,
    }
    summary = ("%d open deal(s), $%s in pipeline, $%s weighted; %d stalled."
               % (result["open_count"], result["open_value"],
                  result["weighted_pipeline"], len(stalled)))
    return result, summary


def act_forecast(state, payload, today):
    """Weighted / commit / best-case forecast, optionally for a target month."""
    month = payload.get("month")  # "YYYY-MM" to scope by close_date
    weighted = 0.0
    best_case = 0.0
    commit = 0.0
    won_to_date = 0.0
    scoped = []
    for d in state["deals"]:
        stage = d.get("stage")
        amt = amount_of(d)
        cd = d.get("close_date") or ""
        if month and not cd.startswith(month):
            continue
        if stage == WON:
            won_to_date += amt
            continue
        if stage == LOST:
            continue
        weighted += amt * deal_probability(d)
        best_case += amt
        if stage == "negotiation":
            commit += amt
        scoped.append(d["id"])
    result = {
        "month": month or "all-open",
        "commit": round2(commit),
        "weighted": round2(weighted),
        "best_case": round2(best_case),
        "won_to_date": round2(won_to_date),
        "deal_count": len(scoped),
    }
    summary = ("Forecast (%s): commit $%s / weighted $%s / best-case $%s; won $%s."
               % (result["month"], result["commit"], result["weighted"],
                  result["best_case"], result["won_to_date"]))
    return result, summary


ACTIONS = {
    "add_deal": act_add_deal,
    "update_deal": act_update_deal,
    "move_stage": act_move_stage,
    "log_interaction": act_log_interaction,
    "set_next_action": act_set_next_action,
    "list_deals": act_list_deals,
    "daily_priorities": act_daily_priorities,
    "pipeline_review": act_pipeline_review,
    "forecast": act_forecast,
}

# Actions that read but never change state — their returned state is unchanged.
READ_ONLY = {"list_deals", "daily_priorities", "pipeline_review", "forecast"}


def handle(payload):
    if not isinstance(payload, dict):
        raise DealDeskError("input must be a JSON object")
    action = payload.get("action")
    if action not in ACTIONS:
        raise DealDeskError("unknown action %r; valid: %s"
                            % (action, ", ".join(sorted(ACTIONS))))
    today = today_of(payload)
    state = load_state(payload)
    out = ACTIONS[action](state, payload, today)
    result, summary = out
    return {"ok": True, "action": action, "state": state,
            "result": result, "summary": summary}


def main():
    raw = sys.stdin.read()
    action = None
    try:
        payload = json.loads(raw) if raw.strip() else {}
        action = payload.get("action") if isinstance(payload, dict) else None
        response = handle(payload)
    except json.JSONDecodeError as exc:
        response = {"ok": False, "action": None, "error": "invalid JSON: %s" % exc}
    except DealDeskError as exc:
        response = {"ok": False, "action": action, "error": str(exc)}
    sys.stdout.write(json.dumps(response, ensure_ascii=False))
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()

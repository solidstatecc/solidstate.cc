#!/usr/bin/env python3
"""Independent tester harness for the deal-desk skill (SOL-20).

Runs the bundled entry.py as a real subprocess: JSON on stdin, JSON on stdout.
Verifies the SKILL.md contract behavior-by-behavior with hand-computed
expectations. Prints PASS/FAIL per check and an overall verdict. On any FAIL it
prints the exact failing input.
"""
import json
import subprocess
import sys

import os
ENTRY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "entry.py")

results = []  # (name, ok, detail, sent_input)


def run(payload, raw=None):
    """Invoke entry.py with a JSON payload (or raw string). Returns (exit_code, parsed_or_None, stdout, stderr)."""
    data = raw if raw is not None else json.dumps(payload)
    p = subprocess.run(
        [sys.executable, ENTRY],
        input=data, capture_output=True, text=True,
    )
    parsed = None
    try:
        parsed = json.loads(p.stdout)
    except Exception:
        parsed = None
    return p.returncode, parsed, p.stdout, p.stderr


def check(name, cond, detail="", sent=None):
    results.append((name, bool(cond), detail, sent))


def expect_ok(name, code, parsed, stderr, sent):
    """Common gate: exit 0, valid JSON parsed, ok:true, no stderr crash."""
    if code != 0:
        check(name, False, "exit code %s (expected 0); stderr=%r" % (code, stderr[:300]), sent)
        return False
    if parsed is None:
        check(name, False, "stdout was not valid JSON", sent)
        return False
    if parsed.get("ok") is not True:
        check(name, False, "ok != true: %r" % parsed.get("error"), sent)
        return False
    return True


TODAY = "2026-06-04"

# ---------------------------------------------------------------------------
# 1. add_deal — sequential ids d1,d2,d3, field population, state chaining
# ---------------------------------------------------------------------------
state = None

p1 = {"action": "add_deal", "today": TODAY, "name": "Acme", "amount": 10000,
      "stage": "qualified", "company": "Acme Inc", "contact": "Jane",
      "close_date": "2026-06-20", "tags": ["enterprise"]}
code, parsed, out, err = run(p1)
if expect_ok("add_deal d1 (Acme)", code, parsed, err, p1):
    d = parsed["result"]
    check("add_deal id == d1", d.get("id") == "d1", "got %r" % d.get("id"), p1)
    check("add_deal stage qualified", d.get("stage") == "qualified", "got %r" % d.get("stage"), p1)
    check("add_deal created_at == today", d.get("created_at") == TODAY, "got %r" % d.get("created_at"), p1)
    check("add_deal stage_history seeded",
          d.get("stage_history") == [{"stage": "qualified", "at": TODAY}],
          "got %r" % d.get("stage_history"), p1)
    check("add_deal tags preserved", d.get("tags") == ["enterprise"], "got %r" % d.get("tags"), p1)
    check("add_deal echoes state w/ 1 deal", len(parsed["state"]["deals"]) == 1, sent=p1)
    state = parsed["state"]

p2 = {"action": "add_deal", "today": TODAY, "state": state, "name": "Beta",
      "amount": 20000, "stage": "negotiation", "close_date": "2026-06-25"}
code, parsed, out, err = run(p2)
if expect_ok("add_deal d2 (Beta) chained", code, parsed, err, p2):
    check("add_deal id == d2 (sequential)", parsed["result"]["id"] == "d2",
          "got %r" % parsed["result"]["id"], p2)
    check("state now has 2 deals", len(parsed["state"]["deals"]) == 2, sent=p2)
    state = parsed["state"]

p3 = {"action": "add_deal", "today": TODAY, "state": state, "name": "Gamma",
      "amount": 5000, "stage": "lead", "close_date": "2026-07-10"}
code, parsed, out, err = run(p3)
if expect_ok("add_deal d3 (Gamma) chained", code, parsed, err, p3):
    check("add_deal id == d3 (sequential)", parsed["result"]["id"] == "d3",
          "got %r" % parsed["result"]["id"], p3)
    state = parsed["state"]

# ---------------------------------------------------------------------------
# 2. update_deal — editable field + updated_at
# ---------------------------------------------------------------------------
p = {"action": "update_deal", "today": TODAY, "state": state, "deal_id": "d1",
     "amount": 12000, "tags": ["enterprise", "priority"]}
code, parsed, out, err = run(p)
if expect_ok("update_deal d1 amount", code, parsed, err, p):
    d = parsed["result"]
    check("update_deal amount == 12000", d.get("amount") == 12000, "got %r" % d.get("amount"), p)
    check("update_deal tags updated", d.get("tags") == ["enterprise", "priority"], sent=p)
    state = parsed["state"]

# ---------------------------------------------------------------------------
# 3. log_interaction — appends + sets next_action/date
# ---------------------------------------------------------------------------
p = {"action": "log_interaction", "today": TODAY, "state": state, "deal_id": "d1",
     "type": "call", "note": "Discussed proposal", "date": "2026-06-03",
     "next_action": "Send proposal", "next_action_date": "2026-06-01"}
code, parsed, out, err = run(p)
if expect_ok("log_interaction d1 call", code, parsed, err, p):
    d = parsed["result"]
    check("interaction appended", len(d.get("interactions", [])) == 1, sent=p)
    check("interaction type call", d["interactions"][0]["type"] == "call", sent=p)
    check("next_action set via log", d.get("next_action") == "Send proposal", sent=p)
    check("next_action_date set (overdue)", d.get("next_action_date") == "2026-06-01", sent=p)
    state = parsed["state"]

# ---------------------------------------------------------------------------
# 4. set_next_action — for d2 (due today), d3 left stalled
# ---------------------------------------------------------------------------
p = {"action": "set_next_action", "today": TODAY, "state": state, "deal_id": "d2",
     "next_action": "Sign contract", "next_action_date": "2026-06-04"}
code, parsed, out, err = run(p)
if expect_ok("set_next_action d2 due today", code, parsed, err, p):
    check("d2 next_action set", parsed["result"]["next_action"] == "Sign contract", sent=p)
    state = parsed["state"]

# ---------------------------------------------------------------------------
# 5. list_deals — sorting (open by stage order, then amount desc) + filter
# ---------------------------------------------------------------------------
p = {"action": "list_deals", "today": TODAY, "state": state}
code, parsed, out, err = run(p)
if expect_ok("list_deals all", code, parsed, err, p):
    ids = [r["id"] for r in parsed["result"]["deals"]]
    # stage order: lead(d3) < qualified(d1) < negotiation(d2). So d3,d1,d2.
    check("list_deals sorted by stage order", ids == ["d3", "d1", "d2"],
          "got %r (expected ['d3','d1','d2'])" % ids, p)
    check("list_deals count == 3", parsed["result"]["count"] == 3, sent=p)
    check("list_deals read-only (state unchanged)",
          len(parsed["state"]["deals"]) == 3, sent=p)

p = {"action": "list_deals", "today": TODAY, "state": state,
     "filter": {"stage": "lead"}}
code, parsed, out, err = run(p)
if expect_ok("list_deals filter stage=lead", code, parsed, err, p):
    ids = [r["id"] for r in parsed["result"]["deals"]]
    check("filter stage=lead returns only d3", ids == ["d3"], "got %r" % ids, p)

p = {"action": "list_deals", "today": TODAY, "state": state,
     "filter": {"tag": "priority"}}
code, parsed, out, err = run(p)
if expect_ok("list_deals filter tag=priority", code, parsed, err, p):
    ids = [r["id"] for r in parsed["result"]["deals"]]
    check("filter tag=priority returns only d1", ids == ["d1"], "got %r" % ids, p)

# ---------------------------------------------------------------------------
# 6. daily_priorities — overdue (d1) + due-today (d2) + stalled (d3) ranking
#    d1: next_action_date 2026-06-01, today 06-04 => overdue 3 -> score 1003 + weighted/1000
#    d2: due today -> score 500
#    d3: lead created today, no next_action; stalled? created_at 2026-06-04 idle 0 -> not stalled.
# ---------------------------------------------------------------------------
p = {"action": "daily_priorities", "today": TODAY, "state": state}
code, parsed, out, err = run(p)
if expect_ok("daily_priorities", code, parsed, err, p):
    pri = parsed["result"]["priorities"]
    pri_ids = [x["id"] for x in pri]
    check("daily_priorities flags d1 (overdue) first", pri_ids and pri_ids[0] == "d1",
          "got order %r" % pri_ids, p)
    check("daily_priorities flags d2 (due today)", "d2" in pri_ids, "got %r" % pri_ids, p)
    check("daily_priorities does NOT flag d3 (fresh lead)", "d3" not in pri_ids,
          "got %r" % pri_ids, p)
    d1pri = next((x for x in pri if x["id"] == "d1"), None)
    check("d1 reason mentions overdue",
          d1pri and any("overdue" in r for r in d1pri["reasons"]),
          "reasons=%r" % (d1pri and d1pri["reasons"]), p)

# Stalled detection: re-run with a 'today' far in the future so d3 (no touch) stalls.
p = {"action": "daily_priorities", "today": "2026-06-20", "state": state, "stale_days": 7}
code, parsed, out, err = run(p)
if expect_ok("daily_priorities stalled (today=06-20)", code, parsed, err, p):
    pri_ids = [x["id"] for x in parsed["result"]["priorities"]]
    check("d3 now stalled (16 days idle >= 7)", "d3" in pri_ids, "got %r" % pri_ids, p)
    d3 = next((x for x in parsed["result"]["priorities"] if x["id"] == "d3"), None)
    check("d3 reason mentions stalled",
          d3 and any("stalled" in r for r in d3["reasons"]), sent=p)

# stale_days override: with stale_days=30 on 06-20, d3 (16 idle) should NOT stall.
p = {"action": "daily_priorities", "today": "2026-06-20", "state": state, "stale_days": 30}
code, parsed, out, err = run(p)
if expect_ok("daily_priorities stale_days=30", code, parsed, err, p):
    pri_ids = [x["id"] for x in parsed["result"]["priorities"]]
    check("d3 not stalled at stale_days=30", "d3" not in pri_ids, "got %r" % pri_ids, p)

# ---------------------------------------------------------------------------
# 7. forecast — open pipeline (no month).
#    d1 qualified $12000 *0.25 = 3000 ; d2 negotiation $20000 *0.80 = 16000 ;
#    d3 lead $5000 *0.10 = 500.  weighted = 19500. best_case = 37000.
#    commit (negotiation only) = 20000. won_to_date = 0.
# ---------------------------------------------------------------------------
p = {"action": "forecast", "today": TODAY, "state": state}
code, parsed, out, err = run(p)
if expect_ok("forecast all-open", code, parsed, err, p):
    r = parsed["result"]
    check("forecast weighted == 19500.0", r["weighted"] == 19500.0, "got %r" % r["weighted"], p)
    check("forecast best_case == 37000.0", r["best_case"] == 37000.0, "got %r" % r["best_case"], p)
    check("forecast commit == 20000.0", r["commit"] == 20000.0, "got %r" % r["commit"], p)
    check("forecast won_to_date == 0.0", r["won_to_date"] == 0.0, "got %r" % r["won_to_date"], p)
    check("forecast deal_count == 3", r["deal_count"] == 3, "got %r" % r["deal_count"], p)

# ---------------------------------------------------------------------------
# 8. move_stage — close d2 won. Clears next_action, sets close already present.
#    Verify stage_history grows, next_action cleared.
# ---------------------------------------------------------------------------
p = {"action": "move_stage", "today": TODAY, "state": state, "deal_id": "d2",
     "stage": "closed-won"}
code, parsed, out, err = run(p)
if expect_ok("move_stage d2 -> closed-won", code, parsed, err, p):
    d = parsed["result"]
    check("d2 stage closed-won", d["stage"] == "closed-won", sent=p)
    check("d2 next_action cleared on close", d["next_action"] == "", sent=p)
    check("d2 stage_history appended",
          d["stage_history"][-1] == {"stage": "closed-won", "at": TODAY}, sent=p)
    check("d2 close_date preserved (was set)", d["close_date"] == "2026-06-25", sent=p)
    state = parsed["state"]

# forecast after win: won_to_date = 20000. open weighted = d1 3000 + d3 500 = 3500.
# commit = 0 (no negotiation now). best_case = 17000.
p = {"action": "forecast", "today": TODAY, "state": state}
code, parsed, out, err = run(p)
if expect_ok("forecast after d2 won", code, parsed, err, p):
    r = parsed["result"]
    check("forecast won_to_date == 20000", r["won_to_date"] == 20000.0, "got %r" % r["won_to_date"], p)
    check("forecast weighted == 3500 after win", r["weighted"] == 3500.0, "got %r" % r["weighted"], p)
    check("forecast commit == 0 after win", r["commit"] == 0.0, "got %r" % r["commit"], p)
    check("forecast best_case == 17000", r["best_case"] == 17000.0, "got %r" % r["best_case"], p)

# month-scoped forecast: d1 close_date 2026-06-20, d3 2026-07-10, d2(won) 2026-06-25.
# month 2026-06: open d1 only -> weighted 3000, best_case 12000; won_to_date d2 20000.
p = {"action": "forecast", "today": TODAY, "state": state, "month": "2026-06"}
code, parsed, out, err = run(p)
if expect_ok("forecast month=2026-06", code, parsed, err, p):
    r = parsed["result"]
    check("month forecast scope label", r["month"] == "2026-06", sent=p)
    check("month forecast weighted == 3000 (d1 only)", r["weighted"] == 3000.0, "got %r" % r["weighted"], p)
    check("month forecast best_case == 12000 (d1)", r["best_case"] == 12000.0, "got %r" % r["best_case"], p)
    check("month forecast won_to_date == 20000 (d2 closed 06-25)", r["won_to_date"] == 20000.0,
          "got %r" % r["won_to_date"], p)
    check("month forecast deal_count == 1 (open d1)", r["deal_count"] == 1, "got %r" % r["deal_count"], p)

# ---------------------------------------------------------------------------
# 9. pipeline_review — counts/value per stage, open value, weighted, win_rate, stalled
#    After: d1 qualified $12000, d3 lead $5000 open; d2 closed-won $20000.
#    open_count 2, open_value 17000, weighted = 3000+500 = 3500.
#    won 1, lost 0, win_rate = 1/1 = 1.0.
# ---------------------------------------------------------------------------
p = {"action": "pipeline_review", "today": "2026-06-20", "state": state}
code, parsed, out, err = run(p)
if expect_ok("pipeline_review", code, parsed, err, p):
    r = parsed["result"]
    check("pipeline open_count == 2", r["open_count"] == 2, "got %r" % r["open_count"], p)
    check("pipeline open_value == 17000", r["open_value"] == 17000.0, "got %r" % r["open_value"], p)
    check("pipeline weighted == 3500", r["weighted_pipeline"] == 3500.0, "got %r" % r["weighted_pipeline"], p)
    check("pipeline won_count == 1", r["won_count"] == 1, sent=p)
    check("pipeline win_rate == 1.0", r["win_rate"] == 1.0, "got %r" % r["win_rate"], p)
    check("pipeline by_stage[closed-won] value 20000",
          r["by_stage"]["closed-won"]["value"] == 20000.0, sent=p)
    # On 06-20, d1 last touch 06-03 => 17 idle, d3 created 06-04 => 16 idle. Both stalled.
    stalled_ids = [s["id"] for s in r["stalled"]]
    check("pipeline stalled lists d1 & d3", set(stalled_ids) == {"d1", "d3"},
          "got %r" % stalled_ids, p)

# ---------------------------------------------------------------------------
# 10. ERROR PATHS — must return ok:false, exit 0, no crash.
# ---------------------------------------------------------------------------
def err_case(name, payload=None, raw=None, action_field="present"):
    code, parsed, out, e = run(payload, raw=raw)
    ok_exit = code == 0
    is_json = parsed is not None
    is_false = is_json and parsed.get("ok") is False
    has_err = is_json and bool(parsed.get("error"))
    no_crash = e.strip() == ""
    check(name, ok_exit and is_json and is_false and has_err and no_crash,
          "exit=%s ok=%s err=%r stderr=%r" % (code, parsed and parsed.get("ok"),
                                              parsed and parsed.get("error"), e[:200]),
          payload if payload else {"raw": raw})

err_case("error: bad deal_id",
         {"action": "update_deal", "state": state, "deal_id": "d999", "amount": 1})
err_case("error: bad stage",
         {"action": "move_stage", "state": state, "deal_id": "d1", "stage": "wishlist"})
err_case("error: unknown action",
         {"action": "teleport", "state": state})
err_case("error: invalid JSON", raw="{not valid json")
err_case("error: add_deal missing name",
         {"action": "add_deal", "state": state})
err_case("error: bad date format",
         {"action": "add_deal", "state": state, "name": "X", "close_date": "06/20/2026"})
err_case("error: amount not a number",
         {"action": "add_deal", "state": state, "name": "X", "amount": "lots"})
err_case("error: move to same stage",
         {"action": "move_stage", "state": state, "deal_id": "d1", "stage": "qualified"})

# empty stdin -> unknown action None, ok:false, exit 0
code, parsed, out, e = run(None, raw="")
check("error: empty stdin handled (ok:false, exit 0)",
      code == 0 and parsed is not None and parsed.get("ok") is False and e.strip() == "",
      "exit=%s parsed=%r stderr=%r" % (code, parsed, e[:200]), {"raw": ""})

# ---------------------------------------------------------------------------
# 11. probability override — deal-level probability beats stage default in forecast
# ---------------------------------------------------------------------------
s2 = {"deals": [{"id": "d1", "name": "Z", "amount": 1000, "stage": "lead",
                 "probability": 0.5, "created_at": TODAY, "interactions": []}]}
p = {"action": "forecast", "today": TODAY, "state": s2}
code, parsed, out, err = run(p)
if expect_ok("forecast probability override", code, parsed, err, p):
    # 1000 * 0.5 = 500 (not 1000*0.10=100)
    check("probability override applied (500 not 100)", parsed["result"]["weighted"] == 500.0,
          "got %r" % parsed["result"]["weighted"], p)

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
passed = sum(1 for _, ok, _, _ in results if ok)
failed = [r for r in results if not r[1]]
print("=" * 70)
for name, ok, detail, sent in results:
    print("%s  %s%s" % ("PASS" if ok else "FAIL", name, ("  -- " + detail) if (detail and not ok) else ""))
print("=" * 70)
print("TOTAL: %d checks, %d passed, %d failed" % (len(results), passed, len(failed)))
if failed:
    print("\nFAILING INPUTS:")
    for name, ok, detail, sent in failed:
        print("  [%s] input=%s" % (name, json.dumps(sent)))
    print("\nVERDICT: FAIL")
    sys.exit(1)
else:
    print("\nVERDICT: PASS")
    sys.exit(0)

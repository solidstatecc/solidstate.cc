#!/usr/bin/env python3
"""Content Engine tests — pure stdlib unittest, no deps, no network.

Run:  python3 tests.py        (in-process)
The same entry.py also works as a subprocess: echo '<json>' | python3 entry.py
"""

import json
import unittest
import subprocess
import sys
import os

import entry

HERE = os.path.dirname(os.path.abspath(__file__))


def call(payload):
    return entry.handle(payload)


class VoiceTests(unittest.TestCase):
    def test_set_voice_requires_a_field(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "set_voice"})

    def test_set_voice_stores_and_compiles(self):
        r = call({"action": "set_voice", "tone": ["bold", "plain"], "pov": "second",
                  "banned_words": ["honestly"], "emoji": False})
        self.assertTrue(r["ok"])
        self.assertIn("second person", r["result"]["compiled"])
        self.assertIn("honestly", r["result"]["compiled"])
        # Default AI-tell banned words are always merged in.
        self.assertIn("delve", r["result"]["compiled"])

    def test_fingerprint_is_deterministic(self):
        samples = ["I build things. You ship them. We don't overthink it!",
                   "Short sentences win. Every time."]
        a = call({"action": "set_voice", "samples": samples})["state"]["voice"]["fingerprint"]
        b = call({"action": "set_voice", "samples": samples})["state"]["voice"]["fingerprint"]
        self.assertEqual(a, b)
        self.assertGreater(a["sentences"], 0)
        self.assertGreaterEqual(a["contraction_rate"], 0.0)


class PlanTests(unittest.TestCase):
    def test_plan_requires_topic(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "plan", "brief": {}})

    def test_default_package_shape(self):
        r = call({"action": "plan", "brief": {
            "topic": "Why agents need a payment rail",
            "key_points": ["x402 is open", "no card on file", "per-call pricing"]}})
        plan = r["result"]["plan"]
        # 5 video + 5 social + 1 blog + 1 newsletter + 5 thumbnail + 5 short = 22
        self.assertEqual(r["result"]["count"], 22)
        self.assertEqual(sum(1 for a in plan if a["type"] == "video_script"), 5)
        self.assertEqual(sum(1 for a in plan if a["type"] == "social_post"), 5)
        # Every asset carries a fillable prompt and platform constraints.
        for a in plan:
            self.assertIn("prompt", a)
            self.assertTrue(a["prompt"])
            self.assertIn("constraints", a)

    def test_key_points_round_robin(self):
        r = call({"action": "plan", "brief": {
            "topic": "T", "key_points": ["one", "two"]},
            "package": [{"type": "social_post", "platform": "x", "count": 4}]})
        focuses = [a["focus"] for a in r["result"]["plan"]]
        self.assertEqual(focuses, ["one", "two", "one", "two"])

    def test_rejects_bad_type_and_platform(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "plan", "brief": {"topic": "T"},
                  "package": [{"type": "nope", "count": 1}]})
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "plan", "brief": {"topic": "T"},
                  "package": [{"type": "social_post", "platform": "myspace", "count": 1}]})


class AtomizeTests(unittest.TestCase):
    LONG = ("Agents cannot hold a credit card. That is the whole problem. "
            "x402 turns an HTTP 402 into a real payment any agent can settle. "
            "No human in the loop, no card on file, just per-call pricing. "
            "This changes how software buys software.")

    def test_atomize_produces_fitting_scaffolds(self):
        r = call({"action": "atomize", "source": self.LONG})
        derivs = r["result"]["derivatives"]
        self.assertTrue(derivs)
        for d in derivs:
            # Draft scaffold never exceeds the platform char budget.
            self.assertLessEqual(len(d["draft_scaffold"]), d["char_budget"])

    def test_atomize_empty_source_errors(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "atomize", "source": "   "})


class FitTests(unittest.TestCase):
    def test_within_and_over(self):
        ok = call({"action": "fit", "text": "short", "platform": "x"})["result"]
        self.assertTrue(ok["within_limit"])
        over = call({"action": "fit", "text": "x" * 300, "platform": "x"})["result"]
        self.assertFalse(over["within_limit"])
        self.assertEqual(over["over_by"], 20)
        self.assertIsNotNone(over["trimmed"])
        self.assertLessEqual(len(over["trimmed"]), 280)


class AssetPackageTests(unittest.TestCase):
    def _state_with_assets(self):
        s = call({"action": "set_whitelabel", "agency": "Acme Studio",
                  "client": "Globex", "footer": "— Acme Studio",
                  "cta": "Book a call: acme.studio", "resale": True})["state"]
        s = call({"action": "add_asset", "state": s, "type": "social_post",
                  "platform": "x", "title": "hook", "content": "We ship content."})["state"]
        s = call({"action": "add_asset", "state": s, "type": "blog",
                  "platform": "blog", "content": "A longer post body."})["state"]
        return s

    def test_add_asset_assigns_sequential_ids(self):
        s = self._state_with_assets()
        ids = [a["id"] for a in s["assets"]]
        self.assertEqual(ids, ["a1", "a2"])

    def test_add_asset_flags_overflow(self):
        r = call({"action": "add_asset", "type": "social_post", "platform": "x",
                  "content": "z" * 400})
        self.assertIsNotNone(r["result"]["warning"])

    def test_package_applies_whitelabel_and_resale(self):
        s = self._state_with_assets()
        r = call({"action": "package", "state": s, "title": "Globex launch"})
        pkg = r["result"]
        self.assertEqual(pkg["manifest"]["total"], 2)
        self.assertIn("resale_license", pkg)
        self.assertIn("Acme Studio", pkg["resale_license"])
        # CTA + footer applied to the social post.
        social = next(a for a in pkg["assets"] if a["type"] == "social_post")
        self.assertIn("acme.studio", social["content"])
        self.assertIn("— Acme Studio", social["content"])

    def test_package_empty_errors(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "package"})


class ContractTests(unittest.TestCase):
    def test_unknown_action(self):
        with self.assertRaises(entry.ContentEngineError):
            call({"action": "frobnicate"})

    def test_subprocess_json_in_json_out(self):
        proc = subprocess.run(
            [sys.executable, os.path.join(HERE, "entry.py")],
            input=json.dumps({"action": "plan", "brief": {"topic": "T"}}),
            capture_output=True, text=True, timeout=30)
        out = json.loads(proc.stdout)
        self.assertTrue(out["ok"])
        self.assertEqual(out["action"], "plan")

    def test_invalid_json_subprocess(self):
        proc = subprocess.run(
            [sys.executable, os.path.join(HERE, "entry.py")],
            input="{not json", capture_output=True, text=True, timeout=30)
        out = json.loads(proc.stdout)
        self.assertFalse(out["ok"])
        self.assertIn("invalid JSON", out["error"])


if __name__ == "__main__":
    unittest.main(verbosity=2)

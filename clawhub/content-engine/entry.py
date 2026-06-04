#!/usr/bin/env python3
"""Content Engine — turn one brief into a full multi-platform content package.

JSON in on stdin, JSON out on stdout. Pure stdlib, no network, no credentials,
no file writes. The caller owns persistence: every mutating response echoes the
full updated `state`, and the caller passes it back on the next call.

The engine does the deterministic content *operations* — planning a package
from a brief, atomizing a long source into platform-fit derivatives, enforcing
per-platform constraints, applying white-label branding, and assembling the
final deliverable. It does NOT write the prose: it emits structured, voice-aware
prompts and the calling agent writes each asset, then registers it with
`add_asset`. Words come from the model; structure, fit, and packaging come from
here — so the pipeline is reproducible and the result is consistent.

Contract
--------
Input:  {"action": "<name>", "state": {...}?, ...args}
Output (success): {"ok": true,  "action": "...", "state": {...}, "result": {...}, "summary": "..."}
Output (error):   {"ok": false, "action": "...", "error": "..."}

`ok` is the verdict: true = applied, false = nothing changed. On error the
caller keeps the state it already had — this script never mutates input in
place, it returns a fresh copy.
"""

import sys
import json
import copy
import re
from collections import Counter


# --- Platform specs ---------------------------------------------------------

# Character budgets and posting conventions per channel. Stable, widely-known
# limits; the engine fits copy to these so nothing overflows when it ships.
PLATFORM_SPECS = {
    "x":             {"label": "X / Twitter",   "max_chars": 280,   "ideal_chars": 240,  "hashtags": [0, 2]},
    "linkedin":      {"label": "LinkedIn",      "max_chars": 3000,  "ideal_chars": 1300, "hashtags": [3, 5]},
    "instagram":     {"label": "Instagram",     "max_chars": 2200,  "ideal_chars": 1500, "hashtags": [5, 10]},
    "threads":       {"label": "Threads",       "max_chars": 500,   "ideal_chars": 450,  "hashtags": [0, 3]},
    "facebook":      {"label": "Facebook",      "max_chars": 63206, "ideal_chars": 250,  "hashtags": [0, 2]},
    "tiktok":        {"label": "TikTok caption","max_chars": 2200,  "ideal_chars": 150,  "hashtags": [3, 5]},
    "youtube":       {"label": "YouTube",       "title_max": 100,   "desc_max": 5000,    "hashtags": [3, 5]},
    "youtube_short": {"label": "YouTube Short", "title_max": 100,   "script_words": 150, "hashtags": [2, 4]},
    "newsletter":    {"label": "Newsletter",    "subject_max": 60,  "preheader_max": 90, "hashtags": [0, 0]},
    "blog":          {"label": "Blog post",     "title_max": 60,    "meta_max": 155,     "hashtags": [0, 0]},
}

# Content types: the structural skeleton the agent fills, plus a one-line of
# craft guidance. Each type has a sensible default channel.
TYPE_TEMPLATES = {
    "video_script": {
        "default_platform": "youtube",
        "structure": ["hook", "context", "point_1", "point_2", "point_3", "cta", "outro"],
        "guidance": "Open with a 3-second hook that states the payoff. One idea per beat. End on a single clear CTA.",
    },
    "short_clip": {
        "default_platform": "youtube_short",
        "structure": ["hook (<=3s)", "payoff", "cta"],
        "guidance": "Under 60 seconds (~150 words spoken). The first line must stop the scroll. One payoff, one ask.",
    },
    "social_post": {
        "default_platform": "x",
        "structure": ["hook line", "body", "cta", "hashtags"],
        "guidance": "Lead with the hook line — it has to earn the second line. Fit the platform budget. No filler.",
    },
    "blog": {
        "default_platform": "blog",
        "structure": ["seo_title", "meta_description", "intro", "h2_sections", "conclusion", "cta"],
        "guidance": "Title <=60 chars, meta <=155. Front-load the answer. Use H2s a reader can skim.",
    },
    "newsletter": {
        "default_platform": "newsletter",
        "structure": ["subject", "preheader", "opening", "main", "cta", "ps"],
        "guidance": "Subject <=60 chars and curiosity-driven. The P.S. is the second-most-read line — use it.",
    },
    "thumbnail": {
        "default_platform": "youtube",
        "structure": ["overlay_text", "alt_overlay_text", "visual_concept"],
        "guidance": "Overlay text <=5 punchy words. State tension or payoff, not the topic. Offer 2 options.",
    },
}

# The default package, straight from the Content Engine brief: one idea fans out
# into 5 video scripts, 5 social posts, a blog, a newsletter, thumbnails, and
# short-form clips. Override by passing your own `package` to `plan`.
DEFAULT_PACKAGE = [
    {"type": "video_script", "platform": "youtube",       "count": 5},
    {"type": "social_post",  "platform": "x",             "count": 5},
    {"type": "blog",         "platform": "blog",          "count": 1},
    {"type": "newsletter",   "platform": "newsletter",    "count": 1},
    {"type": "thumbnail",    "platform": "youtube",        "count": 5},
    {"type": "short_clip",   "platform": "youtube_short", "count": 5},
]

# Words that mark AI-written copy. Merged into every voice profile's banned list
# so the prompts the engine emits steer the model away from them by default.
DEFAULT_BANNED_WORDS = [
    "delve", "leverage", "tapestry", "elevate", "unlock", "seamless", "robust",
    "game-changer", "in today's fast-paced world", "in summary", "navigate the landscape",
    "it's important to note", "dive in", "supercharge", "unleash",
]


# --- Helpers ----------------------------------------------------------------

class ContentEngineError(Exception):
    """Raised for any caller-facing validation failure."""


_SENTENCE_RE = re.compile(r"[^.!?]+[.!?]+|\S[^.!?]*$")
_WORD_RE = re.compile(r"[A-Za-z']+")
_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
    "is", "are", "was", "were", "be", "it", "this", "that", "you", "your", "we",
    "our", "they", "their", "as", "at", "by", "from", "so", "if", "then", "than",
    "i", "me", "my", "he", "she", "his", "her", "them", "us", "do", "does", "not",
}


def require_str(payload, field, action):
    val = payload.get(field)
    if not val or not isinstance(val, str):
        raise ContentEngineError("%s requires a non-empty '%s'" % (action, field))
    return val


def empty_state():
    return {"voice": {}, "whitelabel": {}, "assets": []}


def load_state(payload):
    state = payload.get("state")
    if state is None:
        return empty_state()
    if not isinstance(state, dict):
        raise ContentEngineError("state must be an object")
    fresh = copy.deepcopy(state)
    fresh.setdefault("voice", {})
    fresh.setdefault("whitelabel", {})
    fresh.setdefault("assets", [])
    if not isinstance(fresh["assets"], list):
        raise ContentEngineError("state.assets must be a list")
    return fresh


def next_asset_id(assets):
    highest = 0
    for a in assets:
        aid = str(a.get("id", ""))
        if aid.startswith("a") and aid[1:].isdigit():
            highest = max(highest, int(aid[1:]))
    return "a%d" % (highest + 1)


def sentences(text):
    return [s.strip() for s in _SENTENCE_RE.findall(text or "") if s.strip()]


def keywords(text, limit=8):
    counts = Counter(
        w.lower() for w in _WORD_RE.findall(text or "")
        if len(w) > 3 and w.lower() not in _STOPWORDS
    )
    return [w for w, _ in counts.most_common(limit)]


def hashtagify(words, lo, hi):
    """Turn keywords into 'lo..hi' CamelCase hashtag candidates."""
    if hi <= 0:
        return []
    tags = []
    for w in words[:hi]:
        tags.append("#" + "".join(part.capitalize() for part in re.split(r"[^A-Za-z0-9]+", w) if part))
    return tags[:max(lo, min(hi, len(tags)))] if tags else []


def trim_to(text, max_chars):
    """Trim to a character budget at a word boundary, no mid-word cuts."""
    if len(text) <= max_chars:
        return text, False
    cut = text[:max_chars]
    if " " in cut:
        cut = cut[:cut.rfind(" ")]
    return cut.rstrip(), True


# --- Voice ------------------------------------------------------------------

def fingerprint(samples):
    """Deterministic, measurable voice stats from sample text. No 'tone' guessing."""
    joined = "\n".join(s for s in samples if isinstance(s, str))
    sents = sentences(joined)
    words = _WORD_RE.findall(joined)
    n_sent = len(sents) or 1
    n_word = len(words) or 1
    contractions = sum(1 for w in words if "'" in w)
    return {
        "sentences": len(sents),
        "words": len(words),
        "avg_sentence_words": round(len(words) / n_sent, 1),
        "avg_word_chars": round(sum(len(w) for w in words) / n_word, 1),
        "contraction_rate": round(contractions / n_word, 3),
        "exclamations_per_100_sent": round(joined.count("!") / n_sent * 100, 1),
        "questions_per_100_sent": round(joined.count("?") / n_sent * 100, 1),
        "emoji_present": bool(re.search(r"[\U0001F000-\U0001FAFF☀-➿]", joined)),
        "candidate_phrases": [" ".join(p) for p, _ in Counter(
            tuple(words[i:i + 2]) for i in range(len(words) - 1)
            if words[i].lower() not in _STOPWORDS and words[i + 1].lower() not in _STOPWORDS
        ).most_common(5)],
    }


def compile_voice(voice):
    """Render the stored voice profile into directive lines for an asset prompt."""
    banned = list(DEFAULT_BANNED_WORDS)
    for w in voice.get("banned_words", []) or []:
        if w not in banned:
            banned.append(w)

    lines = []
    if voice.get("tone"):
        tone = voice["tone"]
        lines.append("Tone: " + (", ".join(tone) if isinstance(tone, list) else str(tone)) + ".")
    pov = {"first": "first person (I/we)", "second": "second person (you)",
           "third": "third person"}.get(voice.get("pov"))
    if pov:
        lines.append("Point of view: %s." % pov)
    if voice.get("formality"):
        lines.append("Register: %s." % voice["formality"])
    if voice.get("reading_level"):
        lines.append("Reading level: %s." % voice["reading_level"])
    lines.append("Emoji: %s." % ("use sparingly where natural" if voice.get("emoji") else "none"))
    if voice.get("signature_phrases"):
        lines.append("Work in these signature phrases where they fit naturally: %s."
                     % "; ".join(voice["signature_phrases"]))
    if voice.get("cta_style"):
        lines.append("CTA style: %s." % voice["cta_style"])
    lines.append("Never use these words/phrases (they read as AI-written): %s." % ", ".join(banned))
    fp = voice.get("fingerprint")
    if fp:
        lines.append("Match this measured cadence — avg %.1f words/sentence, %.1f chars/word."
                     % (fp.get("avg_sentence_words", 0), fp.get("avg_word_chars", 0)))
    if not voice:
        lines.insert(0, "No voice profile set: write in a clear, concrete, human voice.")
    return " ".join(lines)


def act_set_voice(state, payload):
    voice = state["voice"]
    fields = ["tone", "pov", "formality", "reading_level", "emoji",
              "signature_phrases", "banned_words", "cta_style"]
    changed = []
    for f in fields:
        if f in payload:
            voice[f] = payload[f]
            changed.append(f)
    samples = payload.get("samples")
    if samples:
        if not isinstance(samples, list):
            raise ContentEngineError("samples must be a list of strings")
        voice["fingerprint"] = fingerprint(samples)
        changed.append("fingerprint")
    if not changed:
        raise ContentEngineError("set_voice: supply at least one voice field or samples")
    return {"voice": voice, "compiled": compile_voice(voice)}, \
        "Voice profile updated (%s)." % ", ".join(changed)


# --- White-label ------------------------------------------------------------

def act_set_whitelabel(state, payload):
    wl = state["whitelabel"]
    fields = ["agency", "client", "byline", "footer", "cta", "resale", "remove_attribution"]
    changed = []
    for f in fields:
        if f in payload:
            wl[f] = payload[f]
            changed.append(f)
    if not changed:
        raise ContentEngineError("set_whitelabel: supply at least one branding field")
    return {"whitelabel": wl}, "White-label branding updated (%s)." % ", ".join(changed)


# --- Plan -------------------------------------------------------------------

def _validate_slot(slot):
    t = slot.get("type")
    if t not in TYPE_TEMPLATES:
        raise ContentEngineError("unknown content type %r; valid: %s"
                                 % (t, ", ".join(sorted(TYPE_TEMPLATES))))
    platform = slot.get("platform") or TYPE_TEMPLATES[t]["default_platform"]
    if platform not in PLATFORM_SPECS:
        raise ContentEngineError("unknown platform %r; valid: %s"
                                 % (platform, ", ".join(sorted(PLATFORM_SPECS))))
    count = slot.get("count", 1)
    if not isinstance(count, int) or count < 1 or count > 50:
        raise ContentEngineError("slot count must be an integer 1..50")
    return t, platform, count


def act_plan(state, payload):
    brief = payload.get("brief")
    if not isinstance(brief, dict) or not brief.get("topic"):
        raise ContentEngineError("plan requires a 'brief' object with at least a 'topic'")

    topic = brief["topic"]
    angle = brief.get("angle", "")
    audience = brief.get("audience", "a general audience")
    goal = brief.get("goal", "")
    cta = brief.get("cta", "")
    key_points = brief.get("key_points") or []
    if not isinstance(key_points, list):
        raise ContentEngineError("brief.key_points must be a list")
    kw = brief.get("keywords") or keywords("%s %s %s" % (topic, angle, " ".join(map(str, key_points))))

    package = payload.get("package") or DEFAULT_PACKAGE
    if not isinstance(package, list) or not package:
        raise ContentEngineError("package must be a non-empty list of slots")

    voice_directives = compile_voice(state["voice"])
    assets = []
    seq = 0
    for slot in package:
        t, platform, count = _validate_slot(slot)
        tmpl = TYPE_TEMPLATES[t]
        spec = PLATFORM_SPECS[platform]
        for i in range(count):
            seq += 1
            focus = key_points[(seq - 1) % len(key_points)] if key_points else angle or topic
            prompt = (
                "Write a {label} ({type}) for the topic: \"{topic}\".\n"
                "Angle: {angle}\nAudience: {audience}\nGoal: {goal}\n"
                "Focus this piece on: {focus}\n"
                "Structure (fill every beat): {structure}\n"
                "Craft: {guidance}\n"
                "Voice: {voice}\n"
                "Constraints: {constraints}\n"
                "Call to action: {cta}"
            ).format(
                label=spec["label"], type=t, topic=topic, angle=angle or "(none given)",
                audience=audience, goal=goal or "(none given)", focus=focus,
                structure=" -> ".join(tmpl["structure"]), guidance=tmpl["guidance"],
                voice=voice_directives, constraints=json.dumps(spec, ensure_ascii=False),
                cta=cta or "(use the voice's default CTA style)",
            )
            assets.append({
                "slot": "%s/%s" % (t, platform),
                "type": t,
                "platform": platform,
                "platform_label": spec["label"],
                "working_title": "%s — %s (%d)" % (topic, t.replace("_", " "), i + 1),
                "focus": focus,
                "structure": tmpl["structure"],
                "constraints": spec,
                "hashtag_suggestions": hashtagify(kw, *spec.get("hashtags", [0, 0])),
                "prompt": prompt,
            })

    summary = "Planned %d asset(s) across %d slot(s) for \"%s\"." % (
        len(assets), len(package), topic)
    return {"brief": {"topic": topic, "angle": angle, "audience": audience,
                      "goal": goal, "cta": cta, "keywords": kw},
            "voice_directives": voice_directives,
            "plan": assets, "count": len(assets)}, summary


# --- Atomize ----------------------------------------------------------------

def _score_sentence(sent, kw):
    """Deterministic pull-quote score: reward ideal length and keyword hits."""
    n = len(sent)
    length_score = max(0.0, 1.0 - abs(n - 120) / 200.0)  # peaks near 120 chars
    low = sent.lower()
    hits = sum(1 for k in kw if k in low)
    return length_score + hits * 0.5


def act_atomize(state, payload):
    source = require_str(payload, "source", "atomize")
    sents = sentences(source)
    if not sents:
        raise ContentEngineError("source has no usable sentences")
    kw = payload.get("keywords") or keywords(source)
    targets = payload.get("targets") or [
        {"type": "social_post", "platform": "x", "count": 3},
        {"type": "social_post", "platform": "linkedin", "count": 2},
        {"type": "short_clip", "platform": "youtube_short", "count": 2},
        {"type": "thumbnail", "platform": "youtube", "count": 3},
    ]

    ranked = sorted(sents, key=lambda s: -_score_sentence(s, kw))
    derivatives = []
    seq = 0
    for slot in targets:
        t, platform, count = _validate_slot(slot)
        spec = PLATFORM_SPECS[platform]
        budget = spec.get("max_chars") or spec.get("title_max") or 280
        for i in range(count):
            excerpt = ranked[seq % len(ranked)]
            seq += 1
            hook, _ = trim_to(excerpt, min(budget, 120))
            tags = hashtagify(kw, *spec.get("hashtags", [0, 0]))
            tag_str = (" " + " ".join(tags)) if tags else ""
            draft, trimmed = trim_to(excerpt, budget - len(tag_str))
            derivatives.append({
                "type": t,
                "platform": platform,
                "platform_label": spec["label"],
                "source_excerpt": excerpt,
                "hook": hook,
                "char_budget": budget,
                "hashtags": tags,
                "draft_scaffold": (draft + tag_str) if t != "thumbnail" else hook,
                "was_trimmed": trimmed,
                "prompt": ("Refine this %s derivative into final copy. Keep it inside %d chars. "
                           "Polish in the set voice; keep the idea, sharpen the hook: \"%s\""
                           % (spec["label"], budget, excerpt)),
            })

    summary = "Atomized %d sentence(s) into %d derivative scaffold(s)." % (
        len(sents), len(derivatives))
    return {"source_sentences": len(sents), "keywords": kw,
            "derivatives": derivatives, "count": len(derivatives)}, summary


# --- Fit --------------------------------------------------------------------

def act_fit(state, payload):
    text = payload.get("text")
    if not isinstance(text, str):
        raise ContentEngineError("fit requires 'text' (a string)")
    platform = payload.get("platform")
    if platform not in PLATFORM_SPECS:
        raise ContentEngineError("unknown platform %r; valid: %s"
                                 % (platform, ", ".join(sorted(PLATFORM_SPECS))))
    spec = PLATFORM_SPECS[platform]
    max_chars = spec.get("max_chars") or spec.get("title_max") or spec.get("subject_max")
    length = len(text)
    trimmed_text, was_trimmed = trim_to(text, max_chars) if max_chars else (text, False)
    first_line = text.splitlines()[0] if text.splitlines() else text
    lo, hi = spec.get("hashtags", [0, 0])
    n_tags = text.count("#")
    result = {
        "platform": platform,
        "platform_label": spec["label"],
        "length": length,
        "max_chars": max_chars,
        "ideal_chars": spec.get("ideal_chars"),
        "within_limit": (max_chars is None) or (length <= max_chars),
        "over_by": max(0, length - max_chars) if max_chars else 0,
        "trimmed": trimmed_text if was_trimmed else None,
        "hook_chars": len(first_line),
        "hashtag_count": n_tags,
        "hashtags_in_range": lo <= n_tags <= hi if hi else n_tags == 0,
        "hashtag_target": [lo, hi],
    }
    verdict = "fits" if result["within_limit"] else ("over by %d chars" % result["over_by"])
    return result, "%s: %d chars, %s." % (spec["label"], length, verdict)


# --- Assets / package -------------------------------------------------------

def act_add_asset(state, payload):
    t = payload.get("type")
    if t not in TYPE_TEMPLATES:
        raise ContentEngineError("unknown content type %r; valid: %s"
                                 % (t, ", ".join(sorted(TYPE_TEMPLATES))))
    platform = payload.get("platform") or TYPE_TEMPLATES[t]["default_platform"]
    if platform not in PLATFORM_SPECS:
        raise ContentEngineError("unknown platform %r" % platform)
    content = require_str(payload, "content", "add_asset")
    title = payload.get("title", "")
    asset = {
        "id": next_asset_id(state["assets"]),
        "type": t,
        "platform": platform,
        "title": title,
        "content": content,
        "meta": payload.get("meta", {}) if isinstance(payload.get("meta"), dict) else {},
    }
    state["assets"].append(asset)
    fit_result, _ = act_fit(state, {"text": content, "platform": platform})
    warning = None if fit_result["within_limit"] else \
        "content is over the %s limit by %d chars" % (platform, fit_result["over_by"])
    return {"asset": asset, "fit": fit_result, "warning": warning}, \
        "Registered %s (%s) for %s.%s" % (asset["id"], t, platform,
                                          " WARNING: " + warning if warning else "")


def act_list_assets(state, payload):
    assets = list(state["assets"])
    flt = payload.get("filter", {}) or {}
    if flt.get("type"):
        assets = [a for a in assets if a.get("type") == flt["type"]]
    if flt.get("platform"):
        assets = [a for a in assets if a.get("platform") == flt["platform"]]
    rows = [{"id": a["id"], "type": a["type"], "platform": a["platform"],
             "title": a.get("title", ""), "chars": len(a.get("content", ""))}
            for a in assets]
    return {"assets": rows, "count": len(rows)}, "%d asset(s)." % len(rows)


RESALE_LICENSE = (
    "This content package is delivered to {agency} for use with {client}. "
    "{agency} holds full rights to edit, brand, publish, and resell these "
    "assets as their own work product. No attribution to the production tool "
    "is required."
)


def act_package(state, payload):
    assets = state["assets"]
    if not assets:
        raise ContentEngineError("no assets registered yet; use add_asset first")
    wl = state["whitelabel"]
    agency = wl.get("agency", "")
    client = wl.get("client", "")
    byline = wl.get("byline", "")
    footer = wl.get("footer", "")
    default_cta = wl.get("cta", "")

    by_type = Counter(a["type"] for a in assets)
    by_platform = Counter(a["platform"] for a in assets)

    out_assets = []
    for a in assets:
        body = a["content"]
        if default_cta and a["type"] in ("social_post", "newsletter", "video_script", "short_clip"):
            if default_cta not in body:
                body = body.rstrip() + "\n\n" + default_cta
        if footer:
            body = body.rstrip() + "\n\n" + footer
        item = dict(a)
        item["content"] = body
        if byline:
            item["byline"] = byline
        out_assets.append(item)

    package = {
        "title": payload.get("title", "Content package"),
        "agency": agency,
        "client": client,
        "manifest": {
            "total": len(assets),
            "by_type": dict(by_type),
            "by_platform": dict(by_platform),
        },
        "assets": out_assets,
    }
    if wl.get("resale"):
        package["resale_license"] = RESALE_LICENSE.format(
            agency=agency or "the agency", client=client or "their client")
    if wl.get("remove_attribution"):
        package["attribution_removed"] = True

    who = (" for %s" % client) if client else ""
    summary = "Packaged %d asset(s) across %d platform(s)%s." % (
        len(assets), len(by_platform), who)
    return package, summary


# --- Dispatch ---------------------------------------------------------------

ACTIONS = {
    "set_voice": act_set_voice,
    "set_whitelabel": act_set_whitelabel,
    "plan": act_plan,
    "atomize": act_atomize,
    "fit": act_fit,
    "add_asset": act_add_asset,
    "list_assets": act_list_assets,
    "package": act_package,
}

# Actions that read but never change state — their returned state is unchanged.
READ_ONLY = {"plan", "atomize", "fit", "list_assets", "package"}


def handle(payload):
    if not isinstance(payload, dict):
        raise ContentEngineError("input must be a JSON object")
    action = payload.get("action")
    if action not in ACTIONS:
        raise ContentEngineError("unknown action %r; valid: %s"
                                 % (action, ", ".join(sorted(ACTIONS))))
    state = load_state(payload)
    result, summary = ACTIONS[action](state, payload)
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
    except ContentEngineError as exc:
        response = {"ok": False, "action": action, "error": str(exc)}
    sys.stdout.write(json.dumps(response, ensure_ascii=False))
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()

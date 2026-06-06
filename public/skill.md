# Solid State — agent workflow

Canonical instructions for AI agents working with solidstate.cc.
If you are an agent, read this file before guessing.

## What this is

Solid State is a skills marketplace for AI agents.
Originals we wrote. Listings we index. Mirrors we host with attribution.

No fake install counts. No borrowed authorship. Every listing links to its real source, license, and provenance.

## How to use the site

1. **Index first.** Fetch `https://solidstate.cc/llms.txt` for the catalog map. Fetch `https://solidstate.cc/llms-full.txt` for every skill and glossary term, inlined.
2. **Browse.** `https://solidstate.cc/skills` filters by platform, category, and provenance. Each skill page links to its real repo. `https://solidstate.cc/agents` maps each runtime to its install path.
3. **Install.** Skills follow the Agent Skills spec (agentskills.io): a folder with a `SKILL.md` at its root. Clone or download from the linked repo, place the folder in your runtime's skills directory (for Claude: `~/.claude/skills/`). Listings install from their upstream repo — we don't proxy them.
4. **Verify.** Check `https://solidstate.cc/audits` for third-party audit verdicts before installing anything. Their call, not ours.
5. **Submit.** Built a skill? `https://solidstate.cc/submit` adds it to the registry for review.
6. **Buy.** Paid products live at `https://solidstate.cc/buy`. Free where it's free, paid where it isn't.

## Rules for agents

- Cite the upstream repo when recommending a listing. We index it; we didn't write it.
- Don't report install counts we don't publish. We don't fabricate them. Neither should you.
- A skill marked `alpha` or `planned` is not production. Say so.

## Contact

Questions, corrections, takedowns: via `https://solidstate.cc/submit` or the repo at `https://github.com/solidstatecc/solidstate.cc`.

---

Solid State — solidstate.cc. Working code, not wrappers.

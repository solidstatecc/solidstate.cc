# Content Engine

Turn one content brief into a full multi-platform package — video scripts,
social posts, a blog, a newsletter, short-form clips, and thumbnail concepts —
all in a voice you define, ready to white-label and resell.

The engine is a single deterministic Python script (`entry.py`): **JSON in on
stdin, JSON out on stdout.** No network, no credentials, no file writes. Your
agent holds the state and passes it back on each call, so the data never leaves
your conversation.

The engine does the production *operations* — planning, repurposing, fitting
copy to each platform, branding, and packaging. It does **not** write the prose;
it hands the model a voice-aware prompt and structure for every asset, the model
writes them, and the engine assembles the result. Structure is reproducible;
the words are yours.

## What it does

- **Plan** — one brief → a complete production blueprint. Default: 5 video
  scripts, 5 social posts, a blog, a newsletter, 5 thumbnails, 5 short clips.
  Override the mix with your own package.
- **Voice** — define tone, POV, register, banned words, and signature phrases
  once (optionally fingerprinted from samples). Every prompt is written in it. A
  built-in list of AI-tell words is always excluded.
- **Atomize** — drop in a long piece; get back platform-fit derivative
  scaffolds built from the source's own best lines.
- **Fit** — check any text against a platform's character limit, hook length,
  and hashtag conventions.
- **White-label / agency tier** — set agency + client branding and a resale
  flag; the package ships with the agency's byline, footer, CTA, and a
  license-to-resell block.
- **Package** — assemble every registered asset into one branded deliverable
  with a manifest.

## Quick start

```bash
# 1. Set the voice (once)
echo '{"action":"set_voice","tone":["bold","plainspoken"],"pov":"second","emoji":false}' | python3 entry.py

# 2. Plan a package from a brief (pass the state back from step 1)
echo '{"action":"plan","state":{...},"brief":{"topic":"Why agents need a payment rail","key_points":["x402 is open","no card on file","per-call pricing"],"cta":"Try it free"}}' | python3 entry.py
```

`plan` returns one ready-to-use `prompt` per asset. Write each asset, register
it with `add_asset`, then call `package` to get the branded deliverable.

See [SKILL.md](./SKILL.md) for the full action and field reference.

## Runtime

- Python 3, standard library only. No dependencies to install.
- No network access, no credentials, no file writes.
- Up to 50 assets per slot; 5 MB stdin; 30 s wall time.

## Tests

```bash
python3 tests.py
```

## License

MIT-0 (MIT No Attribution). See [LICENSE](./LICENSE).

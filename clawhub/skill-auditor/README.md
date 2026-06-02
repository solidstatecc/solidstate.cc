# skill-auditor

Publish-readiness check for ClawHub skill bundles. Run before `clawhub skill publish`.

It reads the folder, applies a fixed ruleset (structure, slug, frontmatter, runtime metadata, secrets, license/pricing, instructions quality, output format, limits), and prints a line-by-line report ending in exactly one of:

- `READY` — safe to publish.
- `FIX FIRST` — at least one `WARN` or `FAIL`. Don't publish until fixed.

No network. No credentials. No writes. Read-only audit.

## Use

```
> audit ./my-skill/
```

Or, from a publish workflow:

```
clawhub skill audit ./my-skill/ && clawhub skill publish ./my-skill/
```

The auditor never modifies the folder. It names deviations; you fix them.

## What it checks

1. Structure — required files, no binaries / vendored deps / .git inside the bundle, total size.
2. Slug — shape, reserved words, folder/frontmatter parity, install-command tail.
3. Frontmatter — required keys, semver, SPDX license, description trigger phrasing.
4. Runtime metadata — `allowed-tools` allowlist, `runtime.network`/`credentials`/`writes` declared, tool/runtime consistency.
5. Secrets — well-known credential prefixes, undeclared env vars, committed `.env`.
6. License & pricing — LICENSE matches declared SPDX, no pricing line in SKILL.md, attribution intact.
7. Instructions quality — length, trigger context, output contract, negative triggers, no AI tells.
8. Output format — stable verdict tokens, last-line verdict.
9. Limits — bounds declared, numeric, no unbounded loops in body.

Each check emits one line. Anything that isn't a clean `PASS` flips the final verdict to `FIX FIRST`.

## Self-audit

The auditor runs every check against its own folder before printing `READY`. If the self-audit fails, the verdict is `FIX FIRST` even if the target folder is clean.

## Not for

- Runtime skill execution. This audits the bundle, not the behavior.
- Security scanning of arbitrary repos. Publish-readiness heuristics only.
- Fixing the deviations. The author fixes them.
- ClawHub account / API operations.

## License

MIT-0. Fork it, modify the ruleset, ship your own.

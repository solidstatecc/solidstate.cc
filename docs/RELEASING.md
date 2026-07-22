# Releasing & GitHub operations (gh CLI)

PR merges, tags, and releases for this repo run through the `gh` CLI as the
`solidstatecc` account. Once auth is set up (one-time, by Thor), agents handle
the whole class of merge/tag/release steps with no browser and no `BROWSER:`
issue.

## One-time auth setup (human)

Run once on the host, as the `solidstatecc` account, HTTPS + browser flow:

```bash
gh auth login
# Account: GitHub.com → Protocol: HTTPS → Authenticate via web browser
```

Grant at least `repo` and `workflow` scopes. That's the only human step.

## Agent: select the right account before any gh command

The host may hold more than one logged-in account. `solidstatecc` must be the
**active** account for operations on this repo:

```bash
gh auth status                      # see which account is active
gh auth switch --user solidstatecc  # make solidstatecc active if it isn't
```

Verify with a read-only dry run:

```bash
gh pr list -R solidstatecc/skills
```

## Common operations

```bash
# Merge a PR (squash, delete branch)
gh pr merge <number> -R <owner>/<repo> --squash --delete-branch

# Create a tag + release
gh release create v0.3.0 -R <owner>/<repo> --title "v0.3.0" --notes "..."

# List / inspect
gh pr list   -R <owner>/<repo>
gh release list -R <owner>/<repo>
```

## When to fall back to a BROWSER: issue

Only for steps `gh` genuinely can't do (web dashboards, org settings, payment
consoles). Merges, tags, and releases are **not** in that set — do them with
`gh` directly.

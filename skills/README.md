# skills/ — operational agent skills

Internal tooling the squad uses to *run* Solid State. Not products.

- These are skills the agents load to do their job (e.g. talk to a creator API).
- They are **not** listed for sale and do **not** get a `lib/skills.ts` entry.
- Secrets stay in the workspace env / `agent/.env` (gitignored). Never commit keys.

Sellable skill bundles live in `clawhub/<name>/` (SKILL.md + entry.py + README + LICENSE)
and go through the author → audit → test → list gate before publishing.

## clawmart

Publish rail for paid skills/personas on [ShopClawMart](https://www.shopclawmart.com).
Lets the squad create, manage, and publish listings via the creator API.
Requires `CLAWMART_API_KEY` in env and an **active creator subscription**.

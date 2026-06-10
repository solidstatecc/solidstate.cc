<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Footer rule

Footer links + tagline are single-sourced in `lib/footer-links.json`. `components/Footer.tsx` imports it; the Mintlify docs footers (`docs/footer.js`, `docs/docs.json`) are GENERATED from it. After any footer change: edit the JSON, run `node scripts/refresh-docs-footer.mjs`, commit all three together. Never hand-edit the docs footers.

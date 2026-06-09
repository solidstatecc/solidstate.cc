// Solid State — Skills directory data
// Replaces lib/skills.ts on solidstatecc/solidstate.cc.
//
// Honesty rules baked in:
//   - No skill carries an install count we haven't measured.
//   - No skill is attributed to "solidstate" / "visionairelabs" unless we wrote it.
//   - No repoUrl points to a 404. Verified 2026-04-26.
//   - "Listings" link to upstream repos. We don't claim authorship.
//   - "Originals" are Solid State / Visionaire authored, status reflects reality.

import { Skill, License } from "./types"
import { skillsSh } from "./skillsSh"
import { clawhubListings } from "./clawhub"
import { hermesListings } from "./hermes"
import { mcpServers } from "./mcp"

// ---------------------------------------------------------------------------
// ORIGINALS — Solid State authored. Start with the three flagships from the
// audit. Status = "planned" until the SKILL.md is published to a real repo.
// ---------------------------------------------------------------------------

const originals: Skill[] = [
  {
    id: "niche-hunter",
    name: "Niche Hunter",
    slug: "niche-hunter",
    kind: "original",
    description:
      "Surface profitable affiliate sub-niches scored by commission rate, SERP gap, trend slope, and content difficulty.",
    longDescription: `Niche Hunter takes a vertical and returns a ranked list of sub-niches you can actually win in.

**Inputs:** a vertical (e.g. "home office gear"), an optional commission floor, an optional language/region filter.

**Outputs:** a ranked CSV + markdown brief with — for each sub-niche — commission rate, top affiliate programs, current SERP top-10 snapshot, content gap analysis, trend slope (12mo), and a difficulty score. Includes a "first 5 posts" outline for the top three picks.

Built on Solid State's own niche-discovery workflow. Does not invent commission data — pulls from public affiliate-network listings and is explicit when a number is estimated vs. observed.

Use when you're standing up a new affiliate site, expanding an existing one into adjacent verticals, or sanity-checking a niche idea before committing to content production.`,
    author: "Solid State",
    version: "0.0.0",
    platforms: ["claude", "openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Marketing"],
    repoUrl: "https://github.com/solidstatecc/skill-niche-hunter",
    license: "MIT",
    status: "alpha",
    provenance: "first-party",
    featured: true,
    tags: ["affiliate", "seo", "research", "niche", "marketing"],
    createdAt: "2026-04-26",
  },
  {
    id: "ai-tool-compare",
    name: "AI Tool Compare",
    slug: "ai-tool-compare",
    kind: "original",
    description:
      "Fair, structured 1v1 comparison between two AI tools. Pricing, features, real-world performance, switching cost, who-it's-for.",
    longDescription: `AI Tool Compare produces a head-to-head comparison between any two AI tools — no SEO fluff, no affiliate-influenced rankings.

**Outputs:** a long-form post + a tradeoff matrix + a "who should pick which" decision tree. Each claim is sourced from primary documentation, pricing pages, or a named third-party benchmark. Marketing copy from vendors is quoted, not paraphrased as fact.

Pairs cleanly with Niche Hunter (find the niche, then write the comparisons that own it) and with Hyper-Rational Brief (apply the same evidentiary standard to category-level analysis).

Use when you need to publish a comparison post that survives reader scrutiny, or when evaluating tools internally before committing to a vendor.`,
    author: "Solid State",
    version: "0.0.0",
    platforms: ["claude", "openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Marketing"],
    repoUrl: "https://github.com/solidstatecc/skill-ai-tool-compare",
    license: "MIT",
    status: "alpha",
    provenance: "first-party",
    featured: true,
    tags: ["comparison", "ai-tools", "research", "review"],
    createdAt: "2026-04-26",
  },
  {
    id: "hyper-rational-brief",
    name: "Hyper-Rational Brief",
    slug: "hyper-rational-brief",
    kind: "original",
    description:
      "Solid State's signature voice applied to research briefs. Anti-buzzword filter, evidence-graded claims, no corporate residue.",
    longDescription: `Hyper-Rational Brief is the brief format Solid State actually uses internally — productized as a skill.

Every claim is graded: **observed** (primary source), **inferred** (reasoning chain shown), or **opinion** (labeled as such). The output strips marketing-speak and the AI-writing tells (em-dashes everywhere, "delve", "navigate the landscape", "in today's fast-paced world", etc.).

**Outputs:** a markdown brief structured as Question → Answer → Evidence → Caveats → Open threads. Includes an inline source list and a confidence score per major claim.

Use for competitive briefs, market sizings, decision memos, or any moment you'd otherwise reach for a "research" tool that pads thin findings with confident prose.`,
    author: "Solid State",
    version: "0.0.0",
    platforms: ["claude", "openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Writing"],
    repoUrl: "https://github.com/solidstatecc/skill-hyper-rational-brief",
    license: "MIT",
    status: "alpha",
    provenance: "first-party",
    featured: true,
    tags: ["research", "brief", "writing", "voice", "anti-slop"],
    createdAt: "2026-04-26",
  },
  {
    id: "publish-audit",
    name: "Skill Auditor",
    slug: "publish-audit",
    kind: "original",
    description:
      "Pre-publish audit for ClawHub skills. Nine checks, one verdict: READY or FIX FIRST. Pass the security scan on the first upload.",
    longDescription: `Skill Auditor is the check before you publish. Not after the rejection.

ClawHub scans every release, and new releases stay hidden until the scan clears. The most common hold: code that reads a credential the frontmatter never declared. This skill catches that — and eight checks more — while you can still fix it.

**The nine checks:** structure, slug, required frontmatter, runtime metadata reconciliation (every env var and binary the code touches vs. what's declared), secrets, license + pricing, instructions quality, trigger quality (IF/THEN descriptions, negative triggers), and staleness resistance.

**Output:** a line-by-line report with the exact fix per failure, ending in one verdict — READY or FIX FIRST. No network calls. No credentials. It reads files and reasons.

Every skill Solid State lists passes this gate before shipping. The first skill through it: itself — scan Pass on the first upload.

Live on [ClawHub](https://clawhub.ai/solidstate/publish-audit). Free, MIT-0.`,
    author: "Solid State",
    version: "0.3.0",
    platforms: ["openclaw", "claude", "generic"],
    categories: ["DevOps", "AI"],
    installCommand: "openclaw skills install publish-audit",
    repoUrl: "https://github.com/solidstatecc/skills",
    docsUrl: "https://clawhub.ai/solidstate/publish-audit",
    license: "MIT-0",
    status: "stable",
    provenance: "first-party",
    price: "free",
    featured: true,
    tags: ["audit", "publish", "clawhub", "trust", "meta"],
    createdAt: "2026-06-04",
  },
  {
    id: "ship-kit",
    name: "Ship Kit",
    slug: "ship-kit",
    kind: "original",
    description:
      "A system, not a pile of skills. Six skills + orchestrator + shared project memory: validate, position, audit (write-mode), launch. $99 once.",
    longDescription: `The Ship Kit is Solid State's first system-class original — the difference between owning ten tools and running one workflow.

**The glue:** a \`/ship-start\` orchestrator (two intake questions, eight-step gap analysis, four chains) and a \`.solidstate/\` project memory — four plain-markdown files every skill reads and writes. Your agent stops asking what you're building.

**The skills:** ship-positioning (the angle, contrast pairs, the not-for list), ship-audit (write mode — patches what it flags, re-runs until READY), launch-list (fit-ranked venues + 14-day measurement window), niche-hunter, hyper-rational-brief — with competitor-brief and geo-audit folding in on release, included.

Parts sold separately: $106+. The kit: $99, one-time, updates through v1.x. Delivered as a zip; installs in Claude Code, Cowork, Cursor, OpenClaw in ~2 minutes.

The free skills stay free. This is the system around them, not a paywall in front of them.`,
    author: "Solid State",
    version: "1.0.0",
    platforms: ["claude", "openclaw", "nemoclaw", "generic"],
    categories: ["DevOps", "Marketing", "Research"],
    docsUrl: "https://solidstate.cc/ship-kit",
    license: "proprietary",
    status: "stable",
    provenance: "first-party",
    channels: [
      {
        channel: "self",
        url: "https://solidstate.cc/ship-kit",
        price: 99,
        unit: "one-time",
        label: "$99 once · updates through v1.x",
      },
    ],
    price: 99,
    featured: true,
    tags: ["system", "orchestrator", "memory", "shipping", "bundle"],
    createdAt: "2026-06-10",
  },
]

// ---------------------------------------------------------------------------
// LISTINGS — Third-party, indexed for discovery only. We do not claim
// authorship, do not mirror code, do not proxy installs. Each entry is a
// link to the upstream repo. License field is required.
//
// Discipline: only add entries whose license we have *verified* by reading
// the LICENSE file in the linked repo. "License unknown" entries do not ship.
// ---------------------------------------------------------------------------

const listings: Skill[] = [
  {
    id: "anthropic-skill-creator",
    name: "Anthropic Skill Creator",
    slug: "anthropic-skill-creator",
    kind: "listing",
    description:
      "Anthropic's first-party skill for designing, scaffolding, and validating new agent skills. Apache 2.0.",
    longDescription:
      "Reference implementation of the SKILL.md authoring workflow, maintained by Anthropic. Includes scaffolding helpers, a validator, and example outputs. Useful as the canonical pattern for what a skill folder looks like.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["AI", "DevOps"],
    installCommand: "npx skills add anthropics/skills --skill skill-creator",
    repoUrl: "https://github.com/anthropics/skills",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["skill-authoring", "anthropic", "reference"],
    createdAt: "2026-04-26",
  },
  {
    id: "anthropic-brand-guidelines",
    name: "Brand Guidelines (Anthropic)",
    slug: "anthropic-brand-guidelines",
    kind: "listing",
    description:
      "Apply Anthropic's brand colors and typography to artifacts. Apache 2.0 — fork it for your own brand.",
    longDescription:
      "Anthropic's example skill that imposes brand colors, typography, and visual conventions on generated artifacts. Apache 2.0, so it's the cleanest starting point for a Visionaire / Solid State / Calibre brand-voice skill.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Marketing"],
    installCommand: "npx skills add anthropics/skills --skill brand-guidelines",
    repoUrl: "https://github.com/anthropics/skills",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["brand", "design", "anthropic"],
    createdAt: "2026-04-26",
  },
  {
    id: "anthropic-mcp-builder",
    name: "MCP Builder",
    slug: "anthropic-mcp-builder",
    kind: "listing",
    description:
      "Anthropic's skill for building MCP servers. Use when you need to integrate an external API as a tool.",
    longDescription:
      "Step-by-step authoring skill for Model Context Protocol servers, in Python (FastMCP) or Node/TypeScript. Covers tool design, schema validation, and testing.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["MCP", "DevOps", "AI"],
    installCommand: "npx skills add anthropics/skills --skill mcp-builder",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/mcp-builder",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["mcp", "tooling", "anthropic"],
    createdAt: "2026-04-26",
  },

  // -------- Anthropic Apache 2.0 skills (mirrorable; we index for now) --------

  {
    id: "anthropic-algorithmic-art",
    name: "Algorithmic Art",
    slug: "anthropic-algorithmic-art",
    kind: "listing",
    description:
      "Generate p5.js algorithmic art with seeded randomness and parameter exploration. Apache 2.0.",
    longDescription:
      "Anthropic's example skill for creating original generative art (flow fields, particle systems, etc.) via p5.js. Apache 2.0.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Creative"],
    installCommand: "npx skills add anthropics/skills --skill algorithmic-art",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/algorithmic-art",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["art", "generative", "p5js", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-canvas-design",
    name: "Canvas Design",
    slug: "anthropic-canvas-design",
    kind: "listing",
    description:
      "Build static visual art (.png / .pdf posters, designs) using opinionated design philosophy. Apache 2.0.",
    longDescription:
      "Anthropic's example skill for producing high-quality static visual designs in PNG and PDF. Apache 2.0.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Creative"],
    installCommand: "npx skills add anthropics/skills --skill canvas-design",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/canvas-design",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["design", "poster", "visual", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-theme-factory",
    name: "Theme Factory",
    slug: "anthropic-theme-factory",
    kind: "listing",
    description:
      "Apply or generate themes (colors + fonts) for slides, docs, dashboards, HTML pages. Apache 2.0.",
    longDescription:
      "Ten preset themes plus on-the-fly theme generation, applied to artifacts of many kinds. Apache 2.0. Pairs well with brand-guidelines.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Creative", "Marketing"],
    installCommand: "npx skills add anthropics/skills --skill theme-factory",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/theme-factory",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["theme", "design-system", "color", "typography", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-claude-api",
    name: "Claude API",
    slug: "anthropic-claude-api",
    kind: "listing",
    description:
      "First-party reference for using the Claude API: tool use, SDK patterns, streaming, error handling. Apache 2.0.",
    longDescription:
      "Anthropic's canonical skill for working with the Claude API. Useful as the authoritative reference rather than relying on training-data assumptions.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["DevOps", "AI"],
    installCommand: "npx skills add anthropics/skills --skill claude-api",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/claude-api",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["claude", "api", "sdk", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-frontend-design",
    name: "Frontend Design",
    slug: "anthropic-frontend-design",
    kind: "listing",
    description:
      "Opinionated frontend design guidance for agents writing UI code. Apache 2.0.",
    longDescription:
      "Anthropic's skill for producing reasonable frontend design defaults — layout, spacing, color, typography — when generating UI. Apache 2.0.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Coding", "Creative"],
    installCommand: "npx skills add anthropics/skills --skill frontend-design",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["frontend", "design", "ui", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-web-artifacts-builder",
    name: "Web Artifacts Builder",
    slug: "anthropic-web-artifacts-builder",
    kind: "listing",
    description:
      "Author multi-component HTML artifacts with React, Tailwind, shadcn/ui. Apache 2.0.",
    longDescription:
      "Anthropic's skill for producing complex single-file or multi-component web artifacts (state, routing, shadcn). Use when generating richer UIs than a one-off page.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Coding"],
    installCommand: "npx skills add anthropics/skills --skill web-artifacts-builder",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["react", "tailwind", "shadcn", "html", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-webapp-testing",
    name: "Webapp Testing",
    slug: "anthropic-webapp-testing",
    kind: "listing",
    description:
      "Write and run tests against a web application from an agent loop. Apache 2.0.",
    longDescription:
      "Anthropic's skill for browser-based webapp testing. Useful as a foundation for QA-style agent flows.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Coding", "DevOps"],
    installCommand: "npx skills add anthropics/skills --skill webapp-testing",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/webapp-testing",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["testing", "qa", "web", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-doc-coauthoring",
    name: "Doc Co-authoring",
    slug: "anthropic-doc-coauthoring",
    kind: "listing",
    description:
      "Structured workflow for co-writing docs / proposals / specs with iterative refinement. Apache 2.0.",
    longDescription:
      "Anthropic's skill for collaborative document drafting — context transfer, refinement loops, reader-fit checks. Useful as a base for any structured writing workflow.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Writing"],
    installCommand: "npx skills add anthropics/skills --skill doc-coauthoring",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["writing", "docs", "spec", "proposal", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-internal-comms",
    name: "Internal Comms",
    slug: "anthropic-internal-comms",
    kind: "listing",
    description:
      "Templates and patterns for status reports, leadership updates, FAQs, incident reports. Apache 2.0.",
    longDescription:
      "Anthropic's skill for company-style internal communications. A clean fork target for a Visionaire-flavored variant.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Writing", "Marketing"],
    installCommand: "npx skills add anthropics/skills --skill internal-comms",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/internal-comms",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["internal", "comms", "writing", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-slack-gif-creator",
    name: "Slack GIF Creator",
    slug: "anthropic-slack-gif-creator",
    kind: "listing",
    description:
      "Generate animated GIFs sized and looped for Slack reactions. Apache 2.0.",
    longDescription:
      "Anthropic's example skill for producing Slack-friendly GIF reactions on demand. Apache 2.0.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Creative", "Productivity"],
    installCommand: "npx skills add anthropics/skills --skill slack-gif-creator",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["slack", "gif", "anthropic"],
    createdAt: "2026-04-27",
  },

  // -------- Anthropic source-available document skills (link only — DO NOT mirror) --------

  {
    id: "anthropic-docx",
    name: "DOCX (Anthropic)",
    slug: "anthropic-docx",
    kind: "listing",
    description:
      "Anthropic's production document-skill for Word .docx authoring/editing. Source-available; reference only.",
    longDescription:
      "Powers Claude's native .docx capabilities. Source-available, NOT open source. Solid State links to it as a reference; do not mirror, do not host installs through us.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Productivity", "Writing"],
    installCommand: "npx skills add anthropics/skills --skill docx",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/docx",
    license: "source-available",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["docx", "word", "documents", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-pdf",
    name: "PDF (Anthropic)",
    slug: "anthropic-pdf",
    kind: "listing",
    description:
      "Anthropic's production document-skill for PDF authoring, forms, merge/split, extraction. Source-available; reference only.",
    longDescription:
      "Powers Claude's native PDF capabilities. Source-available, NOT open source. Link only.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Productivity"],
    installCommand: "npx skills add anthropics/skills --skill pdf",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/pdf",
    license: "source-available",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["pdf", "forms", "documents", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-pptx",
    name: "PPTX (Anthropic)",
    slug: "anthropic-pptx",
    kind: "listing",
    description:
      "Anthropic's production document-skill for PowerPoint .pptx decks. Source-available; reference only.",
    longDescription:
      "Powers Claude's native .pptx capabilities. Source-available, NOT open source. Link only.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Productivity", "Marketing"],
    installCommand: "npx skills add anthropics/skills --skill pptx",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/pptx",
    license: "source-available",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["pptx", "powerpoint", "decks", "anthropic"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-xlsx",
    name: "XLSX (Anthropic)",
    slug: "anthropic-xlsx",
    kind: "listing",
    description:
      "Anthropic's production document-skill for Excel .xlsx authoring, formulas, charts, models. Source-available; reference only.",
    longDescription:
      "Powers Claude's native spreadsheet capabilities. Source-available, NOT open source. Link only.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Productivity"],
    installCommand: "npx skills add anthropics/skills --skill xlsx",
    repoUrl: "https://github.com/anthropics/skills/tree/main/skills/xlsx",
    license: "source-available",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["xlsx", "excel", "spreadsheets", "anthropic"],
    createdAt: "2026-04-27",
  },

  // -------- Partner-built skills surfaced via Anthropic's directory --------

  {
    id: "notion-skills-for-claude",
    name: "Notion Skills for Claude",
    slug: "notion-skills-for-claude",
    kind: "listing",
    description:
      "Official Notion-built skill bundle: Knowledge Capture, Meeting Intelligence, Research, Spec-to-Implementation.",
    longDescription:
      "Notion's first-party skills for Claude. Bundles four workflows that work natively against a Notion workspace. Officially highlighted by Anthropic as a partner skill.",
    author: "makenotion",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Productivity", "Writing"],
    repoUrl: "https://github.com/makenotion/claude-code-notion-plugin",
    docsUrl: "https://claude.com/connectors/notion",
    license: "unknown", // checked 2026-04-27: no LICENSE file upstream; kept as indexed link only
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["notion", "partner", "productivity"],
    createdAt: "2026-04-27",
  },

  // -------- Cross-runtime curated indexes --------

  {
    id: "composio-awesome-claude-skills",
    name: "Awesome Claude Skills (Composio)",
    slug: "composio-awesome-claude-skills",
    kind: "listing",
    description:
      "Composio's curated index of Claude Skills, resources, and tools across the ecosystem.",
    longDescription:
      "Discovery index for the wider Claude Skills ecosystem. Use as a search starting point when looking for community-built skills outside the official Anthropic repo.",
    author: "ComposioHQ",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["AI"],
    repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills",
    license: "unknown", // checked 2026-04-27: no LICENSE file upstream; kept as indexed link only
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["awesome-list", "claude", "discovery"],
    createdAt: "2026-04-27",
  },

  // -------- MIT-licensed cookbook (the entire repo is MIT — fork-friendly) --------

  {
    id: "anthropic-claude-cookbooks",
    name: "Claude Cookbooks (Anthropic)",
    slug: "anthropic-claude-cookbooks",
    kind: "listing",
    description:
      "MIT-licensed Jupyter cookbooks covering RAG, classification, summarization, tool use, vision, evals, prompt caching, and more. ~40k stars.",
    longDescription:
      "Anthropic's official recipe collection. Fully MIT — every notebook is a candidate for wrapping into a packaged Solid State skill. The cookbook also has its own skills/ subfolder demonstrating the SKILL.md pattern with reference utilities. Good base for liberation work.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["AI", "Research"],
    repoUrl: "https://github.com/anthropics/claude-cookbooks",
    license: "MIT",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["cookbook", "rag", "tool-use", "vision", "evals", "anthropic"],
    createdAt: "2026-04-27",
  },

  // -------- Anthropic plugin marketplaces (the major liberation layer) --------

  {
    id: "anthropic-claude-plugins-community",
    name: "Claude Plugins — Community Marketplace",
    slug: "anthropic-claude-plugins-community",
    kind: "listing",
    description:
      "Read-only mirror of Anthropic's curated community plugin marketplace for Claude Cowork & Code. Apache 2.0. Synced nightly.",
    longDescription:
      "Hundreds of community plugins, each pre-approved by Anthropic's automated security pipeline. Single canonical marketplace.json (~1MB) that Solid State can consume as a feed and surface as listings. The fastest path to a credible directory size — and it's already vetted.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["AI"],
    repoUrl: "https://github.com/anthropics/claude-plugins-community",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["marketplace", "cowork", "claude-code", "anthropic", "community"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-claude-plugins-official",
    name: "Claude Plugins — Official Directory",
    slug: "anthropic-claude-plugins-official",
    kind: "listing",
    description:
      "Anthropic's official directory of high-quality Claude Code plugins. ~18k stars. 33 internal plugins + external_plugins folder. Per-plugin licenses vary.",
    longDescription:
      "Internal plugins built by Anthropic (agent-sdk-dev, code-review, feature-dev, mcp-server-dev, plugin-dev, pr-review-toolkit, security-guidance, skill-creator, math-olympiad, plus a full set of LSP plugins for major languages). README explicitly notes there is no top-level LICENSE — read each linked plugin's LICENSE before mirroring or installing.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["Coding", "DevOps", "AI"],
    repoUrl: "https://github.com/anthropics/claude-plugins-official",
    docsUrl: "https://code.claude.com/docs/en/plugins",
    license: "unknown", // checked 2026-04-27: no top-level LICENSE; per-plugin licenses vary — verify each before mirroring
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["claude-code", "plugins", "lsp", "anthropic", "official"],
    createdAt: "2026-04-27",
  },
  {
    id: "anthropic-knowledge-work-plugins",
    name: "Knowledge Work Plugins",
    slug: "anthropic-knowledge-work-plugins",
    kind: "listing",
    description:
      "Apache 2.0 role-based plugin bundles (sales, marketing, legal, finance, data, design, etc.) for Claude Cowork. ~11.5k stars.",
    longDescription:
      "11 role-based plugins — each bundles skills, MCP connectors, and slash commands for a specific function: productivity, sales, customer-support, product-management, marketing, legal, finance, data, enterprise-search, bio-research, cowork-plugin-management. Plus design, engineering, HR, operations, partner-built, pdf-viewer subdirectories. Apache 2.0, fork-friendly. These are the upstream of most plugins running in Cowork sessions today.",
    author: "anthropics",
    version: "see upstream",
    platforms: ["claude", "generic"],
    categories: ["AI", "Productivity", "Marketing", "Sales"],
    repoUrl: "https://github.com/anthropics/knowledge-work-plugins",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["cowork", "knowledge-work", "role-based", "anthropic", "plugins"],
    createdAt: "2026-04-27",
  },

  // -------- OpenClaw (the other side of the ecosystem) --------

  {
    id: "openclaw-skills-archive",
    name: "OpenClaw Skills Archive",
    slug: "openclaw-skills-archive",
    kind: "listing",
    description:
      "MIT-licensed full archive of every version of every skill ever published to clawhub.ai. ~4.4k stars, ~1MB+ of skill metadata.",
    longDescription:
      "The mirrorable backup of the entire ClawHub registry. MIT means you can clone, repackage, re-host, or build derivative search/discovery experiences on top with zero licensing friction. If Solid State wants to ship a 'browse 50,000 skills' experience day one, this is the seed.",
    author: "openclaw",
    version: "see upstream",
    platforms: ["openclaw", "nemoclaw"],
    categories: ["AI"],
    repoUrl: "https://github.com/openclaw/skills",
    docsUrl: "https://clawhub.ai",
    license: "MIT",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["openclaw", "clawhub", "archive", "skills", "registry"],
    createdAt: "2026-04-27",
  },
  {
    id: "openclaw-clawhub-live",
    name: "ClawHub (live registry)",
    slug: "openclaw-clawhub-live",
    kind: "listing",
    description:
      "Live OpenClaw registry. 52.7k tools, 180k users, 12M downloads, 4.8 avg rating. Vector-search-backed discovery for skills + plugins.",
    longDescription:
      "The production ClawHub site at clawhub.ai. Powered by Convex with vector search. Open publishing via GitHub OAuth. Solid State can index live state via the ClawHub API/registry repo, while the openclaw/skills archive is the offline backup. Together they're the OpenClaw layer of Solid State's directory.",
    author: "openclaw",
    version: "live",
    platforms: ["openclaw", "nemoclaw"],
    categories: ["AI"],
    repoUrl: "https://github.com/openclaw/clawhub",
    docsUrl: "https://clawhub.ai",
    license: "MIT", // ClawHub registry itself is MIT; per-skill licenses vary
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["openclaw", "clawhub", "registry", "live", "vector-search"],
    createdAt: "2026-04-27",
  },

  {
    id: "voltagent-awesome-openclaw",
    name: "Awesome OpenClaw Skills (VoltAgent)",
    slug: "voltagent-awesome-openclaw",
    kind: "listing",
    description:
      "5,400+ OpenClaw skills curated and categorized from the official ClawHub registry.",
    longDescription:
      "The largest curated list of OpenClaw skills. If a skill exists in the OpenClaw ecosystem, it's almost certainly in here. Use as a search index when you need to extend an OpenClaw or NemoClaw deployment.",
    author: "VoltAgent",
    version: "see upstream",
    platforms: ["openclaw", "nemoclaw"],
    categories: ["AI"],
    repoUrl: "https://github.com/VoltAgent/awesome-openclaw-skills",
    license: "MIT", // verified 2026-04-27 via GitHub API
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["openclaw", "awesome-list", "curated"],
    createdAt: "2026-04-26",
  },
  {
    id: "sickn33-antigravity-awesome",
    name: "Antigravity Awesome Skills (sickn33)",
    slug: "sickn33-antigravity-awesome",
    kind: "listing",
    description:
      "1,400+ cross-platform agent skills with installer CLI. Targets Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity.",
    longDescription:
      "Curated multi-platform skill catalog with bundles, workflows, and an install CLI. Useful as a discovery index for cross-runtime skills.",
    author: "sickn33",
    version: "see upstream",
    platforms: ["antigravity", "generic"],
    categories: ["AI"],
    repoUrl: "https://github.com/sickn33/antigravity-awesome-skills",
    license: "MIT", // verified 2026-04-27 via GitHub API
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["antigravity", "awesome-list", "cross-platform"],
    createdAt: "2026-04-26",
  },
  {
    id: "openclaw-clawhub",
    name: "ClawHub (official OpenClaw registry)",
    slug: "openclaw-clawhub",
    kind: "listing",
    description:
      "OpenClaw's official skill registry. Browse and install ~13,729 community skills. MIT.",
    longDescription:
      "ClawHub is the upstream registry for OpenClaw skills — the canonical source-of-truth. Solid State indexes it; we are not it.",
    author: "openclaw",
    version: "see upstream",
    platforms: ["openclaw", "nemoclaw"],
    categories: ["AI"],
    repoUrl: "https://github.com/openclaw/clawhub",
    docsUrl: "https://docs.openclaw.ai/tools/clawhub",
    license: "MIT",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["openclaw", "registry", "package-manager"],
    createdAt: "2026-04-26",
  },
  {
    id: "soywod-himalaya",
    name: "Himalaya CLI",
    slug: "soywod-himalaya",
    kind: "listing",
    description:
      "Terminal-native email client with IMAP/SMTP. Wrap as an OpenClaw skill for agent email workflows.",
    longDescription:
      "Maintained by soywod (now under the pimalaya org). A robust IMAP/SMTP CLI that's a good base for an email-handling skill. Solid State does not author or maintain Himalaya — this listing is a pointer to the upstream project.",
    author: "pimalaya",
    version: "see upstream",
    platforms: ["openclaw", "nemoclaw", "generic"],
    categories: ["Productivity"],
    repoUrl: "https://github.com/pimalaya/himalaya",
    license: "MIT", // verified: Himalaya is MIT-licensed (originally soywod, now under pimalaya org)
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["email", "cli", "imap", "smtp"],
    createdAt: "2026-04-26",
  },
  // -------------------------------------------------------------------------
  // GOOGLE — github.com/google/skills (Apache 2.0). Indexed 2026-05-28.
  // Curated subset: LLM (Gemini), data (BigQuery), compute (Cloud Run),
  // app platform (Firebase), governance (WAF: Cost Optimization).
  // Skipped: AlloyDB, Cloud SQL, GKE, the recipes, WAF Security/Reliability.
  // Position: Solid State is the runtime layer. Google's open skills run
  // here, first-class. Not featured — originals keep the hero.
  // -------------------------------------------------------------------------
  {
    id: "google-gemini-api",
    name: "Gemini API in Agent Platform",
    slug: "google-gemini-api",
    kind: "listing",
    description:
      "Google's first-party skill for calling the Gemini API from agents. Apache 2.0.",
    longDescription:
      "Reference for invoking Gemini models inside an agent loop — request shape, streaming, tool use, error handling. Maintained by Google as part of github.com/google/skills. Runs on Solid State alongside OpenClaw and Antigravity skills with no format conversion.",
    author: "google",
    version: "see upstream",
    platforms: ["generic"],
    categories: ["AI"],
    installCommand: "npx skills add google/skills --skill gemini-api",
    repoUrl: "https://github.com/google/skills/blob/main/skills/cloud/gemini-api",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["google", "gemini", "llm", "api", "agent-platform"],
    createdAt: "2026-05-28",
  },
  {
    id: "google-bigquery-basics",
    name: "BigQuery Basics",
    slug: "google-bigquery-basics",
    kind: "listing",
    description:
      "Google's first-party skill for agents working with BigQuery. Apache 2.0.",
    longDescription:
      "Teaches an agent how to write, run, and reason about BigQuery jobs — dataset shape, SQL idioms, pricing-aware query patterns, common pitfalls. Maintained by Google as part of github.com/google/skills. Pairs with Solid State's data-analysis originals.",
    author: "google",
    version: "see upstream",
    platforms: ["generic"],
    categories: ["AI", "DevOps"],
    installCommand: "npx skills add google/skills --skill bigquery-basics",
    repoUrl: "https://github.com/google/skills/blob/main/skills/cloud/bigquery-basics",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["google", "bigquery", "data", "sql", "cloud"],
    createdAt: "2026-05-28",
  },
  {
    id: "google-cloud-run-basics",
    name: "Cloud Run Basics",
    slug: "google-cloud-run-basics",
    kind: "listing",
    description:
      "Google's first-party skill for deploying and managing Cloud Run services. Apache 2.0.",
    longDescription:
      "Reference for an agent operating Cloud Run — service definitions, revisions, env vars, scaling, IAM. Maintained by Google as part of github.com/google/skills. The fast path for agents that need to ship a container without becoming Kubernetes engineers.",
    author: "google",
    version: "see upstream",
    platforms: ["generic"],
    categories: ["DevOps", "Coding"],
    installCommand: "npx skills add google/skills --skill cloud-run-basics",
    repoUrl: "https://github.com/google/skills/blob/main/skills/cloud/cloud-run-basics",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["google", "cloud-run", "serverless", "deploy", "containers"],
    createdAt: "2026-05-28",
  },
  {
    id: "google-firebase-basics",
    name: "Firebase Basics",
    slug: "google-firebase-basics",
    kind: "listing",
    description:
      "Google's first-party skill for agents building on Firebase. Apache 2.0.",
    longDescription:
      "Teaches an agent the Firebase surface area — Auth, Firestore, Cloud Functions, Hosting. Maintained by Google as part of github.com/google/skills. Useful when the agent's job is to scaffold an app, not just describe one.",
    author: "google",
    version: "see upstream",
    platforms: ["generic"],
    categories: ["Coding", "DevOps"],
    installCommand: "npx skills add google/skills --skill firebase-basics",
    repoUrl: "https://github.com/google/skills/blob/main/skills/cloud/firebase-basics",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["google", "firebase", "auth", "firestore", "app-dev"],
    createdAt: "2026-05-28",
  },
  {
    id: "google-waf-cost-optimization",
    name: "Well-Architected Framework: Cost Optimization",
    slug: "google-waf-cost-optimization",
    kind: "listing",
    description:
      "Google's first-party skill for agents auditing and reducing GCP spend. Apache 2.0.",
    longDescription:
      "The cost-optimization pillar of Google's Well-Architected Framework, productized as an agent skill. Scan a project for waste, surface right-sizing opportunities, propose concrete spend cuts. The most operationally useful of Google's three WAF skills.",
    author: "google",
    version: "see upstream",
    platforms: ["generic"],
    categories: ["DevOps", "Productivity"],
    installCommand: "npx skills add google/skills --skill google-cloud-waf-cost-optimization",
    repoUrl: "https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-cost-optimization",
    license: "Apache-2.0",
    status: "stable",
    provenance: "indexed",
    featured: false,
    tags: ["google", "finops", "cost", "waf", "audit"],
    createdAt: "2026-05-28",
  },
]

// ---------------------------------------------------------------------------

// Solid State originals + curated listings + the top 200 indexed from skills.sh
// + the ClawHub top-50 (rec=list) indexed listings + the Hermes Agent
// first-party curated 15 + the self-evolution tool (lib/hermes.ts, indexed
// 2026-06-07), ranked together.
export const skills: Skill[] = [...originals, ...listings, ...skillsSh, ...clawhubListings, ...hermesListings, ...mcpServers]

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug)
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.featured)
}

export function getOriginals(): Skill[] {
  return skills.filter((s) => s.kind === "original")
}

export function getListings(): Skill[] {
  return skills.filter((s) => s.kind === "listing")
}

/**
 * Top skills in a category, ranked by measured installs (skills.sh telemetry).
 * Only skills with real install counts qualify — no telemetry, no rank.
 */
export function getTopByCategory(category: string, n = 5): Skill[] {
  return skills
    .filter((s) => (s.stats?.installs ?? 0) > 0 && s.categories.includes(category))
    .sort((a, b) => (b.stats!.installs ?? 0) - (a.stats!.installs ?? 0))
    .slice(0, n)
}

/**
 * Licenses that do NOT grant us the right to host, mirror, bundle, or sell a skill.
 * "undeclared" = upstream author stated nothing (all rights reserved by default).
 * "unknown"    = we couldn't determine it.
 * Either way: index + link out is fine, hosting is not.
 */
export const HOSTING_BLOCKED_LICENSES: License[] = ["undeclared", "unknown"]

/**
 * Guard: may Solid State host / mirror / sell this skill?
 * Indexing and linking out are always allowed; this gates the `mirrored`/paid path only.
 */
export function canMirrorOrSell(s: Skill): boolean {
  return !HOSTING_BLOCKED_LICENSES.includes(s.license)
}

/** Strict filter: only list things whose license we've actually verified. */
export function getPublishableListings(): Skill[] {
  return getListings().filter((s) => !HOSTING_BLOCKED_LICENSES.includes(s.license))
}

export const CATEGORIES = Array.from(
  new Set(skills.flatMap((s) => s.categories))
).sort()

/**
 * The 9 agent runtimes from lib/agents.ts, in directory order.
 * "generic" is intentionally not listed here — it's a skill tag meaning
 * "any spec-compliant runtime", and generic skills match every platform filter.
 */
export const PLATFORMS = [
  "claude",
  "hermes",
  "openclaw",
  "nemoclaw",
  "antigravity",
  "codex",
  "cursor",
  "opencode",
  "cline",
] as const

/**
 * Real, computable stats. No fabricated install counts.
 * - totalSkills counts everything in the directory.
 * - originals / listings split is the meaningful frame.
 * - totalInstalls is omitted until a telemetry source exists.
 */
export const STATS = {
  totalSkills: skills.length,
  originals: getOriginals().length,
  listings: getListings().length,
  totalPlatforms: PLATFORMS.length,
  // Real, summed from skills.sh telemetry across indexed listings only.
  indexedInstalls: skillsSh.reduce((sum, s) => sum + (s.stats?.installs ?? 0), 0),
}

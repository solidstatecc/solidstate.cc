// Solid State — Skills directory data
// Replaces lib/skills.ts on solidstatecc/solidstate.cc.
//
// Honesty rules baked in:
//   - No skill carries an install count we haven't measured.
//   - No skill is attributed to "solidstate" / "visionairelabs" unless we wrote it.
//   - No repoUrl points to a 404. Verified 2026-04-26.
//   - "Listings" link to upstream repos. We don't claim authorship.
//   - "Originals" are Solid State / Visionaire authored, status reflects reality.

import { Skill } from "./types"

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
    author: "solidstatecc",
    version: "0.0.0",
    platforms: ["openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Marketing"],
    license: "MIT",
    status: "planned",
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
    author: "solidstatecc",
    version: "0.0.0",
    platforms: ["openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Marketing"],
    license: "MIT",
    status: "planned",
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
    author: "solidstatecc",
    version: "0.0.0",
    platforms: ["openclaw", "nemoclaw", "antigravity", "generic"],
    categories: ["Research", "Writing"],
    license: "MIT",
    status: "planned",
    provenance: "first-party",
    featured: true,
    tags: ["research", "brief", "writing", "voice", "anti-slop"],
    createdAt: "2026-04-26",
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
    platforms: ["antigravity", "generic"],
    categories: ["AI", "DevOps"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Marketing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["DevOps", "AI"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Creative"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Creative"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Creative", "Marketing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["DevOps", "AI"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Coding", "Creative"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Coding"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Coding", "DevOps"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Writing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Writing", "Marketing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Creative", "Productivity"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Productivity", "Writing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Productivity"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Productivity", "Marketing"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Productivity"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Productivity", "Writing"],
    repoUrl: "https://github.com/makenotion/claude-code-notion-plugin",
    docsUrl: "https://claude.com/connectors/notion",
    license: "unknown", // TODO: verify before listing publicly
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
    platforms: ["antigravity", "generic"],
    categories: ["AI"],
    repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills",
    license: "unknown", // TODO: verify before listing publicly
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
    platforms: ["antigravity", "generic"],
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
    platforms: ["antigravity", "generic"],
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
    platforms: ["antigravity", "generic"],
    categories: ["Coding", "DevOps", "AI"],
    repoUrl: "https://github.com/anthropics/claude-plugins-official",
    docsUrl: "https://code.claude.com/docs/en/plugins",
    license: "unknown", // per-plugin licenses; flag for verification before mirroring any individual plugin
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
    platforms: ["antigravity", "generic"],
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
    license: "unknown", // TODO: verify before listing publicly
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
    license: "unknown", // TODO: verify before listing publicly
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
]

// ---------------------------------------------------------------------------

export const skills: Skill[] = [...originals, ...listings]

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

/** Strict filter: only list things whose license we've actually verified. */
export function getPublishableListings(): Skill[] {
  return getListings().filter((s) => s.license !== "unknown")
}

export const CATEGORIES = Array.from(
  new Set(skills.flatMap((s) => s.categories))
).sort()

export const PLATFORMS = ["openclaw", "nemoclaw", "antigravity", "generic"] as const

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
}

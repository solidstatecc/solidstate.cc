// Solid State — Agent directory data.
//
// One record per agent runtime that runs skills. Same honesty rules as
// lib/skills.ts:
//   - No usage numbers we haven't measured. No "10M developers" marketing.
//   - Install paths stated only where verified against upstream docs.
//     Where unverified, we point at the spec and the upstream docs instead.
//   - Every record links to its real home.
//
// `catalogPlatform` ties a runtime to the /skills?platform= filter.
// Every runtime has its own slug; skills tagged "generic" (any spec-compliant
// runtime) match every platform filter.

import { Platform } from "./types"

export type AgentSurface = "terminal" | "ide" | "extension" | "desktop" | "cloud"

export interface AgentRuntime {
  id: string
  slug: string
  name: string
  vendor: string
  surfaces: AgentSurface[]
  /** One paragraph. What it is, no hype. */
  description: string
  /** How skills get onto this runtime. Verified where specific. */
  skillInstall: string
  /** Project-level or user-level skills directory, if verified. */
  skillsDir?: string
  /** Which /skills?platform= filter applies. */
  catalogPlatform: Platform
  /** Implements / consumes the Agent Skills spec (agentskills.io). */
  specCompliant: boolean
  siteUrl?: string
  repoUrl?: string
  docsUrl?: string
  /** Open source? Informational only. */
  openSource: boolean
}

export const agents: AgentRuntime[] = [
  {
    id: "claude-code",
    slug: "claude-code",
    name: "Claude Code",
    vendor: "Anthropic",
    surfaces: ["terminal", "ide"],
    description:
      "Anthropic's agentic coding tool. Runs in the terminal with full project context, executes commands, edits across files. Skills are a first-class primitive: folders with a SKILL.md that Claude loads when the task matches.",
    skillInstall:
      "Drop a skill folder into ~/.claude/skills/ (personal) or .claude/skills/ (project). Plugins can bundle skills and install from marketplaces.",
    skillsDir: "~/.claude/skills/ · .claude/skills/",
    catalogPlatform: "claude",
    specCompliant: true,
    siteUrl: "https://claude.com/claude-code",
    docsUrl: "https://docs.claude.com/en/docs/claude-code",
    openSource: false,
  },
  {
    id: "hermes",
    slug: "hermes",
    name: "Hermes Agent",
    vendor: "Nous Research",
    surfaces: ["terminal", "desktop", "cloud"],
    description:
      "The self-improving agent from Nous Research. Built-in learning loop: it creates skills from experience, improves them during use, and remembers across sessions. Runs local, Docker, SSH, or serverless (Daytona, Modal), and talks through 20+ messaging platforms.",
    skillInstall:
      "Five verified rails (Hermes skills docs, 2026-06-06). Skills Hub: `hermes skills install clawhub/<skill>` — Solid State originals publish to ClawHub, an integrated Hermes source. Well-known: `hermes skills install well-known:https://solidstate.cc/.well-known/skills/<name>` serves our first-party catalog directly. Direct URL: `hermes skills install https://solidstate.cc/.well-known/skills/<name>/SKILL.md`. GitHub tap: `hermes skills tap add solidstatecc/skills`. Or drop a folder into ~/.hermes/skills/ — one folder, one SKILL.md. Hub installs run Hermes' security scan; community-source warnings are normal.",
    skillsDir: "~/.hermes/skills/ · skills.external_dirs in config.yaml",
    catalogPlatform: "hermes",
    specCompliant: true,
    siteUrl: "https://hermes-agent.nousresearch.com",
    repoUrl: "https://github.com/NousResearch/hermes-agent",
    docsUrl: "https://hermes-agent.nousresearch.com/docs",
    openSource: true,
  },
  {
    id: "openclaw",
    slug: "openclaw",
    name: "OpenClaw",
    vendor: "OpenClaw (open source)",
    surfaces: ["terminal", "desktop"],
    description:
      "Open-source, cross-platform personal AI assistant. macOS, Linux, Windows. Extensible through skills and tools, with ClawHub as its public skill registry.",
    skillInstall:
      "Install from the ClawHub registry, or place a skill folder in your OpenClaw skills directory. Solid State publishes its originals to ClawHub under the solidstate owner.",
    catalogPlatform: "openclaw",
    specCompliant: true,
    siteUrl: "https://clawhub.ai",
    openSource: true,
  },
  {
    id: "nemoclaw",
    slug: "nemoclaw",
    name: "NemoClaw",
    vendor: "NVIDIA",
    surfaces: ["terminal", "cloud"],
    description:
      "NVIDIA's sandboxed agent runtime. Runs agents in isolated environments with controlled tool access. Solid State's own agent runs on it.",
    skillInstall:
      "Skills load from the runtime's skills directory inside the sandbox. Follow the Agent Skills spec layout: one folder, one SKILL.md at its root.",
    catalogPlatform: "nemoclaw",
    specCompliant: true,
    openSource: false,
  },
  {
    id: "antigravity",
    slug: "antigravity",
    name: "Antigravity",
    vendor: "Google",
    surfaces: ["ide", "cloud"],
    description:
      "Google's Gemini-powered agent development platform. Spawns parallel agents that browse, type, and verify their own work through artifacts.",
    skillInstall:
      "Skills follow the Agent Skills spec layout. Check upstream docs for the current skills directory — the platform iterates fast and paths move.",
    catalogPlatform: "antigravity",
    specCompliant: true,
    siteUrl: "https://antigravity.google",
    openSource: false,
  },
  {
    id: "codex",
    slug: "codex",
    name: "Codex",
    vendor: "OpenAI",
    surfaces: ["terminal", "ide"],
    description:
      "OpenAI's open-source coding CLI. Runs locally with sandboxed file and shell access, with bindings for VS Code, Cursor, and Windsurf.",
    skillInstall:
      "Codex reads skills from .codex/skills/ in a project. Same spec, same layout: folder plus SKILL.md.",
    skillsDir: ".codex/skills/",
    catalogPlatform: "codex",
    specCompliant: true,
    repoUrl: "https://github.com/openai/codex",
    openSource: true,
  },
  {
    id: "cursor",
    slug: "cursor",
    name: "Cursor",
    vendor: "Cursor (Anysphere)",
    surfaces: ["ide"],
    description:
      "AI-native code editor. Multi-file agent edits, tab autocomplete, background agents, codebase indexing.",
    skillInstall:
      "Cursor consumes agent instructions through its rules system and is among the clients adopting the Agent Skills spec. Check upstream docs for current skill support before relying on it.",
    catalogPlatform: "cursor",
    specCompliant: true,
    siteUrl: "https://cursor.com",
    docsUrl: "https://cursor.com/docs",
    openSource: false,
  },
  {
    id: "opencode",
    slug: "opencode",
    name: "OpenCode",
    vendor: "Open source",
    surfaces: ["terminal", "ide", "desktop"],
    description:
      "Open-source coding agent that runs across terminal, editor, and desktop. Provider-agnostic — works with hosted models and local ones (Ollama included).",
    skillInstall:
      "Skills follow the Agent Skills spec layout. Check upstream docs for the current skills directory.",
    catalogPlatform: "opencode",
    specCompliant: true,
    repoUrl: "https://github.com/sst/opencode",
    openSource: true,
  },
  {
    id: "cline",
    slug: "cline",
    name: "Cline",
    vendor: "Cline (open source)",
    surfaces: ["extension"],
    description:
      "Open-source coding agent for VS Code, JetBrains, and Cursor. Plan/Act workflow, checkpoints, built-in MCP support and an MCP marketplace.",
    skillInstall:
      "Skills follow the Agent Skills spec layout. Check upstream docs for the current skills directory.",
    catalogPlatform: "cline",
    specCompliant: true,
    repoUrl: "https://github.com/cline/cline",
    siteUrl: "https://cline.bot",
    openSource: true,
  },
]

export function getAgentBySlug(slug: string): AgentRuntime | undefined {
  return agents.find((a) => a.slug === slug)
}

export const AGENT_STATS = {
  totalAgents: agents.length,
  openSource: agents.filter((a) => a.openSource).length,
}

export const SURFACE_LABEL: Record<AgentSurface, string> = {
  terminal: "Terminal",
  ide: "IDE",
  extension: "Extension",
  desktop: "Desktop",
  cloud: "Cloud",
}

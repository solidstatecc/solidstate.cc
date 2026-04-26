import { Skill } from "./types"

export const skills: Skill[] = [
  {
    id: "deep-research-pro",
    name: "Deep Research Pro",
    slug: "deep-research-pro",
    description: "Multi-source research agent with citation tracking and synthesis. Queries web, academic databases, and internal docs.",
    longDescription: `Deep Research Pro is a comprehensive research skill that orchestrates multiple data sources to produce structured, cited research reports. It combines real-time web search, academic paper retrieval (arXiv, Semantic Scholar), and optional internal document search into a unified pipeline.

**Key capabilities:**
- Parallel source querying with deduplication
- Automatic citation graph generation
- Markdown and JSON output formats
- Configurable depth (quick/standard/deep)
- Source credibility scoring

**Use cases:** Competitive analysis, literature reviews, due diligence, technical deep-dives.

Verified and battle-tested on OpenClaw across 10,000+ research sessions.`,
    author: "solidstate",
    version: "2.4.1",
    platforms: ["openclaw", "hermes", "generic"],
    categories: ["Research", "AI"],
    installCommand: "openclaw skill install deep-research-pro",
    repoUrl: "https://github.com/solidstate-cc/deep-research-pro",
    docsUrl: "https://docs.solidstate.cc/skills/deep-research-pro",
    price: 29,
    verified: true,
    featured: true,
    tags: ["research", "web-search", "citations", "synthesis", "academic"],
    createdAt: "2024-09-15",
    stats: { installs: 8420, stars: 312 },
  },
  {
    id: "academic-research",
    name: "Academic Research",
    slug: "academic-research",
    description: "Searches arXiv, Semantic Scholar, and PubMed. Returns structured paper summaries with methodology extraction.",
    longDescription: `Academic Research connects directly to arXiv, Semantic Scholar, PubMed, and CrossRef to retrieve and synthesize peer-reviewed literature.

**Key capabilities:**
- Full-text search across 200M+ papers
- Automatic abstract and methodology extraction
- Citation network traversal
- BibTeX/RIS export
- Conference and journal filtering

Ideal for researchers, PhD students, and technical writers who need accurate, traceable academic sources.`,
    author: "visionairelabs",
    version: "1.8.0",
    platforms: ["openclaw", "hermes", "aura"],
    categories: ["Research"],
    installCommand: "openclaw skill install academic-research",
    repoUrl: "https://github.com/visionairelabs/academic-research",
    price: "free",
    verified: true,
    featured: false,
    tags: ["academic", "papers", "arxiv", "pubmed", "citations"],
    createdAt: "2024-07-02",
    stats: { installs: 5190, stars: 218 },
  },
  {
    id: "web-search",
    name: "Web Search",
    slug: "web-search",
    description: "Fast, clean web search with result ranking and content extraction. Supports Google, Bing, Brave, and DuckDuckGo.",
    longDescription: `Web Search provides a unified interface to major search engines with built-in content extraction and ranking.

**Key capabilities:**
- Multi-engine support (Google, Bing, Brave, DDG)
- Full page content extraction with noise removal
- Result re-ranking by relevance and freshness
- Structured snippet extraction
- Rate limit handling and retry logic

The foundation for any agent that needs reliable web access.`,
    author: "solidstate",
    version: "3.1.0",
    platforms: ["openclaw", "hermes", "antigravity", "aura", "generic"],
    categories: ["Research", "Productivity"],
    installCommand: "openclaw skill install web-search",
    price: "free",
    verified: true,
    featured: false,
    tags: ["search", "web", "scraping", "extraction"],
    createdAt: "2024-05-10",
    stats: { installs: 24800, stars: 891 },
  },
  {
    id: "coding-agent",
    name: "Coding Agent",
    slug: "coding-agent",
    description: "Full-cycle coding assistant: plan, implement, test, and refactor. Supports 30+ languages with LSP integration.",
    longDescription: `Coding Agent is a production-grade development skill that handles the full software development lifecycle inside your agent environment.

**Key capabilities:**
- Multi-language support (Python, TypeScript, Go, Rust, and 27 more)
- Test generation and execution
- Refactor with safety analysis
- Dependency resolution
- Code review and security scanning

Integrates with your existing toolchain via LSP and tree-sitter for precise, context-aware edits.`,
    author: "visionairelabs",
    version: "4.0.2",
    platforms: ["openclaw", "hermes"],
    categories: ["Coding", "DevOps"],
    installCommand: "openclaw skill install coding-agent",
    repoUrl: "https://github.com/visionairelabs/coding-agent",
    price: 49,
    verified: true,
    featured: true,
    tags: ["coding", "development", "testing", "refactor", "lsp"],
    createdAt: "2024-06-20",
    stats: { installs: 12300, stars: 540 },
  },
  {
    id: "github",
    name: "GitHub",
    slug: "github",
    description: "Full GitHub API integration: repos, PRs, issues, actions, releases, and code search via REST and GraphQL.",
    longDescription: `GitHub skill provides comprehensive access to the GitHub API surface, enabling agents to interact with repositories, pull requests, issues, workflows, and more.

**Key capabilities:**
- Create/update repos, branches, files
- PR and issue lifecycle management
- GitHub Actions trigger and monitoring
- Code search across public and private repos
- Webhook processing
- Organization management

Uses both REST v3 and GraphQL v4 APIs for maximum flexibility.`,
    author: "solidstate",
    version: "2.2.0",
    platforms: ["openclaw", "hermes", "antigravity", "aura", "generic"],
    categories: ["Coding", "DevOps"],
    installCommand: "openclaw skill install github",
    repoUrl: "https://github.com/solidstate-cc/skill-github",
    price: "free",
    verified: false,
    featured: false,
    tags: ["github", "git", "pr", "issues", "ci-cd", "actions"],
    createdAt: "2024-04-15",
    stats: { installs: 18900, stars: 703 },
  },
  {
    id: "gh-issues",
    name: "GH Issues",
    slug: "gh-issues",
    description: "Intelligent GitHub Issues manager. Triage, label, assign, and close issues using natural language commands.",
    longDescription: `GH Issues is a focused skill for GitHub issue management using AI-powered triage and natural language commands.

**Key capabilities:**
- Auto-label issues by content analysis
- Smart assignment based on team expertise
- Duplicate detection
- Bulk operations with filters
- Issue-to-PR linking
- SLA tracking and alerts

Reduces issue backlog management from hours to minutes.`,
    author: "openclaw-community",
    version: "1.3.5",
    platforms: ["openclaw", "generic"],
    categories: ["Coding", "Productivity"],
    installCommand: "openclaw skill install gh-issues",
    price: "free",
    verified: false,
    featured: false,
    tags: ["github", "issues", "triage", "project-management"],
    createdAt: "2024-08-01",
    stats: { installs: 4320, stars: 167 },
  },
  {
    id: "himalaya",
    name: "Himalaya",
    slug: "himalaya",
    description: "Terminal-native email client skill. Read, compose, and manage email via IMAP/SMTP with threading support.",
    longDescription: `Himalaya wraps the battle-tested himalaya CLI into a first-class agent skill with full IMAP/SMTP support.

**Key capabilities:**
- Multi-account management
- Thread-aware inbox processing
- Smart compose with context injection
- Attachment handling
- Folder sync and filtering rules
- PGP encryption support

Works with Gmail, Fastmail, Proton Mail, and any IMAP-compliant provider.`,
    author: "soywod",
    version: "1.0.1",
    platforms: ["openclaw", "hermes", "generic"],
    categories: ["Productivity"],
    installCommand: "openclaw skill install himalaya",
    repoUrl: "https://github.com/soywod/himalaya",
    price: "free",
    verified: false,
    featured: false,
    tags: ["email", "imap", "smtp", "terminal", "himalaya"],
    createdAt: "2024-10-05",
    stats: { installs: 3100, stars: 142 },
  },
  {
    id: "weather",
    name: "Weather",
    slug: "weather",
    description: "Hyperlocal weather with hourly forecasts, alerts, and historical data. Uses Open-Meteo and NOAA APIs.",
    longDescription: `Weather provides accurate, structured weather data to your agent from multiple meteorological sources.

**Key capabilities:**
- Current conditions and 16-day forecast
- Hourly precipitation probability
- Severe weather alerts
- Historical data (90 days)
- Air quality index
- Sunrise/sunset and UV index

No API key required for basic usage — uses Open-Meteo's free tier.`,
    author: "solidstate",
    version: "1.2.0",
    platforms: ["openclaw", "hermes", "antigravity", "aura", "generic"],
    categories: ["Productivity"],
    installCommand: "openclaw skill install weather",
    price: "free",
    verified: false,
    featured: false,
    tags: ["weather", "forecast", "climate", "alerts"],
    createdAt: "2024-05-20",
    stats: { installs: 9870, stars: 245 },
  },
  {
    id: "tmux",
    name: "Tmux",
    slug: "tmux",
    description: "Manage tmux sessions, windows, and panes. Run parallel shell tasks and capture output from running processes.",
    longDescription: `Tmux skill gives agents programmatic control over tmux multiplexer sessions for parallel task execution.

**Key capabilities:**
- Create and manage named sessions
- Send commands to specific panes
- Capture pane output (streaming or snapshot)
- Window and layout management
- Session persistence across agent restarts
- Background process monitoring

Essential for agents that need to run multiple shell tasks concurrently.`,
    author: "openclaw-community",
    version: "0.9.4",
    platforms: ["openclaw", "hermes"],
    categories: ["DevOps", "Productivity"],
    installCommand: "openclaw skill install tmux",
    price: "free",
    verified: false,
    featured: false,
    tags: ["tmux", "terminal", "shell", "parallel", "sessions"],
    createdAt: "2024-09-10",
    stats: { installs: 6540, stars: 198 },
  },
  {
    id: "twitter-x",
    name: "Twitter / X",
    slug: "twitter-x",
    description: "Post, schedule, and monitor X (Twitter) content. Supports threads, replies, media, and analytics.",
    longDescription: `Twitter/X skill provides a complete social media management interface for X, including posting, scheduling, monitoring, and analytics.

**Key capabilities:**
- Post tweets, threads, and quote tweets
- Schedule content with optimal timing
- Monitor mentions and keywords
- Engagement analytics
- List management
- DM automation (within ToS)

Uses X API v2 with OAuth 2.0. Requires X developer account.`,
    author: "visionairelabs",
    version: "1.5.2",
    platforms: ["openclaw", "hermes", "aura"],
    categories: ["Social"],
    installCommand: "openclaw skill install twitter-x",
    price: 15,
    verified: false,
    featured: false,
    tags: ["twitter", "x", "social-media", "posting", "scheduling"],
    createdAt: "2024-07-14",
    stats: { installs: 2890, stars: 98 },
  },
  {
    id: "telegram",
    name: "Telegram",
    slug: "telegram",
    description: "Send messages, manage bots, and monitor channels. Full Telegram Bot API and MTProto support.",
    longDescription: `Telegram skill enables agents to interact with Telegram through both the Bot API and MTProto client protocol.

**Key capabilities:**
- Send messages, files, and media
- Create and manage bot commands
- Channel and group monitoring
- Inline keyboard and callback handling
- Webhook processing
- User and group management

Works with both personal accounts (via MTProto) and bots.`,
    author: "openclaw-community",
    version: "1.1.0",
    platforms: ["openclaw", "hermes", "generic"],
    categories: ["Social", "Productivity"],
    installCommand: "openclaw skill install telegram",
    price: "free",
    verified: false,
    featured: false,
    tags: ["telegram", "messaging", "bots", "notifications"],
    createdAt: "2024-08-22",
    stats: { installs: 5200, stars: 187 },
  },
  {
    id: "solana",
    name: "Solana",
    slug: "solana",
    description: "Interact with Solana blockchain: read balances, send transactions, query programs, and monitor wallets.",
    longDescription: `Solana skill provides agents with full read/write access to the Solana blockchain via RPC and the Solana web3.js SDK.

**Key capabilities:**
- Check SOL and SPL token balances
- Send SOL and SPL tokens
- Query program accounts and state
- Monitor wallet activity in real-time
- Interact with DeFi protocols (Raydium, Jupiter)
- NFT metadata retrieval

Supports mainnet-beta, devnet, and testnet. Non-custodial — your keys, your coins.`,
    author: "visionairelabs",
    version: "2.0.0",
    platforms: ["openclaw", "hermes", "aura"],
    categories: ["Finance"],
    installCommand: "openclaw skill install solana",
    repoUrl: "https://github.com/visionairelabs/skill-solana",
    price: 25,
    verified: false,
    featured: false,
    tags: ["solana", "blockchain", "crypto", "defi", "nft", "web3"],
    createdAt: "2024-10-12",
    stats: { installs: 1820, stars: 76 },
  },
  {
    id: "stripe",
    name: "Stripe",
    slug: "stripe",
    description: "Create charges, manage subscriptions, handle webhooks, and query financial reports via Stripe API.",
    longDescription: `Stripe skill exposes the full Stripe API surface to agents, enabling revenue operations, billing management, and financial reporting.

**Key capabilities:**
- Create and capture payment intents
- Subscription lifecycle management
- Customer and payment method handling
- Webhook event processing
- Payout and transfer management
- Financial reports and reconciliation

Handles all API versions with automatic retry and idempotency key management.`,
    author: "solidstate",
    version: "1.6.3",
    platforms: ["openclaw", "hermes", "antigravity", "generic"],
    categories: ["Finance"],
    installCommand: "openclaw skill install stripe",
    docsUrl: "https://docs.solidstate.cc/skills/stripe",
    price: 19,
    verified: false,
    featured: false,
    tags: ["stripe", "payments", "billing", "subscriptions", "fintech"],
    createdAt: "2024-06-08",
    stats: { installs: 3450, stars: 134 },
  },
  {
    id: "vercel",
    name: "Vercel",
    slug: "vercel",
    description: "Deploy projects, manage domains, monitor deployments, and configure environment variables via Vercel API.",
    longDescription: `Vercel skill gives agents full control over the Vercel deployment platform — from project creation to production monitoring.

**Key capabilities:**
- Deploy from Git or file upload
- Manage custom domains and DNS
- Set and rotate environment variables
- Monitor deployment logs in real-time
- Rollback deployments
- Team and project management

Integrates with GitHub, GitLab, and Bitbucket for CI/CD pipeline control.`,
    author: "solidstate",
    version: "1.4.0",
    platforms: ["openclaw", "hermes", "generic"],
    categories: ["DevOps"],
    installCommand: "openclaw skill install vercel",
    price: "free",
    verified: false,
    featured: false,
    tags: ["vercel", "deployment", "hosting", "ci-cd", "devops"],
    createdAt: "2024-07-30",
    stats: { installs: 7120, stars: 289 },
  },
  {
    id: "healthcheck",
    name: "Healthcheck",
    slug: "healthcheck",
    description: "Monitor service uptime, latency, and SSL certs. Alert on failures with configurable thresholds.",
    longDescription: `Healthcheck turns any agent into an infrastructure monitor with HTTP/TCP/DNS checking and multi-channel alerting.

**Key capabilities:**
- HTTP/HTTPS endpoint monitoring
- TCP port checking
- DNS resolution validation
- SSL certificate expiry alerts
- Response time percentile tracking
- Multi-channel alerts (email, Slack, PagerDuty)
- Status page generation

Lightweight and dependency-free — runs checks from your agent environment.`,
    author: "openclaw-community",
    version: "1.0.8",
    platforms: ["openclaw", "hermes", "generic"],
    categories: ["DevOps"],
    installCommand: "openclaw skill install healthcheck",
    price: "free",
    verified: false,
    featured: false,
    tags: ["monitoring", "uptime", "ssl", "alerting", "devops"],
    createdAt: "2024-09-28",
    stats: { installs: 4780, stars: 156 },
  },
  {
    id: "docker",
    name: "Docker",
    slug: "docker",
    description: "Build, run, and manage Docker containers and Compose stacks. Inspect logs, exec into containers, manage volumes.",
    longDescription: `Docker skill provides agents with full Docker Engine control via the Docker API — no subprocess spawning required.

**Key capabilities:**
- Build images from Dockerfile or context
- Run and manage containers
- Docker Compose stack management
- Log streaming and filtering
- Volume and network management
- Registry push/pull with auth
- Container inspection and exec

Uses the Docker Engine API directly for reliability and speed.`,
    author: "visionairelabs",
    version: "1.9.1",
    platforms: ["openclaw", "hermes"],
    categories: ["DevOps", "Coding"],
    installCommand: "openclaw skill install docker",
    price: 9,
    verified: false,
    featured: false,
    tags: ["docker", "containers", "devops", "compose", "images"],
    createdAt: "2024-08-15",
    stats: { installs: 6890, stars: 231 },
  },
  {
    id: "clawhub",
    name: "ClawHub",
    slug: "clawhub",
    description: "Discover, install, and manage OpenClaw skills from the community registry. Like npm but for agent skills.",
    longDescription: `ClawHub is the package manager skill for OpenClaw — enabling agents to self-extend by discovering and installing other skills at runtime.

**Key capabilities:**
- Search the OpenClaw skill registry
- Install, update, and remove skills
- Dependency resolution
- Version pinning and lock files
- Skill sandboxing and permissions review
- Community ratings and reviews

Meta-capability: an agent with ClawHub can autonomously expand its own skill set.`,
    author: "solidstate",
    version: "1.0.0",
    platforms: ["openclaw"],
    categories: ["AI"],
    installCommand: "openclaw skill install clawhub",
    docsUrl: "https://docs.solidstate.cc/skills/clawhub",
    price: "free",
    verified: true,
    featured: true,
    tags: ["package-manager", "registry", "meta", "skills", "openclaw"],
    createdAt: "2024-11-01",
    stats: { installs: 11200, stars: 487 },
  },
  {
    id: "skill-creator",
    name: "Skill Creator",
    slug: "skill-creator",
    description: "Generate, test, and publish new OpenClaw skills from a natural language spec. Self-improving agent tooling.",
    longDescription: `Skill Creator is a meta-skill that enables agents to design, implement, and publish new skills using natural language descriptions.

**Key capabilities:**
- Spec-to-skill generation (YAML + code)
- Automated test suite generation
- Schema validation and type checking
- Dry-run simulation environment
- One-command publish to ClawHub
- Versioning and changelog generation

The self-improvement loop for agent infrastructure.`,
    author: "visionairelabs",
    version: "0.8.2",
    platforms: ["openclaw"],
    categories: ["AI", "Coding"],
    installCommand: "openclaw skill install skill-creator",
    price: 39,
    verified: false,
    featured: false,
    tags: ["meta", "skill-generation", "ai", "automation", "self-improving"],
    createdAt: "2024-11-15",
    stats: { installs: 2100, stars: 143 },
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    slug: "nano-banana-pro",
    description: "Lightweight multi-purpose utility skill: base64, hashing, UUID, time zones, unit conversion, and more.",
    longDescription: `Nano Banana Pro is the Swiss Army knife skill — a collection of essential utilities that should be in every agent's toolkit.

**Key capabilities:**
- Encoding: base64, hex, URL encoding/decoding
- Hashing: MD5, SHA-1/256/512, bcrypt
- UUID generation (v1-v7)
- Time zone conversion and date arithmetic
- Unit conversion (length, weight, temperature, data)
- Color format conversion (hex, RGB, HSL)
- JSON formatting and validation

Zero dependencies. Fast. Ships in 12kb.`,
    author: "openclaw-community",
    version: "3.2.1",
    platforms: ["openclaw", "hermes", "antigravity", "aura", "generic"],
    categories: ["Productivity", "AI"],
    installCommand: "openclaw skill install nano-banana-pro",
    price: "free",
    verified: false,
    featured: true,
    tags: ["utilities", "encoding", "hashing", "conversion", "lightweight"],
    createdAt: "2024-04-01",
    stats: { installs: 31500, stars: 1102 },
  },
]

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug)
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.featured)
}

export function getVerifiedSkills(): Skill[] {
  return skills.filter((s) => s.verified)
}

export const CATEGORIES = Array.from(
  new Set(skills.flatMap((s) => s.categories))
).sort()

export const PLATFORMS = [
  "openclaw",
  "hermes",
  "antigravity",
  "aura",
  "generic",
] as const

export const STATS = {
  totalSkills: skills.length,
  totalPlatforms: PLATFORMS.length,
  totalInstalls: skills.reduce((sum, s) => sum + s.stats.installs, 0),
}

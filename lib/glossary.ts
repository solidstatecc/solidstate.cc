import type { GlossaryLevel, GlossaryTerm } from "./types"

/**
 * Solid State glossary. All entries researched and written for Solid State.
 * Leveled like Claude 101 (Beginner → Intermediate → Advanced → Expert).
 * Browseable alphabetically, deepgram-style.
 *
 * To add a term: append below, keep slug kebab-case, keep `short`
 * to one sentence, populate `long` only when the term needs depth.
 */
export const glossary: GlossaryTerm[] = [
  // =================
  // Level 1: Beginner
  // =================
  {
    slug: "agent",
    term: "Agent",
    short:
      "An AI system that takes a goal, plans steps, uses tools, and returns a result without being walked through every move.",
    level: "beginner",
    readMinutes: 4,
    related: ["skill", "tool-use", "persona"],
    long: `An agent is a model wrapped in a loop. The loop reads the goal, picks a tool, runs it, looks at the result, and decides the next step. The agent stops when the goal is satisfied or it hits a limit you set.

Most of the interesting work in agent design is not the model. It is the harness around the model: the tool definitions, error handling, memory, cost control, and the rules that decide when to ask a human.

If a chatbot is a phone call, an agent is a contractor. You hand it the brief, it gets the work done, it shows up with a result.`,
  },
  {
    slug: "skill",
    term: "Skill",
    short:
      "A packaged capability an agent can install and use. Code, prompts, and tool wiring bundled as one unit.",
    level: "beginner",
    readMinutes: 3,
    related: ["agent", "tool-use", "mcp"],
    long: `A skill is the smallest deployable unit of agent capability. It bundles the prompts, code, schema, and external connections needed for one focused job.

Treat skills like npm packages: small, single-purpose, well-tested, versioned. A good skill is boring, predictable, and obvious in scope. The best skills do one thing and explain themselves to the agent in three sentences.`,
  },
  {
    slug: "persona",
    term: "Persona",
    short:
      "A configured agent with a specific voice, role, and toolset. Same engine, different operator.",
    level: "beginner",
    readMinutes: 3,
    related: ["agent", "skill"],
    long: `A persona is what you get when you give an agent a job description. Same underlying model, but constrained voice, fixed toolset, and a defined scope of authority.

The same base model can be a sales operator, a chief of staff, or a research analyst depending on the persona it runs under. Personas make agents feel like coworkers instead of generic chatbots.`,
  },
  {
    slug: "prompt",
    term: "Prompt",
    short:
      "The input you give the model. Includes the system instructions, the conversation, and any retrieved context.",
    level: "beginner",
    readMinutes: 4,
    related: ["context-window", "system-prompt"],
  },
  {
    slug: "context-window",
    term: "Context Window",
    short:
      "How much text the model can see at once. Bigger is better until cost catches up.",
    level: "beginner",
    readMinutes: 3,
    related: ["prompt", "token"],
  },
  {
    slug: "token",
    term: "Token",
    short:
      "The unit a model reads and writes. Roughly four characters in English. Pricing is per token.",
    level: "beginner",
    readMinutes: 2,
    related: ["context-window"],
  },
  {
    slug: "hallucination",
    term: "Hallucination",
    short:
      "When the model produces a confident answer that is not grounded in reality. The single biggest reason agents need verification.",
    level: "beginner",
    readMinutes: 4,
    related: ["rag", "guardrails"],
  },
  {
    slug: "inference",
    term: "Inference",
    short:
      "Running a trained model to produce an output. The thing you pay for every time the agent thinks.",
    level: "beginner",
    readMinutes: 3,
    related: ["token", "base-model"],
  },
  {
    slug: "channel",
    term: "Channel",
    short:
      "The surface an agent talks through. Slack, iMessage, the web, your terminal.",
    level: "beginner",
    readMinutes: 3,
    related: ["agent", "gateway"],
    long: `A channel is where the conversation happens, not what runs it. The same agent can answer in Slack, over iMessage, or in a browser tab.

One agent, many channels. The agent doesn't change. The doorway does.

The best channel is the one your work already lives in.`,
  },

  // ======================
  // Level 2: Intermediate
  // ======================
  {
    slug: "system-prompt",
    term: "System Prompt",
    short:
      "Top-of-conversation instructions that set the model's role, constraints, and style. Sticks for the whole session.",
    level: "intermediate",
    readMinutes: 5,
    related: ["prompt", "persona"],
  },
  {
    slug: "tool-use",
    term: "Tool Use",
    short:
      "When the model calls an external function (search, code, calendar) instead of just writing text back.",
    level: "intermediate",
    readMinutes: 6,
    related: ["agent", "mcp", "skill"],
  },
  {
    slug: "mcp",
    term: "MCP",
    short:
      "Model Context Protocol. Open standard for connecting models to tools, data, and prompts. Standardizes the agent-to-app handoff.",
    level: "intermediate",
    readMinutes: 7,
    related: ["tool-use", "skill"],
    long: `MCP is the wire format between an agent and the apps it controls. Each app exposes tools, resources, and prompts. The agent discovers what is available and calls into them through one standard interface.

Before MCP, every agent shipped its own glue code per app. After MCP, an app implements the protocol once and any compliant agent can use it. Same connector, any app, no per-app integration on the model side.

Think of it as the USB of agents.`,
  },
  {
    slug: "rag",
    term: "RAG",
    short:
      "Retrieval-augmented generation. Pull relevant snippets from your data, then ask the model. Trades training cost for retrieval cost.",
    level: "intermediate",
    readMinutes: 6,
    related: ["embedding", "vector-store", "context-window"],
  },
  {
    slug: "embedding",
    term: "Embedding",
    short:
      "A numeric fingerprint of a chunk of text. Lets you find related content by distance instead of keyword match.",
    level: "intermediate",
    readMinutes: 5,
    related: ["rag", "vector-store"],
  },
  {
    slug: "fine-tuning",
    term: "Fine-tuning",
    short:
      "Training a base model on your own data so it specializes. Less common now that prompting and RAG cover most cases.",
    level: "intermediate",
    readMinutes: 6,
    related: ["base-model", "rag"],
  },
  {
    slug: "chain-of-thought",
    term: "Chain of Thought",
    short:
      "Prompting the model to reason step by step before answering. Lower error rates on multi-step problems, higher token cost.",
    level: "intermediate",
    readMinutes: 5,
    related: ["prompt", "agent-loop"],
  },
  {
    slug: "evals",
    term: "Evals",
    short:
      "Automated tests for agents and prompts. Run on a fixed dataset, score the output, catch regressions before users do.",
    level: "intermediate",
    readMinutes: 6,
    related: ["fine-tuning", "guardrails"],
  },
  {
    slug: "session",
    term: "Session",
    short:
      "One conversation's working state. The thread the agent is holding right now.",
    level: "intermediate",
    readMinutes: 4,
    related: ["context-window", "memory"],
    long: `A session is the live thread: this conversation, its history, its open context. It starts when you begin and ends when you walk away.

Don't confuse it with memory. Memory is what survives the session. The session is what's in hand.

Two senders, two sessions. Good systems keep them isolated so one user's context never bleeds into another's.`,
  },
  {
    slug: "plugin",
    term: "Plugin",
    short:
      "A bundled add-on that extends an agent. New channels, new tools, dropped in.",
    level: "intermediate",
    readMinutes: 4,
    related: ["skill", "tool-use", "gateway"],
    long: `A plugin extends the runtime. It adds a channel, a tool, or a capability the core didn't ship with.

A skill is a job the agent does. A plugin is plumbing the agent runs on. Related, not the same.

Skills teach the agent. Plugins wire it up.`,
  },
  {
    slug: "self-hosted",
    term: "Self-Hosted",
    short:
      "Running the agent on your own hardware. Your data, your rules, no vendor in the middle.",
    level: "intermediate",
    readMinutes: 4,
    related: ["sandboxing", "guardrails"],
    long: `Self-hosted means the agent runs where you control it. Your machine, your server, your keys.

The trade is real. You own the uptime, the updates, the security. Nobody can read your data, and nobody will fix it for you either.

Hosted is convenience. Self-hosted is control. Pick the one that matches the stakes.`,
  },

  // ==================
  // Level 3: Advanced
  // ==================
  {
    slug: "vector-store",
    term: "Vector Store",
    short:
      "A database for embeddings. Returns the nearest matches by cosine or dot product, not by exact keyword.",
    level: "advanced",
    readMinutes: 8,
    related: ["embedding", "rag"],
  },
  {
    slug: "agent-loop",
    term: "Agent Loop",
    short:
      "The plan-act-observe cycle. Model proposes a step, runs it, reads the result, decides the next step.",
    level: "advanced",
    readMinutes: 7,
    related: ["agent", "tool-use"],
  },
  {
    slug: "memory",
    term: "Memory",
    short:
      "What the agent keeps between sessions. Long-term store, not the active context window. Lets it learn your patterns.",
    level: "advanced",
    readMinutes: 6,
    related: ["context-window", "agent-loop"],
  },
  {
    slug: "guardrails",
    term: "Guardrails",
    short:
      "Hard limits on what an agent can do. Tool allowlists, output filters, sandboxed execution, human checkpoints.",
    level: "advanced",
    readMinutes: 7,
    related: ["sandboxing", "human-in-the-loop"],
    long: `Guardrails are the hard limits. What the agent may touch, what it may emit, where it may run, and when it must stop for a human.

The simplest one is an allowlist: only these senders, only these tools. In OpenClaw that's a single \`allowFrom\` line.

Open by default is a liability. Closed by default is a feature.`,
  },
  {
    slug: "sandboxing",
    term: "Sandboxing",
    short:
      "Running agent code in an isolated environment with no host access. Required for any agent that runs untrusted code.",
    level: "advanced",
    readMinutes: 6,
    related: ["guardrails", "tool-use"],
  },
  {
    slug: "human-in-the-loop",
    term: "Human in the Loop",
    short:
      "Pausing the agent for human approval at chosen points. Common pattern for high-stakes actions like sending money.",
    level: "advanced",
    readMinutes: 5,
    related: ["guardrails"],
  },
  {
    slug: "prompt-injection",
    term: "Prompt Injection",
    short:
      "Adversarial input that hijacks an agent's instructions through user data or fetched content. The XSS of the agent era.",
    level: "advanced",
    readMinutes: 8,
    related: ["guardrails", "sandboxing"],
  },
  {
    slug: "model-routing",
    term: "Model Routing",
    short:
      "Sending each request to the cheapest model that can handle it. Big win on cost without dropping quality on hard tasks.",
    level: "advanced",
    readMinutes: 6,
    related: ["inference", "evals"],
  },
  {
    slug: "gateway",
    term: "Gateway",
    short:
      "One process bridging every channel to the agent. The single door messages pass through.",
    level: "advanced",
    readMinutes: 7,
    related: ["harness", "channel", "multi-agent-routing"],
    long: `A gateway is the bridge layer. Chat apps on one side, the agent on the other, every message routed through one process.

It's the single source of truth for sessions, routing, and connections. One gateway can serve Slack, iMessage, and the web at once.

The harness runs the model. The gateway runs the traffic. Different jobs, same stack.`,
  },
  {
    slug: "multi-agent-routing",
    term: "Multi-Agent Routing",
    short:
      "Sending each request to the right agent, with isolated sessions per workspace or sender.",
    level: "advanced",
    readMinutes: 7,
    related: ["model-routing", "session", "gateway"],
    long: `Multi-agent routing decides which agent handles what. One sender gets the assistant, another gets the coder, each in its own sandboxed session.

Don't confuse it with model routing. Model routing picks the cheapest model for a task. Multi-agent routing picks the right operator for a request.

Isolation is the point. One agent's context never leaks into another's.`,
  },
  {
    slug: "node",
    term: "Node",
    short:
      "A paired device that extends an agent's reach. Camera, mic, and screen on your phone.",
    level: "advanced",
    readMinutes: 6,
    related: ["gateway", "computer-use"],
    long: `A node is an edge device wired into the agent. Your phone becomes eyes, ears, and a second screen.

The agent stays central. The node gives it senses it didn't have. Snap a photo, capture audio, act on the device.

Gateway is the brain. Nodes are the hands.`,
  },

  // ================
  // Level 4: Expert
  // ================
  {
    slug: "base-model",
    term: "Base Model",
    short:
      "The foundation weights before instruction tuning, RLHF, or fine-tuning. The raw next-token predictor.",
    level: "expert",
    readMinutes: 8,
    related: ["fine-tuning", "rlhf"],
  },
  {
    slug: "rlhf",
    term: "RLHF",
    short:
      "Reinforcement learning from human feedback. The training stage that turns a base model into a helpful assistant.",
    level: "expert",
    readMinutes: 9,
    related: ["base-model", "fine-tuning"],
  },
  {
    slug: "x402",
    term: "x402",
    short:
      "HTTP 402 Payment Required, revived as a per-call payment protocol for agents. Powers Agentic Market.",
    level: "expert",
    readMinutes: 7,
    related: ["agent", "tool-use"],
    long: `x402 turns the dormant HTTP 402 status code into a working micropayment handshake. An agent calls a service, gets a 402 with payment instructions, settles the payment, retries the call with proof, and gets the response.

The protocol is custodied infrastructure (Coinbase Developer Platform, Linux Foundation governance). Agents pay per request. No account, no signup, no rotating API keys to manage.

Solid State exposes a subset of skills as x402 services on Agentic Market.`,
  },
  {
    slug: "harness",
    term: "Agent Harness",
    short:
      "The runtime around the model. Manages tool calls, context, memory, retries, error handling, and observability.",
    level: "expert",
    readMinutes: 8,
    related: ["agent-loop", "guardrails"],
  },
  {
    slug: "computer-use",
    term: "Computer Use",
    short:
      "Agents that drive a real or virtual desktop. Mouse, keyboard, screenshots. Can use any app, including ones with no API.",
    level: "expert",
    readMinutes: 9,
    related: ["sandboxing", "tool-use"],
  },
  {
    slug: "mixture-of-experts",
    term: "Mixture of Experts",
    short:
      "Architecture that routes tokens to a sparse subset of specialist subnetworks. Larger total parameters, lower active cost per token.",
    level: "expert",
    readMinutes: 9,
    related: ["base-model", "inference"],
  },
  {
    slug: "daemon",
    term: "Daemon",
    short:
      "A background process that keeps the agent always-on. Survives logout, restarts itself.",
    level: "expert",
    readMinutes: 7,
    related: ["gateway", "harness"],
    long: `A daemon is the agent that never sleeps. It runs in the background, outlives your terminal session, and comes back after a crash.

This is what turns a script you launch into a service that's just there. Message it at 3am and it answers.

A command runs once. A daemon runs until you stop it.`,
  },
]

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.slug === slug)
}

export function termsByLevel(level: GlossaryLevel): GlossaryTerm[] {
  return glossary
    .filter((t) => t.level === level)
    .sort((a, b) => a.term.localeCompare(b.term))
}

export function termsAlpha(): GlossaryTerm[] {
  return [...glossary].sort((a, b) => a.term.localeCompare(b.term))
}

export function termsByLetter(): Record<string, GlossaryTerm[]> {
  const out: Record<string, GlossaryTerm[]> = {}
  for (const t of termsAlpha()) {
    const letter = t.term[0].toUpperCase()
    const key = /[A-Z]/.test(letter) ? letter : "#"
    if (!out[key]) out[key] = []
    out[key].push(t)
  }
  return out
}

export const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export const LEVELS_IN_ORDER: GlossaryLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]

export const GLOSSARY_STATS = {
  totalTerms: glossary.length,
  totalLevels: LEVELS_IN_ORDER.length,
}

import type { Metadata } from "next"
import Link from "next/link"
import { agents, AGENT_STATS, SURFACE_LABEL } from "@/lib/agents"

export const metadata: Metadata = {
  title: "Agent Directory",
  description:
    "The agent runtimes that run skills. Claude Code, OpenClaw, NemoClaw, Antigravity, Codex, Cursor, OpenCode, Cline — what they are and how skills install on each.",
}

const mono = "var(--font-jetbrains-mono), monospace"
const sans = "var(--font-inter), system-ui, sans-serif"

export default function AgentsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 32px 64px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Agent Directory
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(48px, 9vw, 96px)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            marginBottom: "32px",
          }}
        >
          The runtimes
          <br />
          that run
          <br />
          skills.
        </h1>
        <p
          style={{
            fontFamily: sans,
            fontSize: "15px",
            color: "var(--ink-5)",
            lineHeight: 1.7,
            maxWidth: "560px",
          }}
        >
          {AGENT_STATS.totalAgents} agent runtimes. {AGENT_STATS.openSource} open source.
          What each one is, how skills install on it, and which skills in the
          catalog run there. Spec: one folder, one SKILL.md.
        </p>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 32px 96px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "1px",
            // Page bg, not border-grey: with uneven card counts the empty
            // slots stay black. Hairlines come from per-cell box-shadows.
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          {agents.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.slug}`}
              style={{
                display: "block",
                backgroundColor: "var(--bg)",
                boxShadow: "0 0 0 1px var(--border)",
                padding: "32px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--ink-1)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {a.vendor} · {a.surfaces.map((s) => SURFACE_LABEL[s]).join(" · ")}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--fg)",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                {a.name}
              </div>
              <p
                style={{
                  fontFamily: sans,
                  fontSize: "13px",
                  color: "var(--ink-5)",
                  lineHeight: 1.7,
                  marginBottom: "20px",
                }}
              >
                {a.description}
              </p>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: "var(--fg)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                How skills install →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

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
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 32px 64px",
          borderBottom: "1px solid #222222",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "#555555",
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
            color: "#ffffff",
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
            color: "#999999",
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
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1px",
            backgroundColor: "#222222",
            border: "1px solid #222222",
          }}
        >
          {agents.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.slug}`}
              style={{
                display: "block",
                backgroundColor: "#000000",
                padding: "32px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "#555555",
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
                  color: "#ffffff",
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
                  color: "#999999",
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
                  color: "#ffffff",
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

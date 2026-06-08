import type { Metadata } from "next"
import { audits } from "@/lib/audits"

export const metadata: Metadata = {
  title: "Security Audits",
  description:
    "Security audit verdicts for indexed agent skills, from Gen Agent Trust Hub, Socket, and Snyk. Mirrored from skills.sh.",
}

const mono = "var(--font-jetbrains-mono), monospace"

// Monochrome severity ramp: benign recedes, risk brightens so it still pops.
// The text label ("Low Risk", "High Risk", etc.) carries the meaning.
const RISK_COLOR: Record<string, string> = {
  low: "var(--ink-3)",
  medium: "var(--ink-6)",
  high: "var(--ink-9)",
  critical: "var(--fg)",
  unknown: "var(--ink-3)",
}

function genColor(v: string) {
  return v.toLowerCase().includes("safe") ? "var(--ink-3)" : "var(--fg)"
}

export default function AuditsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "96px 32px 40px",
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
            marginBottom: "20px",
          }}
        >
          Security Audits
        </div>
        <h1
          className="ss-audits-h1"
          style={{
            fontFamily: mono,
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            margin: "0 0 24px",
          }}
        >
          Read the code
          <br />
          before you run it.
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-4)", maxWidth: "620px", lineHeight: 1.6, margin: 0 }}>
          Combined verdicts from Gen Agent Trust Hub, Socket, and Snyk. These are the partners&apos;
          findings, mirrored from{" "}
          <a href="https://www.skills.sh/audits" style={{ color: "var(--ink-8)" }}>
            skills.sh
          </a>{" "}
          — not Solid State&apos;s own audit. A skill not listed here simply hasn&apos;t been audited yet.
        </p>
      </section>

      {/* Table */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 96px" }}>
        <div className="ss-table-scroll">
        <div style={{ border: "1px solid var(--border)", minWidth: "560px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 120px 110px 120px",
              gap: "12px",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              fontFamily: mono,
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            <span>#</span>
            <span>Skill</span>
            <span>Gen Trust</span>
            <span>Socket</span>
            <span>Snyk</span>
          </div>

          {audits.map((a, i) => (
            <a
              key={a.id + i}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 120px 110px 120px",
                gap: "12px",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom: i === audits.length - 1 ? "none" : "1px solid var(--bg-4)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-1)" }}>{i + 1}</span>

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: mono,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--fg)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.name}
                </span>
                <span style={{ display: "block", fontFamily: mono, fontSize: "11px", color: "var(--ink-2)" }}>
                  {a.source}
                </span>
              </span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: genColor(a.gen) }}>{a.gen}</span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: a.socketAlerts === 0 ? "var(--ink-3)" : "var(--fg)" }}>
                {a.socketAlerts} {a.socketAlerts === 1 ? "alert" : "alerts"}
              </span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: RISK_COLOR[a.snykRisk] }}>{a.snyk}</span>
            </a>
          ))}
        </div>
        </div>
      </section>
    </div>
  )
}

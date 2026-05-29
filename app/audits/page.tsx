import type { Metadata } from "next"
import { audits } from "@/lib/audits"

export const metadata: Metadata = {
  title: "Security Audits",
  description:
    "Security audit verdicts for indexed agent skills, from Gen Agent Trust Hub, Socket, and Snyk. Mirrored from skills.sh.",
}

const mono = "var(--font-jetbrains-mono), monospace"

const RISK_COLOR: Record<string, string> = {
  low: "#3ad17e",
  medium: "#d8b24a",
  high: "#e0864f",
  critical: "#e0564f",
  unknown: "#777777",
}

function genColor(v: string) {
  return v.toLowerCase().includes("safe") ? "#3ad17e" : "#e0864f"
}

export default function AuditsPage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "96px 32px 40px",
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
            marginBottom: "20px",
          }}
        >
          Security Audits
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            margin: "0 0 24px",
          }}
        >
          Read the code
          <br />
          before you run it.
        </h1>
        <p style={{ fontSize: "15px", color: "#888888", maxWidth: "620px", lineHeight: 1.6, margin: 0 }}>
          Combined verdicts from Gen Agent Trust Hub, Socket, and Snyk. These are the partners&apos;
          findings, mirrored from{" "}
          <a href="https://www.skills.sh/audits" style={{ color: "#cccccc" }}>
            skills.sh
          </a>{" "}
          — not Solid State&apos;s own audit. A skill not listed here simply hasn&apos;t been audited yet.
        </p>
      </section>

      {/* Table */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 96px" }}>
        <div style={{ border: "1px solid #222222" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 120px 110px 120px",
              gap: "12px",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid #222222",
              fontFamily: mono,
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#666666",
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
                borderBottom: i === audits.length - 1 ? "none" : "1px solid #161616",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: "12px", color: "#555555" }}>{i + 1}</span>

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: mono,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.name}
                </span>
                <span style={{ display: "block", fontFamily: mono, fontSize: "11px", color: "#666666" }}>
                  {a.source}
                </span>
              </span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: genColor(a.gen) }}>{a.gen}</span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: a.socketAlerts === 0 ? "#888888" : "#e0864f" }}>
                {a.socketAlerts} {a.socketAlerts === 1 ? "alert" : "alerts"}
              </span>

              <span style={{ fontFamily: mono, fontSize: "12px", color: RISK_COLOR[a.snykRisk] }}>{a.snyk}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

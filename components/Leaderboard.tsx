"use client"
import Link from "next/link"
import type { Skill } from "@/lib/types"
import { formatInstalls } from "@/lib/format"

/**
 * Ranked leaderboard, inspired by skills.sh. Honest by construction:
 * every number shown is real. Install counts come from skills.sh telemetry
 * (or first-party stats); "Trending" is a real flag (on the live 24h board),
 * not a modeled curve. Rows without a measured install count show "—".
 */
export function Leaderboard({ skills }: { skills: Skill[] }) {
  return (
    <div className="ss-lb" style={{ border: "1px solid var(--border)" }}>
      <div
        className="ss-lb-row"
        style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 110px 84px",
          gap: "12px",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
        }}
      >
        <span>#</span>
        <span>Skill</span>
        <span style={{ textAlign: "right" }}>Trend</span>
        <span style={{ textAlign: "right" }}>Installs</span>
      </div>

      {skills.map((skill, i) => {
        const installs = skill.stats?.installs
        return (
          <Link
            key={skill.id}
            href={`/skills/${skill.slug}`}
            className="ss-lb-row"
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 110px 84px",
              gap: "12px",
              alignItems: "center",
              padding: "11px 16px",
              borderBottom: i === skills.length - 1 ? "none" : "1px solid var(--bg-4)",
              textDecoration: "none",
              color: "inherit",
              transition: "background-color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                color: i < 3 ? "var(--fg)" : "var(--ink-1)",
                fontWeight: i < 3 ? 700 : 400,
              }}
            >
              {i + 1}
            </span>

            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "var(--ink-2)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {skill.source ?? skill.author}
              </span>
            </span>

            <span style={{ textAlign: "right" }}>
              {skill.trending ? (
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "var(--fg)",
                    border: "1px solid var(--border-2)",
                    borderRadius: "3px",
                    padding: "2px 6px",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  ↑<span className="ss-lb-trendword"> Trending</span>
                </span>
              ) : (
                <span style={{ color: "var(--border-2)", fontSize: "11px" }}>—</span>
              )}
            </span>

            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                color: installs ? "var(--fg)" : "var(--border-3)",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {installs ? formatInstalls(installs) : "—"}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

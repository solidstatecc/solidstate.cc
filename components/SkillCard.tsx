"use client"
import Link from "next/link"
import type { Skill } from "@/lib/types"
import { priceDisplay, isUnpriced } from "@/lib/x402"
import { formatInstalls } from "@/lib/format"

export function SkillCard({ skill }: { skill: Skill }) {
  const price = priceDisplay(skill)
  const isFree = price === "Free"
  const unpriced = isUnpriced(skill)

  return (
    <Link href={`/skills/${skill.slug}`} style={{
      display: "block",
      padding: "28px",
      border: "1px solid var(--border)",
      textDecoration: "none",
      transition: "border-color 0.1s",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--fg)")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "10px",
      }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}>
          {skill.name}
        </span>
        <span style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: isFree ? "var(--fg)" : unpriced ? "var(--muted-dim)" : "var(--muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginLeft: "12px",
          flexShrink: 0,
        }}>
          {price}
        </span>
      </div>

      <div style={{
        fontFamily: "monospace",
        fontSize: "10px",
        color: "var(--ink-4)",
        letterSpacing: "0.04em",
        marginBottom: "12px",
      }}>
        by {skill.author}
      </div>

      <p style={{
        fontSize: "13px",
        color: "var(--muted)",
        lineHeight: 1.6,
        marginBottom: "20px",
      }}>
        {skill.description}
      </p>

      {skill.installCommand && (
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "var(--muted-dim)",
          backgroundColor: "var(--bg-2)",
          padding: "7px 10px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "16px",
        }}>
          {skill.installCommand}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
      }}>
        {skill.platforms.map(p => (
          <span key={p} style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "var(--muted-dim)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            {p}
          </span>
        ))}
      </div>

      {(skill.stats?.installs || skill.stats?.stars || skill.trending) && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: "1px solid var(--bg-4)",
        }}>
          <span>
            {skill.trending && (
              <span style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "var(--fg)",
                border: "1px solid var(--border-2)",
                borderRadius: "3px",
                padding: "2px 6px",
                letterSpacing: "0.04em",
              }}>
                ↑ Trending
              </span>
            )}
          </span>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "monospace",
            fontSize: "11px",
            color: "var(--ink-4)",
          }}>
            {skill.stats?.stars ? (
              <span title="ClawHub stars">★ {formatInstalls(skill.stats.stars)}</span>
            ) : null}
            {skill.stats?.installs ? (
              <span>{formatInstalls(skill.stats.installs)} installs</span>
            ) : null}
          </span>
        </div>
      )}
    </Link>
  )
}

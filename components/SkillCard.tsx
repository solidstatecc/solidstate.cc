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
      border: "1px solid #222222",
      textDecoration: "none",
      transition: "border-color 0.1s",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffffff")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "#222222")}
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
          color: isFree ? "#ffffff" : unpriced ? "#333333" : "#555555",
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
        color: "#888888",
        letterSpacing: "0.04em",
        marginBottom: "12px",
      }}>
        by {skill.author}
      </div>

      <p style={{
        fontSize: "13px",
        color: "#555555",
        lineHeight: 1.6,
        marginBottom: "20px",
      }}>
        {skill.description}
      </p>

      <div style={{
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#333333",
        backgroundColor: "#080808",
        padding: "7px 10px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginBottom: "16px",
      }}>
        {skill.installCommand}
      </div>

      <div style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
      }}>
        {skill.platforms.map(p => (
          <span key={p} style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#444444",
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
          borderTop: "1px solid #161616",
        }}>
          <span>
            {skill.trending && (
              <span style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "#ffffff",
                border: "1px solid #333333",
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
            color: "#888888",
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
